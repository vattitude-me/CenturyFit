import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Mic } from 'lucide-react';
import Button from '../components/Button';
import TempoSlider from '../components/TempoSlider';
import ModeChip from '../components/ModeChip';
import { useCadenceEngine } from '../hooks/useCadenceEngine';
import { getSettings, saveSetLog, saveDayPlan, getDayPlan, saveBaselineLog } from '../db';
import type { CounterMode, Exercise, CounterVariant } from '../types';
import { EXERCISE_LABELS } from '../types';
import { requestWakeLock, releaseWakeLock } from '../engine/audio';

const RING_R = 112;
const RING_DASH = 2 * Math.PI * RING_R; // 703.7

const MODE_OPTIONS: { key: CounterMode; label: string }[] = [
  { key: 'voice', label: 'Voice-led' },
  { key: 'camera', label: 'Camera auto' },
  { key: 'tap', label: 'Tap to count' },
];

interface SessionState {
  count: number;
  target: number;
}

export default function Session() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const exercise = (params.get('exercise') as Exercise) || 'push';
  const isBaseline = params.get('mode') === 'baseline';
  const target = isBaseline ? Infinity : Number(params.get('target') || 12);
  const ladder = params.get('ladder') || 'Set 3 of 5';

  const [mode, setMode] = useState<CounterMode>('voice');
  const [counterVariant, setCounterVariant] = useState<CounterVariant>('cadenceRing');
  const [voiceOn, setVoiceOn] = useState(true);
  const [ticksOn, setTicksOn] = useState(true);
  const [hapticsOn, setHapticsOn] = useState(true);
  const [done, setDone] = useState<SessionState | null>(null);

  useEffect(() => {
    getSettings().then((s) => {
      setCounterVariant(s.counterVariant);
      setVoiceOn(s.voice);
      setTicksOn(s.ticks);
      setHapticsOn(s.haptics);
    });
  }, []);

  useEffect(() => {
    requestWakeLock();
    return () => { releaseWakeLock(); };
  }, []);

  const handleBank = (reps: number) => {
    const today = new Date().toISOString().slice(0, 10);
    if (isBaseline) {
      saveBaselineLog({ id: exercise, exercise, maxReps: reps, testedAt: Date.now() });
      navigate('/onboarding/baseline', { replace: true });
      return;
    }
    saveSetLog({
      id: `${Date.now()}`,
      date: today,
      at: new Date().toTimeString().slice(0, 5),
      exercise,
      reps,
      targetReps: Number.isFinite(target) ? target : reps,
      tempo: engine.state.tempo,
      mode,
      source: 'session',
      completedAt: Date.now(),
    });
    getDayPlan(today).then((plan) => {
      if (!plan) return;
      saveDayPlan(plan);
    });
    setDone({ count: reps, target: Number.isFinite(target) ? target : reps });
  };

  const engine = useCadenceEngine({
    target,
    mode,
    voiceEnabled: voiceOn && mode === 'voice',
    ticksEnabled: ticksOn,
    hapticsEnabled: hapticsOn,
    onBank: handleBank,
  });

  const cue = engine.state.running
    ? (engine.state.phase === 'down' ? 'DOWN' : 'UP')
    : (engine.state.count > 0 ? 'PAUSED' : 'READY');
  const cueColor = engine.state.running
    ? (engine.state.phase === 'down' ? '#9184d9' : '#e9e9ed')
    : '#75798c';

  const offset = useMemo(() => {
    if (!Number.isFinite(target) || target === 0) return RING_DASH;
    return RING_DASH * (1 - Math.min(1, engine.state.count / target));
  }, [engine.state.count, target]);

  if (done) {
    return (
      <div className="route-done flex-1 h-full flex flex-col items-center justify-center px-6 py-6.5 gap-4 text-center">
        <div
          className="w-[104px] h-[104px] rounded-full grid place-items-center"
          style={{ background: 'var(--color-accent-900)', boxShadow: '0 0 0 12px rgba(145,132,217,.08)' }}
        >
          <span className="text-[42px] text-accent leading-none">✓</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="text-[28px] font-medium tracking-[-0.02em]">{done.count} reps banked</div>
          <div className="text-[13.5px] leading-[1.5] text-neutral-400 max-w-[280px]">
            Nice work. That's banked into today's totals.
          </div>
        </div>
        <div className="w-full flex flex-col gap-2.25 mt-1">
          <Button variant="primary" block className="h-12 text-[15px]" onClick={() => navigate('/today')}>
            Back to today
          </Button>
          <Button variant="secondary" block className="h-11" onClick={() => { setDone(null); engine.stop(); }}>
            One more set
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="route-session flex-1 h-full flex flex-col px-5 pt-3 pb-5.5 gap-3"
      style={{ background: 'radial-gradient(120% 60% at 50% 8%, #1c1f30, #161826 70%)' }}
    >
      <div className="flex items-center justify-between gap-2.5">
        <Button variant="icon" onClick={() => navigate(-1)}><ChevronLeft size={18} /></Button>
        <div className="flex flex-col items-center gap-px">
          <span className="text-[14.5px] font-medium">{EXERCISE_LABELS[exercise]}</span>
          <span className="text-[11px] text-neutral-500">{isBaseline ? 'Baseline test' : `${ladder} · target ${target}`}</span>
        </div>
        <span
          onClick={() => setVoiceOn((v) => !v)}
          style={{ background: voiceOn ? '#423a6a' : 'rgba(233,233,237,.07)', color: voiceOn ? '#d2cefd' : '#75798c' }}
          className="w-9 h-9 rounded-[10px] grid place-items-center cursor-pointer"
        >
          <Mic size={16} />
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-3.5 min-h-[280px]">
        {counterVariant === 'bigNumeral' && (
          <div onClick={engine.tapRep} className="flex flex-col items-center gap-0.5 cursor-pointer select-none">
            <div className="text-[132px] leading-[.9] font-medium tracking-[-0.05em] tabular-nums">{engine.state.count}</div>
            <div className="text-xs tracking-[0.28em] text-neutral-500">REPS</div>
            <div className="mt-3 text-[22px] font-medium tracking-[0.1em]" style={{ color: cueColor }}>{cue}</div>
          </div>
        )}

        {counterVariant === 'cadenceRing' && (
          <div onClick={engine.tapRep} className="relative w-[250px] h-[250px] cursor-pointer select-none grid place-items-center">
            <div
              className="absolute inset-[18px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(145,132,217,.20), transparent 70%)', animation: `hpulse ${engine.state.tempo}s ease-in-out infinite` }}
            />
            <svg viewBox="0 0 250 250" className="absolute inset-0 w-[250px] h-[250px] -rotate-90">
              <circle cx="125" cy="125" r={RING_R} fill="none" stroke="rgba(233,233,237,.09)" strokeWidth="10" />
              <circle
                cx="125" cy="125" r={RING_R} fill="none" stroke="#9184d9" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={RING_DASH} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset .3s' }}
              />
            </svg>
            <div className="flex flex-col items-center gap-0.5 z-10">
              <div className="text-[82px] leading-[.95] font-medium tracking-[-0.04em] tabular-nums">{engine.state.count}</div>
              <div className="text-[11px] tracking-[0.2em] text-neutral-500">OF {Number.isFinite(target) ? target : '—'}</div>
              <div className="mt-2.5 text-[17px] font-medium tracking-[0.1em]" style={{ color: cueColor }}>{cue}</div>
            </div>
          </div>
        )}

        {counterVariant === 'ladderLane' && (
          <div onClick={engine.tapRep} className="flex items-center gap-5 cursor-pointer select-none">
            <div className="flex flex-col-reverse gap-1 h-[300px] justify-start">
              {Array.from({ length: 12 }, (_, i) => {
                const h = 8 + Math.round(6 * Math.sin(i / 2));
                const lit = i < engine.state.count;
                return <span key={i} style={{ height: h, background: lit ? '#9184d9' : 'rgba(233,233,237,.10)' }} className="w-[52px] rounded block transition-colors" />;
              })}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[70px] leading-[.95] font-medium tracking-[-0.04em] tabular-nums">{engine.state.count}</div>
              <div className="text-[11px] tracking-[0.2em] text-neutral-500">OF {Number.isFinite(target) ? target : '—'} REPS</div>
              <div className="mt-2.5 text-[17px] font-medium tracking-[0.1em]" style={{ color: cueColor }}>{cue}</div>
            </div>
          </div>
        )}
      </div>

      <TempoSlider tempo={engine.state.tempo} onChange={engine.setTempo} />

      <div className="flex items-center justify-center gap-4">
        <Button variant="secondary" onClick={engine.decRep} className="!w-13 !h-13 !p-0 rounded-full text-xl">−</Button>
        <Button variant="primary" onClick={engine.toggleRun} className="!w-[78px] !h-[78px] !p-0 rounded-full text-2xl">
          {engine.state.running ? '❚❚' : '▶'}
        </Button>
        <Button variant="secondary" onClick={engine.tapRep} className="!w-13 !h-13 !p-0 rounded-full text-xl">+</Button>
      </div>

      <ModeChip options={MODE_OPTIONS} value={mode} onChange={setMode} />
      <Button variant="ghost" block className="h-9.5" onClick={engine.endSet}>
        {isBaseline ? 'End test' : `End set, bank ${engine.state.count} reps`}
      </Button>
    </div>
  );
}

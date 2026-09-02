import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDailyPlans, saveDailyPlan, saveSetLog, getSettings } from '../db';
import { EXERCISE_LABELS } from '../engine/progression';
import { playClick, playComplete, speakNumber, vibrate, requestWakeLock, releaseWakeLock } from '../engine/audio';
import {
  MinusIcon, PlusIcon, PauseIcon, PlayIcon, VolumeIcon, MuteIcon, VibrationIcon,
  ChevronLeftIcon, SettingsIcon, StopIcon, CheckIcon, FlameIcon,
} from '../components/icons';
import type { Exercise, DailyPlan, CountMode } from '../types';

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

const CONFETTI_COLORS = ['#7C3AED', '#F97316', '#22C55E', '#EAB308', '#EC4899', '#3B82F6'];

function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360 + Math.random() * 12;
    const distance = 90 + Math.random() * 70;
    const dx = Math.cos((angle * Math.PI) / 180) * distance;
    const dy = Math.sin((angle * Math.PI) / 180) * distance;
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const delay = Math.random() * 0.15;
    return { id: i, dx, dy, color, delay };
  });

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {pieces.map(p => (
        <span
          key={p.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            backgroundColor: p.color,
            animation: `confetti-burst 0.9s ease-out ${p.delay}s forwards`,
            // @ts-expect-error custom properties for the keyframe
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-burst {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(200deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function RepCounter() {
  const { exercise, blockId } = useParams<{ exercise: Exercise; blockId: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [reps, setReps] = useState(0);
  const [goalReps, setGoalReps] = useState(20);
  const [tempo, setTempo] = useState(1.0);
  const [mode, setMode] = useState<CountMode>('metronome');
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);
  const [vibrationOn, setVibrationOn] = useState(true);
  const [setComplete, setSetComplete] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repsRef = useRef(reps);
  const goalRef = useRef(goalReps);

  repsRef.current = reps;
  goalRef.current = goalReps;

  useEffect(() => {
    async function load() {
      const s = await getSettings();
      setTempo(s.defaultTempo);
      setMode(s.defaultCountMode);
      setSoundOn(s.soundEnabled);
      setVoiceOn(s.voiceCuesEnabled);
      setVibrationOn(s.vibrationEnabled);

      if (exercise) {
        const plans = await getDailyPlans(getToday());
        const p = plans.find(pl => pl.exercise === exercise);
        if (p) {
          setPlan(p);
          const block = p.blocks.find(b => b.id === blockId);
          if (block) {
            setGoalReps(block.targetReps);
          }
        }
      }
    }
    load();
    requestWakeLock();
    return () => { releaseWakeLock(); };
  }, [exercise, blockId]);

  const incrementRep = useCallback(() => {
    const newReps = repsRef.current + 1;
    setReps(newReps);
    if (soundOn) playClick();
    if (voiceOn) speakNumber(newReps);
    if (vibrationOn) vibrate(30);

    if (newReps >= goalRef.current) {
      setIsRunning(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      playComplete();
      if (vibrationOn) vibrate([100, 50, 100]);
      setSetComplete(true);
    }
  }, [soundOn, voiceOn, vibrationOn]);

  useEffect(() => {
    if (mode === 'metronome' && isRunning) {
      const interval = tempo * 1000;
      function tick() {
        incrementRep();
        timerRef.current = setTimeout(tick, interval);
      }
      timerRef.current = setTimeout(tick, interval);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [mode, isRunning, tempo, incrementRep]);

  function handleTap() {
    if (mode === 'tap' && !setComplete) {
      incrementRep();
    }
  }

  function toggleRunning() {
    if (setComplete) return;
    setIsRunning(!isRunning);
  }

  async function handleEndSet() {
    if (!exercise || !plan) return;

    const block = plan.blocks.find(b => b.id === blockId);
    if (block) {
      block.completedReps = reps;
      block.status = 'completed';
      block.completedAt = Date.now();
    }
    plan.completedReps = plan.blocks.reduce((s, b) => s + b.completedReps, 0);
    if (plan.completedReps >= plan.targetReps) {
      plan.status = 'completed';
    } else {
      plan.status = 'in_progress';
    }
    await saveDailyPlan(plan);

    await saveSetLog({
      id: `set_${Date.now()}`,
      date: getToday(),
      exercise: exercise as Exercise,
      variant: plan.variant,
      reps,
      tempo,
      effort: reps >= goalReps ? 'moderate' : 'hard',
      completedAt: Date.now(),
      blockId,
    });

    navigate('/today');
  }

  function handleBack() {
    setIsRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    navigate('/today');
  }

  if (!exercise) return null;

  if (setComplete) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-full px-6 py-12 bg-bg-primary animate-fade-in overflow-hidden">
        <Confetti />
        <div className="relative w-20 h-20 flex items-center justify-center mb-6">
          <CheckIcon size={80} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Set Complete!</h1>
        <p className="text-text-secondary mb-2">You did {reps} reps</p>
        <p className="relative flex items-center gap-2 text-text-secondary text-lg mb-8">
          <FlameIcon size={22} /> Great work!
        </p>
        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={handleEndSet}
            className="w-full py-4 bg-purple-accent text-white font-semibold rounded-2xl text-lg"
          >
            Log It
          </button>
          <button
            onClick={() => {
              setSetComplete(false);
              setReps(0);
              setIsRunning(false);
            }}
            className="w-full py-3 text-text-secondary text-sm"
          >
            Do Another Set
          </button>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="flex flex-col min-h-full px-6 py-8 bg-bg-primary animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => setShowSettings(false)} className="text-text-secondary">
            <ChevronLeftIcon size={24} />
          </button>
          <h1 className="text-xl font-bold">Counter Settings</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-sm text-text-muted mb-4 uppercase tracking-wider">Count Mode</h2>
          <div className="flex flex-col gap-3">
            {(['metronome', 'tap'] as CountMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                  mode === m ? 'border-purple-accent bg-purple-accent/10' : 'border-border bg-bg-card'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 ${
                  mode === m ? 'border-purple-accent bg-purple-accent' : 'border-text-muted'
                }`} />
                <span className="capitalize">{m === 'metronome' ? 'Metronome (Auto)' : 'Tap to Count'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-sm text-text-muted mb-4 uppercase tracking-wider">Rep Speed</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted">0.5</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={tempo}
              onChange={e => setTempo(parseFloat(e.target.value))}
              className="flex-1 accent-purple-accent"
            />
            <span className="text-xs text-text-muted">3.0</span>
          </div>
          <div className="text-center text-sm text-text-secondary mt-2">{tempo.toFixed(1)} sec/rep</div>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { label: 'Sound', value: soundOn, set: setSoundOn, icon: VolumeIcon },
            { label: 'Voice Cues', value: voiceOn, set: setVoiceOn, icon: VolumeIcon },
            { label: 'Vibration', value: vibrationOn, set: setVibrationOn, icon: VibrationIcon },
          ].map(({ label, value, set, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-bg-card">
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span>{label}</span>
              </div>
              <button
                onClick={() => set(!value)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  value ? 'bg-purple-accent' : 'bg-border'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex-1" />
        <button
          onClick={() => setShowSettings(false)}
          className="w-full py-4 bg-purple-accent text-white font-semibold rounded-2xl text-lg mt-8"
        >
          Done
        </button>
      </div>
    );
  }

  const progressPct = Math.min(100, Math.round((reps / Math.max(1, goalReps)) * 100));

  return (
    <div className="flex flex-col items-center justify-between min-h-full px-6 py-8 bg-bg-primary" onClick={mode === 'tap' ? handleTap : undefined}>
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <button onClick={handleBack} className="text-text-secondary">
          <ChevronLeftIcon size={24} />
        </button>
        <h2 className="text-lg font-semibold">{EXERCISE_LABELS[exercise as Exercise]}</h2>
        <button onClick={(e) => { e.stopPropagation(); setShowSettings(true); }} className="text-text-secondary">
          <SettingsIcon size={22} />
        </button>
      </div>

      {/* Big Counter */}
      <div className="flex flex-col items-center gap-2 w-full max-w-sm">
        <div className="text-[120px] font-bold leading-none tabular-nums text-text-primary">
          {reps}
        </div>
        <div className="text-2xl text-text-secondary font-medium tracking-wider">REPS</div>
        <div className="text-text-muted text-sm mt-2 mb-3">Goal: {goalReps}</div>
        <div className="w-full h-2 bg-bg-card rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-accent rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-sm">
        {/* Tempo Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2">
            <span>Speed</span>
            <span>{tempo.toFixed(1)} sec/rep</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={tempo}
            onChange={e => setTempo(parseFloat(e.target.value))}
            className="w-full accent-purple-accent"
            onClick={e => e.stopPropagation()}
          />
          <div className="flex justify-between text-[10px] text-text-muted mt-1">
            <span>0.5</span><span>1.0</span><span>1.5</span><span>2.0</span><span>2.5</span><span>3.0</span>
          </div>
        </div>

        {/* Play/Pause + adjust */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            onClick={(e) => { e.stopPropagation(); setReps(Math.max(0, reps - 1)); }}
            className="w-14 h-14 rounded-full bg-bg-card border-2 border-border flex items-center justify-center active:bg-bg-card-hover"
          >
            <MinusIcon size={22} />
          </button>

          {mode === 'metronome' ? (
            <button
              onClick={(e) => { e.stopPropagation(); toggleRunning(); }}
              className="w-20 h-20 rounded-full bg-purple-accent flex items-center justify-center animate-pulse-glow"
            >
              {isRunning ? <PauseIcon size={40} /> : <PlayIcon size={40} />}
            </button>
          ) : (
            <div className="w-20 h-20 rounded-full bg-purple-accent/20 border-4 border-purple-accent flex items-center justify-center">
              <span className="text-sm text-purple-light font-medium">TAP</span>
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); incrementRep(); }}
            className="w-14 h-14 rounded-full bg-bg-card border-2 border-border flex items-center justify-center active:bg-bg-card-hover"
          >
            <PlusIcon size={22} />
          </button>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-around">
          <button onClick={(e) => { e.stopPropagation(); setSoundOn(!soundOn); }} className="flex flex-col items-center gap-1">
            {soundOn ? <VolumeIcon size={20} /> : <MuteIcon size={20} />}
            <span className="text-[10px] text-text-muted">Sound</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setVibrationOn(!vibrationOn); }} className="flex flex-col items-center gap-1">
            <VibrationIcon size={20} />
            <span className="text-[10px] text-text-muted">Vibrate</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSetComplete(true); }}
            className="flex flex-col items-center gap-1"
          >
            <StopIcon size={20} />
            <span className="text-[10px] text-text-muted">End Set</span>
          </button>
        </div>
      </div>
    </div>
  );
}

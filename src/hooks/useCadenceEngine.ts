import { useCallback, useEffect, useRef, useState } from 'react';
import type { CounterMode } from '../types';
import { playTick, speakCount, speakMilestone, vibrate } from '../engine/audio';

export type CadencePhase = 'down' | 'up';

interface CadenceEngineOptions {
  /** Rep target. Omit (or Infinity) for baseline-test count-up mode. */
  target?: number;
  mode: CounterMode;
  initialTempo?: number;
  voiceEnabled: boolean;
  ticksEnabled: boolean;
  hapticsEnabled: boolean;
  onBank: (reps: number) => void;
}

interface CadenceEngineState {
  count: number;
  phase: CadencePhase;
  running: boolean;
  tempo: number;
}

export function useCadenceEngine(opts: CadenceEngineOptions) {
  const { target = Infinity, voiceEnabled, ticksEnabled, hapticsEnabled, onBank } = opts;
  const [state, setState] = useState<CadenceEngineState>({
    count: 0,
    phase: 'up',
    running: false,
    tempo: opts.initialTempo ?? 2,
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const milestonesFiredRef = useRef<Set<string>>(new Set());
  const stateRef = useRef(state);
  stateRef.current = state;

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const fireMilestones = useCallback((count: number, target: number) => {
    if (!Number.isFinite(target) || target <= 0) return;
    const fired = milestonesFiredRef.current;
    if (count >= Math.ceil(target / 2) && !fired.has('halfway')) {
      fired.add('halfway');
      speakMilestone('halfway');
    }
    if (target - count === 3 && !fired.has('threeLeft')) {
      fired.add('threeLeft');
      speakMilestone('threeLeft');
    }
  }, []);

  const tick = useCallback(() => {
    setState((s) => {
      if (!s.running) return s;
      const nextPhase: CadencePhase = s.phase === 'down' ? 'up' : 'down';
      let count = s.count;
      if (nextPhase === 'down') count = count + 1;

      if (count > target) {
        stop();
        onBank(target);
        return { ...s, running: false };
      }

      if (nextPhase === 'down' && count > 0) {
        if (voiceEnabled) speakCount(count, s.tempo);
        if (ticksEnabled) playTick('down');
        if (hapticsEnabled) vibrate(30);
        fireMilestones(count, target);
      } else if (ticksEnabled) {
        playTick('up');
      }

      return { ...s, phase: nextPhase, count };
    });
  }, [target, voiceEnabled, ticksEnabled, hapticsEnabled, onBank, stop, fireMilestones]);

  const run = useCallback((on: boolean, tempo: number) => {
    stop();
    if (on) {
      timerRef.current = setInterval(tick, Math.max(300, tempo * 500));
    }
  }, [stop, tick]);

  const toggleRun = useCallback(() => {
    setState((s) => {
      const running = !s.running;
      run(running, s.tempo);
      return { ...s, running };
    });
  }, [run]);

  const tapRep = useCallback(() => {
    setState((s) => {
      const count = Math.min(target, s.count + 1);
      if (voiceEnabled) speakCount(count, s.tempo);
      if (hapticsEnabled) vibrate(30);
      fireMilestones(count, target);
      if (count >= target && Number.isFinite(target)) {
        stop();
        onBank(count);
        return { ...s, count, running: false };
      }
      return { ...s, count };
    });
  }, [target, voiceEnabled, hapticsEnabled, fireMilestones, stop, onBank]);

  const decRep = useCallback(() => {
    setState((s) => ({ ...s, count: Math.max(0, s.count - 1) }));
  }, []);

  const setTempo = useCallback((tempo: number) => {
    setState((s) => {
      if (s.running) run(true, tempo);
      return { ...s, tempo };
    });
  }, [run]);

  const endSet = useCallback(() => {
    stop();
    const s = stateRef.current;
    setState((cur) => ({ ...cur, running: false }));
    onBank(s.count);
  }, [stop, onBank]);

  useEffect(() => () => stop(), [stop]);

  return { state, toggleRun, tapRep, decRep, setTempo, endSet, stop };
}

import type { Exercise, Window, WindowItem, PullRung, SetModel, StreakData } from '../types';

const EXERCISES: Exercise[] = ['push', 'pull', 'squat'];

export function computeDay1Target(maxReps: number): number {
  return clamp(Math.round(maxReps * 3), 12, 40);
}

export function computeWeeklyTarget(day1Target: number, weekIndex: number): number {
  return Math.min(100, Math.round(day1Target * Math.pow(1.08, weekIndex)));
}

export function computeWindowCount(wakingSpanHours: number, dailyVolume: number): 3 | 4 | 5 {
  if (wakingSpanHours < 12) return 3;
  if (dailyVolume > 70) return 5;
  return 4;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const m = ((mins % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/** Splits daily per-exercise targets across windows, avoiding the first 30min
 * after waking and the last 60min before sleep, never mixing more than 2
 * exercises per window. */
export function splitIntoWindows(
  dailyTargets: Record<Exercise, number>,
  windowCount: number,
  wake: string,
  sleep: string
): Window[] {
  const wakeMin = timeToMinutes(wake);
  let sleepMin = timeToMinutes(sleep);
  if (sleepMin <= wakeMin) sleepMin += 24 * 60;

  const usableStart = wakeMin + 30;
  const usableEnd = sleepMin - 60;
  const span = Math.max(usableEnd - usableStart, windowCount * 10);
  const gap = span / (windowCount + 1);

  const windows: Window[] = [];
  const remaining: Record<Exercise, number> = { ...dailyTargets };
  const exerciseOrder = EXERCISES.filter((e) => dailyTargets[e] > 0);

  for (let i = 1; i <= windowCount; i++) {
    const windowsLeft = windowCount - i + 1;
    const at = minutesToTime(Math.round(usableStart + gap * i));
    const items: WindowItem[] = [];

    // Cycle exercises across windows, at most 2 per window.
    const startIdx = ((i - 1) * 2) % Math.max(1, exerciseOrder.length);
    const picks: Exercise[] = [];
    for (let k = 0; k < exerciseOrder.length && picks.length < 2; k++) {
      const ex = exerciseOrder[(startIdx + k) % exerciseOrder.length];
      if (!picks.includes(ex) && remaining[ex] > 0) picks.push(ex);
    }

    for (const ex of picks) {
      const reps = Math.max(0, Math.ceil(remaining[ex] / windowsLeft));
      if (reps > 0) {
        items.push({ exercise: ex, reps });
        remaining[ex] -= reps;
      }
    }

    windows.push({ id: `w${i}`, at, items, status: 'pending' });
  }

  return windows;
}

const REFLOW_CAP = 0.4;

/** Redistributes a missed window's reps across remaining pending windows,
 * capped at +40% of any window's original volume; overflow is dropped. */
export function reflow(windows: Window[], missedWindowId: string): Window[] {
  const missed = windows.find((w) => w.id === missedWindowId);
  if (!missed) return windows;

  const missedByExercise: Partial<Record<Exercise, number>> = {};
  for (const item of missed.items) {
    missedByExercise[item.exercise] = (missedByExercise[item.exercise] ?? 0) + item.reps;
  }

  const pending = windows.filter((w) => w.id !== missedWindowId && w.status === 'pending');
  if (pending.length === 0) {
    return windows.map((w) => (w.id === missedWindowId ? { ...w, status: 'missed' } : w));
  }

  return windows.map((w) => {
    if (w.id === missedWindowId) return { ...w, status: 'missed' };
    if (w.status !== 'pending') return w;

    const items = w.items.map((item) => {
      const extra = missedByExercise[item.exercise];
      if (!extra) return item;
      const share = Math.floor(extra / pending.length);
      const cap = Math.floor(item.reps * REFLOW_CAP);
      const added = Math.min(share, cap);
      return { ...item, reps: item.reps + added };
    });
    return { ...w, items, status: 'reflowed' };
  });
}

export interface SetStructure {
  model: SetModel;
  sets: number[];
}

/** Ladder days (Tue=2/Fri=5) run a pyramid up to the window volume; other
 * days repeat round(max*0.55) reps per set until the volume is met. */
export function buildSetStructure(
  windowVolume: number,
  currentMax: number,
  dayOfWeek: number
): SetStructure {
  const isLadderDay = dayOfWeek === 2 || dayOfWeek === 5;

  if (isLadderDay) {
    const ladder = [1, 2, 3, 4, 3, 2, 1];
    let total = ladder.reduce((a, b) => a + b, 0);
    const scale = windowVolume / total;
    const sets = ladder.map((n) => Math.max(1, Math.round(n * scale)));
    return { model: 'ladder', sets };
  }

  const perSet = Math.max(1, Math.round(currentMax * 0.55));
  const sets: number[] = [];
  let remaining = windowVolume;
  while (remaining > 0) {
    const reps = Math.min(perSet, remaining);
    sets.push(reps);
    remaining -= reps;
  }
  return { model: 'percent', sets };
}

const REBASELINE_INTERVAL_DAYS = 21;

export function shouldRebaseline(lastRebaselineAt: string | undefined, today: string): boolean {
  if (!lastRebaselineAt) return false;
  const last = new Date(lastRebaselineAt).getTime();
  const now = new Date(today).getTime();
  const days = Math.round((now - last) / (1000 * 60 * 60 * 24));
  return days >= REBASELINE_INTERVAL_DAYS;
}

export interface RebaselineResult {
  maxes: Record<Exercise, number>;
  deload: boolean;
}

export function applyRebaseline(
  previousMaxes: Record<Exercise, number>,
  newMaxes: Record<Exercise, number>
): RebaselineResult {
  const deload = EXERCISES.some((ex) => newMaxes[ex] < previousMaxes[ex]);
  return { maxes: newMaxes, deload };
}

const PULLUP_PROMOTION_REPS = 8;
const PULLUP_DEMOTION_PCT = 0.4;

export function checkPullupPromotion(rung: PullRung, setReps: number): PullRung {
  if (rung < 4 && setReps >= PULLUP_PROMOTION_REPS) return (rung + 1) as PullRung;
  return rung;
}

export function checkPullupDemotion(rung: PullRung, recentWindowPcts: number[]): PullRung {
  if (rung > 0 && recentWindowPcts.length >= 2) {
    const lastTwo = recentWindowPcts.slice(-2);
    if (lastTwo.every((pct) => pct < PULLUP_DEMOTION_PCT)) {
      return (rung - 1) as PullRung;
    }
  }
  return rung;
}

const STREAK_CREDIT_PCT = 0.7;

export function computeStreakCredit(totalTarget: number, totalCompleted: number): boolean {
  if (totalTarget === 0) return false;
  return totalCompleted / totalTarget >= STREAK_CREDIT_PCT;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

const GRACE_WINDOW_DAYS = 14;
const GRACE_DAYS_ALLOWED = 1;

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

/** Recomputes streak state given today's credit status. Consecutive credited
 * days extend the streak; a single missed day within a rolling 14-day window
 * is forgiven once (grace day) before the streak resets. */
export function updateStreak(streak: StreakData, today: string, creditedToday: boolean): StreakData {
  if (!creditedToday) {
    if (!streak.lastActiveDate) return streak;

    const windowStart = streak.windowStartDate || streak.lastActiveDate;
    const withinGraceWindow = daysBetween(windowStart, today) <= GRACE_WINDOW_DAYS;
    const graceAvailable = withinGraceWindow && streak.graceDaysUsedInWindow < GRACE_DAYS_ALLOWED;

    if (graceAvailable) {
      return { ...streak, graceDaysUsedInWindow: streak.graceDaysUsedInWindow + 1 };
    }
    return { current: 0, longest: streak.longest, lastActiveDate: '', graceDaysUsedInWindow: 0, windowStartDate: '' };
  }

  if (streak.lastActiveDate === today) return streak;

  const gap = streak.lastActiveDate ? daysBetween(streak.lastActiveDate, today) : Infinity;
  const continued = gap === 1 || (gap > 1 && streak.graceDaysUsedInWindow < GRACE_DAYS_ALLOWED);
  const current = continued ? streak.current + 1 : 1;
  const windowStartDate = continued ? (streak.windowStartDate || today) : today;
  const resetGraceWindow = !continued || daysBetween(windowStartDate, today) > GRACE_WINDOW_DAYS;

  return {
    current,
    longest: Math.max(streak.longest, current),
    lastActiveDate: today,
    graceDaysUsedInWindow: resetGraceWindow ? 0 : streak.graceDaysUsedInWindow,
    windowStartDate: resetGraceWindow ? today : windowStartDate,
  };
}

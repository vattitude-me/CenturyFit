export type Exercise = 'push' | 'pull' | 'squat';

export type PullRung = 0 | 1 | 2 | 3 | 4; // rows, negatives, band, partials, full
export type BarAccess = 'doorway' | 'park' | 'none';
export type CounterMode = 'voice' | 'tap';
export type CounterVariant = 'cadenceRing' | 'bigNumeral' | 'ladderLane';
export type DashboardVariant = 'rings' | 'fuelBars';
export type SetModel = 'ladder' | 'percent';
export type WindowStatus = 'pending' | 'done' | 'missed' | 'reflowed';

export interface Profile {
  id: string;
  name: string;
  createdAt: number;
  maxes: Record<Exercise, number>;
  pullRung: PullRung;
  barAccess: BarAccess;
  wake: string; // "06:30"
  sleep: string; // "23:00"
  windowCount: number;
  reflow: boolean;
  onboardingComplete: boolean;
  baselineComplete: boolean;
  lastRebaselineAt?: string; // ISO date
}

export interface BaselineLog {
  id: string;
  exercise: Exercise;
  maxReps: number;
  testedAt: number;
}

export interface WindowItem {
  exercise: Exercise;
  reps: number;
  ladder?: number[];
}

export interface Window {
  id: string;
  at: string; // "12:30"
  items: WindowItem[];
  status: WindowStatus;
}

export interface DayPlan {
  id: string;
  date: string; // YYYY-MM-DD
  dayIndex: number;
  targets: Record<Exercise, number>;
  windows: Window[];
  model: SetModel;
}

export interface SetLog {
  id: string;
  date: string;
  at: string;
  exercise: Exercise;
  reps: number;
  targetReps: number;
  tempo: number;
  mode: CounterMode;
  windowId?: string;
  source: 'session' | 'manual' | 'baseline';
  completedAt: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActiveDate: string;
  graceDaysUsedInWindow: number;
  windowStartDate: string;
}

export interface DayRecord {
  date: string;
  exercises: Record<Exercise, { target: number; completed: number }>;
  totalVolumePct: number;
  streakCredit: boolean;
}

export interface AppSettings {
  counterVariant: CounterVariant;
  dashboardVariant: DashboardVariant;
  voice: boolean;
  ticks: boolean;
  haptics: boolean;
  reminders: boolean; // stub, default off
  nudges: boolean; // stub, default off
  waitlistSquad: boolean;
  defaultTempo: number; // 1.00–4.00 step .25, default 2.00
}

/** Per-exercise tempo bounds and default, in seconds/rep. Pull-ups need a
 * slower floor than push/squat — 1.0s/rep is too fast to control a pull-up. */
export const TEMPO_RANGE: Record<Exercise, { min: number; max: number; default: number }> = {
  push: { min: 1, max: 4, default: 2.5 },
  pull: { min: 2, max: 5, default: 3 },
  squat: { min: 1, max: 4, default: 2 },
};

export const EXERCISE_LABELS: Record<Exercise, string> = {
  push: 'Push-ups',
  pull: 'Pull-ups',
  squat: 'Squats',
};

export const PULL_RUNG_LABELS: Record<PullRung, string> = {
  0: 'Rows',
  1: 'Negatives',
  2: 'Band',
  3: 'Partials',
  4: 'Full',
};

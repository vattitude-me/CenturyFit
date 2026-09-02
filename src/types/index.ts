export type Exercise = 'pushups' | 'pullups' | 'squats';

export type ExerciseVariant =
  | 'wall' | 'incline' | 'knee' | 'negative_pushup' | 'full_pushup' | 'tempo_pushup' | 'explosive_pushup'
  | 'dead_hang' | 'band_assisted' | 'australian_rows' | 'negative_pullup' | 'band_pullup' | 'strict_pullup' | 'weighted_pullup'
  | 'box_squat' | 'assisted_squat' | 'bodyweight_squat' | 'tempo_squat' | 'pause_squat' | 'pistol_squat';

export type Tier = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type TimeWindow = 'morning' | 'midday' | 'evening' | 'night';

export interface UserProfile {
  id: string;
  name: string;
  createdAt: number;
  goals: Exercise[];
  timeWindows: TimeWindow[];
  customWindows?: { label: string; start: string; end: string }[];
  wakeTime: string;
  sleepTime: string;
  equipment: {
    pullupBar: boolean;
    resistanceBand: boolean;
  };
  injuries: {
    shoulder: boolean;
    knee: boolean;
    wrist: boolean;
    back: boolean;
  };
  onboardingComplete: boolean;
  baselineComplete: boolean;
}

export interface Baseline {
  exercise: Exercise;
  maxReps: number;
  tier: Tier;
  variant: ExerciseVariant;
  testedAt: number;
}

export interface DailyPlan {
  id: string;
  date: string; // YYYY-MM-DD
  exercise: Exercise;
  targetReps: number;
  variant: ExerciseVariant;
  blocks: WorkoutBlock[];
  completedReps: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface WorkoutBlock {
  id: string;
  time: string; // HH:MM
  targetReps: number;
  completedReps: number;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  completedAt?: number;
}

export interface SetLog {
  id: string;
  date: string;
  exercise: Exercise;
  variant: ExerciseVariant;
  reps: number;
  tempo: number;
  effort: 'easy' | 'moderate' | 'hard' | 'max';
  completedAt: number;
  blockId?: string;
}

export interface StreakData {
  current: number;
  longest: number;
  freezesRemaining: number;
  lastActiveDate: string;
}

export interface DayRecord {
  date: string;
  exercises: {
    pushups: { target: number; completed: number };
    pullups: { target: number; completed: number };
    squats: { target: number; completed: number };
  };
  allGoalsMet: boolean;
}

export type CountMode = 'metronome' | 'tap';

export interface AppSettings {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  voiceCuesEnabled: boolean;
  vibrationEnabled: boolean;
  defaultTempo: number;
  defaultCountMode: CountMode;
  defaultRestTime: number;
}

export interface Friend {
  id: string;
  name: string;
  username: string;
  points: number;
  streak: number;
  status: 'accepted' | 'pending';
  lastActivityText: string;
  lastActivityAt: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  exercise: Exercise | 'all';
  goal: number;
  progress: number;
  unit: string;
  status: 'active' | 'completed';
}

export type NotificationType = 'nudge' | 'reminder' | 'milestone' | 'challenge';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
}

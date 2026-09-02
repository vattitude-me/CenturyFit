import type { Exercise, ExerciseVariant, Tier, Baseline } from '../types';

const VARIANT_LADDER: Record<Exercise, ExerciseVariant[]> = {
  pushups: ['wall', 'incline', 'knee', 'negative_pushup', 'full_pushup', 'tempo_pushup', 'explosive_pushup'],
  pullups: ['dead_hang', 'band_assisted', 'australian_rows', 'negative_pullup', 'band_pullup', 'strict_pullup', 'weighted_pullup'],
  squats: ['box_squat', 'assisted_squat', 'bodyweight_squat', 'tempo_squat', 'pause_squat', 'pistol_squat'],
};

export const EXERCISE_LABELS: Record<Exercise, string> = {
  pushups: 'Push-ups',
  pullups: 'Pull-ups',
  squats: 'Squats',
};

export const VARIANT_LABELS: Record<ExerciseVariant, string> = {
  wall: 'Wall Push-ups',
  incline: 'Incline Push-ups',
  knee: 'Knee Push-ups',
  negative_pushup: 'Negative Push-ups',
  full_pushup: 'Full Push-ups',
  tempo_pushup: 'Tempo Push-ups',
  explosive_pushup: 'Explosive Push-ups',
  dead_hang: 'Dead Hangs',
  band_assisted: 'Band Assisted Pull-ups',
  australian_rows: 'Australian Rows',
  negative_pullup: 'Negative Pull-ups',
  band_pullup: 'Band Pull-ups',
  strict_pullup: 'Strict Pull-ups',
  weighted_pullup: 'Weighted Pull-ups',
  box_squat: 'Box Squats',
  assisted_squat: 'Assisted Squats',
  bodyweight_squat: 'Bodyweight Squats',
  tempo_squat: 'Tempo Squats',
  pause_squat: 'Pause Squats',
  pistol_squat: 'Pistol Squats',
};

export function getTierFromMaxReps(exercise: Exercise, maxReps: number): { tier: Tier; variant: ExerciseVariant } {
  const ladder = VARIANT_LADDER[exercise];
  let tier: Tier;
  if (maxReps === 0) tier = 0;
  else if (maxReps <= 5) tier = 1;
  else if (maxReps <= 10) tier = 2;
  else if (maxReps <= 20) tier = 3;
  else if (maxReps <= 40) tier = 4;
  else if (maxReps <= 70) tier = 5;
  else tier = 6;

  const variantIndex = Math.min(tier, ladder.length - 1);
  return { tier, variant: ladder[variantIndex] };
}

export function computeStartingVolume(maxReps: number): { dailyTarget: number; repsPerBlock: number; blockCount: number } {
  const dailyTarget = Math.max(20, Math.min(100, Math.round(maxReps * 3)));
  const repsPerBlock = Math.max(1, Math.round(maxReps * 0.6));
  const blockCount = Math.ceil(dailyTarget / repsPerBlock);
  return { dailyTarget, repsPerBlock, blockCount };
}

export function computeNextDayTarget(
  currentTarget: number,
  completed: boolean,
  effort: 'easy' | 'moderate' | 'hard' | 'max',
  consecutiveMissedDays: number
): number {
  if (consecutiveMissedDays >= 2) {
    return Math.max(Math.round(currentTarget * 0.8), 20);
  }
  if (completed && (effort === 'easy' || effort === 'moderate')) {
    return Math.min(currentTarget + 5, 100);
  }
  return currentTarget;
}

export function generateTimeSlots(
  blockCount: number,
  wakeTime: string,
  sleepTime: string
): string[] {
  const [wakeH, wakeM] = wakeTime.split(':').map(Number);
  const [sleepH, sleepM] = sleepTime.split(':').map(Number);

  const wakeMinutes = wakeH * 60 + wakeM;
  let sleepMinutes = sleepH * 60 + sleepM;
  if (sleepMinutes <= wakeMinutes) sleepMinutes += 24 * 60;

  const totalMinutes = sleepMinutes - wakeMinutes;
  const gap = Math.floor(totalMinutes / (blockCount + 1));

  const slots: string[] = [];
  for (let i = 1; i <= blockCount; i++) {
    const minutes = (wakeMinutes + gap * i) % (24 * 60);
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
  return slots;
}

export function generateDailyPlanId(date: string, exercise: Exercise): string {
  return `${date}_${exercise}`;
}

export function getBaselineForExercise(baselines: Baseline[], exercise: Exercise): Baseline | undefined {
  return baselines.find(b => b.exercise === exercise);
}

import type { Exercise, DayPlan, Profile } from '../types';
import {
  computeDay1Target, computeWeeklyTarget, computeWindowCount, splitIntoWindows,
} from './coach';
import { getDayPlan, saveDayPlan } from '../db';

const EXERCISES: Exercise[] = ['push', 'pull', 'squat'];

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function wakingSpanHours(wake: string, sleep: string): number {
  const w = timeToMinutes(wake);
  let s = timeToMinutes(sleep);
  if (s <= w) s += 24 * 60;
  return (s - w) / 60;
}

export async function generateDayPlan(
  date: string,
  dayIndex: number,
  profile: Profile
): Promise<DayPlan> {
  const existing = await getDayPlan(date);
  if (existing) return existing;

  const weekIndex = Math.floor(dayIndex / 7);
  const targets: Record<Exercise, number> = { push: 0, pull: 0, squat: 0 };
  let totalVolume = 0;

  for (const ex of EXERCISES) {
    const max = profile.maxes[ex] ?? 0;
    const day1Target = computeDay1Target(max);
    const target = computeWeeklyTarget(day1Target, weekIndex);
    targets[ex] = target;
    totalVolume += target;
  }

  const span = wakingSpanHours(profile.wake, profile.sleep);
  const windowCount = profile.windowCount || computeWindowCount(span, totalVolume / EXERCISES.length);
  const windows = splitIntoWindows(targets, windowCount, profile.wake, profile.sleep);

  const dayOfWeek = new Date(date).getDay();
  const model = dayOfWeek === 2 || dayOfWeek === 5 ? 'ladder' : 'percent';

  const plan: DayPlan = {
    id: date,
    date,
    dayIndex,
    targets,
    windows,
    model,
  };

  await saveDayPlan(plan);
  return plan;
}

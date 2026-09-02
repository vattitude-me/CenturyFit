import type { Baseline, DailyPlan, WorkoutBlock, UserProfile } from '../types';
import { computeStartingVolume, generateTimeSlots, generateDailyPlanId, computeNextDayTarget } from './progression';
import { getDailyPlans, saveDailyPlan, getSetLogs } from '../db';

function generateBlockId(planId: string, index: number): string {
  return `${planId}_block_${index}`;
}

export async function generatePlansForDate(
  date: string,
  profile: UserProfile,
  baselines: Baseline[],
  previousDate?: string
): Promise<DailyPlan[]> {
  const existing = await getDailyPlans(date);
  if (existing.length > 0) return existing;

  const plans: DailyPlan[] = [];

  for (const exercise of profile.goals) {
    const baseline = baselines.find(b => b.exercise === exercise);
    if (!baseline) continue;

    let dailyTarget: number;
    let repsPerBlock: number;
    let blockCount: number;

    if (previousDate) {
      const prevPlans = await getDailyPlans(previousDate);
      const prevPlan = prevPlans.find(p => p.exercise === exercise);
      const prevLogs = await getSetLogs(previousDate);
      const exerciseLogs = prevLogs.filter(l => l.exercise === exercise);

      if (prevPlan) {
        const wasCompleted = prevPlan.completedReps >= prevPlan.targetReps;
        const avgEffort = exerciseLogs.length > 0
          ? getAverageEffort(exerciseLogs.map(l => l.effort))
          : 'moderate';
        dailyTarget = computeNextDayTarget(prevPlan.targetReps, wasCompleted, avgEffort, 0);
      } else {
        const vol = computeStartingVolume(baseline.maxReps);
        dailyTarget = vol.dailyTarget;
      }
    } else {
      const vol = computeStartingVolume(baseline.maxReps);
      dailyTarget = vol.dailyTarget;
    }

    repsPerBlock = Math.max(1, Math.round(baseline.maxReps * 0.6));
    if (repsPerBlock === 0) repsPerBlock = Math.max(1, Math.round(dailyTarget / 10));
    blockCount = Math.ceil(dailyTarget / repsPerBlock);

    const timeSlots = generateTimeSlots(
      blockCount,
      profile.wakeTime || '07:00',
      profile.sleepTime || '22:00'
    );

    const planId = generateDailyPlanId(date, exercise);
    const blocks: WorkoutBlock[] = timeSlots.map((time, i) => {
      const remaining = dailyTarget - repsPerBlock * i;
      const reps = Math.min(repsPerBlock, Math.max(0, remaining));
      return {
        id: generateBlockId(planId, i),
        time,
        targetReps: reps,
        completedReps: 0,
        status: 'pending' as const,
      };
    });

    const plan: DailyPlan = {
      id: planId,
      date,
      exercise,
      targetReps: dailyTarget,
      variant: baseline.variant,
      blocks,
      completedReps: 0,
      status: 'pending',
    };

    await saveDailyPlan(plan);
    plans.push(plan);
  }

  return plans;
}

function getAverageEffort(efforts: Array<'easy' | 'moderate' | 'hard' | 'max'>): 'easy' | 'moderate' | 'hard' | 'max' {
  const scores = { easy: 1, moderate: 2, hard: 3, max: 4 };
  const avg = efforts.reduce((sum, e) => sum + scores[e], 0) / efforts.length;
  if (avg <= 1.5) return 'easy';
  if (avg <= 2.5) return 'moderate';
  if (avg <= 3.5) return 'hard';
  return 'max';
}

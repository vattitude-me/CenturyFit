interface BaselineData {
  pushup_max: number
  pullup_max: number
  squat_max: number
  assessed_at: string
}

interface PlanParams {
  baseline: BaselineData
  exercise: keyof Omit<BaselineData, 'assessed_at'>
  weekNumber: number
  lastWeekCompletionRate: number
}

interface DailyPlan {
  morning: number
  afternoon: number
  evening: number
  repsPerSet: number
  lastSetReps: number
  totalSets: number
  progressFactor: number
}

interface GeneratedPlans {
  baseline: BaselineData
  weekNumber: number
  plans: Record<string, DailyPlan>
}

/**
 * Calculate daily plan for an exercise based on baseline and progress
 * Based on the algorithm from Full_PWA_Implementation_Plan.md:
 * - repsPerSet = floor(baselineMax × progressFactor)
 * - progressFactor = min(0.6 + (weekNumber - 1) × 0.05, 0.80)
 * - if lastWeekCompletionRate < 0.70: do not increase progressFactor
 * - totalSets = ceil(100 / repsPerSet)
 * - last set = 100 - (totalSets - 1) × repsPerSet
 * - Distribute sets across morning/afternoon/evening slots
 */
export function generateDailyPlan(params: PlanParams): DailyPlan {
  const { baseline, exercise, weekNumber, lastWeekCompletionRate } = params

  const maxReps = baseline[exercise]
  if (!maxReps) {
    throw new Error(`No max reps found for exercise: ${exercise}`)
  }

  // Progress factor starts at 0.6 (60% of max per set), increases 5% per week, caps at 0.8
  let progressFactor = Math.min(0.6 + (weekNumber - 1) * 0.05, 0.80)

  // If last week completion rate < 70%, don't increase difficulty
  if (lastWeekCompletionRate < 0.70) {
    progressFactor = Math.min(0.6 + (weekNumber - 2) * 0.05, 0.80)
    if (progressFactor < 0.6) progressFactor = 0.6
  }

  const repsPerSet = Math.floor(maxReps * progressFactor)
  const totalSets = Math.ceil(100 / repsPerSet)
  const lastSetReps = 100 - (totalSets - 1) * repsPerSet

  // Distribute sets across slots: morning, afternoon, evening
  const setsPerSlot = Math.floor(totalSets / 3)
  const remainder = totalSets % 3

  const morningSets = setsPerSlot + (remainder > 0 ? 1 : 0)
  const afternoonSets = setsPerSlot + (remainder > 1 ? 1 : 0)
  const eveningSets = setsPerSlot

  return {
    morning: morningSets,
    afternoon: afternoonSets,
    evening: eveningSets,
    repsPerSet,
    lastSetReps,
    totalSets,
    progressFactor
  }
}

/**
 * Get current week number based on baseline assessment date
 */
export function getWeekNumber(assessedAt: string): number {
  const assessedDate = new Date(assessedAt)
  const today = new Date()
  const timeDiff = today.getTime() - assessedDate.getTime()
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24))
  return Math.max(1, Math.floor(dayDiff / 7) + 1)
}

/**
 * Generate plans for all three exercises - pure calculation version
 * Takes baseline data directly instead of fetching from DB
 */
export function generatePlansFromBaseline(
  baseline: BaselineData,
  weekNumber: number,
  lastWeekCompletionRates: Record<string, number> = {}
): GeneratedPlans {
  const exercises = ['pushup_max', 'pullup_max', 'squat_max'] as const
  const plans: Record<string, DailyPlan> = {}

  for (const exerciseKey of exercises) {
    const exercise = exerciseKey.replace('_max', '') as keyof Omit<BaselineData, 'assessed_at'>
    const lastWeekRate = lastWeekCompletionRates[exercise] ?? 0.5

    const plan = generateDailyPlan({
      baseline,
      exercise,
      weekNumber,
      lastWeekCompletionRate: lastWeekRate
    })
    plans[exercise] = plan
  }

  return { baseline, weekNumber, plans }
}
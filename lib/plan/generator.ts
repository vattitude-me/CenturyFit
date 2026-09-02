import type { Database } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/server'

interface BaselineData {
  pushup_max: number
  pullup_max: number
  squat_max: number
  assessed_at: string
}

interface PlanParams {
  baseline: BaselineData
  exercise: keyof BaselineData
  weekNumber: number
  lastWeekCompletionRate: number
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
export async function generateDailyPlan(params: PlanParams) {
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
 * Calculate last week's completion rate for an exercise
 */
export async function getLastWeekCompletionRate(
  userId: string,
  exercise: keyof BaselineData
): Promise<number> {
  const supabase = await createClient()

  const today = new Date()
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const { data, error } = await supabase
    .from('completed_sets')
    .select('reps_completed')
    .eq('user_id', userId)
    .eq('exercise', exercise)
    .gte('completed_at', oneWeekAgo.toISOString())
    .lte('completed_at', today.toISOString())

  if (error) {
    console.error('Error fetching completion rate:', error)
    return 0.5 // Default moderate completion
  }

  if (!data || data.length === 0) {
    return 0.5 // No data yet, assume moderate
  }

  // Get the planned sets for last week to calculate target
  const { data: plannedData, error: plannedError } = await supabase
    .from('planned_sets')
    .select('target_reps')
    .eq('daily_plan_id', supabase.from('daily_plans').select('id').eq('user_id', userId).single())
    .gte('created_at', oneWeekAgo.toISOString())
    .lte('created_at', today.toISOString())

  if (plannedError || !plannedData) {
    return 0.5
  }

  // Calculate completion rate: actual reps / target reps
  const totalActual = data.reduce((sum, set) => sum + set.reps_completed, 0)
  const totalTarget = plannedData.reduce((sum, set) => sum + set.target_reps, 0)

  return totalTarget > 0 ? Math.min(totalActual / totalTarget, 1.0) : 0.5
}

/**
 * Generate plans for all three exercises for today
 */
export async function generateTodaysPlans(userId: string) {
  const supabase = await createClient()

  // Get active baseline
  const { data: baselineData, error: baselineError } = await supabase
    .from('baselines')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (baselineError || !baselineData) {
    throw new Error('No active baseline found')
  }

  const baseline = {
    pushup_max: baselineData.pushup_max,
    pullup_max: baselineData.pullup_max,
    squat_max: baselineData.squat_max,
    assessed_at: baselineData.assessed_at
  }

  const weekNumber = getWeekNumber(baseline.assessed_at)

  // Generate plans for all exercises
  const exercises = ['pushup_max', 'pullup_max', 'squat_max'] as const
  const plans: Record<string, any> = {}

  for (const exerciseKey of exercises) {
    const exercise = exerciseKey.replace('_max', '') as keyof BaselineData
    const lastWeekRate = await getLastWeekCompletionRate(userId, exercise)
    const plan = await generateDailyPlan({
      baseline,
      exercise,
      weekNumber,
      lastWeekCompletionRate: lastWeekRate
    })
    plans[exercise] = plan
  }

  return { baseline, weekNumber, plans }
}
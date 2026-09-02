import { unstable_cache } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import { TodayPlan } from '@/components/dashboard/TodayPlan'
import { ExerciseProgress } from '@/components/dashboard/ExerciseProgress'
import { redirect } from 'next/navigation'

interface PlanData {
  pushupPlan: {
    completedReps: number
    targetReps: number
    sets: Array<{
      id: string
      set_number: number
      target_reps: number
      is_completed: boolean
      slot: 'morning' | 'afternoon' | 'evening'
    }>
  }
  pullupPlan: {
    completedReps: number
    targetReps: number
    sets: Array<{
      id: string
      set_number: number
      target_reps: number
      is_completed: boolean
      slot: 'morning' | 'afternoon' | 'evening'
    }>
  }
  squatPlan: {
    completedReps: number
    targetReps: number
    sets: Array<{
      id: string
      set_number: number
      target_reps: number
      is_completed: boolean
      slot: 'morning' | 'afternoon' | 'evening'
    }>
  }
  streak: {
    currentStreak: number
    longestStreak: number
  }
}

// Cache the plan fetch for 1 minute
const getTodayPlan = unstable_cache(
  async (userId: string): Promise<PlanData> => {
    const supabase = await createServerClient()
    const today = new Date().toISOString().split('T')[0]

    // Get today's plan
    const { data: planData, error: planError } = await supabase
      .from('daily_plans')
      .select('id')
      .eq('user_id', userId)
      .eq('plan_date', today)
      .single()

    if (planError || !planData) {
      // Return empty plan if none exists for today
      return {
        pushupPlan: {
          completedReps: 0,
          targetReps: 0,
          sets: [],
        },
        pullupPlan: {
          completedReps: 0,
          targetReps: 0,
          sets: [],
        },
        squatPlan: {
          completedReps: 0,
          targetReps: 0,
          sets: [],
        },
        streak: {
          currentStreak: 0,
          longestStreak: 0,
        },
      }
    }

    const planId = planData.id

    // Get planned sets for today
    const { data: plannedSets, error: setsError } = await supabase
      .from('planned_sets')
      .select('*')
      .eq('daily_plan_id', planId)
      .order('slot')
      .order('set_number')

    // Get completed sets for today
    const { data: completedSets } = await supabase
      .from('completed_sets')
      .select('exercise, reps_completed')
      .eq('user_id', userId)
      .eq('log_date', today)

    // Get streak info
    const { data: streakData } = await supabase
      .from('streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', userId)
      .single()

    // Calculate completed reps per exercise
    const completedByExercise: Record<string, number> = {
      pushup: 0,
      pullup: 0,
      squat: 0,
    }
    completedSets?.forEach((set) => {
      completedByExercise[set.exercise] =
        (completedByExercise[set.exercise] || 0) + set.reps_completed
    })

    // Organize planned sets by exercise
    const exerciseSets: Record<string, any[]> = {
      pushup: [],
      pullup: [],
      squat: [],
    }

    plannedSets?.forEach((set) => {
      exerciseSets[set.exercise].push({
        id: set.id,
        set_number: set.set_number,
        target_reps: set.target_reps,
        is_completed: false, // We'll determine this from completed_sets later
        slot: set.slot,
      })
    })

    // Mark sets as completed if we have completion data
    Object.keys(exerciseSets).forEach((exercise) => {
      exerciseSets[exercise].forEach((set) => {
        const exerciseCompleted = completedByExercise[exercise] || 0
        const setsBeforeThis = exerciseSets[exercise].filter(
          (s) => s.set_number < set.set_number
        ).reduce((sum, s) => sum + s.target_reps, 0)

        set.is_completed =
          exerciseCompleted >= setsBeforeThis + set.target_reps
      })
    })

    return {
      pushupPlan: {
        completedReps: completedByExercise.pushup || 0,
        targetReps: exerciseSets.pushup.reduce(
          (sum, set) => sum + set.target_reps,
          0
        ),
        sets: exerciseSets.pushup,
      },
      pullupPlan: {
        completedReps: completedByExercise.pullup || 0,
        targetReps: exerciseSets.pullup.reduce(
          (sum, set) => sum + set.target_reps,
          0
        ),
        sets: exerciseSets.pullup,
      },
      squatPlan: {
        completedReps: completedByExercise.squat || 0,
        targetReps: exerciseSets.squat.reduce(
          (sum, set) => sum + set.target_reps,
          0
        ),
        sets: exerciseSets.squat,
      },
      streak: {
        currentStreak: streakData?.current_streak || 0,
        longestStreak: streakData?.longest_streak || 0,
      },
    }
  },
  ['today-plan'],
  {
    tags: ['today-plan'],
    revalidate: 60, // 1 minute
  }
)

export default async function DashboardPage() {
  // Check authentication - redirect to sign-in if not authenticated
  // In a real implementation, we'd use Clerk auth here
  // For MVP, we'll check if we have a Supabase session

  // Simulate auth check - in production, use Clerk's auth protection
  const shouldRedirect = false // Remove this when integrating with Clerk

  if (shouldRedirect) {
    redirect('/sign-in')
  }

  // For now, show placeholder data until auth is fully integrated
  // In production, we'd get the user ID from Clerk/Supabase auth
  const mockUserId = 'test-user-id'

  const planData = await getTodayPlan(mockUserId)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto py-8 px-4">
        <TodayPlan
          pushupPlan={planData.pushupPlan}
          pullupPlan={planData.pullupPlan}
          squatPlan={planData.squatPlan}
          streak={planData.streak}
          onStartSet={(exercise, setId) => {
            // Navigate to workout page
            // In a real app, we'd pass the setId as a query param
            // For MVP, we'll just show an alert
            alert(
              `Starting ${exercise} set ${setId}\n\nIn production, this would navigate to the workout screen.`
            )
          }}
        />
      </div>
    </div>
  )
}
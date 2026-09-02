'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { generateTodaysPlans } from '@/lib/plan/generator'
import type { Database } from '@/lib/supabase/types'

export default function PlanPreviewPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [baseline, setBaseline] = useState<any>(null)
  const [weekNumber, setWeekNumber] = useState<number>(1)
  const [plans, setPlans] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    loadPlan()
  }, [])

  async function loadPlan() {
    try {
      setIsLoading(true)
      setError(null)

      // Get user ID from Supabase auth (we'd normally get from Clerk, but for MVP we'll check session)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Redirect to sign-in if not authenticated
        router.push('/sign-in')
        return
      }

      const planData = await generateTodaysPlans(user.id)
      setBaseline(planData.baseline)
      setWeekNumber(planData.weekNumber)
      setPlans(planData.plans)
    } catch (err) {
      console.error('Error loading plan:', err)
      setError('Failed to load your plan. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatExerciseName = (exercise: string) => {
    return exercise.charAt(0).toUpperCase() + exercise.slice(1).replace('_', ' ')
  }

  const calculateDay1Total = (plan: any) => {
    return (
      plan.morning * plan.repsPerSet +
      plan.afternoon * plan.repsPerSet +
      plan.evening * plan.repsPerSet +
      (plan.morning > 0 ? plan.lastSetReps : 0) +
      (plan.afternoon > 0 && plan.morning === 0 ? plan.lastSetReps : 0) +
      (plan.evening > 0 && plan.morning === 0 && plan.afternoon === 0 ? plan.lastSetReps : 0)
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-primary">Generating Your Plan...</h2>
          <p className="text-muted-foreground">
            Based on your baseline test, we're creating your personalized daily plan.
          </p>
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 border-2 border-primary rounded-full animate-spin"></div>
            <span className="text-sm text-muted-foreground">Just a moment...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <h2 className="text-2xl font-bold text-destructive">Oops!</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push('/onboarding')}
            className="py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!baseline || !plans) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-muted-foreground">No baseline found</h2>
          <p className="text-muted-foreground">
            Please complete the baseline test first to generate your plan.
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            className="py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Go to Baseline Test
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background min-h-[100vh]">
      <div className="max-w-xl mx-auto py-12 px-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary">Your Personalized Plan</h1>
          <p className="text-muted-foreground">
            Based on your baseline test, here's your plan for Week {weekNumber}
          </p>
        </div>

        <div className="space-y-6">
          {['pushup_max', 'pullup_max', 'squat_max'].map((exerciseKey) => {
            const exercise = exerciseKey.replace('_max', '')
            const plan = plans[exercise]
            if (!plan) return null

            const day1Total = calculateDay1Total(plan)
            const startsWithBaseline =
              (exercise === 'pushup' && baseline.pushup_max < 5) ||
              (exercise === 'pullup' && baseline.pullup_max === 0) ||
              (exercise === 'squat' && baseline.squat_max < 8)
            const variantText =
              exercise === 'pushup'
                ? startsWithBaseline
                  ? 'Knee/Incline Push-ups'
                  : 'Standard Push-ups'
                : exercise === 'pullup'
                ? startsWithBaseline
                  ? 'Assisted/Negative Pull-ups'
                  : 'Standard Pull-ups'
                : startsWithBaseline
                ? 'Box/Chair-Assisted Squats'
                : 'Standard Squats'

            return (
              <div key={exercise} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-primary">
                      {formatExerciseName(exercise)}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Max: {baseline[exercise]} → {variantText}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {day1Total}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    reps/day
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">Daily Breakdown</h3>
                  <div className="grid gap-2 text-sm">
                    {plan.morning > 0 && (
                      <div className="flex justify-between">
                        <span>Morning ({plan.morning} sets):</span>
                        <span>
                          {plan.morning > 1
                            ? `${plan.repsPerSet} × ${plan.morning} = ${
                                plan.morning * plan.repsPerSet
                              }`
                            : `${plan.repsPerSet}`}
                        </span>
                      </div>
                    )}
                    {plan.afternoon > 0 && (
                      <div className="flex justify-between">
                        <span>Afternoon ({plan.afternoon} sets):</span>
                        <span>
                          {plan.afternoon > 1
                            ? `${plan.repsPerSet} × ${plan.afternoon} = ${
                                plan.afternoon * plan.repsPerSet
                              }`
                            : `${plan.repsPerSet}`}
                        </span>
                      </div>
                    )}
                    {plan.evening > 0 && (
                      <div className="flex justify-between">
                        <span>Evening ({plan.evening} sets):</span>
                        <span>
                          {plan.evening > 1
                            ? `${plan.repsPerSet} × ${plan.evening} = ${
                                plan.evening * plan.repsPerSet
                              }`
                            : `${plan.repsPerSet}`}
                        </span>
                      </div>
                    )}
                    {(plan.morning === 0 && plan.afternoon > 0) ||
                    (plan.morning > 0 && plan.afternoon === 0 && plan.evening > 0) ||
                    (plan.morning === 0 && plan.afternoon === 0 && plan.evening > 0) && (
                      <div className="flex justify-between">
                        <span>Remaining set:</span>
                        <span>{plan.lastSetReps}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          })}

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">How It Works</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              <li>
                Each day, you'll aim for <strong>100 reps</strong> of each exercise.
              </li>
              <li>
                We split this into mini-sets across your day (morning, afternoon, evening)
                to make it manageable - this is the "grease the groove" method.
              </li>
              <li>
                As you complete sets successfully, we'll gradually increase the reps per set
                to keep you challenged and progressing toward 100 unbroken reps.
              </li>
              <li>
                If you miss days or find it too hard, we'll adjust the plan to keep you
                progressing safely without burnout or injury.
              </li>
            </ol>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => {
              router.push('/dashboard')
            }}
            className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Start Day 1 Tomorrow
          </button>
        </div>
      </div>
    </div>
  )
}
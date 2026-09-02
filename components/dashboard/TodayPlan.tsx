'use client'

import { ExerciseCard } from './ExerciseCard'
import { StreakBadge } from './StreakBadge'
import type { Database } from '@/lib/supabase/types'

interface TodayPlanProps {
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
  onStartSet: (exercise: string, setId: string) => void
}

export function TodayPlan({
  pushupPlan,
  pullupPlan,
  squatPlan,
  streak,
  onStartSet,
}: TodayPlanProps) {
  const exerciseOrder = [
    { key: 'pushup', plan: pushupPlan },
    { key: 'pullup', plan: pullupPlan },
    { key: 'squat', plan: squatPlan },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">Today's Workout</h1>
        <StreakBadge
          currentStreak={streak.currentStreak}
          longestStreak={streak.longestStreak}
        />
      </div>

      {/* Exercise cards */}
      <div className="space-y-4">
        {exerciseOrder.map(({ key, plan }) => (
          <ExerciseCard
            key={key}
            exercise={key as 'pushup' | 'pullup' | 'squat'}
            completedReps={plan.completedReps}
            targetReps={plan.targetReps}
            sets={plan.sets}
            onStartSet={(setId) => onStartSet(key, setId)}
          />
        ))}
      </div>

      {/* CTA button */}
      <div className="pt-4 border-t">
        <p className="text-center text-sm text-muted-foreground">
          Tap any set to begin
        </p>
        <button
          className="mt-3 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Start Next Set
        </button>
      </div>
    </div>
  )
}
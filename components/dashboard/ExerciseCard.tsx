'use client'

import { ExerciseProgress } from './ExerciseProgress'
import type { Database } from '@/lib/supabase/types'

interface PlannedSet {
  id: string
  set_number: number
  target_reps: number
  is_completed: boolean
  slot: 'morning' | 'afternoon' | 'evening'
}

interface ExerciseCardProps {
  exercise: 'pushup' | 'pullup' | 'squat'
  completedReps: number
  targetReps: number
  sets: PlannedSet[]
  onStartSet: (setId: string) => void
}

export function ExerciseCard({
  exercise,
  completedReps,
  targetReps,
  sets,
  onStartSet,
}: ExerciseCardProps) {
  const exerciseLabels = {
    pushup: 'Push-ups',
    pullup: 'Pull-ups',
    squat: 'Squats',
  }

  const exerciseEmojis = {
    pushup: '💪',
    pullup: '🏋️',
    squat: '🦵',
  }

  const completedSetsCount = sets.filter((s) => s.is_completed).length
  const totalSets = sets.length

  return (
    <div className="bg-secondary rounded-xl p-4 space-y-4">
      {/* Header with progress ring */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{exerciseEmojis[exercise]}</span>
          <div>
            <h3 className="font-semibold text-foreground">
              {exerciseLabels[exercise]}
            </h3>
            <p className="text-sm text-muted-foreground">
              {completedSetsCount}/{totalSets} sets done
            </p>
          </div>
        </div>
        <ExerciseProgress
          completed={completedReps}
          target={targetReps}
          size="md"
        />
      </div>

      {/* Set list */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Today's Sets
        </h4>
        <div className="space-y-2">
          {sets.map((set, index) => (
            <div
              key={set.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                set.is_completed
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-background border-border hover:border-primary/50 cursor-pointer'
              }`}
              onClick={() => !set.is_completed && onStartSet(set.id)}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    set.is_completed
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {set.is_completed ? '✓' : index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Set {set.set_number} • {set.target_reps} reps
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {set.slot}
                  </p>
                </div>
              </div>
              {set.is_completed ? (
                <span className="text-sm text-primary">Done</span>
              ) : (
                <button className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded">
                  Start
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
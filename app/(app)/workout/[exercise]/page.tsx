'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { RepCounter } from '@/components/workout/RepCounter'
import { CadenceSlider } from '@/components/workout/CadenceSlider'
import { SetCompleteOverlay } from '@/components/workout/SetCompleteOverlay'
import { useMetronome } from '@/hooks/useMetronome'
import { useWakeLock } from '@/hooks/useWakeLock'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type ExerciseType = 'pushup' | 'pullup' | 'squat'

export default function WorkoutPage() {
  const params = useParams()
  const router = useRouter()
  const exercise = params.exercise as ExerciseType

  // State
  const [bpm, setBpm] = useState(40)
  const [guidedMode, setGuidedMode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [hapticsEnabled, setHapticsEnabled] = useState(true)
  const [restTimer, setRestTimer] = useState<number>(60) // seconds
  const [isResting, setIsResting] = useState(false)
  const [targetReps, setTargetReps] = useState(15) // Would come from planned set
  const [setComplete, setSetComplete] = useState(false)

  // Hooks
  const { isSupported: wakeLockSupported, requestWakeLock } = useWakeLock()

  const exerciseName = {
    pushup: 'Push-ups',
    pullup: 'Pull-ups',
    squat: 'Squats',
  }[exercise]

  // Metronome auto-increment
  useMetronome({
    bpm,
    isEnabled: guidedMode && !isResting,
    onTick: () => {
      // In guided mode, automatically increment counter
      // (This would connect to the RepCounter's increment function)
      console.log('Metronome tick - would increment')
    },
    soundEnabled,
  })

  // Request Wake Lock on mount
  useEffect(() => {
    if (wakeLockSupported) {
      requestWakeLock()
    }
  }, [wakeLockSupported, requestWakeLock])

  // Keep screen on during workout
  const handleScreenOnToggle = async () => {
    if (wakeLockSupported) {
      await requestWakeLock()
    } else {
      alert('Screen lock not supported on this device')
    }
  }

  // Handle set completion
  const handleSetComplete = () => {
    setSetComplete(true)
    // Log to database
    logSetCompletion()
  }

  const logSetCompletion = async () => {
    const supabase = createClient()

    // Get user ID (in a real app, this would come from auth context)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Insert completed set
    const { error } = await supabase
      .from('completed_sets')
      .insert({
        user_id: user.id,
        exercise,
        reps_completed: targetReps,
        cadence_bpm: guidedMode ? bpm : null,
        completed_at: new Date().toISOString(),
      } as any)

    if (error) {
      console.error('Error logging set:', error)
      // In production, we would queue this for offline sync
    }
  }

  // Rest timer logic
  useEffect(() => {
    if (!isResting) return

    const timer = setInterval(() => {
      setRestTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsResting(false)
          setRestTimer(60)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isResting])

  // Handle "Next Set" after rest
  const handleNextSet = () => {
    // For MVP, just go back to dashboard
    router.push('/dashboard')
  }

  if (setComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SetCompleteOverlay
          repsCompleted={targetReps}
          exercise={exerciseName}
          restTimeSeconds={restTimer}
          onSkipRest={() => {
            setIsResting(false)
            setRestTimer(0)
            router.push('/dashboard')
          }}
          onNextSet={() => {
            setIsResting(false)
            setRestTimer(60)
            router.push('/dashboard')
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">{exerciseName}</h1>
          <p className="text-muted-foreground">Target: {targetReps} reps</p>
        </div>

        {/* Main rep counter */}
        <div className="flex items-center justify-center py-8">
          <RepCounter
            targetReps={targetReps}
            onComplete={handleSetComplete}
            soundEnabled={soundEnabled}
            hapticsEnabled={hapticsEnabled}
          />
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <CadenceSlider
            bpm={bpm}
            onBpmChange={setBpm}
            guidedMode={guidedMode}
            onGuidedModeChange={setGuidedMode}
          />

          <div className="p-4 bg-secondary rounded-lg space-y-3">
            <h3 className="font-semibold text-foreground">Settings</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sound effects</span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-6 rounded-full ${
                  soundEnabled ? 'bg-primary' : 'bg-border'
                }`}
              >
                <div
                  className={`h-4 w-4 bg-white rounded-full transform transition-transform ${
                    soundEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Haptic feedback</span>
              <button
                onClick={() => setHapticsEnabled(!hapticsEnabled)}
                className={`w-12 h-6 rounded-full ${
                  hapticsEnabled ? 'bg-primary' : 'bg-border'
                }`}
              >
                <div
                  className={`h-4 w-4 bg-white rounded-full transform transition-transform ${
                    hapticsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {wakeLockSupported && (
            <button
              onClick={handleScreenOnToggle}
              className="w-full py-3 px-4 bg-input text-foreground border border-border rounded-lg font-medium"
            >
              Keep screen on
            </button>
          )}

          <button
            onClick={() => {
              // Manually mark set complete
              handleSetComplete()
            }}
            className="w-full py-3 px-4 bg-accent text-accent-foreground rounded-lg font-semibold"
          >
            Finish Set
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Tap anywhere on the circle to count a rep</p>
          <p>Long press (hold) to undo a rep</p>
        </div>
      </div>
    </div>
  )
}
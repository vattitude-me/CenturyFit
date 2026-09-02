import { useState, useCallback } from 'react'
import { playBeep, playCompletionChime } from '@/lib/audio/metronome'

interface UseRepCounterProps {
  targetReps: number
  onComplete?: () => void
  soundEnabled?: boolean
  hapticsEnabled?: boolean
}

export function useRepCounter({
  targetReps,
  onComplete,
  soundEnabled = true,
  hapticsEnabled = true,
}: UseRepCounterProps) {
  const [count, setCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const increment = useCallback(() => {
    setCount((prev) => {
      if (prev >= targetReps) return prev

      const next = prev + 1

      if (soundEnabled) {
        if (next === targetReps) {
          playCompletionChime()
        } else {
          playBeep(880, 0.05)
        }
      }

      if (hapticsEnabled && 'vibrate' in navigator) {
        navigator.vibrate(next === targetReps ? [100, 50, 100] : 40)
      }

      if (next === targetReps) {
        setIsFinished(true)
        onComplete?.()
      }

      return next
    })
  }, [targetReps, onComplete, soundEnabled, hapticsEnabled])

  const decrement = useCallback(() => {
    setCount((prev) => {
      if (prev <= 0) return 0
      setIsFinished(false)
      return prev - 1
    })
  }, [])

  const reset = useCallback(() => {
    setCount(0)
    setIsFinished(false)
  }, [])

  return {
    count,
    targetReps,
    isFinished,
    progress: Math.min(count / targetReps, 1),
    increment,
    decrement,
    reset,
  }
}
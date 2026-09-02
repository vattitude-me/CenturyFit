'use client'

import { useState, useEffect } from 'react'
import { playBeep } from '@/lib/audio/metronome'

interface SetCompleteOverlayProps {
  repsCompleted: number
  exercise: string
  restTimeSeconds: number
  onSkipRest?: () => void
  onNextSet?: () => void
}

export function SetCompleteOverlay({
  repsCompleted,
  exercise,
  restTimeSeconds = 60,
  onSkipRest,
  onNextSet,
}: SetCompleteOverlayProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(restTimeSeconds)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Confetti animation
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false)
    }, 2000)

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Play a "set complete" sound
    playBeep(523.25, 0.1) // C5
    setTimeout(() => playBeep(659.25, 0.1), 100) // E5
    setTimeout(() => playBeep(783.99, 0.15), 200) // G5

    return () => {
      clearTimeout(confettiTimer)
      clearInterval(countdownTimer)
    }
  }, [])

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-background border border-border rounded-2xl p-8 max-w-md w-full mx-4 space-y-6">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full opacity-70 animate-ping"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <div className="text-6xl font-bold text-primary mb-2">✓</div>
          <h1 className="text-2xl font-bold text-foreground">Set Complete!</h1>
          <p className="text-muted-foreground mt-1">
            You completed {repsCompleted} {exercise}
          </p>
        </div>

        {/* Rest timer */}
        <div className="bg-secondary rounded-xl p-6 text-center">
          <h2 className="text-lg font-medium text-foreground mb-2">Rest Timer</h2>
          <div className="text-5xl font-bold text-primary tabular-nums mb-4">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          <p className="text-sm text-muted-foreground">
            Rest between sets to maximize recovery
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          <button
            onClick={onSkipRest}
            className="w-full py-3 px-4 bg-input text-foreground border border-border rounded-lg font-medium hover:bg-muted transition-colors"
          >
            Skip Rest
          </button>
          <button
            onClick={onNextSet}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Next Set
          </button>
        </div>

        {/* Stats */}
        <div className="pt-4 border-t">
          <p className="text-center text-sm text-muted-foreground">
            Great work! Your completion has been recorded.
          </p>
        </div>
      </div>
    </div>
  )
}
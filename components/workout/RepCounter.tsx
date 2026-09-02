'use client'

import { useEffect, useState } from 'react'
import { useRepCounter } from '@/hooks/useRepCounter'
import { getAudioContext } from '@/lib/audio/metronome'

interface RepCounterProps {
  targetReps: number
  onComplete?: () => void
  soundEnabled?: boolean
  hapticsEnabled?: boolean
}

export function RepCounter({
  targetReps,
  onComplete,
  soundEnabled = true,
  hapticsEnabled = true,
}: RepCounterProps) {
  const { count, progress, isFinished, increment, decrement } = useRepCounter({
    targetReps,
    onComplete,
    soundEnabled,
    hapticsEnabled,
  })

  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [isLongPress, setIsLongPress] = useState(false)

  // Initialize audio context on mount (user gesture)
  useEffect(() => {
    // Ensure audio context is created on first render
    getAudioContext()
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const timer = setTimeout(() => {
      setIsLongPress(true)
      decrement()
    }, 800) // Long press = 800ms
    setLongPressTimer(timer)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
    if (!isLongPress) {
      increment()
    }
    setIsLongPress(false)
  }

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setIsLongPress(true)
      decrement()
    }, 800)
    setLongPressTimer(timer)
  }

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
    if (!isLongPress) {
      increment()
    }
    setIsLongPress(false)
  }

  // SVG circle calculations
  const radius = 120
  const strokeWidth = 16
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Circular progress ring with tap target */}
      <div
        className="relative cursor-pointer select-none touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ width: radius * 2 + strokeWidth, height: radius * 2 + strokeWidth }}
      >
        <svg
          width={radius * 2 + strokeWidth}
          height={radius * 2 + strokeWidth}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="hsl(var(--color-border))"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
          />
          {/* Progress circle */}
          <circle
            stroke={isFinished ? 'hsl(var(--color-primary))' : 'hsl(var(--color-accent))'}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Counter text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-7xl font-bold text-foreground tabular-nums">
            {count}
          </div>
          <div className="text-xl text-muted-foreground mt-1">/ {targetReps}</div>
        </div>

        {/* Tap hint */}
        {count === 0 && (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-sm text-muted-foreground whitespace-nowrap">
            Tap to count • Hold to undo
          </div>
        )}

        {/* Completion indicator */}
        {isFinished && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-6xl animate-bounce">✓</div>
          </div>
        )}
      </div>
    </div>
  )
}
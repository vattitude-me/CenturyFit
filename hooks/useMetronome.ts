import { useEffect, useRef, useCallback } from 'react'
import { playBeep, playRestTick } from '@/lib/audio/metronome'

interface UseMetronomeProps {
  bpm: number
  isEnabled: boolean
  onTick: () => void
  soundEnabled?: boolean
}

export function useMetronome({
  bpm,
  isEnabled,
  onTick,
  soundEnabled = true,
}: UseMetronomeProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }

    // Calculate interval in milliseconds
    const intervalMs = (60 / bpm) * 1000

    // For more precise timing, use a combination of setInterval and RAF
    // This helps account for JavaScript event loop delays
    let lastTickTime = Date.now()

    const tick = () => {
      const now = Date.now()
      if (now - lastTickTime >= intervalMs) {
        lastTickTime = now
        if (soundEnabled) {
          playRestTick()
        }
        onTick()
      }
      if (isEnabled) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    // Start the RAF-based timer for high precision
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [bpm, isEnabled, onTick, soundEnabled])

  return {
    isRunning: isEnabled,
  }
}
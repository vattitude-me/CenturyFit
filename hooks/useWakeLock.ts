import { useEffect, useState } from 'react'

export function useWakeLock() {
  const [isSupported, setIsSupported] = useState(false)
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null)

  useEffect(() => {
    setIsSupported('wakeLock' in navigator)
  }, [])

  const requestWakeLock = async () => {
    if (!isSupported) {
      console.warn('Wake Lock API not supported')
      return false
    }

    try {
      const lock = await navigator.wakeLock.request('screen')
      setWakeLock(lock)

      lock.addEventListener('release', () => {
        setWakeLock(null)
      })

      return true
    } catch (err) {
      console.error('Wake Lock request failed:', err)
      return false
    }
  }

  const releaseWakeLock = async () => {
    if (wakeLock) {
      try {
        await wakeLock.release()
        setWakeLock(null)
      } catch (err) {
        console.error('Wake Lock release failed:', err)
      }
    }
  }

  // Auto-release on unmount
  useEffect(() => {
    return () => {
      if (wakeLock) {
        wakeLock.release()
      }
    }
  }, [wakeLock])

  return {
    isSupported,
    isLocked: wakeLock !== null,
    requestWakeLock,
    releaseWakeLock,
  }
}
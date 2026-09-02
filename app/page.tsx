'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getGuest, setGuest, isGuestUsername } from '@/lib/guest'
import { useUser } from '@clerk/nextjs'

export default function HomePage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoaded) return
    // Already signed in via Clerk — go straight to app
    if (isSignedIn) {
      router.replace('/dashboard')
      return
    }
    // Returning guest
    const guest = getGuest()
    if (guest) {
      router.replace('/dashboard')
    }
  }, [isSignedIn, isLoaded, router])

  function handleStart() {
    const trimmed = username.trim()
    if (!isGuestUsername(trimmed)) {
      setError('Username must be 2–30 characters')
      return
    }
    setGuest(trimmed)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="text-6xl mb-4">💪</div>
          <h1 className="text-3xl font-bold text-foreground">CenturyFit</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            100 push-ups, pull-ups &amp; squats every day
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
              What should we call you?
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder="Enter a username"
              maxLength={30}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          <button
            onClick={handleStart}
            disabled={!username.trim()}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
          >
            Start training
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{' '}
            <a href="/sign-in" className="text-primary underline">
              Sign in
            </a>{' '}
            to restore your progress
          </p>
        </div>
      </div>
    </div>
  )
}

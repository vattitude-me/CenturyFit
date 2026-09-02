'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { getGuest } from '@/lib/guest'
import Link from 'next/link'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  // If Clerk doesn't load within 3s (e.g. network error), unblock the UI
  const [clerkTimedOut, setClerkTimedOut] = useState(false)

  useEffect(() => {
    if (isLoaded) return
    const t = setTimeout(() => setClerkTimedOut(true), 3000)
    return () => clearTimeout(t)
  }, [isLoaded])

  const ready = isLoaded || clerkTimedOut

  useEffect(() => {
    if (!ready) return
    // Allow through if signed in via Clerk or has a guest session
    if (!isSignedIn && !getGuest()) {
      router.replace('/')
    }
  }, [isSignedIn, ready, router])

  // Don't flash content while Clerk loads (max 3s wait)
  if (!ready) return null

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      <main className="flex-1">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t border-border backdrop-blur-lg bg-opacity-95">
        <div className="max-w-xl mx-auto flex justify-around items-center h-16 px-2">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="text-xl mb-0.5">🏠</span>
            <span>Today</span>
          </Link>

          <Link
            href="/progress"
            className="flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xl mb-0.5">📊</span>
            <span>Progress</span>
          </Link>

          <Link
            href="/friends"
            className="flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xl mb-0.5">👥</span>
            <span>Friends</span>
          </Link>

          <Link
            href="/settings"
            className="flex flex-col items-center justify-center flex-1 py-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xl mb-0.5">⚙️</span>
            <span>Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

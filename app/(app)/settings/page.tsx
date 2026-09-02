'use client'

import { useUser, UserButton, useClerk } from '@clerk/nextjs'
import { getGuest, clearGuest } from '@/lib/guest'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { isSignedIn } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const guest = typeof window !== 'undefined' ? getGuest() : null

  function handleSignOut() {
    if (isSignedIn) {
      signOut(() => router.replace('/'))
    } else {
      clearGuest()
      router.replace('/')
    }
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      {/* Sign-in CTA for guests */}
      {!isSignedIn && guest && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Save your progress</p>
          <p className="text-xs text-muted-foreground">
            You&apos;re training as <strong>{guest.username}</strong>. Create an account to
            back up your streaks and access them from any device.
          </p>
          <a
            href="/sign-up"
            className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
          >
            Create account
          </a>
          <a
            href="/sign-in"
            className="block w-full text-center py-2 px-4 bg-secondary text-foreground rounded-lg text-sm font-medium"
          >
            Sign in
          </a>
        </div>
      )}

      {/* Notifications */}
      <div className="bg-secondary rounded-xl p-4 space-y-4">
        <h2 className="font-semibold text-foreground">Notifications</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm">Set reminders</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Streak alerts</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Friend cheers</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
        </div>
      </div>

      {/* Workout Preferences */}
      <div className="bg-secondary rounded-xl p-4 space-y-4">
        <h2 className="font-semibold text-foreground">Workout</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Default Cadence (BPM)</label>
            <input
              type="number"
              defaultValue={40}
              min={20}
              max={120}
              className="w-full py-2 px-3 bg-background border border-border rounded-lg text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Rest Time Between Sets (seconds)</label>
            <input
              type="number"
              defaultValue={60}
              min={15}
              max={300}
              step={15}
              className="w-full py-2 px-3 bg-background border border-border rounded-lg text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-secondary rounded-xl p-4 space-y-4">
        <h2 className="font-semibold text-foreground">Appearance</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm">Dark Mode</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Haptic Feedback</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Sound Effects</span>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </label>
        </div>
      </div>

      {/* Account */}
      <div className="bg-secondary rounded-xl p-4 space-y-4">
        <h2 className="font-semibold text-foreground">Account</h2>
        {isSignedIn && <UserButton />}
        <button
          onClick={handleSignOut}
          className="w-full py-2 px-4 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium"
        >
          {isSignedIn ? 'Sign Out' : 'Exit (clear local data)'}
        </button>
      </div>

      {/* About */}
      <div className="bg-secondary rounded-xl p-4 space-y-2">
        <h2 className="font-semibold text-foreground">About</h2>
        <p className="text-xs text-muted-foreground">CenturyFit v1.0</p>
        <p className="text-xs text-muted-foreground">
          100 push-ups, pull-ups, and squats every day
        </p>
      </div>
    </div>
  )
}

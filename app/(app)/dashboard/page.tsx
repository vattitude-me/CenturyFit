'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { getGuest } from '@/lib/guest'
import { getOfflineSets } from '@/lib/offline/idb'
import { TodayPlan } from '@/components/dashboard/TodayPlan'
import { useRouter } from 'next/navigation'

const DAILY_TARGET = 100

type ExercisePlan = {
  completedReps: number
  targetReps: number
  sets: Array<{
    id: string
    set_number: number
    target_reps: number
    is_completed: boolean
    slot: 'morning' | 'afternoon' | 'evening'
  }>
}

type PlanData = {
  pushupPlan: ExercisePlan
  pullupPlan: ExercisePlan
  squatPlan: ExercisePlan
  streak: { currentStreak: number; longestStreak: number }
}

function buildGuestPlan(
  completedReps: Record<'pushup' | 'pullup' | 'squat', number>
): PlanData {
  const makePlan = (exercise: 'pushup' | 'pullup' | 'squat'): ExercisePlan => {
    const done = completedReps[exercise]
    const sets = [25, 25, 25, 25].map((reps, i) => ({
      id: `${exercise}-${i + 1}`,
      set_number: i + 1,
      target_reps: reps,
      is_completed: done >= (i + 1) * reps,
      slot: (['morning', 'morning', 'afternoon', 'evening'] as const)[i],
    }))
    return { completedReps: done, targetReps: DAILY_TARGET, sets }
  }
  return {
    pushupPlan: makePlan('pushup'),
    pullupPlan: makePlan('pullup'),
    squatPlan: makePlan('squat'),
    streak: { currentStreak: 0, longestStreak: 0 },
  }
}

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useUser()
  const router = useRouter()
  const [planData, setPlanData] = useState<PlanData | null>(null)
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn && user) {
      setDisplayName(user.firstName || user.username || 'there')
      // Signed-in: fetch plan from server
      fetch('/api/plan/today')
        .then((r) => r.json())
        .then((data) => setPlanData(data))
        .catch(() => setPlanData(buildGuestPlan({ pushup: 0, pullup: 0, squat: 0 })))
      return
    }

    // Guest: build plan from local IDB completed sets
    const guest = getGuest()
    if (!guest) { router.replace('/'); return }
    setDisplayName(guest.username)

    const today = new Date().toISOString().split('T')[0]
    getOfflineSets().then((sets) => {
      const todaySets = sets.filter((s) => s.completed_at.startsWith(today))
      const completedReps = { pushup: 0, pullup: 0, squat: 0 } as Record<'pushup' | 'pullup' | 'squat', number>
      todaySets.forEach((s) => {
        if (s.exercise in completedReps) completedReps[s.exercise] += s.reps_completed
      })
      setPlanData(buildGuestPlan(completedReps))
    })
  }, [isSignedIn, isLoaded, user, router])

  if (!planData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto py-8 px-4">
        {displayName && (
          <p className="text-muted-foreground text-sm mb-4">
            Hey, <span className="text-foreground font-medium">{displayName}</span> 👋
          </p>
        )}
        <TodayPlan
          pushupPlan={planData.pushupPlan}
          pullupPlan={planData.pullupPlan}
          squatPlan={planData.squatPlan}
          streak={planData.streak}
          onStartSet={(exercise, setId) => {
            router.push(`/workout/${exercise}?setId=${setId}`)
          }}
        />
      </div>
    </div>
  )
}

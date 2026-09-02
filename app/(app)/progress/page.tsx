import { createServerClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { RepChart } from '@/components/progress/RepChart'
import { WeeklyCalendar } from '@/components/progress/WeeklyCalendar'

export default async function ProgressPage() {
  const { userId } = await auth()

  let currentStreak = 0
  let longestStreak = 0
  let totalPushups = 0
  let totalPullups = 0
  let totalSquats = 0

  if (userId) {
    const supabase = await createServerClient()

    const { data: streakData } = await supabase
      .from('streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', userId)
      .single()

    if (streakData) {
      currentStreak = streakData.current_streak || 0
      longestStreak = streakData.longest_streak || 0
    }

    const { data: completedSets } = await supabase
      .from('completed_sets')
      .select('exercise, reps_completed')
      .eq('user_id', userId)

    completedSets?.forEach((set) => {
      if (set.exercise === 'pushup') totalPushups += set.reps_completed
      if (set.exercise === 'pullup') totalPullups += set.reps_completed
      if (set.exercise === 'squat') totalSquats += set.reps_completed
    })
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Your Progress</h1>
        <div className="flex items-center space-x-1 text-primary">
          <span className="text-xl">🔥</span>
          <span className="font-bold">{currentStreak} day streak</span>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary tabular-nums">{totalPushups}</div>
          <div className="text-xs text-muted-foreground mt-1">Push-ups</div>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary tabular-nums">{totalPullups}</div>
          <div className="text-xs text-muted-foreground mt-1">Pull-ups</div>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary tabular-nums">{totalSquats}</div>
          <div className="text-xs text-muted-foreground mt-1">Squats</div>
        </div>
      </div>

      {/* Consistency Calendar */}
      <div className="bg-secondary rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-foreground text-sm">Consistency (Last 4 Weeks)</h2>
        <WeeklyCalendar />
      </div>

      {/* 28-Day Volume Chart */}
      <div className="bg-secondary rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-foreground text-sm">Daily Volume (Last 28 Days)</h2>
        <RepChart />
      </div>

      {/* Milestones / Badges */}
      <div className="bg-secondary rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-foreground text-sm">Milestones</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-border rounded-lg p-3 flex items-center space-x-3">
            <span className="text-2xl">🌱</span>
            <div>
              <div className="text-xs font-semibold text-foreground">First Century</div>
              <div className="text-[10px] text-muted-foreground">Hit 100 reps in a day</div>
            </div>
          </div>
          <div className="border border-border rounded-lg p-3 flex items-center space-x-3">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-xs font-semibold text-foreground">Week Warrior</div>
              <div className="text-[10px] text-muted-foreground">7-day streak</div>
            </div>
          </div>
          <div className="border border-border rounded-lg p-3 flex items-center space-x-3">
            <span className="text-2xl">👑</span>
            <div>
              <div className="text-xs font-semibold text-foreground">Century Club</div>
              <div className="text-[10px] text-muted-foreground">100 of each in 1 day</div>
            </div>
          </div>
          <div className="border border-border rounded-lg p-3 flex items-center space-x-3">
            <span className="text-2xl">🏆</span>
            <div>
              <div className="text-xs font-semibold text-foreground">Monthly Legend</div>
              <div className="text-[10px] text-muted-foreground">30-day streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
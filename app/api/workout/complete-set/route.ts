import { createServerClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import type { Database } from '@/lib/supabase/types'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    const { exercise, reps_completed, cadence_bpm, planned_set_id, completed_at } = body

    if (!exercise || reps_completed === undefined) {
      return new Response('Missing required fields', { status: 400 })
    }

    const supabase = await createServerClient()

    // 1. Insert completed set
    const { data: setLog, error: setLogError } = await supabase
      .from('completed_sets')
      .insert({
        user_id: userId,
        exercise,
        reps_completed,
        cadence_bpm: cadence_bpm || null,
        planned_set_id: planned_set_id || null,
        completed_at: completed_at || new Date().toISOString(),
      } as any)
      .select()
      .single()

    if (setLogError) {
      console.error('Error logging set:', setLogError)
      return new Response('Failed to log set', { status: 500 })
    }

    // 2. Check if all daily target reps are completed for today across exercises
    const today = new Date().toISOString().split('T')[0]
    const { data: todaySets } = await supabase
      .from('completed_sets')
      .select('exercise, reps_completed')
      .eq('user_id', userId)
      .eq('log_date', today)

    let totalRepsToday = 0
    todaySets?.forEach((s: any) => {
      totalRepsToday += s.reps_completed
    })

    // 3. If hit milestone or active today, update streak
    const { data: currentStreakData } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (currentStreakData) {
      const lastActive = currentStreakData.last_active_date
      if (lastActive !== today) {
        // Calculate new streak
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        let newStreak = 1
        if (lastActive === yesterdayStr) {
          newStreak = (currentStreakData.current_streak || 0) + 1
        }

        const newLongest = Math.max(newStreak, currentStreakData.longest_streak || 0)

        await supabase
          .from('streaks')
          .update({
            current_streak: newStreak,
            longest_streak: newLongest,
            last_active_date: today,
          })
          .eq('user_id', userId)
      }
    }

    return new Response(JSON.stringify({ success: true, set: setLog }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Error in complete-set API:', err)
    return new Response('Internal server error', { status: 500 })
  }
}
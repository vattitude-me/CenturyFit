import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Check for cron secret
  const { searchParams } = new URL(request.url)
  const cronSecret = searchParams.get('secret')

  if (cronSecret !== process.env.CRON_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const supabase = await createServerClient()

    const { data: users, error } = await supabase
      .from('streaks')
      .select('user_id, current_streak, longest_streak, last_active_date')

    if (error) throw error

    // Use UTC date strings throughout to avoid timezone mismatches
    const todayStr = new Date().toISOString().split('T')[0] // "YYYY-MM-DD" UTC
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const updates = users.map((streak) => {
      const lastActiveStr = streak.last_active_date ?? null
      let newStreak = streak.current_streak || 0
      let newLongest = streak.longest_streak || 0

      if (lastActiveStr === yesterdayStr) {
        newStreak = newStreak + 1
      } else if (lastActiveStr !== todayStr) {
        // More than one day ago (or null): reset streak but do NOT update last_active_date
        // so the next cron doesn't see this user as "active yesterday"
        newStreak = 0
      }
      // If lastActiveStr === todayStr the user already logged today; leave streak unchanged

      if (newStreak > newLongest) newLongest = newStreak

      return {
        user_id: streak.user_id,
        current_streak: newStreak,
        longest_streak: newLongest,
        // Only advance last_active_date when the streak actually progressed
        ...(lastActiveStr === yesterdayStr ? { last_active_date: todayStr } : {}),
      }
    })

    const { error: upsertError } = await supabase
      .from('streaks')
      .upsert(updates, { onConflict: 'user_id' })

    if (upsertError) throw upsertError

    return new NextResponse('Streak cron job completed', { status: 200 })
  } catch (error) {
    console.error('Error in streak cron job:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
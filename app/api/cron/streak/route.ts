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
    const supabase = await createClient()

    // Get all users with streak records
    const { data: users, error } = await supabase
      .from('streaks')
      .select('user_id, current_streak, longest_streak, last_active_date')

    if (error) throw error

    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of today

    // Update streaks for each user
    for (const streak of users) {
      const lastActive = streak.last_active_date
        ? new Date(streak.last_active_date)
        : null

      let newStreak = streak.current_streak || 0
      let newLongest = streak.longest_streak || 0

      if (lastActive) {
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        // Check if last active was yesterday (continue streak)
        if (lastActive.getTime() === yesterday.getTime()) {
          // Streak continues
          newStreak = (streak.current_streak || 0) + 1
        } else if (lastActive.getTime() < yesterday.getTime()) {
          // Streak broken (more than 1 day ago)
          newStreak = 0
        }
        // If lastActive is today, streak remains the same (already counted)
      } else {
        // No last active date, starting fresh
        newStreak = 0
      }

      // Update longest streak if current is greater
      if (newStreak > newLongest) {
        newLongest = newStreak
      }

      // Update the streak record
      const { error: updateError } = await supabase
        .from('streaks')
        .update({
          current_streak: newStreak,
          longest_streak: newLongest,
          last_active_date: today.toISOString().split('T')[0] // Store as date string
        })
        .eq('user_id', streak.user_id)

      if (updateError) {
        console.error(`Error updating streak for user ${streak.user_id}:`, updateError)
      }
    }

    return new NextResponse('Streak cron job completed', { status: 200 })
  } catch (error) {
    console.error('Error in streak cron job:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
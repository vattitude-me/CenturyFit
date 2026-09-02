import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { sendPush } from '@/lib/push/webpush'

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

    // Get users who have enabled push notifications and have workout today
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, push_subscriptions(endpoint, keys, notification_prefs(quiet_hours_start, quiet_hours_end))')
      .neq('push_subscriptions', null)

    if (error) throw error

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    // Send nudges to users who have workouts scheduled for the next hour
    for (const user of users) {
      // Check if user has push subscriptions
      if (!user.push_subscriptions || user.push_subscriptions.length === 0) continue

      // Check quiet hours
      const prefs = user.push_subscriptions[0]?.notification_prefs
      if (prefs) {
        const quietStart = parseInt(prefs.quiet_hours_start || '22')
        const quietEnd = parseInt(prefs.quiet_hours_end || '08')

        let isQuiet = false
        if (quietStart > quietEnd) {
          // Overnight quiet hours (e.g., 22:00 to 08:00)
          isQuiet = currentHour >= quietStart || currentHour < quietEnd
        } else {
          // Same day quiet hours
          isQuiet = currentHour >= quietStart && currentHour < quietEnd
        }

        if (isQuiet) continue
      }

      // Send push notification
      await sendPush(
        user.push_subscriptions[0],
        {
          title: 'Time for your workout!',
          body: "Don't forget to complete your daily sets",
          url: '/',
          type: 'workout_reminder'
        }
      )
    }

    return new NextResponse('Nudge cron job completed', { status: 200 })
  } catch (error) {
    console.error('Error in nudge cron job:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
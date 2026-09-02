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

    // Use UTC hour so quiet-hour checks are consistent regardless of server timezone
    const currentHour = new Date().getUTCHours()

    for (const user of users) {
      if (!user.push_subscriptions || user.push_subscriptions.length === 0) continue

      // notification_prefs may be an array (one-to-many join) or object; normalise to object
      const rawPrefs = user.push_subscriptions[0]?.notification_prefs
      const prefs = Array.isArray(rawPrefs) ? rawPrefs[0] : rawPrefs
      if (prefs) {
        const quietStart = parseInt(prefs.quiet_hours_start ?? '22', 10)
        const quietEnd = parseInt(prefs.quiet_hours_end ?? '08', 10)
        const isQuiet = quietStart > quietEnd
          ? currentHour >= quietStart || currentHour < quietEnd   // overnight
          : currentHour >= quietStart && currentHour < quietEnd
        if (isQuiet) continue
      }

      const payload = {
        title: 'Time for your workout!',
        body: "Don't forget to complete your daily sets",
        url: '/',
        type: 'workout_reminder',
      }

      // Send to every registered device, isolating failures per device
      await Promise.allSettled(
        user.push_subscriptions.map((sub: { endpoint: string; keys: object }) =>
          sendPush(sub, payload).catch((err) =>
            console.error(`Push failed for user ${user.id} endpoint ${sub.endpoint}:`, err)
          )
        )
      )
    }

    return new NextResponse('Nudge cron job completed', { status: 200 })
  } catch (error) {
    console.error('Error in nudge cron job:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
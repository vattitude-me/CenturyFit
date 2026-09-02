import { createServerClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import type { Database } from '@/lib/supabase/types'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const subscription = await request.json()

    // Validate subscription
    if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      return new Response('Invalid subscription', { status: 400 })
    }

    const supabase = await createServerClient()

    // Upsert subscription
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth_key: subscription.keys.auth,
      }, {
        onConflict: ['user_id', 'endpoint']
      })

    if (error) {
      console.error('Error saving subscription:', error)
      return new Response('Failed to save subscription', { status: 500 })
    }

    return new Response('Subscription saved', { status: 200 })
  } catch (error) {
    console.error('Push subscription error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
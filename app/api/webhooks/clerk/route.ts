import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

export async function POST(req: Request) {
  // Verify the webhook signature
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error: Verification failed', {
      status: 400,
    })
  }

  // Handle the event
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, username, email_addresses, image_url } = evt.data

    // Create Supabase admin client
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Extract username or email
    const finalUsername =
      username || email_addresses[0]?.email_address.split('@')[0] || `user_${id.substring(0, 8)}`

    try {
      // Insert profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id,
        username: finalUsername,
        display_name: finalUsername,
        avatar_url: image_url || null,
      })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        return new Response('Error: Failed to create profile', {
          status: 500,
        })
      }

      // Insert default notification preferences
      const { error: prefsError } = await supabase.from('notification_prefs').insert({
        user_id: id,
      })

      if (prefsError) {
        console.error('Error creating notification prefs:', prefsError)
      }

      // Insert initial streak record
      const { error: streakError } = await supabase.from('streaks').insert({
        user_id: id,
        current_streak: 0,
        longest_streak: 0,
      })

      if (streakError) {
        console.error('Error creating streak:', streakError)
      }

      return new Response('User profile created', { status: 200 })
    } catch (error) {
      console.error('Error in user.created handler:', error)
      return new Response('Error: Internal server error', {
        status: 500,
      })
    }
  }

  return new Response('Webhook received', { status: 200 })
}
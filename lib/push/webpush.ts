import webpush from 'web-push'

function initVapid() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )
}

export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export interface PushPayload {
  title: string
  body: string
  url: string
  type: string
}

/**
 * Send a push notification to a subscription
 */
export async function sendPush(
  subscription: PushSubscription,
  payload: PushPayload
) {
  initVapid()
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    )
  } catch (err: any) {
    // Handle expired subscriptions (410 Gone)
    if (err.statusCode === 410) {
      throw new Error('Subscription expired or invalid')
    }
    throw err
  }
}
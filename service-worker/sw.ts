/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope

const CACHE_NAME = 'centuryfit-v3'

// Install: skip waiting immediately so new SW takes over without requiring tab close
sw.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(sw.skipWaiting())
})

// Activate: delete all old caches and claim all clients immediately
sw.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(cacheNames.map((name) => caches.delete(name))))
      .then(() => sw.clients.claim())
  )
})

// Fetch: pass everything through — no caching, no interception
sw.addEventListener('fetch', () => {
  // intentionally empty — let the browser handle all requests
})

// Push Notifications
sw.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return

  try {
    const data = event.data.json()
    const title = data.title || 'CenturyFit'
    const options: NotificationOptions = {
      body: data.body || 'Time for your workout!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: {
        url: data.url || '/dashboard'
      },
      tag: data.type || 'centuryfit-reminder'
    }

    event.waitUntil(sw.registration.showNotification(title, options))
  } catch (err) {
    console.error('Push notification parse error:', err)
  }
})

// Notification Click
sw.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()

  if (event.action === 'snooze') {
    // Snooze handled on client or ignore
    return
  }

  const targetUrl = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    sw.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus()
        }
      }
      if (sw.clients.openWindow) {
        return sw.clients.openWindow(targetUrl)
      }
    })
  )
})

// Background Sync for offline workout sets
sw.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-sets') {
    event.waitUntil(
      // We will notify clients or trigger sync handler
      sw.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_OFFLINE_SETS' })
        })
      })
    )
  }
})

export {}
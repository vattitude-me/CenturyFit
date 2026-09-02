/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope

const CACHE_NAME = 'centuryfit-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/dashboard',
  '/progress',
  '/friends',
  '/settings'
]

// Install: Cache App Shell
sw.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache each asset individually so one missing icon doesn't break install
      return Promise.all(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('SW: failed to cache', url, err)
          })
        )
      )
    }).then(() => {
      return sw.skipWaiting()
    })
  )
})

// Activate: Clean old caches
sw.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    }).then(() => {
      return sw.clients.claim()
    })
  )
})

// Fetch: Stale-while-revalidate for static, Network-first for API
sw.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url)

  // API calls: Network first, fallback to offline response if applicable
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'You are currently offline', offline: true }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 503
          }
        )
      })
    )
    return
  }

  // Navigation requests & static assets: Cache first, then network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse)
              })
            }
          })
          .catch(() => {})
        return cachedResponse
      }

      return fetch(event.request).then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== 'basic'
        ) {
          return networkResponse
        }

        const responseToCache = networkResponse.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return networkResponse
      })
    })
  )
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
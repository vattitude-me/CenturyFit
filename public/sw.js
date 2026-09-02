const sw = self;
const CACHE_NAME = 'centuryfit-v1';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/dashboard',
    '/progress',
    '/friends',
    '/settings'
];
sw.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
    }).then(() => {
        return sw.skipWaiting();
    }));
});
sw.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name)));
    }).then(() => {
        return sw.clients.claim();
    }));
});
sw.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(fetch(event.request).catch(() => {
            return new Response(JSON.stringify({ error: 'You are currently offline', offline: true }), {
                headers: { 'Content-Type': 'application/json' },
                status: 503
            });
        }));
        return;
    }
    event.respondWith(caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
            fetch(event.request)
                .then((networkResponse) => {
                if (networkResponse.status === 200) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse);
                    });
                }
            })
                .catch(() => { });
            return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
            if (!networkResponse ||
                networkResponse.status !== 200 ||
                networkResponse.type !== 'basic') {
                return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
            });
            return networkResponse;
        });
    }));
});
sw.addEventListener('push', (event) => {
    if (!event.data)
        return;
    try {
        const data = event.data.json();
        const title = data.title || 'CenturyFit';
        const options = {
            body: data.body || 'Time for your workout!',
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            data: {
                url: data.url || '/dashboard'
            },
            tag: data.type || 'centuryfit-reminder'
        };
        event.waitUntil(sw.registration.showNotification(title, options));
    }
    catch (err) {
        console.error('Push notification parse error:', err);
    }
});
sw.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'snooze') {
        return;
    }
    const targetUrl = event.notification.data?.url || '/dashboard';
    event.waitUntil(sw.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
            if (client.url.includes(targetUrl) && 'focus' in client) {
                return client.focus();
            }
        }
        if (sw.clients.openWindow) {
            return sw.clients.openWindow(targetUrl);
        }
    }));
});
sw.addEventListener('sync', (event) => {
    if (event.tag === 'sync-sets') {
        event.waitUntil(sw.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
                client.postMessage({ type: 'SYNC_OFFLINE_SETS' });
            });
        }));
    }
});
export {};
//# sourceMappingURL=sw.js.map
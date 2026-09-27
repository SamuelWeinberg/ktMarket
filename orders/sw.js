const CACHE = 'kt-orders-v9';

// On install: skip waiting immediately, no caching
self.addEventListener('install', e => {
  e.waitUntil(self.skipWaiting());
});

// On activate: delete ALL old caches and claim all clients
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
          clients.forEach(c => c.navigate(c.url));
        });
      })
  );
});

// Fetch: always go to network, never cache
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request));
});

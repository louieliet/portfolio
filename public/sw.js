// public/sw.js
const CACHE_NAME = 'portfolio-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/grain.png',
  '/pp.png',
  // Add more static assets that should be cached immediately
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()) // Force activation
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith('portfolio-cache-') && cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim()) // Take control of all clients
  );
});

// Fetch event - apply caching strategies
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Cache strategy for static assets with stale-while-revalidate
  if (event.request.url.match(/\.(js|css|png|jpg|jpeg|svg|ico|webp)$/i) || 
      event.request.url.includes('/videos/')) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Return cached response immediately if available
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              // Update cache with fresh response
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, responseClone));
              }
              return networkResponse;
            })
            .catch(() => {
              // If network fetch fails and we don't have a cached response, fail gracefully
              console.log('Fetch failed for:', event.request.url);
              return new Response('Network error occurred', {
                status: 408,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
          
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }

  // Network-first strategy for HTML requests
  if (event.request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Fall back to cache if network fails
          return caches.match(event.request)
            .then((cachedResponse) => cachedResponse || caches.match('/'));
        })
    );
    return;
  }

  // Default strategy: network with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

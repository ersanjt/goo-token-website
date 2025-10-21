// Professional Service Worker for GOO Token Website
const CACHE_VERSION = '2.0.2';
const CACHE_NAME = `goo-token-cache-v${CACHE_VERSION}`;
const STATIC_CACHE = 'goo-token-static-v1';
const DYNAMIC_CACHE = 'goo-token-dynamic-v1';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles.css',
  '/css/professional-theme.css',
  '/css/professional-header.css',
  '/js/header.js',
  '/js/modern-token.js',
  '/js/cache-manager.js',
  '/manifest.json'
];

// Resources to cache on demand
const CACHE_STRATEGIES = {
  // Static assets - cache first
  static: [
    '/css/',
    '/js/',
    '/images/',
    '/icons/',
    '.css',
    '.js',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.woff',
    '.woff2'
  ],
  // API calls - network first
  api: [
    '/api/',
    'price',
    'market',
    'chart'
  ],
  // HTML pages - cache first with network fallback
  pages: [
    '.html'
  ]
};

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        console.log('Service Worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Special handling for navigations (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try network first for navigations
          const networkResponse = await fetch(request);
          // Cache in background
          const cache = await caches.open(DYNAMIC_CACHE);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (err) {
          // Fallback to cached page or offline page
          const cache = await caches.open(DYNAMIC_CACHE);
          const cached = await cache.match(request);
          if (cached) return cached;
          const staticCache = await caches.open(STATIC_CACHE);
          const offline = await staticCache.match('/offline.html');
          return offline || new Response('Offline', { status: 503 });
        }
      })()
    );
    return;
  }

  event.respondWith(handleRequest(request));
});

// Handle different types of requests
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Determine caching strategy
  if (isStaticAsset(pathname)) {
    return cacheFirst(request, STATIC_CACHE);
  } else if (isApiCall(pathname)) {
    return networkFirst(request, DYNAMIC_CACHE);
  } else if (isPage(pathname)) {
    return cacheFirstWithNetworkFallback(request, DYNAMIC_CACHE);
  } else {
    return networkFirst(request, DYNAMIC_CACHE);
  }
}

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Serving from cache:', request.url);
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Cache first with network fallback
async function cacheFirstWithNetworkFallback(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background
      fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse);
        }
      });
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first with network fallback failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Helper functions
function isStaticAsset(pathname) {
  return CACHE_STRATEGIES.static.some(pattern => 
    pathname.includes(pattern) || pathname.endsWith(pattern)
  );
}

function isApiCall(pathname) {
  return CACHE_STRATEGIES.api.some(pattern => 
    pathname.includes(pattern)
  );
}

function isPage(pathname) {
  return CACHE_STRATEGIES.pages.some(pattern => 
    pathname.endsWith(pattern)
  );
}

// Handle messages from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle any pending offline actions
  console.log('Background sync triggered');
}

// Push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
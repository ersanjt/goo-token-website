// Service Worker for Goo Token Website
const CACHE_NAME = 'goo-token-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/analytics.js',
  '/analytics-config.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Sync offline analytics data
  const offlineData = await getOfflineAnalytics();
  if (offlineData.length > 0) {
    await sendAnalyticsData(offlineData);
    await clearOfflineAnalytics();
  }
}

async function getOfflineAnalytics() {
  // Get stored offline analytics data
  return JSON.parse(localStorage.getItem('offlineAnalytics') || '[]');
}

async function sendAnalyticsData(data) {
  // Send analytics data to server
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('Failed to sync analytics:', error);
  }
}

async function clearOfflineAnalytics() {
  localStorage.removeItem('offlineAnalytics');
}

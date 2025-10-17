// Professional Cache Manager for GOO Token Website
class CacheManager {
  constructor() {
    this.cacheVersion = '1.0.0';
    this.cacheName = `goo-token-cache-v${this.cacheVersion}`;
    this.maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours
    this.init();
  }

  init() {
    this.setupServiceWorker();
    this.setupCacheHeaders();
    this.setupResourcePreloading();
    this.setupCacheCleanup();
  }

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      }).then(registration => {
        console.log('Service Worker registered successfully');
        this.updateServiceWorker(registration);
      }).catch(error => {
        console.log('Service Worker registration failed:', error);
      });
    }
  }

  updateServiceWorker(registration) {
    if (registration.waiting) {
      registration.waiting.postMessage({ action: 'skipWaiting' });
    }

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.showUpdateNotification();
        }
      });
    });
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <h4>Website Update Available</h4>
        <p>A new version of the website is available. Would you like to update?</p>
        <div class="update-actions">
          <button class="btn-update" onclick="this.updateWebsite()">Update Now</button>
          <button class="btn-dismiss" onclick="this.dismissNotification()">Later</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  updateWebsite() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ action: 'skipWaiting' });
          window.location.reload();
        }
      });
    }
  }

  dismissNotification() {
    const notification = document.querySelector('.update-notification');
    if (notification) {
      notification.remove();
    }
  }

  setupCacheHeaders() {
    // Add cache control headers to all requests
    const originalFetch = window.fetch;
    window.fetch = (url, options = {}) => {
      const cacheOptions = {
        ...options,
        headers: {
          'Cache-Control': 'max-age=3600',
          'If-Modified-Since': this.getLastModified(url),
          ...options.headers
        }
      };
      
      return originalFetch(url, cacheOptions).then(response => {
        if (response.ok) {
          this.setLastModified(url, response.headers.get('Last-Modified'));
        }
        return response;
      });
    };
  }

  setupResourcePreloading() {
    // Preload critical resources
    const criticalResources = [
      '/css/professional-theme.css',
      '/css/professional-header.css',
      '/js/header.js',
      '/js/modern-token.js'
    ];

    criticalResources.forEach(resource => {
      this.preloadResource(resource);
    });
  }

  preloadResource(url) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = url.endsWith('.css') ? 'style' : 'script';
    document.head.appendChild(link);
  }

  setupCacheCleanup() {
    // Clean up old cache entries
    setInterval(() => {
      this.cleanupCache();
    }, 60 * 60 * 1000); // Every hour
  }

  cleanupCache() {
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName !== this.cacheName) {
            caches.delete(cacheName);
          }
        });
      });
    }
  }

  getLastModified(url) {
    return localStorage.getItem(`lastModified_${url}`) || '';
  }

  setLastModified(url, lastModified) {
    if (lastModified) {
      localStorage.setItem(`lastModified_${url}`, lastModified);
    }
  }

  // Smart caching for API calls
  async cacheApiCall(url, options = {}) {
    const cacheKey = `api_${url}_${JSON.stringify(options)}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      return cached ? cached.data : null;
    }
  }

  getFromCache(key) {
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  setCache(key, data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  isCacheValid(timestamp) {
    return Date.now() - timestamp < this.maxCacheAge;
  }

  // Clear all cache
  clearAllCache() {
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Clear localStorage cache
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('api_') || key.startsWith('lastModified_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Force refresh
  forceRefresh() {
    this.clearAllCache();
    window.location.reload(true);
  }
}

// Initialize cache manager
window.cacheManager = new CacheManager();

// Add global methods
window.updateWebsite = () => window.cacheManager.updateWebsite();
window.dismissNotification = () => window.cacheManager.dismissNotification();
window.clearCache = () => window.cacheManager.clearAllCache();
window.forceRefresh = () => window.cacheManager.forceRefresh();

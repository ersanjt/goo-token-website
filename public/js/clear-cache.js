// Clear Cache Utility
class CacheManager {
  constructor() {
    this.init();
  }

  async init() {
    // Clear browser cache
    await this.clearBrowserCache();

    // Clear service worker cache
    await this.clearServiceWorkerCache();

    // Clear local storage
    this.clearLocalStorage();

    // Clear session storage
    this.clearSessionStorage();

    console.log('Cache cleared successfully!');
  }

  async clearBrowserCache() {
    try {
      // Clear HTTP cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('Browser cache cleared');
      }
    } catch (error) {
      console.error('Error clearing browser cache:', error);
    }
  }

  async clearServiceWorkerCache() {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('Service worker cache cleared');
      }
    } catch (error) {
      console.error('Error clearing service worker cache:', error);
    }
  }

  clearLocalStorage() {
    try {
      localStorage.clear();
      console.log('Local storage cleared');
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  }

  clearSessionStorage() {
    try {
      sessionStorage.clear();
      console.log('Session storage cleared');
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
  }

  // Force reload without cache
  forceReload() {
    window.location.reload(true);
  }

  // Clear cache and reload
  async clearAndReload() {
    await this.init();
    setTimeout(() => {
      this.forceReload();
    }, 1000);
  }
}

// Auto-clear cache on page load (without button)
document.addEventListener('DOMContentLoaded', () => {
  const cacheManager = new CacheManager();
  
  // Only clear cache automatically, no button
  console.log('Cache manager initialized');
});

// Export for manual use
window.CacheManager = CacheManager;

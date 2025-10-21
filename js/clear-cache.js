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

// Auto-clear cache on page load
document.addEventListener('DOMContentLoaded', () => {
  const cacheManager = new CacheManager();
  
  // Add clear cache button to page
  const clearCacheBtn = document.createElement('button');
  clearCacheBtn.innerHTML = '🔄 Clear Cache';
  clearCacheBtn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: linear-gradient(135deg, #10b981, #34d399);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    transition: all 0.3s ease;
  `;
  
  clearCacheBtn.addEventListener('click', () => {
    cacheManager.clearAndReload();
  });
  
  clearCacheBtn.addEventListener('mouseenter', () => {
    clearCacheBtn.style.transform = 'translateY(-2px)';
    clearCacheBtn.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
  });
  
  clearCacheBtn.addEventListener('mouseleave', () => {
    clearCacheBtn.style.transform = 'translateY(0)';
    clearCacheBtn.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
  });
  
  document.body.appendChild(clearCacheBtn);
  
  // Auto-hide button after 5 seconds
  setTimeout(() => {
    clearCacheBtn.style.opacity = '0.7';
  }, 5000);
});

// Export for manual use
window.CacheManager = CacheManager;


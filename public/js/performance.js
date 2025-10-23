// Performance Optimization for Goo Token Website
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupResourcePreloading();
    this.setupCriticalCSS();
    this.setupServiceWorkerOptimization();
    this.setupMemoryManagement();
  }

  // Lazy loading for images and content
  setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyContent = document.querySelectorAll('[data-lazy]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    const contentObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.classList.add('visible');
          observer.unobserve(element);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
    lazyContent.forEach(content => contentObserver.observe(content));
  }

  // Image optimization
  setupImageOptimization() {
    // WebP support detection
    const supportsWebP = () => {
      return new Promise(resolve => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
          resolve(webP.height === 2);
        };
        webP.src =
          'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      });
    };

    // Optimize images based on device capabilities
    const optimizeImages = async () => {
      const isWebPSupported = await supportsWebP();
      const isRetina = window.devicePixelRatio > 1;

      document.querySelectorAll('img').forEach(img => {
        if (img.dataset.src) {
          let optimizedSrc = img.dataset.src;

          // Add WebP extension if supported
          if (isWebPSupported && !optimizedSrc.includes('.webp')) {
            optimizedSrc = optimizedSrc.replace(/\.(jpg|jpeg|png)$/, '.webp');
          }

          // Add retina suffix if needed
          if (isRetina && !optimizedSrc.includes('@2x')) {
            optimizedSrc = optimizedSrc.replace(
              /\.(webp|jpg|jpeg|png)$/,
              '@2x.$1'
            );
          }

          img.dataset.src = optimizedSrc;
        }
      });
    };

    optimizeImages();
  }

  // Resource preloading
  setupResourcePreloading() {
    const preloadResources = () => {
      // Preload critical resources
      const criticalResources = [
        '/styles.css',
        '/script.js',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
      });

      // Preload next page resources
      const nextPageResources = [
        '/images/hero-bg.jpg',
        '/images/features-bg.jpg',
      ];

      nextPageResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
      });
    };

    // Preload on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadResources);
    } else {
      setTimeout(preloadResources, 100);
    }
  }

  // Critical CSS inlining
  setupCriticalCSS() {
    const criticalCSS = `
      .hero { min-height: 100vh; }
      .header { position: fixed; top: 0; width: 100%; z-index: 1000; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
  }

  // Service Worker optimization
  setupServiceWorkerOptimization() {
    if ('serviceWorker' in navigator) {
      // Register service worker with optimization
      navigator.serviceWorker
        .register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        })
        .then(registration => {
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New version available
                this.showUpdateNotification();
              }
            });
          });
        });
    }
  }

  // Memory management
  setupMemoryManagement() {
    // Clean up event listeners on page unload
    window.addEventListener('beforeunload', () => {
      // Remove all event listeners
      document.querySelectorAll('*').forEach(element => {
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
      });
    });

    // Clean up unused resources
    const cleanup = () => {
      // Remove unused DOM elements
      const unusedElements = document.querySelectorAll('.temp-element');
      unusedElements.forEach(el => el.remove());

      // Clear unused timers
      if (window.animationTimers) {
        window.animationTimers.forEach(timer => clearTimeout(timer));
        window.animationTimers = [];
      }
    };

    // Cleanup every 5 minutes
    setInterval(cleanup, 5 * 60 * 1000);
  }

  // Show update notification
  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <i class="fas fa-sync-alt"></i>
        <span>New version available!</span>
        <button onclick="location.reload()">Update</button>
      </div>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 10 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 10000);
  }

  // Performance monitoring
  static measurePerformance() {
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });

      // CLS (Cumulative Layout Shift)
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            console.log('CLS:', entry.value);
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });
    }

    // Resource timing
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter(
        resource => resource.duration > 1000
      );

      if (slowResources.length > 0) {
        console.warn('Slow resources detected:', slowResources);
      }
    });
  }
}

// Initialize performance optimization
document.addEventListener('DOMContentLoaded', () => {
  new PerformanceOptimizer();
  PerformanceOptimizer.measurePerformance();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceOptimizer;
}

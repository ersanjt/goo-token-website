// Performance Optimizer for GOO Token Website
class PerformanceOptimizer {
  constructor() {
    this.isInitialized = false;
    this.loadingStates = new Map();
    this.resourceQueue = [];
    this.debounceTimers = new Map();
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    this.setupResourceLoading();
    this.setupDebouncedEvents();
    this.setupLazyLoading();
    this.setupPreloading();
    this.setupMemoryManagement();
    this.setupErrorHandling();
    
    this.isInitialized = true;
    console.log('Performance Optimizer initialized');
  }

  setupResourceLoading() {
    // Prevent multiple simultaneous loads of the same resource
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
      const key = `${url}_${JSON.stringify(options)}`;
      
      if (this.loadingStates.has(key)) {
        return this.loadingStates.get(key);
      }

      const promise = originalFetch(url, options);
      this.loadingStates.set(key, promise);
      
      promise.finally(() => {
        this.loadingStates.delete(key);
      });

      return promise;
    };
  }

  setupDebouncedEvents() {
    // Debounce scroll events
    this.debounceEvent('scroll', 16, () => {
      this.handleScroll();
    });

    // Debounce resize events
    this.debounceEvent('resize', 100, () => {
      this.handleResize();
    });

    // Debounce input events
    this.debounceEvent('input', 300, (event) => {
      this.handleInput(event);
    });
  }

  debounceEvent(eventName, delay, callback) {
    const timer = this.debounceTimers.get(eventName);
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      callback();
      this.debounceTimers.delete(eventName);
    }, delay);

    this.debounceTimers.set(eventName, newTimer);
  }

  setupLazyLoading() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }

    // Lazy load scripts
    this.lazyLoadScripts();
  }

  lazyLoadScripts() {
    const scriptObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const script = entry.target;
          if (script.dataset.src) {
            this.loadScript(script.dataset.src);
            scriptObserver.unobserve(script);
          }
        }
      });
    });

    document.querySelectorAll('script[data-src]').forEach(script => {
      scriptObserver.observe(script);
    });
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  setupPreloading() {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Preload next page resources
    this.preloadNextPageResources();
  }

  preloadCriticalResources() {
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

  preloadNextPageResources() {
    // Preload resources for likely next pages
    const nextPageResources = {
      'index.html': ['/js/price-chart.js', '/css/price-chart.css'],
      'price.html': ['/js/buy-form.js', '/css/buy-form.css'],
      'buy.html': ['/js/whitepaper.js', '/css/whitepaper.css']
    };

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const resources = nextPageResources[currentPage] || [];

    resources.forEach(resource => {
      this.preloadResource(resource);
    });
  }

  preloadResource(url) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = url.endsWith('.css') ? 'style' : 'script';
    link.onload = () => console.log(`Preloaded: ${url}`);
    link.onerror = () => console.warn(`Failed to preload: ${url}`);
    document.head.appendChild(link);
  }

  setupMemoryManagement() {
    // Clean up unused resources
    setInterval(() => {
      this.cleanupMemory();
    }, 60000); // Every minute

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanupMemory();
    });
  }

  cleanupMemory() {
    // Clear unused timers
    this.debounceTimers.forEach((timer, eventName) => {
      if (Date.now() - timer.startTime > 300000) { // 5 minutes
        clearTimeout(timer);
        this.debounceTimers.delete(eventName);
      }
    });

    // Clear unused loading states
    this.loadingStates.forEach((promise, key) => {
      if (promise.settled) {
        this.loadingStates.delete(key);
      }
    });

    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }

  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.handleError(event.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError(event.reason);
    });
  }

  handleError(error) {
    // Log error for debugging
    console.error('Performance Optimizer caught error:', error);
    
    // Don't crash the app for non-critical errors
    if (error.name === 'TypeError' && error.message.includes('Cannot read property')) {
      console.warn('Non-critical error, continuing...');
      return;
    }

    // For critical errors, show user-friendly message
    this.showErrorMessage('Something went wrong. Please refresh the page.');
  }

  showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <div class="error-content">
        <h4>Oops! Something went wrong</h4>
        <p>${message}</p>
        <button onclick="location.reload()">Refresh Page</button>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 10000);
  }

  // Event handlers
  handleScroll() {
    // Throttled scroll handling
    this.updateScrollPosition();
    this.handleParallax();
  }

  handleResize() {
    // Throttled resize handling
    this.updateViewportSize();
    this.handleResponsiveChanges();
  }

  handleInput(event) {
    // Throttled input handling
    this.handleFormValidation(event.target);
  }

  updateScrollPosition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    document.documentElement.style.setProperty('--scroll-top', `${scrollTop}px`);
  }

  handleParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const scrollTop = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrollTop * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  updateViewportSize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    document.documentElement.style.setProperty('--vw', `${vw}px`);
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  handleResponsiveChanges() {
    // Handle responsive design changes
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('mobile', isMobile);
    
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    document.body.classList.toggle('tablet', isTablet);
  }

  handleFormValidation(input) {
    // Real-time form validation
    if (input.type === 'email') {
      this.validateEmail(input);
    } else if (input.type === 'number') {
      this.validateNumber(input);
    }
  }

  validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);
    input.classList.toggle('invalid', !isValid && input.value.length > 0);
  }

  validateNumber(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min) || 0;
    const max = parseFloat(input.max) || Infinity;
    const isValid = value >= min && value <= max;
    input.classList.toggle('invalid', !isValid && input.value.length > 0);
  }

  // Performance monitoring
  getPerformanceMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
    };
  }

  // Resource optimization
  optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        // Image is loaded, optimize if needed
        if (img.naturalWidth > img.offsetWidth * 2) {
          console.warn('Large image detected:', img.src);
        }
      }
    });
  }

  // Cleanup method
  destroy() {
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
    this.loadingStates.clear();
    this.isInitialized = false;
  }
}

// Initialize performance optimizer
window.performanceOptimizer = new PerformanceOptimizer();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceOptimizer;
}

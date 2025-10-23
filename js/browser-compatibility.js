/**
 * Browser Compatibility Check for GooToken Website
 * Ensures all features work across different browsers
 */

class BrowserCompatibility {
  constructor() {
    this.checks = [];
    this.init();
  }

  init() {
    this.checkModernFeatures();
    this.checkPolyfills();
    this.setupFallbacks();
  }

  checkModernFeatures() {
    // Check for modern JavaScript features
    const features = {
      'ES6 Classes': typeof class {} === 'function',
      'Arrow Functions': (() => {}) instanceof Function,
      'Template Literals': typeof `${'test'}` === 'string',
      'Destructuring': (() => { const {a} = {a: 1}; return a === 1; })(),
      'Async/Await': typeof async function() {} === 'function',
      'Fetch API': typeof fetch === 'function',
      'Promise': typeof Promise === 'function',
      'LocalStorage': typeof localStorage !== 'undefined',
      'SessionStorage': typeof sessionStorage !== 'undefined',
      'IntersectionObserver': typeof IntersectionObserver !== 'undefined',
      'PerformanceObserver': typeof PerformanceObserver !== 'undefined',
      'ResizeObserver': typeof ResizeObserver !== 'undefined'
    };

    this.checks = features;
    this.logCompatibility(features);
  }

  checkPolyfills() {
    // Add polyfills for missing features
    this.addFetchPolyfill();
    this.addPromisePolyfill();
    this.addIntersectionObserverPolyfill();
  }

  addFetchPolyfill() {
    if (typeof fetch === 'undefined') {
      // Simple fetch polyfill
      window.fetch = function(url, options = {}) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(options.method || 'GET', url);
          
          if (options.headers) {
            Object.keys(options.headers).forEach(key => {
              xhr.setRequestHeader(key, options.headers[key]);
            });
          }
          
          xhr.onload = () => {
            resolve({
              ok: xhr.status >= 200 && xhr.status < 300,
              status: xhr.status,
              statusText: xhr.statusText,
              text: () => Promise.resolve(xhr.responseText),
              json: () => Promise.resolve(JSON.parse(xhr.responseText))
            });
          };
          
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.send(options.body);
        });
      };
    }
  }

  addPromisePolyfill() {
    if (typeof Promise === 'undefined') {
      // Simple Promise polyfill
      window.Promise = function(executor) {
        const self = this;
        self.state = 'pending';
        self.value = undefined;
        self.handlers = [];

        function resolve(result) {
          if (self.state === 'pending') {
            self.state = 'fulfilled';
            self.value = result;
            self.handlers.forEach(handle);
            self.handlers = null;
          }
        }

        function reject(error) {
          if (self.state === 'pending') {
            self.state = 'rejected';
            self.value = error;
            self.handlers.forEach(handle);
            self.handlers = null;
          }
        }

        function handle(handler) {
          if (self.state === 'pending') {
            self.handlers.push(handler);
          } else {
            if (self.state === 'fulfilled' && typeof handler.onFulfilled === 'function') {
              handler.onFulfilled(self.value);
            }
            if (self.state === 'rejected' && typeof handler.onRejected === 'function') {
              handler.onRejected(self.value);
            }
          }
        }

        this.then = function(onFulfilled, onRejected) {
          return new Promise((resolve, reject) => {
            handle({
              onFulfilled: function(result) {
                try {
                  resolve(onFulfilled ? onFulfilled(result) : result);
                } catch (ex) {
                  reject(ex);
                }
              },
              onRejected: function(error) {
                try {
                  resolve(onRejected ? onRejected(error) : error);
                } catch (ex) {
                  reject(ex);
                }
              }
            });
          });
        };

        this.catch = function(onRejected) {
          return this.then(null, onRejected);
        };

        try {
          executor(resolve, reject);
        } catch (ex) {
          reject(ex);
        }
      };
    }
  }

  addIntersectionObserverPolyfill() {
    if (typeof IntersectionObserver === 'undefined') {
      // Simple IntersectionObserver polyfill
      window.IntersectionObserver = function(callback, options = {}) {
        const elements = new Set();
        const observer = {
          observe: function(element) {
            elements.add(element);
            // Simple implementation - just call callback immediately
            setTimeout(() => {
              callback([{ target: element, isIntersecting: true }], observer);
            }, 0);
          },
          unobserve: function(element) {
            elements.delete(element);
          },
          disconnect: function() {
            elements.clear();
          }
        };
        return observer;
      };
    }
  }

  setupFallbacks() {
    // Setup fallbacks for missing features
    this.setupConsoleFallback();
    this.setupLocalStorageFallback();
    this.setupPerformanceFallback();
  }

  setupConsoleFallback() {
    if (typeof console === 'undefined') {
      window.console = {
        log: function() {},
        error: function() {},
        warn: function() {},
        info: function() {}
      };
    }
  }

  setupLocalStorageFallback() {
    if (typeof localStorage === 'undefined') {
      window.localStorage = {
        getItem: function() { return null; },
        setItem: function() {},
        removeItem: function() {},
        clear: function() {}
      };
    }
  }

  setupPerformanceFallback() {
    if (typeof performance === 'undefined') {
      window.performance = {
        now: function() { return Date.now(); },
        getEntriesByType: function() { return []; },
        mark: function() {},
        measure: function() {}
      };
    }
  }

  logCompatibility(features) {
    const unsupported = Object.keys(features).filter(key => !features[key]);
    
    if (unsupported.length > 0) {
      console.warn('🚨 Unsupported features:', unsupported);
      
      // Show user-friendly message for critical missing features
      const critical = ['Promise', 'Fetch API', 'LocalStorage'];
      const missingCritical = unsupported.filter(feature => critical.includes(feature));
      
      if (missingCritical.length > 0) {
        this.showCompatibilityWarning(missingCritical);
      }
    } else {
      console.log('✅ All features supported');
    }
  }

  showCompatibilityWarning(missingFeatures) {
    const notification = document.createElement('div');
    notification.className = 'compatibility-warning';
    notification.innerHTML = `
      <div class="warning-content">
        <h3>⚠️ Browser Compatibility Issue</h3>
        <p>Your browser is missing some features: ${missingFeatures.join(', ')}</p>
        <p>Please update your browser for the best experience.</p>
        <button onclick="this.parentElement.parentElement.remove()">Dismiss</button>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .compatibility-warning {
        position: fixed;
        top: 20px;
        left: 20px;
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        padding: 16px;
        max-width: 400px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .warning-content h3 {
        margin: 0 0 8px 0;
        color: #856404;
      }
      .warning-content p {
        margin: 0 0 8px 0;
        color: #856404;
      }
      .warning-content button {
        background: #856404;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
  }

  getCompatibilityReport() {
    return {
      userAgent: navigator.userAgent,
      features: this.checks,
      unsupported: Object.keys(this.checks).filter(key => !this.checks[key]),
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize browser compatibility check
const browserCompatibility = new BrowserCompatibility();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BrowserCompatibility;
}

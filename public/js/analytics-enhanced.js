/**
 * Enhanced Analytics for GooToken Website
 * Comprehensive tracking and monitoring system
 */

class AnalyticsEnhanced {
  constructor() {
    this.config = {
      trackingId: 'GA_MEASUREMENT_ID', // Replace with actual GA ID
      debug: this.isDevelopment(),
      enablePerformanceTracking: true,
      enableErrorTracking: true,
      enableUserBehaviorTracking: true,
    };

    this.events = [];
    this.init();
  }

  init() {
    this.setupGoogleAnalytics();
    this.setupErrorTracking();
    this.setupPerformanceTracking();
    this.setupUserBehaviorTracking();
    this.setupCustomEvents();
  }

  setupGoogleAnalytics() {
    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.trackingId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.config.trackingId, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: 'goo_token_website',
      },
    });
  }

  setupErrorTracking() {
    if (!this.config.enableErrorTracking) return;

    // JavaScript errors
    window.addEventListener('error', event => {
      this.trackError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.trackError('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise,
      });
    });

    // Resource loading errors
    window.addEventListener(
      'error',
      event => {
        if (event.target !== window) {
          this.trackError('Resource Loading Error', {
            type: event.target.tagName,
            src: event.target.src || event.target.href,
            error: event.error,
          });
        }
      },
      true
    );
  }

  setupPerformanceTracking() {
    if (!this.config.enablePerformanceTracking) return;

    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = this.getPerformanceData();
        this.trackEvent('Performance', 'Page Load', perfData);
      }, 0);
    });

    // Track Core Web Vitals
    this.trackCoreWebVitals();
  }

  getPerformanceData() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded:
        navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')
        ?.startTime,
      totalSize: this.calculateTotalSize(),
    };
  }

  calculateTotalSize() {
    const resources = performance.getEntriesByType('resource');
    return resources.reduce(
      (total, resource) => total + (resource.transferSize || 0),
      0
    );
  }

  trackCoreWebVitals() {
    // Largest Contentful Paint
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.trackEvent('Core Web Vitals', 'LCP', { value: lastEntry.startTime });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.trackEvent('Core Web Vitals', 'FID', {
          value: entry.processingStart - entry.startTime,
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.trackEvent('Core Web Vitals', 'CLS', { value: clsValue });
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  setupUserBehaviorTracking() {
    if (!this.config.enableUserBehaviorTracking) return;

    // Track page views
    this.trackPageView();

    // Track scroll depth
    this.trackScrollDepth();

    // Track time on page
    this.trackTimeOnPage();

    // Track clicks
    this.trackClicks();

    // Track form interactions
    this.trackFormInteractions();
  }

  trackPageView() {
    this.trackEvent('Page View', window.location.pathname, {
      page_title: document.title,
      page_location: window.location.href,
      page_referrer: document.referrer,
    });
  }

  trackScrollDepth() {
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];
    const trackedThresholds = new Set();

    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100
      );

      maxScroll = Math.max(maxScroll, scrollPercent);

      scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          this.trackEvent('Scroll Depth', `${threshold}%`, {
            scroll_percent: threshold,
            max_scroll: maxScroll,
          });
        }
      });
    });
  }

  trackTimeOnPage() {
    const startTime = Date.now();

    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime;
      this.trackEvent('Time on Page', 'Exit', {
        time_seconds: Math.round(timeOnPage / 1000),
      });
    });
  }

  trackClicks() {
    document.addEventListener('click', event => {
      const element = event.target;
      const elementInfo = this.getElementInfo(element);

      this.trackEvent('Click', elementInfo.type, {
        element_text: elementInfo.text,
        element_href: elementInfo.href,
        element_class: elementInfo.className,
        element_id: elementInfo.id,
        page_location: window.location.href,
      });
    });
  }

  getElementInfo(element) {
    return {
      type: element.tagName.toLowerCase(),
      text: element.textContent?.trim().substring(0, 100),
      href: element.href,
      className: element.className,
      id: element.id,
    };
  }

  trackFormInteractions() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      // Track form starts
      form.addEventListener('submit', event => {
        this.trackEvent('Form', 'Submit', {
          form_id: form.id,
          form_action: form.action,
          form_method: form.method,
        });
      });

      // Track form field interactions
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          this.trackEvent('Form Field', 'Focus', {
            field_name: input.name,
            field_type: input.type,
            form_id: form.id,
          });
        });

        input.addEventListener('blur', () => {
          this.trackEvent('Form Field', 'Blur', {
            field_name: input.name,
            field_type: input.type,
            field_value_length: input.value?.length || 0,
            form_id: form.id,
          });
        });
      });
    });
  }

  setupCustomEvents() {
    // Track cryptocurrency-specific events
    this.trackCryptocurrencyEvents();

    // Track payment events
    this.trackPaymentEvents();

    // Track user engagement
    this.trackEngagementEvents();
  }

  trackCryptocurrencyEvents() {
    // Track price views
    const priceElements = document.querySelectorAll(
      '.price, .token-price, .crypto-price'
    );
    priceElements.forEach(element => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.trackEvent('Cryptocurrency', 'Price View', {
              price_element: element.className,
              page_location: window.location.pathname,
            });
          }
        });
      });
      observer.observe(element);
    });
  }

  trackPaymentEvents() {
    // Track payment method selections
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
      option.addEventListener('click', () => {
        this.trackEvent('Payment', 'Method Selected', {
          payment_method: option.dataset.method,
          page_location: window.location.pathname,
        });
      });
    });

    // Track purchase attempts
    const buyButtons = document.querySelectorAll('.buy-btn, .purchase-btn');
    buyButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.trackEvent('Payment', 'Purchase Attempt', {
          button_text: button.textContent?.trim(),
          page_location: window.location.pathname,
        });
      });
    });
  }

  trackEngagementEvents() {
    // Track video plays
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.addEventListener('play', () => {
        this.trackEvent('Engagement', 'Video Play', {
          video_src: video.src,
          page_location: window.location.pathname,
        });
      });
    });

    // Track external link clicks
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.trackEvent('Engagement', 'External Link Click', {
          link_url: link.href,
          link_text: link.textContent?.trim(),
          page_location: window.location.pathname,
        });
      });
    });
  }

  // Public tracking methods
  trackEvent(category, action, parameters = {}) {
    const event = {
      category,
      action,
      parameters: {
        ...parameters,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      },
    };

    this.events.push(event);

    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        ...parameters,
      });
    }

    // Debug logging
    if (this.config.debug) {
      console.log('📊 Analytics Event:', event);
    }
  }

  trackError(errorType, errorData) {
    this.trackEvent('Error', errorType, {
      error_message: errorData.message,
      error_filename: errorData.filename,
      error_line: errorData.lineno,
      error_column: errorData.colno,
      error_stack: errorData.error,
      page_location: window.location.href,
    });
  }

  trackConversion(conversionType, value = null) {
    this.trackEvent('Conversion', conversionType, {
      conversion_value: value,
      page_location: window.location.href,
    });
  }

  // Utility methods
  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }

  exportEvents() {
    return JSON.stringify(this.events, null, 2);
  }

  isDevelopment() {
    // Check if we're in development mode
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('dev') ||
           window.location.port === '3000';
  }
}

// Initialize enhanced analytics
const analyticsEnhanced = new AnalyticsEnhanced();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnalyticsEnhanced;
}

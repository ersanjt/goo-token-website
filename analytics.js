// Analytics and Monitoring for Goo Token Website
class AnalyticsManager {
  constructor() {
    this.config = {
      googleAnalyticsId: 'GA_MEASUREMENT_ID', // Replace with your GA4 ID
      hotjarId: 'HOTJAR_ID', // Replace with your Hotjar ID
      sentryDsn: 'SENTRY_DSN', // Replace with your Sentry DSN
    };
    this.init();
  }

  init() {
    this.loadGoogleAnalytics();
    this.loadHotjar();
    this.loadSentry();
    this.setupCustomEvents();
  }

  loadGoogleAnalytics() {
    // Google Analytics 4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', this.config.googleAnalyticsId);

    // Track page views
    this.trackPageView();
  }

  loadHotjar() {
    // Hotjar for user behavior tracking
    (function (h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function () {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: this.config.hotjarId, hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }

  loadSentry() {
    // Sentry for error tracking
    if (this.config.sentryDsn) {
      const script = document.createElement('script');
      script.src = 'https://browser.sentry-cdn.com/7.0.0/bundle.min.js';
      script.onload = () => {
        Sentry.init({
          dsn: this.config.sentryDsn,
          environment:
            window.location.hostname === 'localhost'
              ? 'development'
              : 'production',
        });
      };
      document.head.appendChild(script);
    }
  }

  setupCustomEvents() {
    // Track button clicks
    document.addEventListener('click', e => {
      if (e.target.matches('.btn-primary, .buy-btn, .btn-revolution')) {
        this.trackEvent('button_click', {
          button_text: e.target.textContent.trim(),
          button_class: e.target.className,
        });
      }
    });

    // Track wallet connection attempts
    document.addEventListener('click', e => {
      if (e.target.closest('.wallet-option')) {
        const walletName = e.target
          .closest('.wallet-option')
          .querySelector('h4').textContent;
        this.trackEvent('wallet_connection_attempt', {
          wallet_name: walletName,
        });
      }
    });

    // Track newsletter signups
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', e => {
        this.trackEvent('newsletter_signup', {
          email_domain: e.target
            .querySelector('input[type="email"]')
            .value.split('@')[1],
        });
      });
    }

    // Track scroll depth
    this.trackScrollDepth();

    // Track time on page
    this.trackTimeOnPage();
  }

  trackPageView() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }

  trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }

    // Also send to custom analytics endpoint
    this.sendToCustomAnalytics(eventName, parameters);
  }

  sendToCustomAnalytics(eventName, parameters) {
    // Send to your custom analytics endpoint
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        parameters: parameters,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(error => {
      console.warn('Analytics tracking failed:', error);
    });
  }

  trackScrollDepth() {
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];
    const trackedThresholds = new Set();

    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        scrollThresholds.forEach(threshold => {
          if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
            trackedThresholds.add(threshold);
            this.trackEvent('scroll_depth', {
              depth: threshold,
            });
          }
        });
      }
    });
  }

  trackTimeOnPage() {
    const startTime = Date.now();

    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      this.trackEvent('time_on_page', {
        seconds: timeOnPage,
      });
    });
  }

  // Performance monitoring
  trackPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];

          this.trackEvent('page_performance', {
            load_time: Math.round(
              perfData.loadEventEnd - perfData.loadEventStart
            ),
            dom_content_loaded: Math.round(
              perfData.domContentLoadedEventEnd -
                perfData.domContentLoadedEventStart
            ),
            first_paint: Math.round(
              performance.getEntriesByType('paint')[0]?.startTime || 0
            ),
          });
        }, 0);
      });
    }
  }

  // Error tracking
  trackError(error, context = {}) {
    if (typeof Sentry !== 'undefined') {
      Sentry.captureException(error, { extra: context });
    }

    this.trackEvent('javascript_error', {
      error_message: error.message,
      error_stack: error.stack,
      context: context,
    });
  }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.analytics = new AnalyticsManager();

  // Track performance
  window.analytics.trackPerformance();

  // Global error handler
  window.addEventListener('error', e => {
    window.analytics.trackError(e.error, {
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
    });
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', e => {
    window.analytics.trackError(new Error(e.reason), {
      type: 'unhandled_promise_rejection',
    });
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnalyticsManager;
}

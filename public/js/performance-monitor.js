/**
 * Performance Monitor for GooToken Website
 * Tracks Core Web Vitals and performance metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.init();
  }

  init() {
    // Wait for page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () =>
        this.startMonitoring()
      );
    } else {
      this.startMonitoring();
    }
  }

  startMonitoring() {
    this.measureCoreWebVitals();
    this.measureResourceTiming();
    this.measureUserTiming();
    this.setupPerformanceObserver();
  }

  measureCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    this.measureLCP();

    // First Input Delay (FID)
    this.measureFID();

    // Cumulative Layout Shift (CLS)
    this.measureCLS();

    // First Contentful Paint (FCP)
    this.measureFCP();
  }

  measureLCP() {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.reportMetric('LCP', lastEntry.startTime);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(observer);
  }

  measureFID() {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.reportMetric('FID', this.metrics.fid);
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.push(observer);
  }

  measureCLS() {
    let clsValue = 0;
    const clsEntries = [];

    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsEntries.push(entry);
          clsValue += entry.value;
        }
      });

      this.metrics.cls = clsValue;
      this.reportMetric('CLS', clsValue);
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(observer);
  }

  measureFCP() {
    const observer = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.reportMetric('FCP', entry.startTime);
        }
      });
    });

    observer.observe({ entryTypes: ['paint'] });
    this.observers.push(observer);
  }

  measureResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    const resourceMetrics = {
      totalResources: resources.length,
      totalSize: 0,
      loadTime: 0,
      slowResources: [],
    };

    resources.forEach(resource => {
      const loadTime = resource.responseEnd - resource.startTime;
      resourceMetrics.totalSize += resource.transferSize || 0;
      resourceMetrics.loadTime += loadTime;

      if (loadTime > 1000) {
        // Resources taking more than 1 second
        resourceMetrics.slowResources.push({
          name: resource.name,
          loadTime: loadTime,
          size: resource.transferSize,
        });
      }
    });

    this.metrics.resources = resourceMetrics;
    this.reportMetric('Resource Timing', resourceMetrics);
  }

  measureUserTiming() {
    // Measure custom user interactions
    const userTimings = performance.getEntriesByType('measure');
    const userMetrics = {};

    userTimings.forEach(timing => {
      userMetrics[timing.name] = timing.duration;
    });

    this.metrics.userTiming = userMetrics;
  }

  setupPerformanceObserver() {
    // Monitor long tasks
    const longTaskObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.duration > 50) {
          // Tasks longer than 50ms
          this.reportMetric('Long Task', {
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }
      });
    });

    longTaskObserver.observe({ entryTypes: ['longtask'] });
    this.observers.push(longTaskObserver);
  }

  reportMetric(name, value) {
    // Send to analytics (replace with your analytics service)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        custom_parameter: 'goo_token_website',
      });
    }

    // Log to console in development
    if (this.isDevelopment()) {
      console.log(`📊 Performance Metric: ${name}`, value);
    }
  }

  getPerformanceScore() {
    const scores = {
      lcp: this.getScore('lcp', this.metrics.lcp),
      fid: this.getScore('fid', this.metrics.fid),
      cls: this.getScore('cls', this.metrics.cls),
      fcp: this.getScore('fcp', this.metrics.fcp),
    };

    const overallScore =
      Object.values(scores).reduce((a, b) => a + b, 0) /
      Object.keys(scores).length;
    return { scores, overallScore };
  }

  getScore(metric, value) {
    if (!value) return 0;

    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return 3; // Good
    if (value <= threshold.poor) return 2; // Needs Improvement
    return 1; // Poor
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.metrics,
      score: this.getPerformanceScore(),
    };

    return report;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  isDevelopment() {
    // Check if we're in development mode
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('dev') ||
           window.location.port === '3000';
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceMonitor;
}

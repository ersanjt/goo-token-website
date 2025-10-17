// Analytics Configuration for Goo Token Website
// Replace these IDs with your actual analytics service IDs

const ANALYTICS_CONFIG = {
  // Google Analytics 4
  googleAnalytics: {
    enabled: true,
    measurementId: 'GA_MEASUREMENT_ID', // Replace with your GA4 Measurement ID
    // Example: 'G-XXXXXXXXXX'
  },

  // Hotjar for user behavior tracking
  hotjar: {
    enabled: true,
    siteId: 'HOTJAR_SITE_ID', // Replace with your Hotjar Site ID
    // Example: '1234567'
  },

  // Sentry for error tracking
  sentry: {
    enabled: true,
    dsn: 'SENTRY_DSN', // Replace with your Sentry DSN
    // Example: 'https://your-dsn@sentry.io/project-id'
  },

  // Custom analytics endpoint
  customAnalytics: {
    enabled: true,
    endpoint: '/api/analytics', // Your custom analytics endpoint
    // Example: 'https://your-domain.com/api/analytics'
  },

  // Development mode
  development: {
    enabled: window.location.hostname === 'localhost',
    logLevel: 'debug', // 'debug', 'info', 'warn', 'error'
  },
};

// Initialize analytics with configuration
if (typeof window !== 'undefined') {
  window.ANALYTICS_CONFIG = ANALYTICS_CONFIG;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ANALYTICS_CONFIG;
}

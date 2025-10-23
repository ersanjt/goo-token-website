/**
 * Advanced Error Handler for GooToken Website
 * Comprehensive error handling, logging, and recovery system
 */

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.recoveryStrategies = new Map();
    this.config = {
      enableConsoleLogging: true,
      enableRemoteLogging: true,
      enableErrorReporting: true,
      enableRecovery: true,
      enableUserNotifications: false, // Disable user notifications by default
      maxRetries: 3,
      retryDelay: 1000,
    };

    this.init();
  }

  init() {
    this.setupGlobalErrorHandling();
    this.setupPromiseRejectionHandling();
    this.setupResourceErrorHandling();
    this.setupNetworkErrorHandling();
    this.setupRecoveryStrategies();
    this.setupErrorReporting();
  }

  setupGlobalErrorHandling() {
    // Global JavaScript error handler
    window.addEventListener('error', event => {
      // Ignore non-critical errors
      if (this.shouldIgnoreError(event)) {
        return;
      }

      const error = {
        type: 'JavaScript Error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      this.handleError(error);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', event => {
      const error = {
        type: 'Unhandled Promise Rejection',
        message: event.reason?.message || 'Unknown promise rejection',
        stack: event.reason?.stack,
        reason: event.reason,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      this.handleError(error);
    });
  }

  setupPromiseRejectionHandling() {
    // Enhanced promise rejection handling
    const originalPromise = window.Promise;

    window.Promise = function (executor) {
      return new originalPromise((resolve, reject) => {
        const wrappedReject = reason => {
          this.logError('Promise Rejection', {
            reason: reason,
            stack: reason?.stack,
          });
          reject(reason);
        };

        try {
          executor(resolve, wrappedReject);
        } catch (error) {
          this.logError('Promise Executor Error', {
            error: error.message,
            stack: error.stack,
          });
          wrappedReject(error);
        }
      });
    };

    // Copy static methods
    Object.setPrototypeOf(window.Promise, originalPromise);
    Object.assign(window.Promise, originalPromise);
  }

  setupResourceErrorHandling() {
    // Handle resource loading errors
    document.addEventListener(
      'error',
      event => {
        if (event.target !== window) {
          const error = {
            type: 'Resource Loading Error',
            element: event.target.tagName,
            src: event.target.src || event.target.href,
            timestamp: new Date().toISOString(),
            url: window.location.href,
          };

          this.handleError(error);
        }
      },
      true
    );
  }

  setupNetworkErrorHandling() {
    // Intercept fetch requests for error handling
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (!response.ok) {
          this.logError('Network Error', {
            url: args[0],
            status: response.status,
            statusText: response.statusText,
          });
        }

        return response;
      } catch (error) {
        this.logError('Fetch Error', {
          url: args[0],
          error: error.message,
          stack: error.stack,
        });
        throw error;
      }
    };
  }

  setupRecoveryStrategies() {
    // Define recovery strategies for common errors
    this.recoveryStrategies.set(
      'Network Error',
      this.retryWithBackoff.bind(this)
    );
    this.recoveryStrategies.set(
      'Resource Loading Error',
      this.loadFallbackResource.bind(this)
    );
    this.recoveryStrategies.set(
      'JavaScript Error',
      this.showUserFriendlyMessage.bind(this)
    );
    this.recoveryStrategies.set(
      'Payment Error',
      this.handlePaymentError.bind(this)
    );
  }

  setupErrorReporting() {
    // Send errors to external service (replace with your error reporting service)
    this.reportError = async error => {
      if (!this.config.enableRemoteLogging) return;

      try {
        // Example: Send to error reporting service
        await fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: error,
            sessionId: this.getSessionId(),
            userId: this.getUserId(),
          }),
        });
      } catch (reportingError) {
        console.error('Failed to report error:', reportingError);
      }
    };
  }

  handleError(error) {
    // Log the error
    this.logError(error.type, error);

    // Attempt recovery
    if (this.config.enableRecovery) {
      this.attemptRecovery(error);
    }

    // Report to external service
    if (this.config.enableErrorReporting) {
      this.reportError(error);
    }

    // Show user notification if critical and enabled
    if (this.isCriticalError(error) && this.config.enableUserNotifications) {
      this.showErrorNotification(error);
    }
  }

  logError(type, error) {
    const logEntry = {
      id: this.generateErrorId(),
      type,
      error,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.errorLog.push(logEntry);

    if (this.config.enableConsoleLogging) {
      console.error(`🚨 ${type}:`, error);
    }

    // Store in localStorage for persistence
    this.persistErrorLog();
  }

  attemptRecovery(error) {
    const strategy = this.recoveryStrategies.get(error.type);
    if (strategy) {
      try {
        strategy(error);
      } catch (recoveryError) {
        console.error('Recovery failed:', recoveryError);
      }
    }
  }

  retryWithBackoff(error, attempt = 1) {
    if (attempt > this.config.maxRetries) {
      this.showUserFriendlyMessage(
        'Network connection failed. Please check your internet connection.'
      );
      return;
    }

    const delay = this.config.retryDelay * Math.pow(2, attempt - 1);

    setTimeout(() => {
      // Retry the failed operation
      this.retryOperation(error);
    }, delay);
  }

  loadFallbackResource(error) {
    // Load fallback resources for failed assets
    if (error.element === 'IMG') {
      error.target.src = '/images/placeholder.png';
    } else if (error.element === 'LINK') {
      // Load fallback CSS
      this.loadFallbackCSS();
    }
  }

  loadFallbackCSS() {
    const fallbackCSS = document.createElement('link');
    fallbackCSS.rel = 'stylesheet';
    fallbackCSS.href = '/css/fallback.css';
    document.head.appendChild(fallbackCSS);
  }

  showUserFriendlyMessage(message) {
    // Ensure message is a string
    const displayMessage = typeof message === 'string' ? message : 
      (message?.message || message?.error || JSON.stringify(message) || 'An unknown error occurred');
    
    // Create user-friendly error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <div class="error-content">
        <h3>⚠️ Something went wrong</h3>
        <p>${displayMessage}</p>
        <button onclick="this.parentElement.parentElement.remove()">Dismiss</button>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 8px;
        padding: 16px;
        max-width: 300px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .error-content h3 {
        margin: 0 0 8px 0;
        color: #c33;
      }
      .error-content p {
        margin: 0 0 12px 0;
        color: #666;
      }
      .error-content button {
        background: #c33;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  handlePaymentError(error) {
    // Special handling for payment-related errors
    this.showUserFriendlyMessage(
      'Payment processing encountered an issue. Please try again or contact support if the problem persists.'
    );

    // Log payment error for investigation
    this.logError('Payment Error', {
      ...error,
      critical: true,
      requiresInvestigation: true,
    });
  }

  showErrorNotification(error) {
    const message = this.getUserFriendlyMessage(error);
    this.showUserFriendlyMessage(message);
  }

  getUserFriendlyMessage(error) {
    const messages = {
      'Network Error':
        'Unable to connect to the server. Please check your internet connection.',
      'Resource Loading Error':
        'Some content failed to load. The page may not display correctly.',
      'JavaScript Error':
        'An unexpected error occurred. Please refresh the page.',
      'Payment Error':
        'Payment processing failed. Please try again or use a different payment method.',
    };

    return (
      messages[error.type] || 'An unexpected error occurred. Please try again.'
    );
  }

  isCriticalError(error) {
    const criticalTypes = ['Payment Error', 'Network Error'];
    return criticalTypes.includes(error.type) || error.critical;
  }

  // Utility methods
  shouldIgnoreError(event) {
    // Ignore common non-critical errors
    const ignoredErrors = [
      'Script error',
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'Loading chunk',
      'ChunkLoadError'
    ];

    const errorMessage = event.message || event.reason?.message || '';
    const errorFilename = event.filename || '';

    // Ignore if error message contains ignored patterns
    if (ignoredErrors.some(pattern => errorMessage.includes(pattern))) {
      return true;
    }

    // Ignore external script errors (CDN, third-party)
    if (errorFilename.includes('cdnjs.cloudflare.com') || 
        errorFilename.includes('googleapis.com') ||
        errorFilename.includes('gstatic.com')) {
      return true;
    }

    // Ignore if error is from our error handler itself
    if (errorFilename.includes('error-handler.js')) {
      return true;
    }

    return false;
  }

  generateErrorId() {
    return (
      'error_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId =
        'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  getUserId() {
    return localStorage.getItem('userId') || 'anonymous';
  }

  persistErrorLog() {
    try {
      localStorage.setItem(
        'errorLog',
        JSON.stringify(this.errorLog.slice(-50))
      ); // Keep last 50 errors
    } catch (e) {
      console.warn('Failed to persist error log:', e);
    }
  }

  loadPersistedErrors() {
    try {
      const persisted = localStorage.getItem('errorLog');
      if (persisted) {
        this.errorLog = JSON.parse(persisted);
      }
    } catch (e) {
      console.warn('Failed to load persisted error log:', e);
    }
  }

  getErrorLog() {
    return this.errorLog;
  }

  clearErrorLog() {
    this.errorLog = [];
    localStorage.removeItem('errorLog');
  }

  exportErrorLog() {
    return JSON.stringify(this.errorLog, null, 2);
  }

  // Recovery methods
  retryOperation(error) {
    // Implement specific retry logic based on error type
    console.log('Retrying operation after error:', error);
  }
}

// Initialize error handler
const errorHandler = new ErrorHandler();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorHandler;
}

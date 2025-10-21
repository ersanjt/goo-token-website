// Professional Loading Manager for GOO Token Website
class LoadingManager {
  constructor() {
    this.loader = null;
    this.isHidden = false;
    this.init();
  }

  init() {
    this.setupLoadingDetection();
    this.setupFallbackTimers();
    this.setupUserInteractionHandlers();
  }

  setupLoadingDetection() {
    // Check if page is already loaded
    if (document.readyState === 'complete') {
      this.hideLoaderImmediately();
      return;
    }

    // Multiple loading detection methods
    window.addEventListener('load', () => this.hideLoaderWithDelay(1000));
    document.addEventListener('DOMContentLoaded', () => this.hideLoaderWithDelay(1500));
    
    // Check for specific resources
    this.checkCriticalResources();
  }

  checkCriticalResources() {
    const criticalResources = [
      'styles.css',
      'css/unified-header.css',
      'css/professional-theme.css',
      'css/modern-token.css'
    ];

    let loadedCount = 0;
    const totalResources = criticalResources.length;

    criticalResources.forEach(resource => {
      const link = document.querySelector(`link[href*="${resource}"]`);
      if (link) {
        link.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount >= totalResources) {
            this.hideLoaderWithDelay(500);
          }
        });
      }
    });
  }

  setupFallbackTimers() {
    // Progressive timeouts to ensure loader is always hidden
    setTimeout(() => this.hideLoaderWithDelay(0), 2000);  // 2 seconds
    setTimeout(() => this.hideLoaderWithDelay(0), 3000);  // 3 seconds
    setTimeout(() => this.hideLoaderWithDelay(0), 5000);  // 5 seconds (final fallback)
  }

  setupUserInteractionHandlers() {
    // Hide loader on any user interaction
    const events = ['click', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.hideLoaderImmediately();
      }, { once: true });
    });

    // Hide on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.hideLoaderImmediately();
      }
    });

    // Hide on focus (when user returns to tab)
    window.addEventListener('focus', () => {
      this.hideLoaderImmediately();
    });
  }

  hideLoaderWithDelay(delay = 0) {
    if (this.isHidden) return;
    
    setTimeout(() => {
      this.hideLoaderImmediately();
    }, delay);
  }

  hideLoaderImmediately() {
    if (this.isHidden) return;
    
    this.isHidden = true;
    
    // Find the loader element
    const loader = document.querySelector('.ultra-modern-loader');
    if (!loader) return;

    // Complete progress bar
    const progressBar = loader.querySelector('.progress-fill');
    const progressPercentage = loader.querySelector('.progress-percentage');
    
    if (progressBar) {
      progressBar.style.width = '100%';
    }
    if (progressPercentage) {
      progressPercentage.textContent = '100%';
    }

    // Animate out
    loader.style.opacity = '0';
    loader.style.transform = 'scale(0.95)';
    
    // Remove after animation
    setTimeout(() => {
      if (loader.parentNode) {
        loader.remove();
      }
    }, 800);
  }

  // Public method to force hide loader
  forceHide() {
    this.hideLoaderImmediately();
  }
}

// Initialize loading manager
document.addEventListener('DOMContentLoaded', () => {
  window.loadingManager = new LoadingManager();
});

// Global function to force hide loader
window.hideLoader = () => {
  if (window.loadingManager) {
    window.loadingManager.forceHide();
  }
};

// Emergency fallback - hide loader after 10 seconds no matter what
setTimeout(() => {
  if (window.loadingManager) {
    window.loadingManager.forceHide();
  }
}, 10000);

// Add emergency button to hide loader (only when loader is visible)
document.addEventListener('DOMContentLoaded', () => {
  // Only add emergency button if loader is visible
  const checkAndAddButton = () => {
    const loader = document.querySelector('.ultra-modern-loader');
    if (!loader || loader.style.display === 'none') return;

    // Create emergency hide button
    const emergencyButton = document.createElement('button');
    emergencyButton.innerHTML = 'Skip Loading';
    emergencyButton.className = 'emergency-skip-button';
    emergencyButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      background: rgba(255, 0, 0, 0.8);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      opacity: 0.7;
      transition: opacity 0.3s ease;
    `;
    
    emergencyButton.addEventListener('click', () => {
      if (window.loadingManager) {
        window.loadingManager.forceHide();
      }
      emergencyButton.remove();
    });
    
    emergencyButton.addEventListener('mouseenter', () => {
      emergencyButton.style.opacity = '1';
    });
    
    emergencyButton.addEventListener('mouseleave', () => {
      emergencyButton.style.opacity = '0.7';
    });
    
    // Add button after 3 seconds only if loader is still visible
    setTimeout(() => {
      const currentLoader = document.querySelector('.ultra-modern-loader');
      if (currentLoader && currentLoader.style.display !== 'none') {
        document.body.appendChild(emergencyButton);
        
        // Auto-remove button after 10 seconds
        setTimeout(() => {
          if (emergencyButton.parentNode) {
            emergencyButton.remove();
          }
        }, 10000);
      }
    }, 3000);
  };

  // Check immediately and after a delay
  checkAndAddButton();
  setTimeout(checkAndAddButton, 1000);
});

// Remove any emergency skip button that might appear in header
document.addEventListener('DOMContentLoaded', () => {
  const removeSkipButton = () => {
    const skipButton = document.querySelector('.emergency-skip-button');
    if (skipButton) {
      skipButton.remove();
    }
  };
  
  // Remove immediately and periodically
  removeSkipButton();
  setInterval(removeSkipButton, 1000);
});

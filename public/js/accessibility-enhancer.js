/**
 * Accessibility Enhancer for GooToken Website
 * Improves accessibility features and WCAG compliance
 */

class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.addSkipLinks();
    this.enhanceKeyboardNavigation();
    this.improveFocusManagement();
    this.addAriaLabels();
    this.enhanceColorContrast();
    this.addScreenReaderSupport();
    this.setupReducedMotion();
  }

  addSkipLinks() {
    const skipLinks = `
      <div class="skip-links" aria-label="Skip navigation">
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <a href="#navigation" class="skip-link">Skip to navigation</a>
        <a href="#footer" class="skip-link">Skip to footer</a>
      </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', skipLinks);

    // Add CSS for skip links
    const style = document.createElement('style');
    style.textContent = `
      .skip-links {
        position: absolute;
        top: -100px;
        left: 0;
        z-index: 1000;
      }
      
      .skip-link {
        position: absolute;
        top: 0;
        left: 0;
        background: #000;
        color: #fff;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 0 0 4px 0;
        font-weight: bold;
        transition: top 0.3s;
      }
      
      .skip-link:focus {
        top: 0;
        outline: 2px solid #fff;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  enhanceKeyboardNavigation() {
    // Add keyboard navigation for custom elements
    document.addEventListener('keydown', e => {
      // Handle Enter and Space for custom buttons
      if (
        e.target.classList.contains('custom-button') ||
        e.target.classList.contains('payment-option')
      ) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.target.click();
        }
      }

      // Handle arrow keys for navigation
      if (e.target.classList.contains('nav-item')) {
        const navItems = Array.from(document.querySelectorAll('.nav-item'));
        const currentIndex = navItems.indexOf(e.target);

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown': {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % navItems.length;
            navItems[nextIndex].focus();
            break;
          }
          case 'ArrowLeft':
          case 'ArrowUp': {
            e.preventDefault();
            const prevIndex =
              currentIndex === 0 ? navItems.length - 1 : currentIndex - 1;
            navItems[prevIndex].focus();
            break;
          }
        }
      }
    });
  }

  improveFocusManagement() {
    // Add focus indicators
    const style = document.createElement('style');
    style.textContent = `
      *:focus {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
      }
      
      .focus-visible {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
      }
      
      /* Remove focus outline for mouse users */
      .no-focus-outline:focus:not(:focus-visible) {
        outline: none !important;
      }
    `;
    document.head.appendChild(style);

    // Add focus management for modals
    this.setupModalFocusManagement();
  }

  setupModalFocusManagement() {
    const modals = document.querySelectorAll('.modal, .popup, .overlay');

    modals.forEach(modal => {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      modal.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }

        if (e.key === 'Escape') {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    });
  }

  addAriaLabels() {
    // Add ARIA labels to interactive elements
    const elements = [
      { selector: '.logo-icon', label: 'GooToken Logo' },
      { selector: '.theme-toggle', label: 'Toggle dark mode' },
      { selector: '.language-switcher', label: 'Language selector' },
      { selector: '.payment-option', label: 'Payment method option' },
      { selector: '.social-links a', label: 'Social media link' },
    ];

    elements.forEach(({ selector, label }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (!element.getAttribute('aria-label')) {
          element.setAttribute('aria-label', label);
        }
      });
    });

    // Add ARIA live regions for dynamic content
    this.addLiveRegions();
  }

  addLiveRegions() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);

    // Add screen reader only class
    const style = document.createElement('style');
    style.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
    document.head.appendChild(style);
  }

  enhanceColorContrast() {
    // Check and improve color contrast
    const style = document.createElement('style');
    style.textContent = `
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .btn {
          border: 2px solid currentColor;
        }
        
        .card {
          border: 1px solid currentColor;
        }
      }
      
      /* Dark mode improvements */
      @media (prefers-color-scheme: dark) {
        :root {
          --text-color: #ffffff;
          --bg-color: #000000;
          --accent-color: #3b82f6;
        }
      }
    `;
    document.head.appendChild(style);
  }

  addScreenReaderSupport() {
    // Add screen reader announcements
    this.announceToScreenReader = message => {
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = message;
      }
    };

    // Announce important events
    document.addEventListener('click', e => {
      if (e.target.classList.contains('btn-primary')) {
        this.announceToScreenReader('Button clicked');
      }
    });

    // Add descriptive text for complex elements
    this.addDescriptiveText();
  }

  addDescriptiveText() {
    // Add descriptions for charts and complex visuals
    const charts = document.querySelectorAll('.chart, .graph, .visualization');
    charts.forEach(chart => {
      if (!chart.getAttribute('aria-describedby')) {
        const description = document.createElement('div');
        description.id = `chart-desc-${Math.random().toString(36).substr(2, 9)}`;
        description.className = 'sr-only';
        description.textContent =
          'Interactive chart showing data visualization';
        chart.parentNode.insertBefore(description, chart);
        chart.setAttribute('aria-describedby', description.id);
      }
    });
  }

  setupReducedMotion() {
    // Respect user's motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotionPreference = e => {
      if (e.matches) {
        document.documentElement.style.setProperty(
          '--animation-duration',
          '0.01ms'
        );
        document.documentElement.style.setProperty(
          '--animation-iteration-count',
          '1'
        );
      } else {
        document.documentElement.style.removeProperty('--animation-duration');
        document.documentElement.style.removeProperty(
          '--animation-iteration-count'
        );
      }
    };

    mediaQuery.addListener(handleMotionPreference);
    handleMotionPreference(mediaQuery);
  }

  // Utility methods
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }

  setFocus(element) {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }
}

// Initialize accessibility enhancements
const accessibilityEnhancer = new AccessibilityEnhancer();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityEnhancer;
}

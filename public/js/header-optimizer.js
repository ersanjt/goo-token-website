/**
 * Header Optimizer - Clean and optimize header display
 */

class HeaderOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.removeSkipButton();
    this.optimizeHeaderLayout();
    this.addScrollEffects();
  }

  removeSkipButton() {
    // Remove emergency skip button from header area
    const removeSkipButton = () => {
      const skipButton = document.querySelector('.emergency-skip-button');
      if (skipButton) {
        skipButton.remove();
      }
    };

    // Remove immediately and periodically
    removeSkipButton();
    setInterval(removeSkipButton, 500);
  }

  optimizeHeaderLayout() {
    // Ensure header elements are properly spaced
    const header = document.querySelector('.header');
    if (!header) return;

    // Add smooth transitions
    header.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    // Optimize container spacing
    const container = header.querySelector('.container');
    if (container) {
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'space-between';
      container.style.width = '100%';
    }
  }

  addScrollEffects() {
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');
    if (!header) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (y > 8) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }

      if (y > lastScrollY && y > 160) {
        header.style.transform = 'translateY(-8px)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScrollY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

// Initialize header optimizer
document.addEventListener('DOMContentLoaded', () => {
  new HeaderOptimizer();
});

// Also initialize after page load
window.addEventListener('load', () => {
  new HeaderOptimizer();
});

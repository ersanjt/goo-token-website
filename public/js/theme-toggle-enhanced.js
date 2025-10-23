/**
 * Enhanced Theme Toggle - Improved functionality and UX
 */

class ThemeToggleEnhanced {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.toggleButton = null;
    this.init();
  }

  init() {
    this.setupToggleButton();
    this.applyTheme();
    this.addEventListeners();
  }

  setupToggleButton() {
    this.toggleButton = document.getElementById('floating-theme-toggle');
    if (!this.toggleButton) return;

    // Set visual state by theme immediately
    this.refreshButtonAppearance();

    // Show button immediately with smooth fade-in
    this.toggleButton.style.opacity = '0';
    this.toggleButton.style.pointerEvents = 'auto';

    // Smooth fade-in animation
    requestAnimationFrame(() => {
      this.toggleButton.style.transition = 'opacity 0.3s ease';
      this.toggleButton.style.opacity = '1';
    });
  }

  addEventListeners() {
    if (!this.toggleButton) return;

    // Enhanced click handler with better performance
    this.toggleButton.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      // Create enhanced ripple effect
      this.createRippleEffect(e);

      // Add click animation
      this.toggleButton.style.transform = 'translateY(-2px) scale(0.98)';
      setTimeout(() => {
        this.toggleButton.style.transform = '';
      }, 150);

      this.toggleTheme();
    });

    // Keyboard support with better accessibility
    this.toggleButton.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        this.toggleTheme();
      }
    });

    // Enhanced hover effects with smooth transitions
    this.toggleButton.addEventListener('mouseenter', () => {
      if (!this.toggleButton.classList.contains('is-hovering')) {
        this.toggleButton.classList.add('is-hovering');
        this.toggleButton.style.transform = 'translateY(-6px) scale(1.08)';
      }
    });

    this.toggleButton.addEventListener('mouseleave', () => {
      this.toggleButton.classList.remove('is-hovering');
      this.toggleButton.style.transform = '';
    });

    // Touch support for mobile devices
    this.toggleButton.addEventListener(
      'touchstart',
      e => {
        e.preventDefault();
        this.toggleButton.style.transform = 'translateY(-2px) scale(0.98)';
      },
      { passive: false }
    );

    this.toggleButton.addEventListener(
      'touchend',
      e => {
        e.preventDefault();
        this.toggleButton.style.transform = '';
        this.toggleTheme();
      },
      { passive: false }
    );
  }

  createRippleEffect(event) {
    const ripple = document.createElement('span');
    ripple.className = 'theme-ripple';

    // Calculate ripple position based on click/touch
    const rect = this.toggleButton.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;

    this.toggleButton.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, 800);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme();
    this.saveTheme();
    this.updateButtonIcon();
    this.refreshButtonAppearance();
    this.showNotification();
  }

  applyTheme() {
    // Apply theme immediately for better performance
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    document.body.className =
      this.currentTheme === 'dark' ? 'dark-theme' : 'light-theme';

    // Use CSS custom properties for instant theme switching
    const root = document.documentElement;
    if (this.currentTheme === 'light') {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--text-primary', '#1a1a1a');
      root.style.setProperty('--text-secondary', '#666666');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-tertiary', '#f1f5f9');
    } else {
      root.style.setProperty('--bg-primary', '#0a0a0a');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#cccccc');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--bg-tertiary', '#334155');
    }
  }

  updateButtonIcon() {
    if (!this.toggleButton) return;

    const icon = this.toggleButton.querySelector('i');
    if (!icon) return;

    // Update icon based on theme
    if (this.currentTheme === 'dark') {
      icon.setAttribute('data-feather', 'moon');
    } else {
      icon.setAttribute('data-feather', 'sun');
    }

    // Re-initialize feather icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  refreshButtonAppearance() {
    if (!this.toggleButton) return;
    this.toggleButton.classList.remove('is-light', 'is-dark');
    this.toggleButton.classList.add(
      this.currentTheme === 'light' ? 'is-light' : 'is-dark'
    );
  }

  saveTheme() {
    localStorage.setItem('theme', this.currentTheme);
  }

  showNotification() {
    // Remove existing notifications quickly
    const existingNotifications = document.querySelectorAll(
      '.theme-notification'
    );
    existingNotifications.forEach(notif => {
      notif.style.transform = 'translateX(100%) scale(0.9)';
      notif.style.opacity = '0';
      setTimeout(() => notif.remove(), 200);
    });

    // Create enhanced notification
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          <i class="feather" data-feather="${this.currentTheme === 'dark' ? 'moon' : 'sun'}"></i>
        </div>
        <div class="notification-text">
          <span class="notification-title">Theme Changed</span>
          <span class="notification-subtitle">${this.currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode'} Activated</span>
        </div>
        <div class="notification-close">
          <i class="feather" data-feather="x"></i>
        </div>
      </div>
    `;

    // Enhanced styles
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: linear-gradient(135deg, ${this.currentTheme === 'dark' ? '#6366f1 0%, #7c3aed 100%' : '#fbbf24 0%, #f59e0b 100%'});
      color: ${this.currentTheme === 'dark' ? '#ffffff' : '#1f2937'};
      padding: 1rem 1.25rem;
      border-radius: 16px;
      box-shadow: 0 12px 32px ${this.currentTheme === 'dark' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(245, 158, 11, 0.4)'};
      z-index: 10000;
      transform: translateX(100%) scale(0.9);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      max-width: 320px;
      min-width: 280px;
    `;

    // Add content styles
    const style = document.createElement('style');
    style.textContent = `
      .theme-notification .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .theme-notification .notification-icon {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .theme-notification .notification-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .theme-notification .notification-title {
        font-weight: 600;
        font-size: 14px;
      }
      .theme-notification .notification-subtitle {
        font-size: 12px;
        opacity: 0.8;
      }
      .theme-notification .notification-close {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        transition: background-color 0.2s ease;
      }
      .theme-notification .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0) scale(1)';
    });

    // Re-initialize feather icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.transform = 'translateX(100%) scale(0.9)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
        if (style.parentNode) {
          style.remove();
        }
      }, 400);
    });

    // Auto remove after delay
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(100%) scale(0.9)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
          if (style.parentNode) {
            style.remove();
          }
        }, 400);
      }
    }, 4000);
  }
}

// Optimized initialization - only run once
let themeToggleInstance = null;

function initializeThemeToggle() {
  if (themeToggleInstance) return;
  themeToggleInstance = new ThemeToggleEnhanced();
}

// Initialize as soon as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeThemeToggle);
} else {
  // DOM is already ready
  initializeThemeToggle();
}

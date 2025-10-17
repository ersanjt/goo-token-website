// Enhanced Header Functionality
class HeaderManager {
  constructor() {
    this.header = document.querySelector('.header');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.nav = document.querySelector('.nav');
    this.priceValue = document.querySelector('.price-value');
    this.priceChange = document.querySelector('.price-change');
    
    this.init();
  }

  init() {
    this.setupScrollEffect();
    this.setupActiveLink();
    this.setupMobileMenu();
    this.setupPriceDisplay();
    this.setupSmoothScrolling();
    this.setupHeaderAnimations();
  }

  // Scroll effect for header
  setupScrollEffect() {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }

      // Hide/show header on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        this.header.style.transform = 'translateY(-100%)';
      } else {
        this.header.style.transform = 'translateY(0)';
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Set active navigation link based on current page
  setupActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Mobile menu functionality
  setupMobileMenu() {
    // Create mobile menu toggle if it doesn't exist
    if (!this.mobileMenuToggle) {
      this.mobileMenuToggle = document.createElement('button');
      this.mobileMenuToggle.className = 'mobile-menu-toggle';
      this.mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      
      const headerActions = document.querySelector('.header-actions');
      headerActions.insertBefore(this.mobileMenuToggle, headerActions.firstChild);
    }

    this.mobileMenuToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.header.contains(e.target) && this.nav.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu when window is resized
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.nav.classList.toggle('active');
    const icon = this.mobileMenuToggle.querySelector('i');
    
    if (this.nav.classList.contains('active')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  }

  closeMobileMenu() {
    this.nav.classList.remove('active');
    const icon = this.mobileMenuToggle.querySelector('i');
    icon.className = 'fas fa-bars';
  }

  // Real-time price display
  setupPriceDisplay() {
    if (!this.priceValue || !this.priceChange) return;

    // Simulate real-time price updates
    this.updatePrice();
    setInterval(() => {
      this.updatePrice();
    }, 5000); // Update every 5 seconds
  }

  updatePrice() {
    // Simulate price fluctuation
    const basePrice = 1.00;
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    const newPrice = basePrice + variation;
    const change = ((newPrice - basePrice) / basePrice) * 100;

    this.priceValue.textContent = `$${newPrice.toFixed(2)}`;
    
    if (change >= 0) {
      this.priceChange.textContent = `+${change.toFixed(1)}%`;
      this.priceChange.className = 'price-change positive';
    } else {
      this.priceChange.textContent = `${change.toFixed(1)}%`;
      this.priceChange.className = 'price-change negative';
    }
  }

  // Smooth scrolling for anchor links
  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // If it's an anchor link on the same page
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            const headerHeight = this.header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // Header animations and effects
  setupHeaderAnimations() {
    // Logo hover animation
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.addEventListener('mouseenter', () => {
        logo.style.transform = 'scale(1.05)';
      });
      
      logo.addEventListener('mouseleave', () => {
        logo.style.transform = 'scale(1)';
      });
    }

    // Navigation link animations
    this.navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-2px)';
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
      });
    });

    // Buy button animation
    const buyBtn = document.querySelector('.buy-btn');
    if (buyBtn) {
      buyBtn.addEventListener('mouseenter', () => {
        buyBtn.style.transform = 'translateY(-2px) scale(1.02)';
      });
      
      buyBtn.addEventListener('mouseleave', () => {
        buyBtn.style.transform = 'translateY(0) scale(1)';
      });
    }
  }

  // Public methods
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `header-notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: var(--bg-card);
      color: var(--text-primary);
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 1001;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HeaderManager();
});

// Export for use in other scripts
window.HeaderManager = HeaderManager;

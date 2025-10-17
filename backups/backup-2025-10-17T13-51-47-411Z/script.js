// Goo Token Website JavaScript
document.addEventListener('DOMContentLoaded', function () {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.style.background = 'rgba(10, 10, 10, 0.98)';
      header.style.backdropFilter = 'blur(15px)';
    } else {
      header.style.background = 'rgba(10, 10, 10, 0.95)';
      header.style.backdropFilter = 'blur(10px)';
    }

    // Hide/show header on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
  });

  // Active navigation link highlighting
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Buy button click handlers
  const buyButtons = document.querySelectorAll('.btn-primary, .buy-btn');
  const walletModal = document.getElementById('walletModal');

  buyButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      showWalletModal();
    });
  });

  // Wallet modal functionality
  function showWalletModal() {
    walletModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Add animation
    setTimeout(() => {
      walletModal.querySelector('.modal-content').style.transform =
        'translate(-50%, -50%) scale(1)';
      walletModal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
  }

  function hideWalletModal() {
    walletModal.querySelector('.modal-content').style.transform =
      'translate(-50%, -50%) scale(0.9)';
    walletModal.querySelector('.modal-content').style.opacity = '0';

    setTimeout(() => {
      walletModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 300);
  }

  // Close modal when clicking outside
  walletModal.addEventListener('click', function (e) {
    if (e.target === walletModal) {
      hideWalletModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && walletModal.style.display === 'block') {
      hideWalletModal();
    }
  });

  // Wallet option click handlers
  const walletOptions = document.querySelectorAll('.wallet-option');
  walletOptions.forEach(option => {
    option.addEventListener('click', function () {
      const walletName = this.querySelector('h4').textContent;
      connectWallet(walletName);
    });
  });

  function connectWallet(walletName) {
    // Simulate wallet connection
    showNotification(`Connecting to ${walletName}...`, 'info');

    setTimeout(() => {
      showNotification(`Successfully connected to ${walletName}!`, 'success');
      hideWalletModal();
    }, 2000);
  }

  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

    // Add notification styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Newsletter form submission
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = this.querySelector('.newsletter-input').value;

      if (email && isValidEmail(email)) {
        showNotification('Successfully subscribed to newsletter!', 'success');
        this.querySelector('.newsletter-input').value = '';
      } else {
        showNotification('Please enter a valid email address.', 'error');
      }
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    '.feature-card, .market-card, .roadmap-item, .stat-card'
  );
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Price animation
  function animatePrice() {
    const priceElement = document.querySelector('.price-value');
    if (priceElement) {
      const currentPrice = parseFloat(
        priceElement.textContent.replace('$', '')
      );
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const newPrice = currentPrice * (1 + variation);

      priceElement.textContent = `$${newPrice.toFixed(2)}`;

      // Update change indicator
      const changeElement = document.querySelector('.price-change');
      if (changeElement) {
        const changePercent = (variation * 100).toFixed(1);
        changeElement.textContent = `${variation >= 0 ? '+' : ''}${changePercent}%`;
        changeElement.className = `price-change ${variation >= 0 ? 'positive' : 'negative'}`;
      }
    }
  }

  // Update price every 5 seconds
  setInterval(animatePrice, 5000);

  // Counter animation for stats
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-value, .market-value');

    counters.forEach(counter => {
      const target = counter.textContent;
      const isNumber = !isNaN(parseFloat(target.replace(/[$,%]/g, '')));

      if (isNumber) {
        const finalValue = parseFloat(target.replace(/[$,%]/g, ''));
        const prefix = target.includes('$') ? '$' : '';
        const suffix = target.includes('%')
          ? '%'
          : target.includes('K')
            ? 'K'
            : target.includes('M')
              ? 'M'
              : '';

        let currentValue = 0;
        const increment = finalValue / 50;

        const updateCounter = () => {
          currentValue += increment;
          if (currentValue < finalValue) {
            counter.textContent = `${prefix}${Math.floor(currentValue)}${suffix}`;
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
      }
    });
  }

  // Trigger counter animation when market data section is visible
  const marketSection = document.querySelector('.market-data');
  if (marketSection) {
    const marketObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            marketObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    marketObserver.observe(marketSection);
  }

  // Mobile menu toggle (if needed)
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');

  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', function () {
      nav.classList.toggle('mobile-open');
      this.classList.toggle('active');
    });
  }

  // Parallax effect for hero background
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.bg-pattern');

    parallaxElements.forEach(element => {
      const speed = 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Add loading animation
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // Add CSS for loading animation
  const style = document.createElement('style');
  style.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-error {
            background: var(--error-color) !important;
        }
        
        .notification-info {
            background: var(--primary-color) !important;
        }
        
        .price-change.negative {
            color: var(--error-color);
        }
        
        @media (max-width: 768px) {
            .nav {
                position: fixed;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--bg-primary);
                border-top: 1px solid var(--border-color);
                flex-direction: column;
                padding: 1rem;
                transform: translateY(0);
                transition: transform 0.3s ease;
            }
            
            .nav.mobile-open {
                transform: translateY(-100%);
            }
            
            .mobile-menu-toggle {
                display: block;
                background: none;
                border: none;
                color: var(--text-primary);
                font-size: 1.5rem;
                cursor: pointer;
            }
        }
    `;
  document.head.appendChild(style);

  // Initialize everything
  console.log('Goo Token website loaded successfully!');
});

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

  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  // PWA Install Prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', e => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button
    showInstallButton();
  });

  function showInstallButton() {
    const installButton = document.createElement('button');
    installButton.className = 'install-pwa-btn';
    installButton.innerHTML = '<i class="fas fa-download"></i> Install App';
    installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);
    transition: all 0.3s ease;
  `;

    installButton.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choiceResult => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          }
          deferredPrompt = null;
          installButton.remove();
        });
      }
    });

    document.body.appendChild(installButton);
  }

  // Language Switcher Functionality
  const languageSelect = document.getElementById('language-select');
  let currentLanguage = localStorage.getItem('language') || 'en';

  // Load saved language
  languageSelect.value = currentLanguage;
  updateLanguage(currentLanguage);

  languageSelect.addEventListener('change', e => {
    currentLanguage = e.target.value;
    localStorage.setItem('language', currentLanguage);
    updateLanguage(currentLanguage);
  });

  function updateLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    // Update navigation
    document.querySelectorAll('.nav-link span').forEach((span, index) => {
      const navTexts = [
        t.home,
        t.price,
        t.buy,
        t.whitepaper,
        t.marketing,
        t.about,
        t.contact,
      ];
      if (navTexts[index]) span.textContent = navTexts[index];
    });

    // Update hero section
    const heroBadge = document.querySelector('.hero-badge span');
    if (heroBadge) heroBadge.textContent = t.heroBadge;

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;

    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) heroDescription.textContent = t.heroDescription;

    // Update buttons
    const buyButton = document.querySelector('.btn-primary');
    if (buyButton)
      buyButton.innerHTML = `<i class="fas fa-gem"></i> ${t.buyNow}`;

    const whitepaperButton = document.querySelector('.btn-secondary');
    if (whitepaperButton)
      whitepaperButton.innerHTML = `<i class="fas fa-file-alt"></i> ${t.readWhitepaper}`;

    // Update stats labels
    const statLabels = document.querySelectorAll('.stat-label');
    const statTexts = [t.currentPrice, t.totalSupply, t.change24h];
    statLabels.forEach((label, index) => {
      if (statTexts[index]) label.textContent = statTexts[index];
    });

    // Update features section
    const featuresTitle = document.querySelector('.section-title');
    if (featuresTitle && featuresTitle.textContent.includes('Why Choose')) {
      featuresTitle.textContent = t.whyChoose;
    }

    const featuresSubtitle = document.querySelector('.section-subtitle');
    if (featuresSubtitle) featuresSubtitle.textContent = t.featuresSubtitle;

    // Update RTL for Arabic and Persian
    if (lang === 'ar' || lang === 'fa') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', lang);
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
  }

  // Theme Toggle Functionality
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);

    // Add smooth transition
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      body.style.transition = '';
    }, 300);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fas fa-moon';
      themeToggle.title = 'Switch to Light Mode';
    } else {
      icon.className = 'fas fa-sun';
      themeToggle.title = 'Switch to Dark Mode';
    }
  }

  // Initialize everything
  console.log('Goo Token website loaded successfully!');
});

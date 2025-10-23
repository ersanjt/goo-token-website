// Modern Token Website - Advanced Features
class ModernTokenWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.setupParticleSystem();
    this.setupTokenPriceTracker();
    this.setupWalletConnection();
    this.setupTokenPurchase();
    this.setupRealTimeUpdates();
    this.setupModernInteractions();
    this.setupPerformanceOptimizations();
  }

  // Advanced Scroll Animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll');
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    document
      .querySelectorAll(
        '.feature-card, .tokenomics-card, .roadmap-item, .market-stat, .adoption-card'
      )
      .forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
      });
  }

  // Parallax Effects
  setupParallaxEffects() {
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(
        '.hero-background, .bg-pattern'
      );

      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + index * 0.1;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Particle System
  setupParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';

    document.querySelector('.hero').appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      };
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
      }
    };

    const updateParticles = () => {
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(102, 126, 234, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
  }

  // Token Price Tracker
  setupTokenPriceTracker() {
    const priceElements = document.querySelectorAll(
      '.stat-value, .price-value'
    );

    const updatePrice = () => {
      // Simulate real-time price updates
      const basePrice = 1.0;
      const variation = (Math.random() - 0.5) * 0.2;
      const newPrice = basePrice + variation;
      const change = ((newPrice - basePrice) / basePrice) * 100;

      priceElements.forEach(element => {
        if (element.textContent.includes('$')) {
          element.textContent = `$${newPrice.toFixed(2)}`;

          // Add animation
          element.style.transform = 'scale(1.1)';
          element.style.color = change >= 0 ? '#00ff88' : '#ff4757';

          setTimeout(() => {
            element.style.transform = 'scale(1)';
          }, 300);
        }
      });

      // Update change indicators
      const changeElements = document.querySelectorAll(
        '.price-change, .stat-value.positive, .stat-value.negative'
      );
      changeElements.forEach(element => {
        if (
          element.textContent.includes('%') ||
          element.textContent.includes('+') ||
          element.textContent.includes('-')
        ) {
          element.textContent =
            change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
          element.className =
            change >= 0 ? 'price-change positive' : 'price-change negative';
        }
      });
    };

    // Update price every 3 seconds
    setInterval(updatePrice, 3000);

    // Initial update
    updatePrice();
  }

  // Wallet Connection
  setupWalletConnection() {
    const connectWalletBtn = document.querySelector('.connect-wallet-btn');
    if (!connectWalletBtn) return;

    connectWalletBtn.addEventListener('click', async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });

          if (accounts.length > 0) {
            this.showNotification('Wallet connected successfully!', 'success');
            connectWalletBtn.textContent = `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
            connectWalletBtn.disabled = true;
          }
        } else {
          this.showNotification(
            'Please install MetaMask or another Web3 wallet',
            'error'
          );
        }
      } catch (error) {
        this.showNotification('Failed to connect wallet', 'error');
        console.error('Wallet connection error:', error);
      }
    });
  }

  // Token Purchase System
  setupTokenPurchase() {
    const buyButtons = document.querySelectorAll('.btn-primary, .buy-btn');

    buyButtons.forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        this.showPurchaseModal();
      });
    });

    // Live purchase form functionality
    this.setupLivePurchaseForm();
  }

  setupLivePurchaseForm() {
    const amountInput = document.getElementById('token-amount');
    const amountDisplay = document.getElementById('amount-display');
    const totalCost = document.getElementById('total-cost');
    const purchaseBtn = document.querySelector('.connect-wallet-btn');

    if (!amountInput || !amountDisplay || !totalCost) return;

    const updatePurchaseInfo = () => {
      const amount = parseFloat(amountInput.value) || 0;
      const price = 1.0; // $1.00 per token
      const total = amount * price;

      amountDisplay.textContent = `${amount} GOO`;
      totalCost.textContent = `$${total.toFixed(2)}`;

      // Update button state
      if (amount > 0) {
        purchaseBtn.disabled = false;
        purchaseBtn.style.opacity = '1';
      } else {
        purchaseBtn.disabled = true;
        purchaseBtn.style.opacity = '0.5';
      }
    };

    amountInput.addEventListener('input', updatePurchaseInfo);
    updatePurchaseInfo();

    // Purchase button functionality
    purchaseBtn.addEventListener('click', () => {
      const amount = parseFloat(amountInput.value);
      if (amount > 0) {
        this.showNotification(
          `Purchase initiated for ${amount} GOO tokens!`,
          'success'
        );
        this.simulatePurchase(amount);
      }
    });
  }

  simulatePurchase(amount) {
    // Simulate purchase process
    const purchaseBtn = document.querySelector('.connect-wallet-btn');
    const originalText = purchaseBtn.innerHTML;

    purchaseBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Processing...';
    purchaseBtn.disabled = true;

    setTimeout(() => {
      purchaseBtn.innerHTML = '<i class="fas fa-check"></i> Purchase Complete!';
      purchaseBtn.style.background = 'var(--success-gradient)';

      setTimeout(() => {
        purchaseBtn.innerHTML = originalText;
        purchaseBtn.disabled = false;
        purchaseBtn.style.background = 'var(--primary-gradient)';
      }, 2000);
    }, 3000);
  }

  showPurchaseModal() {
    const modal = document.createElement('div');
    modal.className = 'purchase-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Purchase Goo Token</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="purchase-form">
              <div class="form-group">
                <label>Amount (GOO)</label>
                <input type="number" id="token-amount" placeholder="Enter amount" min="1">
              </div>
              <div class="form-group">
                <label>Payment Method</label>
                <select id="payment-method">
                  <option value="eth">Ethereum (ETH)</option>
                  <option value="btc">Bitcoin (BTC)</option>
                  <option value="usdt">Tether (USDT)</option>
                </select>
              </div>
              <div class="price-display">
                <div class="price-item">
                  <span>Token Price:</span>
                  <span>$1.00</span>
                </div>
                <div class="price-item">
                  <span>Total Cost:</span>
                  <span id="total-cost">$0.00</span>
                </div>
              </div>
              <button class="purchase-btn">Purchase Now</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
      .purchase-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
      }
      
      .modal-content {
        position: relative;
        background: var(--bg-card);
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease;
      }
      
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      
      .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-muted);
      }
      
      .form-group {
        margin-bottom: 1rem;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      
      .form-group input,
      .form-group select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-primary);
        color: var(--text-primary);
      }
      
      .price-display {
        background: var(--bg-secondary);
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
      }
      
      .price-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      
      .purchase-btn {
        width: 100%;
        padding: 1rem;
        background: var(--primary-gradient);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1rem;
      }
    `;
    document.head.appendChild(style);

    // Modal functionality
    const closeModal = () => {
      modal.remove();
      style.remove();
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // Calculate total cost
    const amountInput = modal.querySelector('#token-amount');
    const totalCost = modal.querySelector('#total-cost');

    amountInput.addEventListener('input', () => {
      const amount = parseFloat(amountInput.value) || 0;
      const cost = amount * 1.0; // $1.00 per token
      totalCost.textContent = `$${cost.toFixed(2)}`;
    });

    // Purchase button
    modal.querySelector('.purchase-btn').addEventListener('click', () => {
      const amount = amountInput.value;
      if (amount && amount > 0) {
        this.showNotification(
          `Purchase initiated for ${amount} GOO tokens!`,
          'success'
        );
        closeModal();
      } else {
        this.showNotification('Please enter a valid amount', 'error');
      }
    });
  }

  // Real-time Updates
  setupRealTimeUpdates() {
    // Update market stats
    const updateMarketStats = () => {
      const stats = [
        { selector: '.market-cap', value: '$1.2M', change: '+5.2%' },
        { selector: '.volume-24h', value: '$45.6K', change: '+12.8%' },
        { selector: '.holders', value: '1,234', change: '+23' },
        { selector: '.transactions', value: '5,678', change: '+156' },
      ];

      stats.forEach(stat => {
        const element = document.querySelector(stat.selector);
        if (element) {
          element.textContent = stat.value;

          // Add change indicator
          const changeElement = element.parentElement.querySelector('.change');
          if (changeElement) {
            changeElement.textContent = stat.change;
            changeElement.className = `change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`;
          }
        }
      });
    };

    // Update every 5 seconds
    setInterval(updateMarketStats, 5000);
    updateMarketStats();
  }

  // Modern Interactions
  setupModernInteractions() {
    // Hover effects for cards
    const cards = document.querySelectorAll(
      '.feature-card, .tokenomics-card, .market-stat, .adoption-card'
    );

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
      });
    });

    // Button animations
    const buttons = document.querySelectorAll(
      '.btn-primary, .btn-secondary, .buy-btn'
    );

    buttons.forEach(button => {
      button.addEventListener('click', e => {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Performance Optimizations
  setupPerformanceOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Scroll-based optimizations
        this.optimizeScrollPerformance();
      }, 100);
    });
  }

  optimizeScrollPerformance() {
    // Hide/show elements based on scroll position
    const header = document.querySelector('.header');
    const scrolled = window.pageYOffset;

    if (scrolled > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Notification System
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4757' : '#667eea'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 10001;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
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
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ModernTokenWebsite();
});

// Export for use in other scripts
window.ModernTokenWebsite = ModernTokenWebsite;

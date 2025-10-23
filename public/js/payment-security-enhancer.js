// Payment Methods & Security Section Enhancer
class PaymentSecurityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.enhancePaymentCards();
    this.enhanceSecurityItems();
    this.addScrollAnimations();
    this.addHoverEffects();
  }

  enhancePaymentCards() {
    const paymentCards = document.querySelectorAll('.payment-card');

    paymentCards.forEach((card, index) => {
      // Add staggered animation delay
      card.style.animationDelay = `${index * 0.1}s`;

      // Add click effect
      card.addEventListener('click', () => {
        this.animateCardClick(card);
      });

      // Add ripple effect
      card.addEventListener('mouseenter', () => {
        this.addRippleEffect(card);
      });
    });
  }

  enhanceSecurityItems() {
    const securityItems = document.querySelectorAll('.security-item');

    securityItems.forEach((item, index) => {
      // Add staggered animation delay
      item.style.animationDelay = `${index * 0.15}s`;

      // Add click effect
      item.addEventListener('click', () => {
        this.animateItemClick(item);
      });
    });
  }

  addScrollAnimations() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe payment cards
    document.querySelectorAll('.payment-card').forEach(card => {
      observer.observe(card);
    });

    // Observe security items
    document.querySelectorAll('.security-item').forEach(item => {
      observer.observe(item);
    });
  }

  addHoverEffects() {
    // Add hover sound effect (optional)
    const cards = document.querySelectorAll('.payment-card, .security-item');

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  animateCardClick(card) {
    card.style.transform = 'translateY(-8px) scale(0.98)';
    setTimeout(() => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    }, 150);
  }

  animateItemClick(item) {
    item.style.transform = 'translateY(-6px) scale(0.98)';
    setTimeout(() => {
      item.style.transform = 'translateY(-6px) scale(1.02)';
    }, 150);
  }

  addRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: ripple 0.6s ease-out;
    `;

    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    0% {
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      width: 200px;
      height: 200px;
      opacity: 0;
    }
  }
  
  .payment-card, .security-item {
    animation: slideInUp 0.6s ease-out forwards;
    opacity: 0;
    transform: translateY(30px);
  }
  
  .payment-card.animate-in, .security-item.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PaymentSecurityEnhancer();
});

// Export for manual use
window.PaymentSecurityEnhancer = PaymentSecurityEnhancer;

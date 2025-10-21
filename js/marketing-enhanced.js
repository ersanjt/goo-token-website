// Enhanced Marketing Page JavaScript
class MarketingPageManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupCampaignButtons();
    this.setupPartnershipCards();
    this.setupCommunityCards();
    this.setupMaterialCards();
    this.setupStatsAnimation();
    this.setupProgressBars();
  }

  // Scroll Animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.stat-card, .campaign-card, .partnership-card, .community-card');
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // Campaign Buttons
  setupCampaignButtons() {
    const campaignBtns = document.querySelectorAll('.campaign-btn');
    
    campaignBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.campaign-card');
        const campaignName = card.querySelector('h3').textContent;
        
        this.trackEvent('campaign_button_clicked', {
          campaign: campaignName,
          button_type: btn.classList.contains('primary') ? 'primary' : 'secondary'
        });
        
        this.showNotification(`${campaignName} feature coming soon!`, 'info');
      });
    });
  }

  // Partnership Cards
  setupPartnershipCards() {
    const partnershipCards = document.querySelectorAll('.partnership-card');
    
    partnershipCards.forEach(card => {
      card.addEventListener('click', () => {
        const partnershipName = card.querySelector('h3').textContent;
        
        this.trackEvent('partnership_card_clicked', {
          partnership: partnershipName
        });
        
        this.showNotification(`Learn more about ${partnershipName} partnership`, 'info');
      });
    });
  }

  // Community Cards
  setupCommunityCards() {
    const communityBtns = document.querySelectorAll('.community-btn');
    
    communityBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.community-card');
        const programName = card.querySelector('h3').textContent;
        
        this.trackEvent('community_program_clicked', {
          program: programName
        });
        
        this.showNotification(`${programName} program coming soon!`, 'info');
      });
    });
  }

  // Material Cards
  setupMaterialCards() {
    const materialBtns = document.querySelectorAll('.material-btn');
    
    materialBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.material-card');
        const materialType = card.querySelector('h4').textContent;
        
        this.trackEvent('material_download_clicked', {
          material_type: materialType
        });
        
        this.showNotification(`${materialType} download coming soon!`, 'info');
      });
    });
  }

  // Stats Animation
  setupStatsAnimation() {
    const statValues = document.querySelectorAll('.stat-value');
    
    const animateValue = (element, start, end, duration) => {
      const startTime = performance.now();
      
      const updateValue = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = start + (end - start) * this.easeOutCubic(progress);
        
        if (element.textContent.includes('K')) {
          element.textContent = Math.round(currentValue) + 'K+';
        } else if (element.textContent.includes('M')) {
          element.textContent = '$' + Math.round(currentValue) + 'M+';
        } else if (element.textContent.includes('%')) {
          element.textContent = Math.round(currentValue) + '%';
        } else {
          element.textContent = Math.round(currentValue);
        }
        
        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };
      
      requestAnimationFrame(updateValue);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const text = element.textContent;
          
          if (text.includes('K')) {
            const value = parseInt(text.replace('K+', ''));
            animateValue(element, 0, value, 2000);
          } else if (text.includes('M')) {
            const value = parseInt(text.replace('$', '').replace('M+', ''));
            animateValue(element, 0, value, 2000);
          } else if (text.includes('%')) {
            const value = parseInt(text.replace('%', ''));
            animateValue(element, 0, value, 2000);
          } else {
            const value = parseInt(text);
            if (!isNaN(value)) {
              animateValue(element, 0, value, 2000);
            }
          }
          
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    statValues.forEach(stat => {
      observer.observe(stat);
    });
  }

  // Progress Bars
  setupProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const width = element.style.width;
          
          element.style.width = '0%';
          setTimeout(() => {
            element.style.width = width;
          }, 500);
          
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
      observer.observe(bar);
    });
  }

  // Easing function
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Notifications
  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification);
    }, 5000);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.removeNotification(notification);
    });
  }

  removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      info: 'info-circle',
      warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
  }

  // Analytics
  trackEvent(eventName, properties = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }
    
    // Console log for development
    console.log('Event tracked:', eventName, properties);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MarketingPageManager();
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    color: var(--text-primary);
  }
  
  .notification-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
    transition: color 0.3s ease;
  }
  
  .notification-close:hover {
    color: var(--text-primary);
  }
  
  .notification-success {
    border-left: 4px solid var(--trust-green);
  }
  
  .notification-error {
    border-left: 4px solid var(--error-color);
  }
  
  .notification-info {
    border-left: 4px solid var(--digital-blue);
  }
  
  .notification-warning {
    border-left: 4px solid var(--value-gold);
  }
`;
document.head.appendChild(style);


// Enhanced About Page JavaScript
class AboutPageEnhanced {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupTeamMemberInteractions();
    this.setupStatsCounter();
    this.setupTimelineAnimation();
    this.setupValueCardsAnimation();
    this.setupCareerCards();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll(
      '.mission-card, .vision-card, .team-member, .value-card, .stat-item, .position-card, .timeline-item'
    );
    sections.forEach(section => {
      section.classList.add('animate-on-scroll');
      observer.observe(section);
    });
  }

  setupTeamMemberInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');

    teamMembers.forEach(member => {
      const socialLinks = member.querySelectorAll('.social-link');

      member.addEventListener('mouseenter', () => {
        socialLinks.forEach((link, index) => {
          setTimeout(() => {
            link.style.transform = 'translateY(-2px) scale(1.1)';
            link.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
          }, index * 100);
        });
      });

      member.addEventListener('mouseleave', () => {
        socialLinks.forEach(link => {
          link.style.transform = 'translateY(0) scale(1)';
          link.style.boxShadow = 'none';
        });
      });
    });
  }

  setupStatsCounter() {
    const statValues = document.querySelectorAll('.stat-value');

    const animateCounter = (element, target, duration = 2000) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        // Format the number based on the target
        if (target >= 1000000) {
          element.textContent = (current / 1000000).toFixed(1) + 'M+';
        } else if (target >= 1000) {
          element.textContent = (current / 1000).toFixed(0) + 'K+';
        } else if (target < 1) {
          element.textContent = current.toFixed(1) + '%';
        } else {
          element.textContent = Math.floor(current).toLocaleString() + '+';
        }
      }, 16);
    };

    const statsObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const statValue = entry.target;
            const text = statValue.textContent;

            // Extract numeric value
            let target = 0;
            if (text.includes('50,000')) target = 50000;
            else if (text.includes('100')) target = 100;
            else if (text.includes('10M')) target = 10000000;
            else if (text.includes('99.9')) target = 99.9;

            animateCounter(statValue, target);
            statsObserver.unobserve(statValue);
          }
        });
      },
      { threshold: 0.5 }
    );

    statValues.forEach(stat => {
      statsObserver.observe(stat);
    });
  }

  setupTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    const timelineObserver = new IntersectionObserver(
      entries => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('timeline-animate');
            }, index * 200);
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    timelineItems.forEach(item => {
      timelineObserver.observe(item);
    });
  }

  setupValueCardsAnimation() {
    const valueCards = document.querySelectorAll('.value-card');

    valueCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'value-ripple';
        ripple.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;

        card.style.position = 'relative';
        card.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  setupCareerCards() {
    const applyButtons = document.querySelectorAll('.apply-btn');

    applyButtons.forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();

        // Create loading state
        const originalText = button.textContent;
        button.textContent = 'Applying...';
        button.disabled = true;
        button.style.opacity = '0.7';

        // Simulate application process
        setTimeout(() => {
          button.textContent = 'Applied!';
          button.style.background = 'var(--trust-green)';

          // Show success notification
          this.showNotification(
            'Application submitted successfully!',
            'success'
          );

          setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.style.opacity = '1';
            button.style.background = '';
          }, 3000);
        }, 2000);
      });
    });
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.about-notification');
    existing.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `about-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      padding: 1rem 1.5rem;
      box-shadow: var(--shadow-glow);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 400px;
      backdrop-filter: blur(20px);
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button
    notification
      .querySelector('.notification-close')
      .addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      });
  }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }
  
  .animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  .timeline-item {
    opacity: 0;
    transform: translateX(-30px);
    transition: all 0.6s ease;
  }
  
  .timeline-animate {
    opacity: 1;
    transform: translateX(0);
  }
  
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
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .about-notification {
    color: var(--text-primary);
  }
  
  .about-notification.success {
    border-color: var(--trust-green);
    background: rgba(16, 185, 129, 0.1);
  }
  
  .about-notification .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }
  
  .about-notification .notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .about-notification .notification-close:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AboutPageEnhanced();
});

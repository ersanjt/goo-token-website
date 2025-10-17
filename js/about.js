// About JavaScript for Goo Token
class AboutPage {
  constructor() {
    this.init();
  }

  init() {
    this.setupTeamInteractions();
    this.setupCareerApplications();
    this.setupStatsAnimation();
    this.setupTimelineAnimation();
    this.setupValueCards();
    this.setupSocialLinks();
  }

  setupTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
      member.addEventListener('mouseenter', () => {
        this.animateTeamMember(member);
      });
      
      member.addEventListener('click', () => {
        this.showTeamMemberDetails(member);
      });
    });
  }

  animateTeamMember(member) {
    member.style.transform = 'translateY(-10px) scale(1.02)';
    member.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
      member.style.transform = 'translateY(0) scale(1)';
    }, 300);
  }

  showTeamMemberDetails(member) {
    const name = member.querySelector('h4').textContent;
    const role = member.querySelector('.member-role').textContent;
    const bio = member.querySelector('.member-bio').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'team-member-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${name}</h3>
          <button class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="member-details">
            <div class="member-avatar-large">
              <i class="fas fa-user"></i>
            </div>
            <div class="member-info-large">
              <h4>${role}</h4>
              <p class="member-bio-large">${bio}</p>
              <div class="member-achievements">
                <h5>Key Achievements</h5>
                <ul>
                  <li>Led development of core blockchain infrastructure</li>
                  <li>Published 20+ research papers on blockchain technology</li>
                  <li>Speaker at major cryptocurrency conferences</li>
                  <li>Mentor to 50+ blockchain developers</li>
                </ul>
              </div>
              <div class="member-social-large">
                <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
                <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-link"><i class="fab fa-github"></i></a>
                <a href="#" class="social-link"><i class="fas fa-envelope"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  setupCareerApplications() {
    const applyButtons = document.querySelectorAll('.apply-btn');
    
    applyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const positionCard = e.target.closest('.position-card');
        const positionTitle = positionCard.querySelector('h4').textContent;
        this.showApplicationForm(positionTitle);
      });
    });
  }

  showApplicationForm(positionTitle) {
    const modal = document.createElement('div');
    modal.className = 'application-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Apply for ${positionTitle}</h3>
          <button class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form class="application-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" required />
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" required />
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" />
            </div>
            
            <div class="form-group">
              <label for="experience">Years of Experience</label>
              <select id="experience" name="experience" required>
                <option value="">Select Experience</option>
                <option value="0-1">0-1 years</option>
                <option value="2-5">2-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="resume">Resume/CV</label>
              <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required />
            </div>
            
            <div class="form-group">
              <label for="coverLetter">Cover Letter</label>
              <textarea id="coverLetter" name="coverLetter" rows="5" placeholder="Tell us why you're interested in this position..."></textarea>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" name="terms" required />
                I agree to the terms and conditions
              </label>
            </div>
            
            <button type="submit" class="submit-application-btn">
              <i class="fas fa-paper-plane"></i>
              Submit Application
            </button>
          </form>
        </div>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
    
    // Handle form submission
    const form = modal.querySelector('.application-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.processApplication(form, positionTitle);
    });
  }

  processApplication(form, positionTitle) {
    const formData = new FormData(form);
    const applicationData = {
      position: positionTitle,
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      experience: formData.get('experience'),
      resume: formData.get('resume'),
      coverLetter: formData.get('coverLetter')
    };
    
    // Simulate API call
    setTimeout(() => {
      this.showNotification('Application submitted successfully!', 'success');
      form.closest('.application-modal').remove();
    }, 2000);
  }

  setupStatsAnimation() {
    const statItems = document.querySelectorAll('.stat-item');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStatItem(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statItems.forEach(item => {
      observer.observe(item);
    });
  }

  animateStatItem(item) {
    const valueElement = item.querySelector('.stat-value');
    const value = valueElement.textContent;
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    
    if (isNaN(numericValue)) return;
    
    let currentValue = 0;
    const increment = numericValue / 50;
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= numericValue) {
        currentValue = numericValue;
        clearInterval(timer);
      }
      
      if (value.includes('$')) {
        valueElement.textContent = `$${Math.floor(currentValue).toLocaleString()}`;
      } else if (value.includes('%')) {
        valueElement.textContent = `${currentValue.toFixed(1)}%`;
      } else {
        valueElement.textContent = `${Math.floor(currentValue).toLocaleString()}`;
      }
    }, 50);
  }

  setupTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
      observer.observe(item);
    });
  }

  setupValueCards() {
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.animateValueCard(card);
      });
    });
  }

  animateValueCard(card) {
    const icon = card.querySelector('.value-icon');
    icon.style.transform = 'scale(1.1) rotate(5deg)';
    icon.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
  }

  setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = link.querySelector('i').className;
        this.trackSocialClick(platform);
      });
    });
  }

  trackSocialClick(platform) {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'social_click', {
        'platform': platform
      });
    }
    
    console.log(`Social link clicked: ${platform}`);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }
}

// Initialize about page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AboutPage();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AboutPage;
}

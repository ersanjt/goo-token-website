// Marketing JavaScript for Goo Token
class MarketingDashboard {
  constructor() {
    this.init();
  }

  init() {
    this.setupCampaignInteractions();
    this.setupPartnershipTracking();
    this.setupCommunityInitiatives();
    this.setupMaterialDownloads();
    this.setupRealTimeUpdates();
    this.setupAnalytics();
  }

  setupCampaignInteractions() {
    const campaignButtons = document.querySelectorAll('.campaign-btn');
    
    campaignButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const campaignCard = e.target.closest('.campaign-card');
        const campaignTitle = campaignCard.querySelector('h3').textContent;
        this.handleCampaignJoin(campaignTitle);
      });
    });
  }

  handleCampaignJoin(campaignTitle) {
    // Show campaign join modal
    this.showCampaignModal(campaignTitle);
  }

  showCampaignModal(campaignTitle) {
    const modal = document.createElement('div');
    modal.className = 'campaign-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Join ${campaignTitle}</h3>
          <button class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form class="campaign-form">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div class="form-group">
              <label for="wallet">Wallet Address</label>
              <input type="text" id="wallet" name="wallet" placeholder="0x..." required />
            </div>
            <div class="form-group">
              <label for="referral">Referral Code (Optional)</label>
              <input type="text" id="referral" name="referral" />
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" name="terms" required />
                I agree to the terms and conditions
              </label>
            </div>
            <button type="submit" class="join-campaign-btn">
              <i class="fas fa-rocket"></i>
              Join Campaign
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
    const form = modal.querySelector('.campaign-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.processCampaignJoin(form);
      modal.remove();
    });
  }

  processCampaignJoin(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const wallet = formData.get('wallet');
    const referral = formData.get('referral');
    
    // Simulate API call
    setTimeout(() => {
      this.showNotification('Successfully joined campaign!', 'success');
      this.updateCampaignStats();
    }, 1000);
  }

  setupPartnershipTracking() {
    const partnershipCards = document.querySelectorAll('.partnership-card');
    
    partnershipCards.forEach(card => {
      card.addEventListener('click', () => {
        const partnershipName = card.querySelector('h4').textContent;
        this.trackPartnershipClick(partnershipName);
      });
    });
  }

  trackPartnershipClick(partnershipName) {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'partnership_click', {
        'partnership_name': partnershipName
      });
    }
    
    console.log(`Partnership clicked: ${partnershipName}`);
  }

  setupCommunityInitiatives() {
    const initiativeButtons = document.querySelectorAll('.initiative-btn');
    
    initiativeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const initiativeCard = e.target.closest('.initiative-card');
        const initiativeTitle = initiativeCard.querySelector('h3').textContent;
        this.handleInitiativeClick(initiativeTitle);
      });
    });
  }

  handleInitiativeClick(initiativeTitle) {
    // Show initiative details
    this.showInitiativeDetails(initiativeTitle);
  }

  showInitiativeDetails(initiativeTitle) {
    const details = this.getInitiativeDetails(initiativeTitle);
    
    const modal = document.createElement('div');
    modal.className = 'initiative-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${initiativeTitle}</h3>
          <button class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="initiative-details">
            <h4>Description</h4>
            <p>${details.description}</p>
            
            <h4>Benefits</h4>
            <ul>
              ${details.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
            
            <h4>Requirements</h4>
            <ul>
              ${details.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
            
            <div class="initiative-actions">
              <button class="btn-primary">Apply Now</button>
              <button class="btn-secondary">Learn More</button>
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
  }

  getInitiativeDetails(initiativeTitle) {
    const details = {
      'Developer Program': {
        description: 'Join our developer program and build innovative applications on the Goo Token ecosystem.',
        benefits: [
          'Access to development tools and APIs',
          'Technical support and documentation',
          'Development grants up to $10,000',
          'Community recognition and networking'
        ],
        requirements: [
          'Basic programming knowledge',
          'Portfolio of previous projects',
          'Commitment to building on Goo Token'
        ]
      },
      'Education Program': {
        description: 'Learn blockchain technology through our comprehensive education program.',
        benefits: [
          'Free online courses',
          'Expert-led webinars',
          'Certification upon completion',
          'Career guidance and mentorship'
        ],
        requirements: [
          'No prior experience required',
          'Commitment to complete the program',
          'Active participation in community'
        ]
      },
      'Social Impact': {
        description: 'Make a positive impact on society through our social impact initiatives.',
        benefits: [
          'Contribute to meaningful causes',
          'Community recognition',
          'Networking opportunities',
          'Personal fulfillment'
        ],
        requirements: [
          'Passion for social causes',
          'Willingness to volunteer',
          'Commitment to the initiative'
        ]
      }
    };
    
    return details[initiativeTitle] || {
      description: 'Learn more about this initiative.',
      benefits: ['Community benefits', 'Networking opportunities'],
      requirements: ['Active participation', 'Community engagement']
    };
  }

  setupMaterialDownloads() {
    const materialButtons = document.querySelectorAll('.material-btn');
    
    materialButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const materialCard = e.target.closest('.material-card');
        const materialTitle = materialCard.querySelector('h4').textContent;
        this.handleMaterialDownload(materialTitle);
      });
    });
  }

  handleMaterialDownload(materialTitle) {
    // Simulate download
    this.showNotification(`Downloading ${materialTitle}...`, 'info');
    
    setTimeout(() => {
      this.showNotification(`${materialTitle} downloaded successfully!`, 'success');
    }, 2000);
  }

  setupRealTimeUpdates() {
    // Update campaign stats every 30 seconds
    setInterval(() => {
      this.updateCampaignStats();
    }, 30000);
    
    // Update partnership status every minute
    setInterval(() => {
      this.updatePartnershipStatus();
    }, 60000);
  }

  updateCampaignStats() {
    const statElements = document.querySelectorAll('.campaign-stat .stat-value');
    
    statElements.forEach(element => {
      const currentValue = parseInt(element.textContent.replace(/[^0-9]/g, ''));
      const change = Math.floor(Math.random() * 10) + 1;
      const newValue = currentValue + change;
      
      element.textContent = element.textContent.replace(/[0-9,]+/, newValue.toLocaleString());
    });
  }

  updatePartnershipStatus() {
    const statusElements = document.querySelectorAll('.partnership-status');
    
    statusElements.forEach(status => {
      if (Math.random() < 0.1) { // 10% chance to change status
        if (status.textContent === 'Pending') {
          status.textContent = 'Active';
          status.className = 'partnership-status active';
        }
      }
    });
  }

  setupAnalytics() {
    // Track page views
    this.trackPageView();
    
    // Track user interactions
    this.trackUserInteractions();
  }

  trackPageView() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        'page_title': 'Marketing Dashboard',
        'page_location': window.location.href
      });
    }
  }

  trackUserInteractions() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('.campaign-btn, .initiative-btn, .material-btn')) {
        const action = e.target.textContent.trim();
        if (typeof gtag !== 'undefined') {
          gtag('event', 'marketing_interaction', {
            'action': action,
            'element': e.target.className
          });
        }
      }
    });
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

// Initialize marketing dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MarketingDashboard();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarketingDashboard;
}

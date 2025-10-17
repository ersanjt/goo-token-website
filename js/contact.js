// Contact JavaScript for Goo Token
class ContactPage {
  constructor() {
    this.init();
  }

  init() {
    this.setupContactForm();
    this.setupFAQ();
    this.setupSupportChannels();
    this.setupFormValidation();
    this.setupSocialLinks();
  }

  setupContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmission(form);
      });
    }
  }

  handleFormSubmission(form) {
    const formData = new FormData(form);
    const contactData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      newsletter: formData.get('newsletter') === 'on'
    };
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }

  setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = question.querySelector('i');
      
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
            otherItem.querySelector('.faq-answer').style.maxHeight = '0';
            otherItem.querySelector('i').style.transform = 'rotate(0deg)';
          }
        });
        
        // Toggle current item
        if (isOpen) {
          item.classList.remove('open');
          answer.style.maxHeight = '0';
          icon.style.transform = 'rotate(0deg)';
        } else {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          icon.style.transform = 'rotate(180deg)';
        }
      });
    });
  }

  setupSupportChannels() {
    const supportButtons = document.querySelectorAll('.support-btn');
    
    supportButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const supportCard = e.target.closest('.support-card');
        const supportType = supportCard.querySelector('h4').textContent;
        this.handleSupportChannel(supportType);
      });
    });
  }

  handleSupportChannel(supportType) {
    switch (supportType) {
      case 'Live Chat':
        this.openLiveChat();
        break;
      case 'Help Center':
        this.openHelpCenter();
        break;
      case 'Support Ticket':
        this.openSupportTicket();
        break;
      case 'Video Call':
        this.scheduleVideoCall();
        break;
      default:
        this.showNotification('Support channel not available yet.', 'info');
    }
  }

  openLiveChat() {
    const chatModal = document.createElement('div');
    chatModal.className = 'chat-modal';
    chatModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Live Chat Support</h3>
          <button class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="chat-container">
            <div class="chat-messages">
              <div class="message bot-message">
                <div class="message-avatar">
                  <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                  <p>Hello! I'm here to help you. How can I assist you today?</p>
                  <span class="message-time">Just now</span>
                </div>
              </div>
            </div>
            <div class="chat-input">
              <input type="text" placeholder="Type your message..." />
              <button class="send-btn">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    chatModal.style.cssText = `
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
    
    document.body.appendChild(chatModal);
    
    // Close modal
    const closeBtn = chatModal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      chatModal.remove();
    });
    
    // Handle chat input
    const chatInput = chatModal.querySelector('.chat-input input');
    const sendBtn = chatModal.querySelector('.send-btn');
    
    const sendMessage = () => {
      const message = chatInput.value.trim();
      if (message) {
        this.addChatMessage(chatModal, message, 'user');
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
          this.addChatMessage(chatModal, 'Thank you for your message. A support agent will be with you shortly.', 'bot');
        }, 1000);
      }
    };
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  addChatMessage(chatModal, message, sender) {
    const messagesContainer = chatModal.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
      </div>
      <div class="message-content">
        <p>${message}</p>
        <span class="message-time">${new Date().toLocaleTimeString()}</span>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  openHelpCenter() {
    this.showNotification('Redirecting to Help Center...', 'info');
    // Simulate redirect
    setTimeout(() => {
      this.showNotification('Help Center opened in new tab.', 'success');
    }, 1000);
  }

  openSupportTicket() {
    const ticketModal = document.createElement('div');
    ticketModal.className = 'ticket-modal';
    ticketModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Create Support Ticket</h3>
          <button class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form class="ticket-form">
            <div class="form-group">
              <label for="ticket-subject">Subject</label>
              <input type="text" id="ticket-subject" name="subject" required />
            </div>
            <div class="form-group">
              <label for="ticket-priority">Priority</label>
              <select id="ticket-priority" name="priority" required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div class="form-group">
              <label for="ticket-category">Category</label>
              <select id="ticket-category" name="category" required>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing</option>
                <option value="general">General Inquiry</option>
                <option value="bug">Bug Report</option>
              </select>
            </div>
            <div class="form-group">
              <label for="ticket-description">Description</label>
              <textarea id="ticket-description" name="description" rows="5" required></textarea>
            </div>
            <button type="submit" class="submit-ticket-btn">
              <i class="fas fa-ticket-alt"></i>
              Create Ticket
            </button>
          </form>
        </div>
      </div>
    `;
    
    ticketModal.style.cssText = `
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
    
    document.body.appendChild(ticketModal);
    
    // Close modal
    const closeBtn = ticketModal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      ticketModal.remove();
    });
    
    // Handle form submission
    const form = ticketModal.querySelector('.ticket-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.showNotification('Support ticket created successfully!', 'success');
      ticketModal.remove();
    });
  }

  scheduleVideoCall() {
    const callModal = document.createElement('div');
    callModal.className = 'call-modal';
    callModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Schedule Video Call</h3>
          <button class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form class="call-form">
            <div class="form-group">
              <label for="call-date">Preferred Date</label>
              <input type="date" id="call-date" name="date" required />
            </div>
            <div class="form-group">
              <label for="call-time">Preferred Time</label>
              <select id="call-time" name="time" required>
                <option value="9am">9:00 AM</option>
                <option value="10am">10:00 AM</option>
                <option value="11am">11:00 AM</option>
                <option value="2pm">2:00 PM</option>
                <option value="3pm">3:00 PM</option>
                <option value="4pm">4:00 PM</option>
              </select>
            </div>
            <div class="form-group">
              <label for="call-topic">Topic</label>
              <input type="text" id="call-topic" name="topic" placeholder="What would you like to discuss?" required />
            </div>
            <button type="submit" class="schedule-call-btn">
              <i class="fas fa-video"></i>
              Schedule Call
            </button>
          </form>
        </div>
      </div>
    `;
    
    callModal.style.cssText = `
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
    
    document.body.appendChild(callModal);
    
    // Close modal
    const closeBtn = callModal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      callModal.remove();
    });
    
    // Handle form submission
    const form = callModal.querySelector('.call-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.showNotification('Video call scheduled successfully!', 'success');
      callModal.remove();
    });
  }

  setupFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    
    // Clear previous errors
    this.clearFieldError(input);
    
    // Required field validation
    if (input.hasAttribute('required') && !value) {
      this.showFieldError(input, `${this.getFieldLabel(input)} is required`);
      return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showFieldError(input, 'Please enter a valid email address');
        return false;
      }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        this.showFieldError(input, 'Please enter a valid phone number');
        return false;
      }
    }
    
    return true;
  }

  getFieldLabel(input) {
    const label = input.closest('.form-group').querySelector('label');
    return label ? label.textContent : input.name;
  }

  showFieldError(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    `;
    
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#ef4444';
  }

  clearFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    input.style.borderColor = '';
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

// Initialize contact page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ContactPage();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContactPage;
}

// Enhanced Buy Page JavaScript
class BuyPageEnhanced {
  constructor() {
    this.currentPrice = 1.00;
    this.priceChange = 2.5;
    this.paymentMethods = {
      'credit-card': { fee: 2.9, name: 'Credit Card' },
      'bank-transfer': { fee: 1.5, name: 'Bank Transfer' },
      'crypto': { fee: 1.0, name: 'Cryptocurrency' },
      'paypal': { fee: 3.5, name: 'PayPal' }
    };
    this.selectedPaymentMethod = null;
    this.networkFee = 2.50;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updatePriceDisplay();
    this.simulateLiveUpdates();
    this.setupFAQ();
    this.setupFormValidation();
    this.setupQuickBuyButtons();
    this.setupProgressIndicator();
    this.setupModals();
  }

  setupEventListeners() {
    // Amount input and suggestions
    const amountInput = document.getElementById('amount');
    const amountBtns = document.querySelectorAll('.amount-btn');
    
    if (amountInput) {
      amountInput.addEventListener('input', (e) => this.handleAmountChange(e));
    }

    amountBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleAmountSuggestion(e));
    });

    // Payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
      option.addEventListener('click', (e) => this.handlePaymentMethodSelect(e));
    });

    // Wallet connect
    const walletConnectBtn = document.getElementById('wallet-connect');
    if (walletConnectBtn) {
      walletConnectBtn.addEventListener('click', () => this.handleWalletConnect());
    }

    // Wallet address validation
    const walletAddress = document.getElementById('wallet-address');
    if (walletAddress) {
      walletAddress.addEventListener('input', (e) => this.validateWalletAddress(e));
    }

    // Terms acceptance
    const termsCheckbox = document.getElementById('terms-accept');
    if (termsCheckbox) {
      termsCheckbox.addEventListener('change', () => this.updatePurchaseButton());
    }

    // Form submission
    const purchaseForm = document.getElementById('purchase-form');
    if (purchaseForm) {
      purchaseForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
    }
  }

  handleAmountChange(e) {
    const amount = parseFloat(e.target.value) || 0;
    this.updatePurchaseSummary(amount);
    this.validateAmount(amount);
  }

  handleAmountSuggestion(e) {
    const amount = parseFloat(e.target.dataset.amount);
    const amountInput = document.getElementById('amount');
    
    if (amountInput) {
      amountInput.value = amount;
      this.updatePurchaseSummary(amount);
      this.validateAmount(amount);
    }

    // Update button states
    document.querySelectorAll('.amount-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');
  }

  handlePaymentMethodSelect(e) {
    const method = e.currentTarget.dataset.method;
    this.selectedPaymentMethod = method;
    
    // Update UI
    document.querySelectorAll('.payment-option').forEach(option => {
      option.classList.remove('selected');
    });
    e.currentTarget.classList.add('selected');

    // Update hidden input
    const hiddenInput = document.getElementById('payment-method');
    if (hiddenInput) {
      hiddenInput.value = method;
    }

    // Update purchase summary
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    this.updatePurchaseSummary(amount);
    this.updatePurchaseButton();
  }

  handleWalletConnect() {
    // Simulate wallet connection
    const walletAddress = document.getElementById('wallet-address');
    const mockAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
    
    walletAddress.value = mockAddress;
    this.validateWalletAddress({ target: { value: mockAddress } });
    
    // Show success notification
    this.showNotification('Wallet Connected Successfully!', 'success');
  }

  validateWalletAddress(e) {
    const address = e.target.value;
    const validation = document.querySelector('.wallet-validation');
    const validItem = validation.querySelector('.validation-item.valid');
    const invalidItem = validation.querySelector('.validation-item.invalid');
    
    // Simple Ethereum address validation
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
    
    if (address.length > 0) {
      if (isValid) {
        validItem.classList.add('visible');
        invalidItem.classList.remove('visible');
        e.target.style.borderColor = 'var(--trust-green)';
      } else {
        validItem.classList.remove('visible');
        invalidItem.classList.add('visible');
        e.target.style.borderColor = '#ef4444';
      }
    } else {
      validItem.classList.remove('visible');
      invalidItem.classList.remove('visible');
      e.target.style.borderColor = '';
    }
    
    this.updatePurchaseButton();
  }

  validateAmount(amount) {
    const amountInput = document.getElementById('amount');
    const validation = amountInput.parentElement.querySelector('.input-validation');
    const validIcon = validation.querySelector('.valid-icon');
    const invalidIcon = validation.querySelector('.invalid-icon');
    
    const isValid = amount >= 10 && amount <= 50000;
    
    if (amount > 0) {
      if (isValid) {
        validIcon.classList.add('visible');
        invalidIcon.classList.remove('visible');
        amountInput.style.borderColor = 'var(--trust-green)';
      } else {
        validIcon.classList.remove('visible');
        invalidIcon.classList.add('visible');
        amountInput.style.borderColor = '#ef4444';
      }
    } else {
      validIcon.classList.remove('visible');
      invalidIcon.classList.remove('visible');
      amountInput.style.borderColor = '';
    }
    
    this.updatePurchaseButton();
  }

  updatePurchaseSummary(amount) {
    if (!this.selectedPaymentMethod) return;
    
    const paymentFee = (amount * this.paymentMethods[this.selectedPaymentMethod].fee) / 100;
    const total = amount + paymentFee + this.networkFee;
    const tokens = Math.floor(amount / this.currentPrice);
    
    // Update summary values
    document.getElementById('summary-amount').textContent = `$${amount.toFixed(2)}`;
    document.getElementById('summary-tokens').textContent = `${tokens.toLocaleString()} GOO`;
    document.getElementById('summary-fee').textContent = `$${paymentFee.toFixed(2)}`;
    document.getElementById('summary-network-fee').textContent = `$${this.networkFee.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
    
    // Update savings notice
    const savingsNotice = document.querySelector('.savings-notice span');
    const savings = this.calculateSavings(amount);
    savingsNotice.textContent = `You save $${savings.toFixed(2)} with this payment method`;
  }

  calculateSavings(amount) {
    const highestFee = 3.5; // PayPal
    const currentFee = this.selectedPaymentMethod ? this.paymentMethods[this.selectedPaymentMethod].fee : 0;
    return (amount * (highestFee - currentFee)) / 100;
  }

  updatePurchaseButton() {
    const purchaseBtn = document.getElementById('purchase-btn');
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const walletAddress = document.getElementById('wallet-address').value;
    const termsAccepted = document.getElementById('terms-accept').checked;
    
    const isValid = amount >= 10 && amount <= 50000 && 
                   this.selectedPaymentMethod && 
                   walletAddress && 
                   termsAccepted;
    
    purchaseBtn.disabled = !isValid;
  }

  handleFormSubmission(e) {
    e.preventDefault();
    
    const purchaseBtn = document.getElementById('purchase-btn');
    purchaseBtn.classList.add('loading');
    purchaseBtn.disabled = true;
    
    // Simulate processing
    setTimeout(() => {
      purchaseBtn.classList.remove('loading');
      purchaseBtn.disabled = false;
      this.showNotification('Purchase Successful!', 'success');
      this.resetForm();
    }, 3000);
  }

  resetForm() {
    document.getElementById('purchase-form').reset();
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.payment-option').forEach(option => option.classList.remove('selected'));
    document.querySelectorAll('.validation-item').forEach(item => item.classList.remove('visible'));
    this.selectedPaymentMethod = null;
    this.updatePurchaseSummary(0);
    this.updatePurchaseButton();
  }

  updatePriceDisplay() {
    document.getElementById('live-price').textContent = `$${this.currentPrice.toFixed(2)}`;
    document.getElementById('form-price').textContent = `$${this.currentPrice.toFixed(2)}`;
    
    const priceChange = document.getElementById('price-change');
    priceChange.textContent = `${this.priceChange > 0 ? '+' : ''}${this.priceChange.toFixed(1)}%`;
    priceChange.className = `price-change ${this.priceChange > 0 ? 'positive' : 'negative'}`;
  }

  simulateLiveUpdates() {
    // Simulate price updates
    setInterval(() => {
      const change = (Math.random() - 0.5) * 0.1;
      this.currentPrice = Math.max(0.5, this.currentPrice + change);
      this.priceChange = (Math.random() - 0.5) * 5;
      
      this.updatePriceDisplay();
      
      // Update purchase summary if form has values
      const amount = parseFloat(document.getElementById('amount').value) || 0;
      if (amount > 0) {
        this.updatePurchaseSummary(amount);
      }
    }, 5000);

    // Simulate new purchases
    this.simulateNewPurchases();
  }

  simulateNewPurchases() {
    const purchases = [
      { amount: 1250, tokens: 1250, time: '2 minutes ago' },
      { amount: 500, tokens: 500, time: '5 minutes ago' },
      { amount: 2100, tokens: 2100, time: '8 minutes ago' },
      { amount: 750, tokens: 750, time: '12 minutes ago' }
    ];

    setInterval(() => {
      const newPurchase = {
        amount: Math.floor(Math.random() * 2000) + 100,
        tokens: Math.floor(Math.random() * 2000) + 100,
        time: 'Just now'
      };

      this.addPurchaseToFeed(newPurchase);
    }, 15000);
  }

  addPurchaseToFeed(purchase) {
    const purchasesList = document.getElementById('purchases-list');
    const purchaseItem = document.createElement('div');
    purchaseItem.className = 'purchase-item';
    purchaseItem.innerHTML = `
      <div class="purchase-avatar">
        <i class="fas fa-user"></i>
      </div>
      <div class="purchase-details">
        <div class="purchase-amount">$${purchase.amount.toLocaleString()}</div>
        <div class="purchase-tokens">${purchase.tokens.toLocaleString()} GOO</div>
      </div>
      <div class="purchase-time">${purchase.time}</div>
    `;

    purchasesList.insertBefore(purchaseItem, purchasesList.firstChild);
    
    // Remove oldest purchase if more than 4
    if (purchasesList.children.length > 4) {
      purchasesList.removeChild(purchasesList.lastChild);
    }

    // Add animation
    purchaseItem.style.opacity = '0';
    purchaseItem.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      purchaseItem.style.transition = 'all 0.3s ease';
      purchaseItem.style.opacity = '1';
      purchaseItem.style.transform = 'translateX(0)';
    }, 100);
  }

  setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active', !isActive);
      });
    });
  }

  setupFormValidation() {
    // Real-time validation for all inputs
    const inputs = document.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.validateField(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const isValid = value.length > 0;
    
    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }
    
    if (field.type === 'number') {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }
    
    return isValid;
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.buy-notification');
    existing.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `buy-notification ${type}`;
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
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    });
  }

  setupQuickBuyButtons() {
    const quickBuyBtns = document.querySelectorAll('.quick-buy-btn');
    quickBuyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const amount = parseFloat(e.currentTarget.dataset.amount);
        const amountInput = document.getElementById('amount');
        if (amountInput) {
          amountInput.value = amount;
          this.handleAmountChange({ target: amountInput });
        }
        // Scroll to form
        const form = document.querySelector('.purchase-form');
        if (form) {
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  setupProgressIndicator() {
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // Update progress based on form completion
    const updateProgress = () => {
      let completedSteps = 0;
      
      // Check amount input
      const amountInput = document.getElementById('amount');
      if (amountInput && amountInput.value && parseFloat(amountInput.value) >= 10) {
        completedSteps = Math.max(completedSteps, 1);
      }
      
      // Check payment method
      if (this.selectedPaymentMethod) {
        completedSteps = Math.max(completedSteps, 2);
      }
      
      // Check wallet address
      const walletInput = document.getElementById('wallet-address');
      if (walletInput && walletInput.value && this.isValidWalletAddress(walletInput.value)) {
        completedSteps = Math.max(completedSteps, 3);
      }
      
      // Check terms acceptance
      const termsCheckbox = document.getElementById('terms-acceptance');
      if (termsCheckbox && termsCheckbox.checked) {
        completedSteps = Math.max(completedSteps, 4);
      }
      
      // Update progress steps
      progressSteps.forEach((step, index) => {
        if (index < completedSteps) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    };
    
    // Update progress on form changes
    const amountInput = document.getElementById('amount');
    const walletInput = document.getElementById('wallet-address');
    const termsCheckbox = document.getElementById('terms-acceptance');
    
    if (amountInput) amountInput.addEventListener('input', updateProgress);
    if (walletInput) walletInput.addEventListener('input', updateProgress);
    if (termsCheckbox) termsCheckbox.addEventListener('change', updateProgress);
    
    // Initial update
    updateProgress();
  }

  setupModals() {
    // Success modal
    const successModal = document.getElementById('success-modal');
    const modalClose = document.getElementById('modal-close');
    const viewTransactionBtn = document.getElementById('view-transaction');
    const buyMoreBtn = document.getElementById('buy-more');
    
    if (modalClose) {
      modalClose.addEventListener('click', () => this.hideSuccessModal());
    }
    
    if (viewTransactionBtn) {
      viewTransactionBtn.addEventListener('click', () => {
        alert('Opening transaction in blockchain explorer...');
        this.hideSuccessModal();
      });
    }
    
    if (buyMoreBtn) {
      buyMoreBtn.addEventListener('click', () => {
        this.hideSuccessModal();
        this.resetForm();
      });
    }
    
    // Close modal on backdrop click
    if (successModal) {
      successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
          this.hideSuccessModal();
        }
      });
    }
  }

  showSuccessModal(transactionData) {
    const successModal = document.getElementById('success-modal');
    const transactionId = document.getElementById('transaction-id');
    const purchasedAmount = document.getElementById('purchased-amount');
    const totalCost = document.getElementById('total-cost');
    
    if (transactionId) transactionId.textContent = transactionData.id;
    if (purchasedAmount) purchasedAmount.textContent = `${transactionData.tokens} GOO`;
    if (totalCost) totalCost.textContent = `$${transactionData.total.toFixed(2)}`;
    
    if (successModal) {
      successModal.classList.add('show');
    }
  }

  hideSuccessModal() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
      successModal.classList.remove('show');
    }
  }

  showLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.add('show');
    }
  }

  hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.remove('show');
    }
  }

  resetForm() {
    const form = document.getElementById('purchase-form');
    if (form) {
      form.reset();
    }
    
    // Reset payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => option.classList.remove('selected'));
    this.selectedPaymentMethod = null;
    
    // Reset progress
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach(step => step.classList.remove('active'));
    if (progressSteps[0]) progressSteps[0].classList.add('active');
    
    // Update summary
    this.updateSummary();
  }

  isValidWalletAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new BuyPageEnhanced();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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
  
  .buy-notification {
    color: var(--text-primary);
  }
  
  .buy-notification.success {
    border-color: var(--trust-green);
    background: rgba(16, 185, 129, 0.1);
  }
  
  .buy-notification .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }
  
  .buy-notification .notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .buy-notification .notification-close:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
`;
document.head.appendChild(style);

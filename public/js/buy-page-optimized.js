// Optimized Buy Page JavaScript - Professional & Modern

class BuyPageOptimized {
  constructor() {
    this.currentStep = 1;
    this.selectedPaymentMethod = null;
    this.isFormValid = false;
    this.gooPrice = 1.0;
    this.priceChange = 15.2;
    this.isPositive = true;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeAnimations();
    this.startPriceUpdates();
    this.setupFormValidation();
    this.setupProgressIndicator();
    this.setupModals();
    this.setupFAQ();
    this.setupRecentPurchases();
    this.setupQuickBuyButtons();
  }

  setupEventListeners() {
    // Amount input
    const amountInput = document.getElementById('amount');
    if (amountInput) {
      amountInput.addEventListener('input', e => this.handleAmountChange(e));
      amountInput.addEventListener('focus', () =>
        this.handleInputFocus(amountInput)
      );
      amountInput.addEventListener('blur', () =>
        this.handleInputBlur(amountInput)
      );
    }

    // Amount suggestion buttons
    document.querySelectorAll('.amount-btn').forEach(btn => {
      btn.addEventListener('click', e => this.handleAmountSuggestion(e));
    });

    // Payment method selection
    document.querySelectorAll('.payment-option').forEach(option => {
      option.addEventListener('click', e => this.handlePaymentMethodSelect(e));
    });

    // Wallet connect
    const walletBtn = document.querySelector('.wallet-connect-btn');
    if (walletBtn) {
      walletBtn.addEventListener('click', () => this.handleWalletConnect());
    }

    // Terms acceptance
    const termsCheckbox = document.querySelector('input[name="terms"]');
    if (termsCheckbox) {
      termsCheckbox.addEventListener('change', e => this.handleTermsChange(e));
    }

    // Form submission
    const form = document.getElementById('purchase-form');
    if (form) {
      form.addEventListener('submit', e => this.handleFormSubmit(e));
    }

    // Purchase button
    const purchaseBtn = document.querySelector('.purchase-btn');
    if (purchaseBtn) {
      purchaseBtn.addEventListener('click', () => this.handlePurchase());
    }
  }

  initializeAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe elements for animation
    document
      .querySelectorAll('.stat-item, .payment-card, .security-item, .faq-item')
      .forEach(el => {
        observer.observe(el);
      });

    // Staggered animation for hero elements
    this.animateHeroElements();
  }

  animateHeroElements() {
    const heroElements = document.querySelectorAll(
      '.hero-badge, .buy-hero-title, .buy-hero-subtitle, .hero-stats, .hero-actions'
    );
    heroElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';

      setTimeout(() => {
        el.style.transition = 'all 0.6s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  startPriceUpdates() {
    // Update price every 5 seconds
    setInterval(() => {
      this.updateLivePrice();
    }, 5000);

    // Initial price update
    this.updateLivePrice();
  }

  updateLivePrice() {
    // Simulate price changes
    const change = (Math.random() - 0.5) * 0.1;
    this.gooPrice = Math.max(0.5, this.gooPrice + change);
    this.priceChange = (Math.random() - 0.5) * 30;
    this.isPositive = this.priceChange >= 0;

    // Update price display
    const priceValue = document.querySelector('.price-value');
    const priceChange = document.querySelector('.price-change');

    if (priceValue) {
      priceValue.textContent = `$${this.gooPrice.toFixed(2)}`;
    }

    if (priceChange) {
      priceChange.textContent = `${this.isPositive ? '+' : ''}${this.priceChange.toFixed(1)}%`;
      priceChange.className = `price-change ${this.isPositive ? 'positive' : 'negative'}`;
    }

    // Update market info
    this.updateMarketInfo();
  }

  updateMarketInfo() {
    const marketCap = (this.gooPrice * 1000000000).toFixed(0);
    const volume = (Math.random() * 1000000000).toFixed(0);

    const marketInfo = document.querySelector('.market-info');
    if (marketInfo) {
      marketInfo.innerHTML = `
        <div>Market Cap: $${this.formatNumber(marketCap)}</div>
        <div>24h Volume: $${this.formatNumber(volume)}</div>
      `;
    }
  }

  formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  }

  setupFormValidation() {
    const amountInput = document.getElementById('amount');
    if (amountInput) {
      amountInput.addEventListener('input', () => this.validateForm());
    }
  }

  validateForm() {
    const amountInput = document.getElementById('amount');
    const amount = parseFloat(amountInput.value);
    const minAmount = 10;
    const maxAmount = 50000;

    // Validate amount
    const isValidAmount = amount >= minAmount && amount <= maxAmount;
    this.updateInputValidation(amountInput, isValidAmount);

    // Check if form is valid
    this.isFormValid = isValidAmount && this.selectedPaymentMethod !== null;
    this.updatePurchaseButton();
  }

  updateInputValidation(input, isValid) {
    const inputGroup = input.closest('.input-group');
    const validIcon = inputGroup.querySelector('.valid-icon');
    const invalidIcon = inputGroup.querySelector('.invalid-icon');

    inputGroup.classList.remove('valid', 'invalid');

    if (isValid) {
      inputGroup.classList.add('valid');
      if (validIcon) validIcon.style.opacity = '1';
      if (invalidIcon) invalidIcon.style.opacity = '0';
    } else {
      inputGroup.classList.add('invalid');
      if (validIcon) validIcon.style.opacity = '0';
      if (invalidIcon) invalidIcon.style.opacity = '1';
    }
  }

  handleAmountChange(e) {
    const amount = parseFloat(e.target.value);
    this.updatePurchaseSummary(amount);
    this.validateForm();
  }

  handleAmountSuggestion(e) {
    const amount = parseFloat(e.currentTarget.dataset.amount);
    const amountInput = document.getElementById('amount');

    if (amountInput) {
      amountInput.value = amount;
      this.updatePurchaseSummary(amount);
      this.validateForm();

      // Update active button
      document
        .querySelectorAll('.amount-btn')
        .forEach(btn => btn.classList.remove('active'));
      e.currentTarget.classList.add('active');
    }
  }

  handlePaymentMethodSelect(e) {
    const option = e.currentTarget;
    const method = option.dataset.method;

    // Update selection
    document
      .querySelectorAll('.payment-option')
      .forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');

    this.selectedPaymentMethod = method;
    this.updatePurchaseSummary();
    this.validateForm();
    this.updateProgressStep(2);
  }

  handleWalletConnect() {
    // Simulate wallet connection
    const walletBtn = document.querySelector('.wallet-connect-btn');
    if (walletBtn) {
      walletBtn.textContent = 'Connected';
      walletBtn.style.background = 'var(--primary-green)';
      walletBtn.disabled = true;
    }

    this.updateProgressStep(3);
  }

  handleTermsChange(e) {
    this.updatePurchaseButton();
  }

  handleInputFocus(input) {
    const inputGroup = input.closest('.input-group');
    inputGroup.style.borderColor = 'var(--border-accent)';
    inputGroup.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
  }

  handleInputBlur(input) {
    const inputGroup = input.closest('.input-group');
    inputGroup.style.borderColor = 'var(--border-primary)';
    inputGroup.style.boxShadow = 'none';
  }

  updatePurchaseSummary(amount = null) {
    if (!amount) {
      const amountInput = document.getElementById('amount');
      amount = parseFloat(amountInput.value) || 0;
    }

    const gooTokens = amount / this.gooPrice;
    const paymentFee = this.getPaymentFee(amount);
    const networkFee = 0.001; // Fixed network fee
    const totalCost = amount + paymentFee + networkFee;

    // Update summary display
    const summaryRows = document.querySelectorAll('.summary-row');
    summaryRows.forEach(row => {
      const label = row.querySelector('.summary-label');
      const value = row.querySelector('.summary-value');

      if (label && value) {
        switch (label.textContent) {
          case 'Investment Amount:':
            value.textContent = `$${amount.toFixed(2)}`;
            break;
          case 'GOO Tokens:':
            value.textContent = `${gooTokens.toFixed(2)} GOO`;
            break;
          case 'Payment Fee:':
            value.textContent = `$${paymentFee.toFixed(2)}`;
            break;
          case 'Network Fee:':
            value.textContent = `$${networkFee.toFixed(3)}`;
            break;
          case 'Total Cost:':
            value.textContent = `$${totalCost.toFixed(2)}`;
            break;
        }
      }
    });
  }

  getPaymentFee(amount) {
    if (!this.selectedPaymentMethod) return 0;

    const fees = {
      'credit-card': 0.029,
      'bank-transfer': 0.015,
      crypto: 0.01,
      paypal: 0.035,
    };

    return amount * (fees[this.selectedPaymentMethod] || 0);
  }

  updatePurchaseButton() {
    const purchaseBtn = document.querySelector('.purchase-btn');
    const termsCheckbox = document.querySelector('input[name="terms"]');

    if (purchaseBtn) {
      const isTermsAccepted = termsCheckbox ? termsCheckbox.checked : false;
      purchaseBtn.disabled = !this.isFormValid || !isTermsAccepted;
    }
  }

  setupProgressIndicator() {
    // Progress steps are updated by other methods
  }

  updateProgressStep(step) {
    this.currentStep = step;

    document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
      if (index < step) {
        stepEl.classList.add('active');
      } else {
        stepEl.classList.remove('active');
      }
    });
  }

  setupModals() {
    // Success modal
    const successModal = document.querySelector('.success-modal');
    if (successModal) {
      const closeBtn = successModal.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hideSuccessModal());
      }
    }

    // Loading overlay
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      // Auto-hide after 3 seconds if still showing
      setTimeout(() => {
        if (loadingOverlay.classList.contains('show')) {
          this.hideLoadingOverlay();
        }
      }, 3000);
    }
  }

  setupFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', e => {
        const faqItem = e.currentTarget.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');

        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
          item.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
          faqItem.classList.add('active');
        }
      });
    });
  }

  setupRecentPurchases() {
    // Add some sample recent purchases
    const purchasesList = document.querySelector('.purchases-list');
    if (purchasesList) {
      const samplePurchases = [
        {
          name: 'John D.',
          amount: '$1,500',
          tokens: '1,500 GOO',
          time: '2 min ago',
        },
        {
          name: 'Sarah M.',
          amount: '$500',
          tokens: '500 GOO',
          time: '5 min ago',
        },
        {
          name: 'Mike R.',
          amount: '$2,000',
          tokens: '2,000 GOO',
          time: '8 min ago',
        },
        {
          name: 'Lisa K.',
          amount: '$750',
          tokens: '750 GOO',
          time: '12 min ago',
        },
      ];

      samplePurchases.forEach(purchase => {
        this.addRecentPurchase(purchase);
      });
    }
  }

  addRecentPurchase(purchase) {
    const purchasesList = document.querySelector('.purchases-list');
    if (purchasesList) {
      const purchaseItem = document.createElement('div');
      purchaseItem.className = 'purchase-item';
      purchaseItem.innerHTML = `
        <div class="purchase-avatar">${purchase.name.charAt(0)}</div>
        <div class="purchase-details">
          <div class="purchase-amount">${purchase.amount}</div>
          <div class="purchase-tokens">${purchase.tokens}</div>
        </div>
        <div class="purchase-time">${purchase.time}</div>
      `;

      purchasesList.insertBefore(purchaseItem, purchasesList.firstChild);

      // Remove oldest purchase if more than 4
      const items = purchasesList.querySelectorAll('.purchase-item');
      if (items.length > 4) {
        items[items.length - 1].remove();
      }
    }
  }

  setupQuickBuyButtons() {
    document.querySelectorAll('.quick-buy-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const amount = parseFloat(btn.dataset.amount);
        if (amount) {
          this.handleQuickBuy(amount);
        }
      });
    });
  }

  handleQuickBuy(amount) {
    const amountInput = document.getElementById('amount');
    if (amountInput) {
      amountInput.value = amount;
      this.updatePurchaseSummary(amount);
      this.validateForm();

      // Scroll to form
      const form = document.querySelector('.purchase-form-container');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.handlePurchase();
  }

  async handlePurchase() {
    if (!this.isFormValid) return;

    const amountInput = document.getElementById('amount');
    const amount = parseFloat(amountInput.value);

    // Show loading overlay
    this.showLoadingOverlay();

    // Simulate purchase process
    setTimeout(() => {
      this.hideLoadingOverlay();
      this.showSuccessModal(amount);
      this.addRecentPurchase({
        name: 'You',
        amount: `$${amount.toFixed(2)}`,
        tokens: `${(amount / this.gooPrice).toFixed(2)} GOO`,
        time: 'Just now',
      });
    }, 3000);
  }

  showLoadingOverlay() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.add('show');
    }
  }

  hideLoadingOverlay() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.remove('show');
    }
  }

  showSuccessModal(amount) {
    const successModal = document.querySelector('.success-modal');
    if (successModal) {
      // Update modal content
      const gooTokens = amount / this.gooPrice;
      const transactionId = this.generateTransactionId();

      const detailItems = successModal.querySelectorAll('.detail-item');
      detailItems.forEach(item => {
        const label = item.querySelector('.detail-label');
        const value = item.querySelector('.detail-value');

        if (label && value) {
          switch (label.textContent) {
            case 'Amount:':
              value.textContent = `$${amount.toFixed(2)}`;
              break;
            case 'GOO Tokens:':
              value.textContent = `${gooTokens.toFixed(2)} GOO`;
              break;
            case 'Transaction ID:':
              value.textContent = transactionId;
              break;
            case 'Status:':
              value.textContent = 'Completed';
              break;
          }
        }
      });

      successModal.classList.add('show');
    }
  }

  hideSuccessModal() {
    const successModal = document.querySelector('.success-modal');
    if (successModal) {
      successModal.classList.remove('show');
    }
  }

  generateTransactionId() {
    return (
      '0x' +
      Math.random().toString(16).substr(2, 8) +
      Math.random().toString(16).substr(2, 8)
    );
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BuyPageOptimized();
});

// Export for manual use
window.BuyPageOptimized = BuyPageOptimized;

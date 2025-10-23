// Buy Form JavaScript for Goo Token
class BuyForm {
  constructor() {
    this.currentPrice = 1.0;
    this.networkFee = 2.5;
    this.paymentFees = {
      'credit-card': 0.029,
      'bank-transfer': 0.015,
      crypto: 0.01,
      paypal: 0.035,
    };
    this.init();
  }

  init() {
    this.setupFormHandlers();
    this.setupAmountButtons();
    this.setupRealTimeUpdates();
    this.setupFormValidation();
    this.setupRecentPurchases();
  }

  setupFormHandlers() {
    const form = document.getElementById('purchase-form');
    const amountInput = document.getElementById('amount');
    const paymentMethodInput = document.getElementById('payment-method');

    if (amountInput) {
      amountInput.addEventListener('input', () => {
        this.updatePurchaseSummary();
      });
    }

    if (paymentMethodInput) {
      paymentMethodInput.addEventListener('change', () => {
        this.updatePurchaseSummary();
      });
    }

    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
      method.addEventListener('click', () => {
        // Remove selected class from all methods
        paymentMethods.forEach(m => m.classList.remove('selected'));
        // Add selected class to clicked method
        method.classList.add('selected');
        // Update hidden input
        if (paymentMethodInput) {
          paymentMethodInput.value = method.dataset.method;
        }
        this.updatePurchaseSummary();
      });
    });

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        this.handlePurchase();
      });
    }
  }

  setupAmountButtons() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const amountInput = document.getElementById('amount');

    amountButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = parseFloat(btn.dataset.amount);
        if (amountInput) {
          amountInput.value = amount;
          this.updatePurchaseSummary();
        }
      });
    });
  }

  setupRealTimeUpdates() {
    // Update price every 10 seconds
    setInterval(() => {
      this.updateCurrentPrice();
    }, 10000);

    // Update recent purchases every 30 seconds
    setInterval(() => {
      this.updateRecentPurchases();
    }, 30000);
  }

  updateCurrentPrice() {
    const priceElement = document.querySelector('.price-value');
    if (priceElement) {
      const change = (Math.random() - 0.5) * 0.02;
      this.currentPrice = Math.max(
        0.5,
        Math.min(1.5, this.currentPrice + change)
      );
      priceElement.textContent = `$${this.currentPrice.toFixed(2)}`;
      this.updatePurchaseSummary();
    }
  }

  updatePurchaseSummary() {
    const amountInput = document.getElementById('amount');
    const paymentMethodInput = document.getElementById('payment-method');

    if (!amountInput) return;

    const amount = parseFloat(amountInput.value) || 0;
    const paymentMethodValue = paymentMethodInput
      ? paymentMethodInput.value
      : '';

    // Calculate payment fee
    const paymentFeeRate = this.paymentFees[paymentMethodValue] || 0;
    const paymentFee = amount * paymentFeeRate;

    // Calculate total
    const total = amount + paymentFee + this.networkFee;

    // Calculate GOO tokens
    const tokens = amount / this.currentPrice;

    // Update summary
    this.updateSummaryElement('summary-amount', `$${amount.toFixed(2)}`);
    this.updateSummaryElement(
      'summary-tokens',
      `${Math.floor(tokens).toLocaleString()} GOO`
    );
    this.updateSummaryElement(
      'summary-payment-fee',
      `$${paymentFee.toFixed(2)}`
    );
    this.updateSummaryElement('summary-total', `$${total.toFixed(2)}`);
  }

  updateSummaryElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  setupFormValidation() {
    const form = document.getElementById('purchase-form');
    const amountInput = document.getElementById('amount');
    const walletInput = document.getElementById('wallet-address');

    if (amountInput) {
      amountInput.addEventListener('blur', () => {
        this.validateAmount(amountInput);
      });
    }

    if (walletInput) {
      walletInput.addEventListener('blur', () => {
        this.validateWalletAddress(walletInput);
      });
    }
  }

  validateAmount(input) {
    const amount = parseFloat(input.value);
    const minAmount = 10;
    const maxAmount = 100000;

    if (amount < minAmount) {
      this.showFieldError(input, `Minimum amount is $${minAmount}`);
      return false;
    } else if (amount > maxAmount) {
      this.showFieldError(
        input,
        `Maximum amount is $${maxAmount.toLocaleString()}`
      );
      return false;
    } else {
      this.clearFieldError(input);
      return true;
    }
  }

  validateWalletAddress(input) {
    const address = input.value.trim();
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;

    if (!address) {
      this.showFieldError(input, 'Wallet address is required');
      return false;
    } else if (!ethAddressRegex.test(address)) {
      this.showFieldError(input, 'Please enter a valid Ethereum address');
      return false;
    } else {
      this.clearFieldError(input);
      return true;
    }
  }

  showFieldError(input, message) {
    this.clearFieldError(input);

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

  async handlePurchase() {
    const form = document.getElementById('purchase-form');
    const formData = new FormData(form);

    // Validate form
    const amount = parseFloat(formData.get('amount'));
    const paymentMethod = formData.get('payment-method');
    const walletAddress = formData.get('wallet-address');

    if (
      !this.validateAmount(document.getElementById('amount')) ||
      !this.validateWalletAddress(document.getElementById('wallet-address')) ||
      !paymentMethod
    ) {
      this.showNotification('Please fix the form errors', 'error');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.purchase-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
      // Simulate API call
      const result = await this.simulatePurchase({
        amount: amount,
        paymentMethod: paymentMethod,
        walletAddress: walletAddress,
      });

      this.showNotification(
        'Purchase successful! Tokens will be sent to your wallet.',
        'success'
      );

      // Add success animation
      submitBtn.classList.add('success-animation');
      setTimeout(() => submitBtn.classList.remove('success-animation'), 600);

      form.reset();
      this.updatePurchaseSummary();

      // Clear payment method selection
      document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
      });

      // Add to recent purchases
      this.addToRecentPurchases(amount);
    } catch (error) {
      this.showNotification('Purchase failed. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  }

  async simulatePurchase(purchaseData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random success/failure
    if (Math.random() < 0.1) {
      throw new Error('Payment failed');
    }

    return { success: true, transactionId: this.generateTransactionId() };
  }

  generateTransactionId() {
    return '0x' + Math.random().toString(16).substr(2, 40);
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

  setupRecentPurchases() {
    this.updateRecentPurchases();
  }

  updateRecentPurchases() {
    const purchasesList = document.querySelector('.purchases-list');
    if (!purchasesList) return;

    // Simulate new purchases
    if (Math.random() < 0.3) {
      this.addToRecentPurchases(Math.floor(Math.random() * 5000) + 100);
    }
  }

  addToRecentPurchases(amount) {
    const purchasesList = document.querySelector('.purchases-list');
    if (!purchasesList) return;

    const tokens = Math.floor(amount / this.currentPrice);
    const time = 'just now';

    const purchaseItem = document.createElement('div');
    purchaseItem.className = 'purchase-item';
    purchaseItem.innerHTML = `
      <div class="purchase-amount">$${amount.toLocaleString()}</div>
      <div class="purchase-tokens">${tokens.toLocaleString()} GOO</div>
      <div class="purchase-time">${time}</div>
    `;

    purchasesList.insertBefore(purchaseItem, purchasesList.firstChild);

    // Keep only last 5 purchases
    const purchases = purchasesList.querySelectorAll('.purchase-item');
    if (purchases.length > 5) {
      purchases[purchases.length - 1].remove();
    }
  }
}

// Initialize buy form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BuyForm();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BuyForm;
}

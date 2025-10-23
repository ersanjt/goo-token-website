// Professional Price Chart JavaScript for GOO Token
class ProfessionalPriceChart {
  constructor() {
    this.chart = null;
    this.currentTimeframe = '1d';
    this.chartType = 'line';
    this.isRealTime = true;
    this.updateInterval = null;
    this.priceData = this.generateInitialData();

    this.init();
  }

  init() {
    this.setupChart();
    this.setupTimeframeSelector();
    this.setupChartOptions();
    this.setupRealTimeUpdates();
    this.setupPriceAlerts();
    this.animatePriceCards();
  }

  generateInitialData() {
    return {
      currentPrice: 1.0,
      change24h: 15.2,
      volume24h: 45600,
      marketCap: 1200000,
      holders: 1234,
      transactions: 5678,
    };
  }

  setupChart() {
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;

    // Generate sample data
    const data = this.generateSampleData();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'GOO Price',
            data: data.prices,
            borderColor: '#00d4aa',
            backgroundColor: 'rgba(0, 212, 170, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#00d4aa',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#00d4aa',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: function (context) {
                return `Price: $${context[0].parsed.y.toFixed(2)}`;
              },
              label: function (context) {
                return `Time: ${context.label}`;
              },
            },
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false,
            },
            ticks: {
              color: '#a0a0a0',
              font: {
                size: 12,
              },
            },
          },
          y: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false,
            },
            ticks: {
              color: '#a0a0a0',
              font: {
                size: 12,
              },
              callback: function (value) {
                return '$' + value.toFixed(2);
              },
            },
          },
        },
        elements: {
          point: {
            hoverBackgroundColor: '#00d4aa',
            hoverBorderColor: '#ffffff',
            hoverBorderWidth: 2,
          },
        },
      },
    });
  }

  generateSampleData() {
    const timeframes = {
      '1h': { points: 60, interval: 1 },
      '4h': { points: 48, interval: 5 },
      '1d': { points: 24, interval: 60 },
      '7d': { points: 168, interval: 60 },
      '30d': { points: 30, interval: 1440 },
      '1y': { points: 365, interval: 1440 },
    };

    const config = timeframes[this.currentTimeframe] || timeframes['1d'];
    const labels = [];
    const prices = [];
    let basePrice = 1.0;

    for (let i = 0; i < config.points; i++) {
      const time = new Date();
      time.setMinutes(
        time.getMinutes() - (config.points - i) * config.interval
      );

      labels.push(
        time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );

      // Generate realistic price movement
      const change = (Math.random() - 0.5) * 0.02;
      basePrice += change;
      basePrice = Math.max(0.5, Math.min(1.5, basePrice)); // Keep price between $0.50 and $1.50

      prices.push(basePrice);
    }

    return { labels, prices };
  }

  setupTimeframeSelector() {
    const buttons = document.querySelectorAll('.timeframe-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        buttons.forEach(b => b.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        // Update timeframe
        this.currentTimeframe = btn.dataset.timeframe;

        // Update chart
        this.updateChart();
      });
    });
  }

  setupChartOptions() {
    const candlestickBtn = document.getElementById('candlestick-toggle');
    const lineBtn = document.getElementById('line-toggle');
    const volumeBtn = document.getElementById('volume-toggle');

    if (candlestickBtn) {
      candlestickBtn.addEventListener('click', () => {
        this.switchChartType('candlestick');
        this.updateButtonStates(candlestickBtn);
      });
    }

    if (lineBtn) {
      lineBtn.addEventListener('click', () => {
        this.switchChartType('line');
        this.updateButtonStates(lineBtn);
      });
    }

    if (volumeBtn) {
      volumeBtn.addEventListener('click', () => {
        this.toggleVolume();
        this.updateButtonStates(volumeBtn);
      });
    }
  }

  switchChartType(type) {
    if (!this.chart) return;

    this.chartType = type;

    if (type === 'candlestick') {
      // Switch to candlestick chart
      this.chart.config.type = 'bar';
      this.chart.config.data.datasets[0].type = 'bar';
    } else {
      // Switch to line chart
      this.chart.config.type = 'line';
      this.chart.config.data.datasets[0].type = 'line';
    }

    this.chart.update();
  }

  toggleVolume() {
    if (!this.chart) return;

    const volumeDataset = this.chart.config.data.datasets.find(
      ds => ds.label === 'Volume'
    );

    if (volumeDataset) {
      // Remove volume dataset
      this.chart.config.data.datasets = this.chart.config.data.datasets.filter(
        ds => ds.label !== 'Volume'
      );
    } else {
      // Add volume dataset
      const volumeData = this.generateVolumeData();
      this.chart.config.data.datasets.push({
        label: 'Volume',
        data: volumeData,
        type: 'bar',
        backgroundColor: 'rgba(255, 107, 53, 0.3)',
        borderColor: '#ff6b35',
        borderWidth: 1,
        yAxisID: 'y1',
      });
    }

    this.chart.update();
  }

  generateVolumeData() {
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push(Math.random() * 1000000 + 100000);
    }
    return data;
  }

  updateButtonStates(activeBtn) {
    const buttons = document.querySelectorAll('.chart-option-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  updateChart() {
    if (!this.chart) return;

    const data = this.generateSampleData();
    this.chart.config.data.labels = data.labels;
    this.chart.config.data.datasets[0].data = data.prices;
    this.chart.update();
  }

  setupRealTimeUpdates() {
    // Update price every 5 seconds
    setInterval(() => {
      this.updateRealTimePrice();
    }, 5000);

    // Update chart every 30 seconds
    setInterval(() => {
      this.updateChartData();
    }, 30000);
  }

  updateRealTimePrice() {
    const priceElement = document.querySelector('.price-value');
    const changeElement = document.querySelector('.price-change');

    if (priceElement && changeElement) {
      const currentPrice = parseFloat(
        priceElement.textContent.replace('$', '')
      );
      const change = (Math.random() - 0.5) * 0.02;
      const newPrice = Math.max(0.5, Math.min(1.5, currentPrice + change));

      priceElement.textContent = `$${newPrice.toFixed(2)}`;

      const changePercent = (((newPrice - 1.0) / 1.0) * 100).toFixed(1);
      changeElement.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent}%`;
      changeElement.className = `price-change ${changePercent >= 0 ? 'positive' : 'negative'}`;
    }
  }

  updateChartData() {
    if (!this.chart) return;

    const data = this.chart.config.data;
    const newPrice = parseFloat(
      document.querySelector('.price-value').textContent.replace('$', '')
    );

    // Add new data point
    data.labels.push(
      new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    );
    data.datasets[0].data.push(newPrice);

    // Remove old data points (keep last 24)
    if (data.labels.length > 24) {
      data.labels.shift();
      data.datasets[0].data.shift();
    }

    this.chart.update('none');
  }

  setupMarketDepth() {
    // Simulate real-time market depth updates
    setInterval(() => {
      this.updateMarketDepth();
    }, 10000);
  }

  updateMarketDepth() {
    const depthBars = document.querySelectorAll('.depth-fill');
    depthBars.forEach(bar => {
      const currentWidth = parseInt(bar.style.width);
      const change = (Math.random() - 0.5) * 10;
      const newWidth = Math.max(10, Math.min(100, currentWidth + change));
      bar.style.width = `${newWidth}%`;
    });
  }

  setupRecentTrades() {
    // Simulate new trades
    setInterval(() => {
      this.addNewTrade();
    }, 15000);
  }

  setupPriceAlerts() {
    const addAlertBtn = document.querySelector('.btn-add-alert');
    if (addAlertBtn) {
      addAlertBtn.addEventListener('click', e => {
        e.preventDefault();
        this.showAlertModal();
      });
    }
  }

  showAlertModal() {
    // Create and show price alert modal
    const modal = document.createElement('div');
    modal.className = 'price-alert-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;

    modal.innerHTML = `
      <div class="modal-content" style="
        background: var(--bg-card);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-xl);
        padding: var(--space-2xl);
        max-width: 400px;
        width: 90%;
        text-align: center;
      ">
        <div class="modal-header" style="margin-bottom: var(--space-lg);">
          <h3 style="color: var(--text-primary); margin: 0;">Price Alert Created</h3>
          <button class="modal-close" style="
            position: absolute;
            top: var(--space-md);
            right: var(--space-md);
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 1.5rem;
            cursor: pointer;
          ">&times;</button>
        </div>
        <div class="modal-body" style="margin-bottom: var(--space-xl);">
          <p style="color: var(--text-secondary); margin: 0;">
            Your price alert has been successfully created. You'll be notified when the price reaches your target.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-primary modal-close" style="
            background: var(--trust-gradient);
            color: white;
            border: none;
            padding: var(--space-md) var(--space-xl);
            border-radius: var(--radius-lg);
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-base);
          ">OK</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    modal.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.remove();
      });
    });
  }

  animatePriceCards() {
    const cards = document.querySelectorAll('.price-card, .market-stat');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';

      setTimeout(() => {
        card.style.transition = 'all 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  updatePriceCards(currentPrice) {
    const priceValue = document.querySelector('.price-card-value');
    if (priceValue) {
      priceValue.textContent = `$${currentPrice.toFixed(2)}`;
    }

    // Update market stats
    this.updateMarketStats();
  }

  updateMarketStats() {
    const stats = [
      {
        selector: '.market-stat:nth-child(1) .market-stat-value',
        value: '$1.2M',
      },
      {
        selector: '.market-stat:nth-child(2) .market-stat-value',
        value: '$45.6K',
      },
      {
        selector: '.market-stat:nth-child(3) .market-stat-value',
        value: '1,234',
      },
      {
        selector: '.market-stat:nth-child(4) .market-stat-value',
        value: '5,678',
      },
      {
        selector: '.market-stat:nth-child(5) .market-stat-value',
        value: '+15.2%',
      },
      {
        selector: '.market-stat:nth-child(6) .market-stat-value',
        value: '$0.95',
      },
    ];

    stats.forEach(stat => {
      const element = document.querySelector(stat.selector);
      if (element) {
        element.textContent = stat.value;
      }
    });
  }

  destroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// Initialize professional price chart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.priceChart = new ProfessionalPriceChart();
});

// Cleanup on page unload
window.addEventListener('beforeunload', function () {
  if (window.priceChart) {
    window.priceChart.destroy();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProfessionalPriceChart;
}

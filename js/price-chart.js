// Price Chart JavaScript for Goo Token
class PriceChart {
  constructor() {
    this.chart = null;
    this.currentTimeframe = '1d';
    this.chartType = 'line';
    this.init();
  }

  init() {
    this.setupChart();
    this.setupTimeframeSelector();
    this.setupChartOptions();
    this.setupRealTimeUpdates();
    this.setupMarketDepth();
    this.setupRecentTrades();
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
        datasets: [{
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
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
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
              title: function(context) {
                return `Price: $${context[0].parsed.y.toFixed(2)}`;
              },
              label: function(context) {
                return `Time: ${context.label}`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#a0a0a0',
              font: {
                size: 12
              }
            }
          },
          y: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#a0a0a0',
              font: {
                size: 12
              },
              callback: function(value) {
                return '$' + value.toFixed(2);
              }
            }
          }
        },
        elements: {
          point: {
            hoverBackgroundColor: '#00d4aa',
            hoverBorderColor: '#ffffff',
            hoverBorderWidth: 2
          }
        }
      }
    });
  }

  generateSampleData() {
    const timeframes = {
      '1h': { points: 60, interval: 1 },
      '4h': { points: 48, interval: 5 },
      '1d': { points: 24, interval: 60 },
      '7d': { points: 168, interval: 60 },
      '30d': { points: 30, interval: 1440 },
      '1y': { points: 365, interval: 1440 }
    };

    const config = timeframes[this.currentTimeframe] || timeframes['1d'];
    const labels = [];
    const prices = [];
    let basePrice = 1.00;

    for (let i = 0; i < config.points; i++) {
      const time = new Date();
      time.setMinutes(time.getMinutes() - (config.points - i) * config.interval);
      
      labels.push(time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));

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

    const volumeDataset = this.chart.config.data.datasets.find(ds => ds.label === 'Volume');
    
    if (volumeDataset) {
      // Remove volume dataset
      this.chart.config.data.datasets = this.chart.config.data.datasets.filter(ds => ds.label !== 'Volume');
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
        yAxisID: 'y1'
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
      const currentPrice = parseFloat(priceElement.textContent.replace('$', ''));
      const change = (Math.random() - 0.5) * 0.02;
      const newPrice = Math.max(0.5, Math.min(1.5, currentPrice + change));
      
      priceElement.textContent = `$${newPrice.toFixed(2)}`;
      
      const changePercent = ((newPrice - 1.00) / 1.00 * 100).toFixed(1);
      changeElement.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent}%`;
      changeElement.className = `price-change ${changePercent >= 0 ? 'positive' : 'negative'}`;
    }
  }

  updateChartData() {
    if (!this.chart) return;

    const data = this.chart.config.data;
    const newPrice = parseFloat(document.querySelector('.price-value').textContent.replace('$', ''));
    
    // Add new data point
    data.labels.push(new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }));
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

  addNewTrade() {
    const tradesList = document.querySelector('.trades-list');
    if (!tradesList) return;

    const tradeTypes = ['BUY', 'SELL'];
    const tradeType = tradeTypes[Math.floor(Math.random() * tradeTypes.length)];
    const price = (Math.random() * 0.1 + 0.95).toFixed(2);
    const amount = Math.floor(Math.random() * 5000) + 100;
    const time = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });

    const tradeItem = document.createElement('div');
    tradeItem.className = 'trade-item';
    tradeItem.innerHTML = `
      <div class="trade-time">${time}</div>
      <div class="trade-price ${tradeType === 'BUY' ? 'positive' : 'negative'}">$${price}</div>
      <div class="trade-amount">${amount.toLocaleString()} GOO</div>
      <div class="trade-type">${tradeType}</div>
    `;

    tradesList.insertBefore(tradeItem, tradesList.firstChild);

    // Keep only last 10 trades
    const trades = tradesList.querySelectorAll('.trade-item');
    if (trades.length > 10) {
      trades[trades.length - 1].remove();
    }
  }
}

// Initialize price chart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PriceChart();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PriceChart;
}

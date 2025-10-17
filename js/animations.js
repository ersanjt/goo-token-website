// Advanced Animations for Goo Token Website
class AdvancedAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.setupCounterAnimations();
    this.setupHoverEffects();
    this.setupLoadingAnimations();
    this.setupParticleSystem();
  }

  // Scroll-based animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          this.animateElement(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .market-card, .roadmap-item, .stat-item').forEach(el => {
      observer.observe(el);
    });
  }

  // Parallax effects
  setupParallaxEffects() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.hero-background, .bg-pattern');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }

  // Counter animations
  setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-value, .market-value');
    
    const animateCounter = (element) => {
      const target = parseFloat(element.textContent.replace(/[^0-9.-]/g, ''));
      const duration = 2000;
      const start = performance.now();
      
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (target - start) * this.easeOutCubic(progress);
        element.textContent = this.formatNumber(current, element.textContent);
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      
      requestAnimationFrame(updateCounter);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // Hover effects
  setupHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .market-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.createRippleEffect(e, card);
        card.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // Loading animations
  setupLoadingAnimations() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-logo">
          <span>G</span>
        </div>
        <div class="loader-text">Loading Goo Token...</div>
        <div class="loader-progress">
          <div class="loader-bar"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(loader);
    
    // Hide loader when page is loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 1000);
    });
  }

  // Particle system
  setupParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.className = 'particles-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      };
    };
    
    const initParticles = () => {
      for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
      }
    };
    
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 170, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animateParticles);
    };
    
    resizeCanvas();
    initParticles();
    animateParticles();
    
    window.addEventListener('resize', resizeCanvas);
  }

  // Utility functions
  animateElement(element) {
    element.style.animation = 'slideInUp 0.6s ease-out forwards';
  }

  createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(0, 212, 170, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: ${event.clientX - rect.left - size/2}px;
      top: ${event.clientY - rect.top - size/2}px;
      width: ${size}px;
      height: ${size}px;
    `;
    
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  formatNumber(num, original) {
    if (original.includes('$')) return `$${num.toFixed(2)}`;
    if (original.includes('%')) return `+${num.toFixed(1)}%`;
    if (original.includes('K')) return `${(num/1000).toFixed(1)}K`;
    if (original.includes('M')) return `$${(num/1000000).toFixed(1)}M`;
    return Math.round(num).toLocaleString();
  }
}

// CSS for animations
const animationStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .animate-in {
    animation: slideInUp 0.6s ease-out forwards;
  }

  .page-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.5s ease;
  }

  .loader-content {
    text-align: center;
    color: var(--text-primary);
  }

  .loader-logo {
    font-size: 4rem;
    font-weight: bold;
    color: var(--primary-color);
    margin-bottom: 1rem;
    animation: pulse 2s infinite;
  }

  .loader-text {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.8;
  }

  .loader-progress {
    width: 200px;
    height: 4px;
    background: var(--bg-secondary);
    border-radius: 2px;
    overflow: hidden;
  }

  .loader-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    border-radius: 2px;
    animation: loading 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes loading {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .feature-card, .market-card {
    transition: all 0.3s ease;
  }

  .feature-card:hover, .market-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AdvancedAnimations();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedAnimations;
}

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

  // Ultra-Modern Loading animations
  setupLoadingAnimations() {
    const loader = document.createElement('div');
    loader.className = 'ultra-modern-loader';
    loader.innerHTML = `
      <div class="loader-background">
        <div class="loader-particles"></div>
        <div class="loader-gradient"></div>
      </div>
      <div class="loader-content">
        <div class="loader-logo-container">
          <div class="loader-logo">
            <div class="logo-inner">G</div>
            <div class="logo-glow"></div>
            <div class="logo-ring"></div>
          </div>
          <div class="logo-pulse"></div>
        </div>
        <div class="loader-text-container">
          <div class="loader-text">Loading Goo Token</div>
          <div class="loader-subtitle">Preparing your digital experience...</div>
        </div>
        <div class="loader-progress-container">
          <div class="loader-progress">
            <div class="progress-bar">
              <div class="progress-fill"></div>
              <div class="progress-glow"></div>
            </div>
            <div class="progress-percentage">0%</div>
          </div>
        </div>
        <div class="loader-features">
          <div class="feature-item">
            <i class="feather" data-feather="shield"></i>
            <span>Secure</span>
          </div>
          <div class="feature-item">
            <i class="feather" data-feather="zap"></i>
            <span>Fast</span>
          </div>
          <div class="feature-item">
            <i class="feather" data-feather="globe"></i>
            <span>Global</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(loader);
    
    // Initialize Feather icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
    
    // Simulate loading progress
    let progress = 0;
    const progressBar = loader.querySelector('.progress-fill');
    const progressPercentage = loader.querySelector('.progress-percentage');
    
    const updateProgress = () => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;
      
      progressBar.style.width = `${progress}%`;
      progressPercentage.textContent = `${Math.round(progress)}%`;
      
      if (progress < 100) {
        setTimeout(updateProgress, 100 + Math.random() * 200);
      }
    };
    
    // Start progress animation
    setTimeout(updateProgress, 500);
    
    // Hide loader when page is loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        progress = 100;
        progressBar.style.width = '100%';
        progressPercentage.textContent = '100%';
        
        setTimeout(() => {
          loader.style.opacity = '0';
          loader.style.transform = 'scale(0.95)';
          setTimeout(() => loader.remove(), 800);
        }, 500);
      }, 1500);
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

  /* Ultra-Modern Loader Styles */
  .ultra-modern-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 50%, #2d1b69 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .loader-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .loader-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
    animation: particleFloat 8s ease-in-out infinite;
  }

  .loader-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, 
      rgba(102, 126, 234, 0.1) 0%, 
      rgba(118, 75, 162, 0.1) 25%, 
      rgba(240, 147, 251, 0.1) 50%, 
      rgba(67, 233, 123, 0.1) 75%, 
      rgba(56, 249, 215, 0.1) 100%);
    animation: gradientShift 6s ease-in-out infinite;
  }

  .loader-content {
    position: relative;
    z-index: 10;
    text-align: center;
    color: var(--text-primary);
    max-width: 500px;
    padding: 2rem;
  }

  .loader-logo-container {
    position: relative;
    margin-bottom: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loader-logo {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    border-radius: 30px;
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
    animation: logoFloat 3s ease-in-out infinite;
  }

  .logo-inner {
    font-size: 3rem;
    font-weight: 800;
    color: white;
    z-index: 2;
    position: relative;
  }

  .logo-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: logoGlow 2s ease-in-out infinite;
  }

  .logo-ring {
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 2px solid rgba(102, 126, 234, 0.3);
    border-radius: 40px;
    animation: logoRing 2s ease-in-out infinite;
  }

  .logo-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140px;
    height: 140px;
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: logoPulse 2s ease-in-out infinite;
  }

  .loader-text-container {
    margin-bottom: 3rem;
  }

  .loader-text {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
    animation: textGlow 2s ease-in-out infinite;
  }

  .loader-subtitle {
    font-size: 1.1rem;
    color: var(--text-muted);
    opacity: 0.8;
    animation: subtitleFade 2s ease-in-out infinite;
  }

  .loader-progress-container {
    margin-bottom: 3rem;
  }

  .loader-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .progress-bar {
    position: relative;
    width: 300px;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    backdrop-filter: blur(10px);
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .progress-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: progressShine 2s ease-in-out infinite;
  }

  .progress-percentage {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
    animation: percentagePulse 1s ease-in-out infinite;
  }

  .loader-features {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    animation: featureFloat 3s ease-in-out infinite;
  }

  .feature-item:nth-child(1) { animation-delay: 0s; }
  .feature-item:nth-child(2) { animation-delay: 0.5s; }
  .feature-item:nth-child(3) { animation-delay: 1s; }

  .feature-item i {
    font-size: 1.5rem;
    color: #667eea;
    animation: iconRotate 2s ease-in-out infinite;
  }

  .feature-item span {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  /* Animations */
  @keyframes particleFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }

  @keyframes gradientShift {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }

  @keyframes logoFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }

  @keyframes logoGlow {
    0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.8); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
  }

  @keyframes logoRing {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }

  @keyframes logoPulse {
    0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
  }

  @keyframes textGlow {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.2); }
  }

  @keyframes subtitleFade {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @keyframes progressShine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes percentagePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes featureFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  @keyframes iconRotate {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(10deg); }
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

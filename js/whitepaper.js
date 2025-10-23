// Whitepaper JavaScript for Goo Token
class WhitepaperReader {
  constructor() {
    this.currentSection = 'abstract';
    this.init();
  }

  init() {
    this.setupTableOfContents();
    this.setupScrollSpy();
    this.setupPrintFunctionality();
    this.setupProgressTracking();
  }

  setupTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-list a');

    tocLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      });
    });
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Update active section
      this.updateActiveSection(sectionId);
    }
  }

  setupScrollSpy() {
    const sections = document.querySelectorAll('.whitepaper-section-content');
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  updateActiveSection(sectionId) {
    this.currentSection = sectionId;

    // Update TOC active state
    const tocLinks = document.querySelectorAll('.toc-list a');
    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
  }

  setupPrintFunctionality() {
    // Print functionality is now handled by the modern print section in HTML
    // The modern print button is already in the HTML with proper styling
    console.log('Print functionality ready - using modern print section');
  }

  printWhitepaper() {
    // Create print-friendly version
    const printWindow = window.open('', '_blank');
    const printContent = this.generatePrintContent();

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  generatePrintContent() {
    const title = document.querySelector('.whitepaper-title').textContent;
    const subtitle = document.querySelector('.whitepaper-subtitle').textContent;
    const content = document.querySelector('.whitepaper-content').innerHTML;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          h1 { color: #00d4aa; border-bottom: 2px solid #00d4aa; padding-bottom: 10px; }
          h2 { color: #333; margin-top: 30px; }
          h3 { color: #666; margin-top: 20px; }
          .whitepaper-meta { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .problem-grid, .solution-features { display: none; }
          .roadmap-timeline { page-break-inside: avoid; }
          .team-grid { display: none; }
          @media print {
            body { margin: 20px; }
            .print-btn { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p style="font-size: 18px; color: #666;">${subtitle}</p>
        <div class="whitepaper-meta">
          <strong>Version:</strong> 1.0 | <strong>Date:</strong> January 2025 | <strong>Authors:</strong> Goo Token Team
        </div>
        ${content}
      </body>
      </html>
    `;
  }


  setupProgressTracking() {
    // Add reading progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';

    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: var(--bg-secondary);
      z-index: 10000;
    `;

    const progressFill = progressBar.querySelector('.progress-fill');
    progressFill.style.cssText = `
      height: 100%;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      width: 0%;
      transition: width 0.3s ease;
    `;

    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', () => {
      this.updateReadingProgress(progressFill);
    });
  }

  updateReadingProgress(progressFill) {
    const content = document.querySelector('.whitepaper-content');
    if (!content) return;

    const contentHeight = content.offsetHeight;
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const scrollPercent = (scrollTop / (contentHeight - windowHeight)) * 100;

    progressFill.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
  }
}

// Initialize whitepaper reader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WhitepaperReader();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WhitepaperReader;
}

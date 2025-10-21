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
    this.setupSearchFunctionality();
    this.setupProgressTracking();
  }

  setupTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    tocLinks.forEach(link => {
      link.addEventListener('click', (e) => {
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
        block: 'start'
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
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
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

  setupSearchFunctionality() {
    // Add search input
    const searchContainer = document.createElement('div');
    searchContainer.className = 'whitepaper-search';
    searchContainer.innerHTML = `
      <div class="search-input-container">
        <input type="text" id="whitepaper-search" placeholder="Search whitepaper..." />
        <i class="fas fa-search"></i>
      </div>
      <div class="search-results" id="search-results"></div>
    `;
    
    searchContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      min-width: 300px;
    `;
    
    document.body.appendChild(searchContainer);
    
    const searchInput = document.getElementById('whitepaper-search');
    const searchResults = document.getElementById('search-results');
    
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value, searchResults);
      }, 300);
    });
  }

  performSearch(query, resultsContainer) {
    if (query.length < 2) {
      resultsContainer.innerHTML = '';
      return;
    }
    
    const sections = document.querySelectorAll('.whitepaper-section-content');
    const results = [];
    
    sections.forEach(section => {
      const text = section.textContent.toLowerCase();
      const title = section.querySelector('h2').textContent;
      
      if (text.includes(query.toLowerCase())) {
        const matches = this.findMatches(section, query);
        results.push({
          title: title,
          id: section.id,
          matches: matches
        });
      }
    });
    
    this.displaySearchResults(results, resultsContainer, query);
  }

  findMatches(section, query) {
    const matches = [];
    const paragraphs = section.querySelectorAll('p, li');
    
    paragraphs.forEach(p => {
      const text = p.textContent;
      const regex = new RegExp(`(${query})`, 'gi');
      if (regex.test(text)) {
        const highlighted = text.replace(regex, '<mark>$1</mark>');
        matches.push(highlighted.substring(0, 200) + '...');
      }
    });
    
    return matches.slice(0, 3); // Limit to 3 matches per section
  }

  displaySearchResults(results, container, query) {
    if (results.length === 0) {
      container.innerHTML = '<p>No results found</p>';
      return;
    }
    
    let html = `<h4>Search Results for "${query}"</h4>`;
    
    results.forEach(result => {
      html += `
        <div class="search-result-item">
          <h5><a href="#${result.id}">${result.title}</a></h5>
          <div class="search-matches">
            ${result.matches.map(match => `<p>${match}</p>`).join('')}
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
    // Add click handlers for result links
    container.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollToSection(link.getAttribute('href').substring(1));
      });
    });
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

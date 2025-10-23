// Enhanced Whitepaper Page JavaScript
class WhitepaperEnhanced {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupTableOfContents();
    this.setupPrintFunctionality();
    this.setupDownloadFunctionality();
    this.setupShareFunctionality();
    this.setupSmoothScrolling();
    this.setupProgressIndicator();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll(
      '.whitepaper-section-content, .problem-item, .feature-card, .roadmap-item'
    );
    sections.forEach(section => {
      section.classList.add('animate-on-scroll');
      observer.observe(section);
    });
  }

  setupTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    const sections = document.querySelectorAll('.whitepaper-section-content');
    const tocToggle = document.getElementById('toc-toggle');
    const tocMobileToggle = document.getElementById('toc-mobile-toggle');
    const tocPanel = document.getElementById('whitepaper-toc');

    // TOC Toggle functionality
    if (tocToggle) {
      tocToggle.addEventListener('click', () => {
        tocPanel.classList.add('toc-hidden');
        setTimeout(() => {
          tocPanel.style.display = 'none';
        }, 300);
      });
    }

    // Mobile TOC Toggle functionality
    if (tocMobileToggle) {
      tocMobileToggle.addEventListener('click', () => {
        if (tocPanel.classList.contains('toc-hidden')) {
          tocPanel.style.display = 'block';
          setTimeout(() => {
            tocPanel.classList.remove('toc-hidden');
          }, 10);
        } else {
          tocPanel.classList.add('toc-hidden');
          setTimeout(() => {
            tocPanel.style.display = 'none';
          }, 300);
        }
      });
    }

    // Update active TOC item on scroll
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Remove active class from all TOC links
            tocLinks.forEach(link => link.classList.remove('active'));

            // Add active class to corresponding TOC link
            const id = entry.target.getAttribute('id');
            const activeLink = document.querySelector(
              `.toc-list a[href="#${id}"]`
            );
            if (activeLink) {
              activeLink.classList.add('active');
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(section => {
      sectionObserver.observe(section);
    });

    // Smooth scroll for TOC links
    tocLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

          // Close TOC on mobile after clicking
          if (window.innerWidth <= 768) {
            setTimeout(() => {
              tocPanel.classList.add('toc-hidden');
              setTimeout(() => {
                tocPanel.style.display = 'none';
              }, 300);
            }, 500);
          }
        }
      });
    });
  }

  setupPrintFunctionality() {
    window.printWhitepaper = () => {
      // Create print styles
      const printStyles = `
        <style>
          @media print {
            body * {
              visibility: hidden;
            }
            .whitepaper-content, .whitepaper-content * {
              visibility: visible;
            }
            .whitepaper-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              color: black !important;
            }
            .print-section, .whitepaper-toc, .download-section {
              display: none !important;
            }
            .whitepaper-content::before {
              display: none !important;
            }
            .whitepaper-section-content h2 {
              color: black !important;
              page-break-before: always;
            }
            .whitepaper-section-content h2:first-child {
              page-break-before: avoid;
            }
          }
        </style>
      `;

      // Add print styles to head
      const styleSheet = document.createElement('style');
      styleSheet.textContent = printStyles;
      document.head.appendChild(styleSheet);

      // Print
      window.print();

      // Remove print styles after printing
      setTimeout(() => {
        document.head.removeChild(styleSheet);
      }, 1000);
    };
  }

  setupDownloadFunctionality() {
    window.downloadPDF = () => {
      this.showNotification('Preparing PDF download...', 'info');

      // Simulate PDF generation
      setTimeout(() => {
        // Create a simple PDF content (in real implementation, use a PDF library)
        const content = this.generatePDFContent();
        this.downloadFile(
          content,
          'goo-token-whitepaper.pdf',
          'application/pdf'
        );
        this.showNotification('PDF downloaded successfully!', 'success');
      }, 2000);
    };

    window.downloadDoc = () => {
      this.showNotification('Preparing Word document...', 'info');

      setTimeout(() => {
        const content = this.generateDocContent();
        this.downloadFile(
          content,
          'goo-token-whitepaper.docx',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );
        this.showNotification('Word document downloaded!', 'success');
      }, 2000);
    };
  }

  setupShareFunctionality() {
    window.shareWhitepaper = () => {
      if (navigator.share) {
        navigator
          .share({
            title: 'Goo Token Whitepaper',
            text: 'Check out the complete technical documentation for Goo Token',
            url: window.location.href,
          })
          .then(() => {
            this.showNotification('Shared successfully!', 'success');
          })
          .catch(() => {
            this.fallbackShare();
          });
      } else {
        this.fallbackShare();
      }
    };
  }

  fallbackShare() {
    // Copy URL to clipboard
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        this.showNotification('URL copied to clipboard!', 'success');
      })
      .catch(() => {
        // Show share options
        this.showShareModal();
      });
  }

  showShareModal() {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Share Whitepaper</h3>
          <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="share-options">
            <button class="share-btn" onclick="shareToTwitter()">
              <i class="fab fa-twitter"></i>
              <span>Twitter</span>
            </button>
            <button class="share-btn" onclick="shareToLinkedIn()">
              <i class="fab fa-linkedin"></i>
              <span>LinkedIn</span>
            </button>
            <button class="share-btn" onclick="shareToFacebook()">
              <i class="fab fa-facebook"></i>
              <span>Facebook</span>
            </button>
            <button class="share-btn" onclick="copyLink()">
              <i class="fas fa-link"></i>
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Add modal styles
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
      z-index: 10000;
      backdrop-filter: blur(10px);
    `;

    document.body.appendChild(modal);

    // Close modal
    modal.querySelector('.close-btn').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.addEventListener('click', e => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  setupSmoothScrolling() {
    // Smooth scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }

  setupProgressIndicator() {
    // Create reading progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';

    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 1000;
    `;

    const progressFill = progressBar.querySelector('.progress-fill');
    progressFill.style.cssText = `
      height: 100%;
      background: var(--mixed-gradient);
      width: 0%;
      transition: width 0.3s ease;
    `;

    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressFill.style.width = scrollPercent + '%';
    });
  }

  generatePDFContent() {
    // In a real implementation, this would generate actual PDF content
    return 'PDF content would be generated here';
  }

  generateDocContent() {
    // In a real implementation, this would generate actual Word document content
    return 'Word document content would be generated here';
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.whitepaper-notification');
    existing.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `whitepaper-notification ${type}`;
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
    notification
      .querySelector('.notification-close')
      .addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      });
  }
}

// Share functions
window.shareToTwitter = () => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('Check out the Goo Token Whitepaper!');
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    '_blank'
  );
};

window.shareToLinkedIn = () => {
  const url = encodeURIComponent(window.location.href);
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    '_blank'
  );
};

window.shareToFacebook = () => {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};

window.copyLink = () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    // Close modal and show notification
    const modal = document.querySelector('.share-modal');
    if (modal) {
      document.body.removeChild(modal);
    }
    // You can add a notification here
  });
};

// Add CSS for animations and modal
const style = document.createElement('style');
style.textContent = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }
  
  .animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  .toc-list a.active {
    background: var(--trust-green);
    color: white;
    border-color: var(--trust-green);
  }
  
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
  
  .whitepaper-notification {
    color: var(--text-primary);
  }
  
  .whitepaper-notification.success {
    border-color: var(--trust-green);
    background: rgba(16, 185, 129, 0.1);
  }
  
  .whitepaper-notification .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }
  
  .whitepaper-notification .notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .whitepaper-notification .notification-close:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
  
  .share-modal .modal-content {
    background: var(--bg-card);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-xl);
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    backdrop-filter: blur(20px);
  }
  
  .share-modal .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .share-modal .modal-header h3 {
    margin: 0;
    color: var(--text-primary);
  }
  
  .share-modal .close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .share-modal .close-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
  
  .share-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .share-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
  }
  
  .share-btn:hover {
    background: var(--trust-green);
    color: white;
    border-color: var(--trust-green);
    transform: translateY(-2px);
  }
  
  .share-btn i {
    font-size: 1.5rem;
  }
  
  .share-btn span {
    font-size: 0.9rem;
    font-weight: 600;
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new WhitepaperEnhanced();
});

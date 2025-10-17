#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Comprehensive Website Audit Script
class WebsiteAuditor {
  constructor() {
    this.htmlFiles = [
      'index.html',
      'price.html', 
      'buy.html',
      'whitepaper.html',
      'whitepaper-full.html',
      'marketing.html',
      'about.html',
      'contact.html'
    ];
    
    this.cssFiles = [
      'styles.css',
      'css/header.css',
      'css/professional-header.css',
      'css/professional-theme.css',
      'css/modern-token.css',
      'css/price-chart.css',
      'css/buy-page.css'
    ];
    
    this.jsFiles = [
      'script.js',
      'analytics.js',
      'js/header.js',
      'js/modern-token.js',
      'js/price-chart.js',
      'js/buy-form.js',
      'js/whitepaper.js',
      'js/marketing.js',
      'js/about.js',
      'js/contact.js',
      'js/translations.js',
      'js/animations.js',
      'js/performance.js',
      'js/cache-manager.js',
      'js/performance-optimizer.js'
    ];
    
    this.results = {
      html: {},
      css: {},
      js: {},
      consistency: {},
      uniqueness: {},
      issues: []
    };
  }

  async audit() {
    console.log('🔍 Starting Comprehensive Website Audit...\n');
    
    await this.auditHtmlFiles();
    await this.auditCssFiles();
    await this.auditJsFiles();
    await this.checkConsistency();
    await this.checkUniqueness();
    await this.generateReport();
  }

  async auditHtmlFiles() {
    console.log('📄 Auditing HTML Files...');
    
    for (const file of this.htmlFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        this.results.html[file] = {
          exists: true,
          size: content.length,
          hasTitle: content.includes('<title>'),
          hasMeta: content.includes('<meta'),
          hasHeader: content.includes('<header'),
          hasFooter: content.includes('<footer'),
          hasNavigation: content.includes('<nav'),
          hasMainContent: content.includes('<main') || content.includes('<section'),
          hasScripts: content.includes('<script'),
          hasStyles: content.includes('<link rel="stylesheet"'),
          hasFeatherIcons: content.includes('feather-icons'),
          hasFontAwesome: content.includes('font-awesome'),
          hasGoogleFonts: content.includes('fonts.googleapis.com'),
          hasPWA: content.includes('manifest.json'),
          hasSEO: content.includes('og:title') && content.includes('og:description'),
          hasAnalytics: content.includes('analytics.js'),
          hasThemeToggle: content.includes('theme-toggle'),
          hasLanguageSwitcher: content.includes('language-switcher'),
          hasPriceDisplay: content.includes('price-display'),
          hasBuyButton: content.includes('buy-btn')
        };
      } else {
        this.results.html[file] = { exists: false };
        this.results.issues.push(`❌ Missing HTML file: ${file}`);
      }
    }
  }

  async auditCssFiles() {
    console.log('🎨 Auditing CSS Files...');
    
    for (const file of this.cssFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        this.results.css[file] = {
          exists: true,
          size: content.length,
          hasVariables: content.includes('--'),
          hasMediaQueries: content.includes('@media'),
          hasAnimations: content.includes('@keyframes') || content.includes('animation:'),
          hasTransitions: content.includes('transition:'),
          hasGradients: content.includes('gradient'),
          hasFlexbox: content.includes('display: flex'),
          hasGrid: content.includes('display: grid'),
          hasResponsive: content.includes('max-width') || content.includes('min-width')
        };
      } else {
        this.results.css[file] = { exists: false };
        this.results.issues.push(`❌ Missing CSS file: ${file}`);
      }
    }
  }

  async auditJsFiles() {
    console.log('⚡ Auditing JavaScript Files...');
    
    for (const file of this.jsFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        this.results.js[file] = {
          exists: true,
          size: content.length,
          hasClasses: content.includes('class '),
          hasFunctions: content.includes('function '),
          hasEventListeners: content.includes('addEventListener'),
          hasAsyncAwait: content.includes('async ') || content.includes('await '),
          hasErrorHandling: content.includes('try {') || content.includes('catch'),
          hasComments: content.includes('//') || content.includes('/*'),
          hasModernJS: content.includes('const ') || content.includes('let '),
          hasModules: content.includes('export ') || content.includes('import ')
        };
      } else {
        this.results.js[file] = { exists: false };
        this.results.issues.push(`❌ Missing JS file: ${file}`);
      }
    }
  }

  async checkConsistency() {
    console.log('🔄 Checking Consistency...');
    
    const headerElements = [
      'logo-icon', 'logo-inner', 'fa-coins', 'logo-glow', 'logo-main', 'logo-sub',
      'feather', 'data-feather', 'price-display', 'language-switcher', 'theme-toggle', 'buy-btn'
    ];
    
    const footerElements = [
      'footer-content', 'footer-section', 'Quick Links', 'Resources', 'Community',
      'social-links', 'footer-bottom'
    ];
    
    for (const file of this.htmlFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        this.results.consistency[file] = {
          headerElements: headerElements.map(el => content.includes(el)),
          footerElements: footerElements.map(el => content.includes(el)),
          hasProfessionalHeader: content.includes('css/professional-header.css'),
          hasProfessionalTheme: content.includes('css/professional-theme.css'),
          hasFeatherIcons: content.includes('feather-icons'),
          hasFontAwesome: content.includes('font-awesome')
        };
      }
    }
  }

  async checkUniqueness() {
    console.log('🎯 Checking Page Uniqueness...');
    
    const uniqueContent = {
      'index.html': ['hero', 'features', 'tokenomics', 'roadmap', 'market-data', 'global-adoption'],
      'price.html': ['price-hero', 'price-overview', 'chart-container', 'market-stats', 'trading-pairs', 'price-alerts'],
      'buy.html': ['buy-hero', 'purchase-form', 'payment-methods', 'security-features', 'recent-purchases'],
      'whitepaper.html': ['whitepaper-content', 'abstract', 'introduction', 'problem-statement', 'solution'],
      'whitepaper-full.html': ['full-whitepaper', 'table-of-contents', 'technical-details'],
      'marketing.html': ['marketing-hero', 'campaigns', 'partnerships', 'community-stats'],
      'about.html': ['about-hero', 'our-vision', 'our-story', 'team-section', 'roadmap'],
      'contact.html': ['contact-hero', 'contact-form', 'contact-methods', 'faq-section']
    };
    
    for (const [file, expectedContent] of Object.entries(uniqueContent)) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        this.results.uniqueness[file] = {
          hasUniqueContent: expectedContent.some(item => content.includes(item)),
          uniqueElements: expectedContent.filter(item => content.includes(item)),
          hasPageSpecificCSS: content.includes(`css/${file.replace('.html', '')}`),
          hasPageSpecificJS: content.includes(`js/${file.replace('.html', '')}`)
        };
      }
    }
  }

  async generateReport() {
    console.log('\n📊 Generating Comprehensive Report...\n');
    
    // HTML Files Summary
    console.log('📄 HTML Files Summary:');
    const htmlFiles = Object.entries(this.results.html);
    const existingHtml = htmlFiles.filter(([_, data]) => data.exists);
    console.log(`✅ ${existingHtml.length}/${htmlFiles.length} HTML files exist`);
    
    // CSS Files Summary
    console.log('\n🎨 CSS Files Summary:');
    const cssFiles = Object.entries(this.results.css);
    const existingCss = cssFiles.filter(([_, data]) => data.exists);
    console.log(`✅ ${existingCss.length}/${cssFiles.length} CSS files exist`);
    
    // JS Files Summary
    console.log('\n⚡ JavaScript Files Summary:');
    const jsFiles = Object.entries(this.results.js);
    const existingJs = jsFiles.filter(([_, data]) => data.exists);
    console.log(`✅ ${existingJs.length}/${jsFiles.length} JavaScript files exist`);
    
    // Consistency Check
    console.log('\n🔄 Consistency Analysis:');
    const consistentPages = Object.entries(this.results.consistency)
      .filter(([_, data]) => data.headerElements.every(Boolean) && data.footerElements.every(Boolean));
    console.log(`✅ ${consistentPages.length}/${Object.keys(this.results.consistency).length} pages have consistent header/footer`);
    
    // Uniqueness Check
    console.log('\n🎯 Uniqueness Analysis:');
    const uniquePages = Object.entries(this.results.uniqueness)
      .filter(([_, data]) => data.hasUniqueContent);
    console.log(`✅ ${uniquePages.length}/${Object.keys(this.results.uniqueness).length} pages have unique content`);
    
    // Issues Summary
    console.log('\n⚠️ Issues Found:');
    if (this.results.issues.length === 0) {
      console.log('✅ No issues found!');
    } else {
      this.results.issues.forEach(issue => console.log(issue));
    }
    
    // Detailed Analysis
    console.log('\n📋 Detailed Analysis:');
    
    // Page-specific analysis
    for (const [file, data] of Object.entries(this.results.html)) {
      if (data.exists) {
        console.log(`\n📄 ${file}:`);
        console.log(`  Size: ${(data.size / 1024).toFixed(1)}KB`);
        console.log(`  Has Title: ${data.hasTitle ? '✅' : '❌'}`);
        console.log(`  Has Meta Tags: ${data.hasMeta ? '✅' : '❌'}`);
        console.log(`  Has Header: ${data.hasHeader ? '✅' : '❌'}`);
        console.log(`  Has Footer: ${data.hasFooter ? '✅' : '❌'}`);
        console.log(`  Has Navigation: ${data.hasNavigation ? '✅' : '❌'}`);
        console.log(`  Has Main Content: ${data.hasMainContent ? '✅' : '❌'}`);
        console.log(`  Has Scripts: ${data.hasScripts ? '✅' : '❌'}`);
        console.log(`  Has Styles: ${data.hasStyles ? '✅' : '❌'}`);
        console.log(`  Has Feather Icons: ${data.hasFeatherIcons ? '✅' : '❌'}`);
        console.log(`  Has Font Awesome: ${data.hasFontAwesome ? '✅' : '❌'}`);
        console.log(`  Has Google Fonts: ${data.hasGoogleFonts ? '✅' : '❌'}`);
        console.log(`  Has PWA: ${data.hasPWA ? '✅' : '❌'}`);
        console.log(`  Has SEO: ${data.hasSEO ? '✅' : '❌'}`);
        console.log(`  Has Analytics: ${data.hasAnalytics ? '✅' : '❌'}`);
        console.log(`  Has Theme Toggle: ${data.hasThemeToggle ? '✅' : '❌'}`);
        console.log(`  Has Language Switcher: ${data.hasLanguageSwitcher ? '✅' : '❌'}`);
        console.log(`  Has Price Display: ${data.hasPriceDisplay ? '✅' : '❌'}`);
        console.log(`  Has Buy Button: ${data.hasBuyButton ? '✅' : '❌'}`);
      }
    }
    
    // Final Summary
    console.log('\n🎉 Final Summary:');
    console.log(`✅ Total HTML Files: ${existingHtml.length}`);
    console.log(`✅ Total CSS Files: ${existingCss.length}`);
    console.log(`✅ Total JS Files: ${existingJs.length}`);
    console.log(`✅ Consistent Pages: ${consistentPages.length}`);
    console.log(`✅ Unique Pages: ${uniquePages.length}`);
    console.log(`⚠️ Total Issues: ${this.results.issues.length}`);
    
    if (this.results.issues.length === 0 && consistentPages.length === Object.keys(this.results.consistency).length) {
      console.log('\n🎊 Congratulations! Your website is perfectly structured and consistent!');
    } else {
      console.log('\n🔧 Some improvements needed. Please review the issues above.');
    }
  }
}

// Run the audit
const auditor = new WebsiteAuditor();
auditor.audit().catch(console.error);

/**
 * SEO Optimizer for GooToken Website
 * Enhances search engine optimization and structured data
 */

class SEOOptimizer {
  constructor() {
    this.structuredData = {};
    this.init();
  }

  init() {
    this.addStructuredData();
    this.optimizeMetaTags();
    this.addSchemaMarkup();
    this.enhanceInternalLinking();
    this.addBreadcrumbs();
    this.optimizeImages();
    this.addSitemapData();
  }

  addStructuredData() {
    // Organization Schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'GooToken',
      description:
        'Professional cryptocurrency token with advanced blockchain technology',
      url: window.location.origin,
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/favicon.svg`,
        width: 32,
        height: 32,
      },
      sameAs: [
        'https://twitter.com/gootoken',
        'https://t.me/gootoken',
        'https://discord.gg/gootoken',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-GOO-TOKEN',
        contactType: 'customer service',
        availableLanguage: ['English', 'Persian'],
      },
    };

    // Cryptocurrency Schema
    const cryptocurrencySchema = {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      name: 'GooToken',
      description:
        'Digital cryptocurrency token built on blockchain technology',
      category: 'Cryptocurrency',
      provider: {
        '@type': 'Organization',
        name: 'GooToken',
      },
      offers: {
        '@type': 'Offer',
        price: '1.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    };

    this.structuredData.organization = organizationSchema;
    this.structuredData.cryptocurrency = cryptocurrencySchema;
  }

  optimizeMetaTags() {
    // Dynamic meta tags based on current page
    const currentPage = this.getCurrentPage();
    const metaTags = this.generateMetaTags(currentPage);

    this.updateMetaTags(metaTags);
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const pages = {
      '/': 'home',
      '/buy.html': 'buy',
      '/about.html': 'about',
      '/contact.html': 'contact',
      '/marketing.html': 'marketing',
      '/price.html': 'price',
      '/whitepaper.html': 'whitepaper',
    };

    return pages[path] || 'home';
  }

  generateMetaTags(page) {
    const baseTags = {
      home: {
        title:
          'GooToken - Professional Cryptocurrency Token | Blockchain Technology',
        description:
          'Discover GooToken, the next-generation cryptocurrency built on advanced blockchain technology. Secure, fast, and reliable digital currency for the modern world.',
        keywords:
          'GooToken, cryptocurrency, blockchain, digital currency, crypto, token, blockchain technology',
      },
      buy: {
        title: 'Buy GooToken - Secure Cryptocurrency Purchase | GooToken',
        description:
          'Purchase GooToken securely with multiple payment methods. Credit card, bank transfer, cryptocurrency, and PayPal accepted. Start your crypto journey today.',
        keywords:
          'buy GooToken, purchase cryptocurrency, crypto investment, digital currency, secure payment',
      },
      about: {
        title: 'About GooToken - Our Mission & Technology | GooToken',
        description:
          "Learn about GooToken's mission, technology, and team. Discover how we're revolutionizing the cryptocurrency space with innovative blockchain solutions.",
        keywords:
          'about GooToken, cryptocurrency mission, blockchain technology, crypto team, digital currency innovation',
      },
      contact: {
        title: 'Contact GooToken - Get Support & Information | GooToken',
        description:
          "Get in touch with the GooToken team. Find support, ask questions, and connect with our community. We're here to help with your crypto journey.",
        keywords:
          'contact GooToken, crypto support, cryptocurrency help, blockchain support, digital currency assistance',
      },
    };

    return baseTags[page] || baseTags.home;
  }

  updateMetaTags(tags) {
    // Update title
    document.title = tags.title;

    // Update or create meta description
    this.updateMetaTag('description', tags.description);
    this.updateMetaTag('keywords', tags.keywords);

    // Add Open Graph tags
    this.addOpenGraphTags(tags);

    // Add Twitter Card tags
    this.addTwitterCardTags(tags);
  }

  updateMetaTag(name, content) {
    let metaTag = document.querySelector(`meta[name="${name}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = name;
      document.head.appendChild(metaTag);
    }
    metaTag.content = content;
  }

  addOpenGraphTags(tags) {
    const ogTags = [
      { property: 'og:title', content: tags.title },
      { property: 'og:description', content: tags.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      {
        property: 'og:image',
        content: `${window.location.origin}/icons/icon-512x512.png`,
      },
      { property: 'og:site_name', content: 'GooToken' },
    ];

    ogTags.forEach(tag => {
      this.updateMetaTag(tag.property, tag.content);
    });
  }

  addTwitterCardTags(tags) {
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: tags.title },
      { name: 'twitter:description', content: tags.description },
      {
        name: 'twitter:image',
        content: `${window.location.origin}/icons/icon-512x512.png`,
      },
    ];

    twitterTags.forEach(tag => {
      this.updateMetaTag(tag.name, tag.content);
    });
  }

  addSchemaMarkup() {
    // Add JSON-LD structured data
    Object.values(this.structuredData).forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }

  enhanceInternalLinking() {
    // Add internal linking for better SEO
    const internalLinks = [
      { from: 'home', to: 'buy', text: 'Buy GooToken' },
      { from: 'home', to: 'about', text: 'About Us' },
      { from: 'buy', to: 'about', text: 'Learn More' },
      { from: 'about', to: 'contact', text: 'Contact Us' },
    ];

    // This would be implemented based on current page content
    this.addContextualLinks();
  }

  addContextualLinks() {
    // Add contextual internal links to improve page authority
    const contentAreas = document.querySelectorAll(
      '.content, .main-content, .section'
    );

    contentAreas.forEach(area => {
      // Add relevant internal links based on content
      this.addRelevantLinks(area);
    });
  }

  addRelevantLinks(container) {
    // This would analyze content and add relevant internal links
    // Implementation depends on specific content structure
  }

  addBreadcrumbs() {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: this.generateBreadcrumbs(),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);
  }

  generateBreadcrumbs() {
    const path = window.location.pathname;
    const breadcrumbs = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: window.location.origin,
      },
    ];

    if (path !== '/') {
      const pageName = this.getPageName(path);
      breadcrumbs.push({
        '@type': 'ListItem',
        position: 2,
        name: pageName,
        item: window.location.href,
      });
    }

    return breadcrumbs;
  }

  getPageName(path) {
    const pageNames = {
      '/buy.html': 'Buy',
      '/about.html': 'About',
      '/contact.html': 'Contact',
      '/marketing.html': 'Marketing',
      '/price.html': 'Price',
      '/whitepaper.html': 'Whitepaper',
    };

    return pageNames[path] || 'Page';
  }

  optimizeImages() {
    // Add lazy loading and alt text optimization
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      // Add lazy loading
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }

      // Optimize alt text
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', this.generateAltText(img));
      }
    });
  }

  generateAltText(img) {
    // Generate descriptive alt text based on image context
    const src = img.src;
    const className = img.className;

    if (src.includes('logo') || className.includes('logo')) {
      return 'GooToken Logo';
    }

    if (src.includes('icon') || className.includes('icon')) {
      return 'GooToken Icon';
    }

    return 'GooToken related image';
  }

  addSitemapData() {
    // Generate sitemap data for search engines
    const sitemapData = {
      pages: [
        { url: '/', priority: 1.0, changefreq: 'daily' },
        { url: '/buy.html', priority: 0.9, changefreq: 'weekly' },
        { url: '/about.html', priority: 0.8, changefreq: 'monthly' },
        { url: '/contact.html', priority: 0.7, changefreq: 'monthly' },
        { url: '/marketing.html', priority: 0.8, changefreq: 'weekly' },
        { url: '/price.html', priority: 0.9, changefreq: 'daily' },
        { url: '/whitepaper.html', priority: 0.6, changefreq: 'monthly' },
      ],
    };

    // Store sitemap data for potential use
    this.sitemapData = sitemapData;
  }

  // Utility methods
  trackPageView() {
    // Track page views for analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }

  generateSitemap() {
    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${this.sitemapData.pages
  .map(
    page => `
  <url>
    <loc>${window.location.origin}${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
  </url>`
  )
  .join('')}
</urlset>`;

    return sitemap;
  }
}

// Initialize SEO optimization
const seoOptimizer = new SEOOptimizer();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEOOptimizer;
}

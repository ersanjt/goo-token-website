// Script to check header and footer consistency across all pages
const fs = require('fs');
const path = require('path');

const pages = [
  'index.html',
  'price.html',
  'buy.html',
  'whitepaper.html',
  'whitepaper-full.html',
  'marketing.html',
  'about.html',
  'contact.html',
];

const requiredHeaderElements = [
  'logo-icon',
  'logo-inner',
  'fa-gem',
  'logo-glow',
  'logo-main',
  'logo-sub',
  'feather',
  'data-feather',
  'price-display',
  'language-switcher',
  'theme-toggle',
  'buy-btn',
];

const requiredFooterElements = [
  'footer-content',
  'footer-section',
  'Quick Links',
  'Resources',
  'Community',
  'social-links',
  'footer-bottom',
];

function checkPage(pageName) {
  const filePath = path.join(__dirname, '..', pageName);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${pageName} - File not found`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let hasAllElements = true;

  console.log(`\n📄 Checking ${pageName}:`);

  // Check header elements
  console.log('  Header elements:');
  requiredHeaderElements.forEach(element => {
    if (content.includes(element)) {
      console.log(`    ✅ ${element}`);
    } else {
      console.log(`    ❌ ${element} - Missing`);
      hasAllElements = false;
    }
  });

  // Check footer elements
  console.log('  Footer elements:');
  requiredFooterElements.forEach(element => {
    if (content.includes(element)) {
      console.log(`    ✅ ${element}`);
    } else {
      console.log(`    ❌ ${element} - Missing`);
      hasAllElements = false;
    }
  });

  // Check for Feather Icons CDN
  if (content.includes('feather-icons/4.29.0/feather.min.js')) {
    console.log('    ✅ Feather Icons CDN');
  } else {
    console.log('    ❌ Feather Icons CDN - Missing');
    hasAllElements = false;
  }

  // Check for professional CSS files
  const requiredCSS = [
    'css/professional-header.css',
    'css/professional-theme.css',
  ];

  console.log('  CSS files:');
  requiredCSS.forEach(css => {
    if (content.includes(css)) {
      console.log(`    ✅ ${css}`);
    } else {
      console.log(`    ❌ ${css} - Missing`);
      hasAllElements = false;
    }
  });

  return hasAllElements;
}

function main() {
  console.log(
    '🔍 Checking header and footer consistency across all pages...\n'
  );

  let allConsistent = true;

  pages.forEach(page => {
    const isConsistent = checkPage(page);
    if (!isConsistent) {
      allConsistent = false;
    }
  });

  console.log('\n📊 Summary:');
  if (allConsistent) {
    console.log('✅ All pages have consistent header and footer!');
  } else {
    console.log('❌ Some pages are missing required elements.');
    console.log('Please update the inconsistent pages.');
  }

  return allConsistent;
}

if (require.main === module) {
  main();
}

module.exports = { checkPage, main };

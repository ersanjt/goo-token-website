const fs = require('fs');
const path = require('path');

// List of HTML files to optimize
const htmlFiles = [
  'index.html',
  'price.html', 
  'buy.html',
  'whitepaper.html',
  'whitepaper-full.html',
  'marketing.html',
  'about.html',
  'contact.html'
];

// CSS files to replace
const cssReplacements = [
  {
    from: 'css/header.css',
    to: 'css/unified-header.css'
  },
  {
    from: 'css/professional-header.css', 
    to: 'css/unified-header.css'
  }
];

// Floating theme toggle HTML
const floatingThemeToggle = `
    <!-- Floating Theme Toggle -->
    <button id="floating-theme-toggle" class="floating-theme-toggle" title="Toggle Dark/Light Mode">
      <i class="feather" data-feather="moon"></i>
    </button>`;

// Floating theme toggle JavaScript
const floatingThemeJS = `
      // Floating theme toggle functionality
      const floatingToggle = document.getElementById('floating-theme-toggle');
      const themeToggle = document.getElementById('theme-toggle');
      
      if (floatingToggle) {
        floatingToggle.addEventListener('click', function() {
          if (themeToggle) {
            themeToggle.click();
          } else {
            // Fallback theme toggle
            const currentTheme = localStorage.getItem('theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Update icon
            const icon = floatingToggle.querySelector('i');
            if (icon) {
              icon.setAttribute('data-feather', newTheme === 'dark' ? 'moon' : 'sun');
              setTimeout(() => feather.replace(), 100);
            }
          }
        });
      }`;

function optimizeHTMLFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace CSS files
    cssReplacements.forEach(replacement => {
      const regex = new RegExp(`<link[^>]*href="${replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'g');
      if (content.includes(replacement.from)) {
        content = content.replace(regex, `<link rel="stylesheet" href="${replacement.to}" />`);
        modified = true;
        console.log(`✓ Replaced ${replacement.from} with ${replacement.to} in ${filePath}`);
      }
    });

    // Add floating theme toggle if not exists
    if (!content.includes('floating-theme-toggle')) {
      // Find footer closing tag
      const footerRegex = /<\/footer>\s*<script/;
      if (footerRegex.test(content)) {
        content = content.replace(footerRegex, `</footer>\n\n${floatingThemeToggle}\n\n    <script`);
        modified = true;
        console.log(`✓ Added floating theme toggle to ${filePath}`);
      }
    }

    // Add floating theme toggle JavaScript if not exists
    if (!content.includes('floating-theme-toggle') && content.includes('feather.replace()')) {
      const featherRegex = /feather\.replace\(\);\s*<\/script>/;
      if (featherRegex.test(content)) {
        content = content.replace(featherRegex, `feather.replace();\n      \n      ${floatingThemeJS}\n    </script>`);
        modified = true;
        console.log(`✓ Added floating theme toggle JavaScript to ${filePath}`);
      }
    }

    // Remove old theme toggle from header if exists
    const oldThemeToggleRegex = /<button[^>]*id="theme-toggle"[^>]*>[\s\S]*?<\/button>/g;
    if (oldThemeToggleRegex.test(content)) {
      content = content.replace(oldThemeToggleRegex, '');
      modified = true;
      console.log(`✓ Removed old theme toggle from header in ${filePath}`);
    }

    // Remove language switcher if exists
    const languageSwitcherRegex = /<div[^>]*class="language-switcher"[\s\S]*?<\/div>/g;
    if (languageSwitcherRegex.test(content)) {
      content = content.replace(languageSwitcherRegex, '');
      modified = true;
      console.log(`✓ Removed language switcher from ${filePath}`);
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Optimized ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed for ${filePath}`);
    }

  } catch (error) {
    console.error(`❌ Error optimizing ${filePath}:`, error.message);
  }
}

// Main execution
console.log('🚀 Starting optimization of all HTML pages...\n');

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    optimizeHTMLFile(file);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n✨ Optimization complete!');
console.log('\n📋 Summary of changes:');
console.log('• Replaced old header CSS with unified-header.css');
console.log('• Added floating theme toggle to all pages');
console.log('• Added floating theme toggle JavaScript');
console.log('• Removed old theme toggle from headers');
console.log('• Removed language switcher components');
console.log('\n🎉 All pages are now optimized with modern loading and theme toggle!');

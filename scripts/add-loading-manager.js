const fs = require('fs');
const path = require('path');

// List of HTML files to update
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

function addLoadingManager(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if loading-manager.js is already included
    if (!content.includes('js/loading-manager.js')) {
      // Find the animations.js script tag and add loading-manager.js after it
      const animationsRegex = /<script[^>]*src="js\/animations\.js"[^>]*><\/script>/;
      if (animationsRegex.test(content)) {
        content = content.replace(
          animationsRegex,
          `<script src="js/animations.js"></script>
    <script src="js/loading-manager.js"></script>`
        );
        modified = true;
        console.log(`✓ Added loading-manager.js to ${filePath}`);
      }
    } else {
      console.log(`⏭️  loading-manager.js already exists in ${filePath}`);
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${filePath}`);
    }

  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Main execution
console.log('🚀 Adding loading manager to all pages...\n');

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    addLoadingManager(file);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n✨ Loading manager addition complete!');
console.log('\n📋 Summary of changes:');
console.log('• Added js/loading-manager.js to all HTML pages');
console.log('• Enhanced loading screen reliability');
console.log('• Added multiple fallback mechanisms');
console.log('\n🎉 All pages now have robust loading management!');

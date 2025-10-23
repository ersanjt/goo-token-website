const fs = require('fs');
const path = require('path');

// List of HTML files to fix
const htmlFiles = [
  'index.html',
  'price.html',
  'buy.html',
  'whitepaper.html',
  'whitepaper-full.html',
  'marketing.html',
  'about.html',
  'contact.html',
];

function fixTranslationsLinks(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove js/translations.js script tag
    const translationsRegex =
      /<script[^>]*src="js\/translations\.js"[^>]*><\/script>\s*/g;
    if (translationsRegex.test(content)) {
      content = content.replace(translationsRegex, '');
      modified = true;
      console.log(`✓ Removed js/translations.js from ${filePath}`);
    }

    // Remove any remaining references to translations
    const translationsRefRegex = /translations\.js/g;
    if (translationsRefRegex.test(content)) {
      content = content.replace(translationsRefRegex, '');
      modified = true;
      console.log(`✓ Cleaned up translations references in ${filePath}`);
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Main execution
console.log('🚀 Starting to fix translations links...\n');

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fixTranslationsLinks(file);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n✨ Translations links fix complete!');
console.log('\n📋 Summary of changes:');
console.log('• Removed js/translations.js script tags from all pages');
console.log('• Cleaned up any remaining translations references');
console.log('\n🎉 All pages are now clean of translations references!');

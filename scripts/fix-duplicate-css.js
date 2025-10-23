const fs = require('fs');
const path = require('path');

// List of HTML files to fix
const htmlFiles = [
  'buy.html',
  'whitepaper.html',
  'whitepaper-full.html',
  'marketing.html',
  'about.html',
  'contact.html',
];

function fixDuplicateCSS(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remove duplicate css/unified-header.css links
    const unifiedHeaderRegex =
      /<link[^>]*href="css\/unified-header\.css"[^>]*>\s*<link[^>]*href="css\/unified-header\.css"[^>]*>/g;
    if (unifiedHeaderRegex.test(content)) {
      content = content.replace(
        unifiedHeaderRegex,
        '<link rel="stylesheet" href="css/unified-header.css" />'
      );
      modified = true;
      console.log(`✓ Fixed duplicate css/unified-header.css in ${filePath}`);
    }

    // Also check for any other duplicate CSS links
    const duplicateCSSRegex =
      /<link[^>]*href="([^"]+)"[^>]*>\s*<link[^>]*href="\1"[^>]*>/g;
    if (duplicateCSSRegex.test(content)) {
      content = content.replace(
        duplicateCSSRegex,
        '<link rel="stylesheet" href="$1" />'
      );
      modified = true;
      console.log(`✓ Fixed duplicate CSS links in ${filePath}`);
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
console.log('🚀 Starting to fix duplicate CSS links...\n');

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fixDuplicateCSS(file);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n✨ Duplicate CSS links fix complete!');
console.log('\n📋 Summary of changes:');
console.log('• Removed duplicate css/unified-header.css links');
console.log('• Fixed any other duplicate CSS links');
console.log('\n🎉 All pages now have clean CSS links!');

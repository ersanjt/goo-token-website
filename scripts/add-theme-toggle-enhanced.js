const fs = require('fs');
const path = require('path');

// List of HTML files to update
const htmlFiles = [
  'index.html',
  'price.html',
  'buy.html',
  'contact.html',
  'marketing.html',
  'about.html',
  'whitepaper.html',
  'whitepaper-full.html',
];

// Function to add theme toggle enhanced script
function addThemeToggleEnhanced(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if script already exists
    if (content.includes('js/theme-toggle-enhanced.js')) {
      console.log(`⚠️  Theme toggle enhanced already exists in ${filePath}`);
      return;
    }

    // Add script before closing body tag
    const scriptTag =
      '    <script src="js/theme-toggle-enhanced.js"></script>\n  </body>';
    content = content.replace('</body>', scriptTag);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Added theme toggle enhanced to ${filePath}`);
  } catch (error) {
    console.error(
      `❌ Error adding theme toggle enhanced to ${filePath}:`,
      error.message
    );
  }
}

// Process all HTML files
console.log('🎨 Adding enhanced theme toggle to all pages...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    addThemeToggleEnhanced(filePath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n🎉 Enhanced theme toggle added successfully!');

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

// Function to fix footer duplicates
function fixFooterDuplicates(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace Community section with Support section
    const communitySectionRegex =
      /<div class="footer-section">\s*<h3>Community<\/h3>\s*<div class="social-links">[\s\S]*?<\/div>\s*<\/div>/g;

    const supportSection = `          <div class="footer-section">
            <h3>Support</h3>
            <ul class="footer-links">
              <li><a href="mailto:support@gootoken.com">24/7 Support</a></li>
              <li><a href="mailto:info@gootoken.com">General Info</a></li>
              <li><a href="mailto:partnerships@gootoken.com">Partnerships</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>`;

    content = content.replace(communitySectionRegex, supportSection);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed footer duplicates in ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Process all HTML files
console.log('🔧 Fixing footer duplicates across all pages...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    fixFooterDuplicates(filePath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n🎉 Footer duplicates fixed successfully!');

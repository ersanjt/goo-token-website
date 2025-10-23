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

// Function to improve theme toggle button
function improveThemeToggle(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Update the floating theme toggle button with better title and accessibility
    const oldToggleRegex =
      /<button id="floating-theme-toggle" class="floating-theme-toggle" title="Toggle Dark\/Light Mode">\s*<i class="feather" data-feather="moon"><\/i>\s*<\/button>/g;

    const newToggle = `<button id="floating-theme-toggle" class="floating-theme-toggle" title="تغییر تم (Dark/Light Mode)" aria-label="تغییر تم">
      <i class="feather" data-feather="moon"></i>
    </button>`;

    content = content.replace(oldToggleRegex, newToggle);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Improved theme toggle in ${filePath}`);
  } catch (error) {
    console.error(
      `❌ Error improving theme toggle in ${filePath}:`,
      error.message
    );
  }
}

// Process all HTML files
console.log('🎨 Improving theme toggle button across all pages...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    improveThemeToggle(filePath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n🎉 Theme toggle button improved successfully!');

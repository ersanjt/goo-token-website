# 🚀 Goo Token Website

> **Professional cryptocurrency website developed by ErsanJ.Tabrizi from Bizdavar Team**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Jest-29.6.2-green.svg)](https://jestjs.io/)
[![ESLint](https://img.shields.io/badge/ESLint-8.45.0-purple.svg)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.0.0-pink.svg)](https://prettier.io/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Build & Deploy](#build--deploy)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

## 🎯 Overview

Goo Token Website is a modern, responsive, and professional cryptocurrency platform built with cutting-edge web technologies. The website features a complete ecosystem for digital currency trading, information, and community engagement.

### 🌟 Key Highlights

- **Modern Design**: Clean, professional UI with dark/light theme support
- **Responsive**: Mobile-first design that works on all devices
- **Fast Performance**: Optimized loading and smooth animations
- **PWA Ready**: Progressive Web App capabilities
- **SEO Optimized**: Search engine friendly structure
- **Accessibility**: WCAG compliant design

## ✨ Features

### 🎨 User Interface
- **3D Gem Logo**: Animated 3D gem with rotating facets
- **Theme Toggle**: Dark/Light mode with smooth transitions
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Modern Animations**: Smooth CSS animations and transitions
- **Professional Typography**: Inter font family for readability

### 🚀 Performance
- **Lazy Loading**: Optimized resource loading
- **Service Worker**: Offline functionality and caching
- **Minified Assets**: Compressed CSS and JavaScript
- **Image Optimization**: WebP format with fallbacks
- **Critical CSS**: Above-the-fold optimization

### 🔧 Technical Features
- **TypeScript Support**: Type-safe development
- **ESLint & Prettier**: Code quality and formatting
- **Jest Testing**: Comprehensive test coverage
- **GitHub Actions**: Automated CI/CD pipeline
- **Vercel Deployment**: Automatic deployments

## 🛠 Tech Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript ES2020**: Modern JavaScript features
- **TypeScript**: Type-safe development
- **PWA**: Progressive Web App capabilities

### Build Tools
- **Node.js**: Runtime environment
- **NPM**: Package management
- **Terser**: JavaScript minification
- **Clean CSS**: CSS optimization
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Deployment
- **Vercel**: Hosting platform
- **GitHub**: Version control
- **GitHub Actions**: CI/CD pipeline

## 📁 Project Structure

```
goo-token-website/
├── 📄 index.html              # Home page
├── 📄 buy.html                # Purchase page
├── 📄 about.html              # About page
├── 📄 contact.html            # Contact page
├── 📄 marketing.html          # Marketing page
├── 📄 price.html              # Price chart page
├── 📄 whitepaper.html         # Whitepaper page
├── 📄 whitepaper-full.html    # Full whitepaper
├── 📄 styles.css              # Main stylesheet
├── 📄 script.js               # Main JavaScript
├── 📄 manifest.json           # PWA manifest
├── 📄 sw.js                   # Service worker
├── 📄 favicon.svg             # SVG favicon
├── 📄 favicon.ico             # ICO favicon
├── 📁 css/                    # Stylesheets
│   ├── unified-header.css
│   ├── professional-theme.css
│   ├── modern-token.css
│   └── ...
├── 📁 js/                     # JavaScript files
│   ├── animations.js
│   ├── theme-toggle-enhanced.js
│   ├── performance-monitor.js
│   ├── error-handler.js
│   └── ...
├── 📁 icons/                  # PWA icons
├── 📁 scripts/                # Build scripts
├── 📁 dist/                   # Build output
├── 📁 node_modules/           # Dependencies
├── 📄 package.json            # Project configuration
├── 📄 tsconfig.json           # TypeScript config
├── 📄 jest.config.js          # Jest configuration
├── 📄 .eslintrc.js            # ESLint configuration
├── 📄 .prettierrc             # Prettier configuration
└── 📄 README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **NPM** (v8 or higher)
- **Git** (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ersanjt/goo-token-website.git
   cd goo-token-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run clean            # Clean build artifacts

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run typecheck        # Run TypeScript checks

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Deployment
npm run deploy           # Deploy to GitHub Pages
```

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Edit files
   - Test changes
   - Run linting and tests

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🏗 Build & Deploy

### Production Build

```bash
npm run build
```

This will:
- Run TypeScript checks
- Minify CSS and JavaScript
- Generate optimized assets in `dist/` folder

### Deployment

The project is automatically deployed to Vercel on every push to the main branch.

**Manual deployment:**
```bash
npm run deploy
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: `js/__tests__/`
- **Test Configuration**: `jest.config.js`
- **Test Setup**: `jest.setup.js`

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Guidelines

- Follow [Conventional Commits](https://conventionalcommits.org/)
- Write tests for new features
- Ensure code passes linting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Credits

**Developed by:** [ErsanJ.Tabrizi](https://github.com/ersanjt)  
**Team:** [Bizdavar](https://bizdavar.com)  
**Project:** Goo Token Website  
**Year:** 2024  

### Special Thanks

- **Bizdavar Team** for project management
- **Goo Token Community** for feedback and support
- **Open Source Community** for amazing tools and libraries

---

**Made with ❤️ by ErsanJ.Tabrizi from Bizdavar Team**
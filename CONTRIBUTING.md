# 🤝 Contributing to GooToken Website

Thank you for your interest in contributing to the GooToken website! This document provides guidelines and information for contributors.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/goo-token-website.git
cd goo-token-website

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📋 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Check code quality
npm run lint
npm run typecheck
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

## 📝 Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples:

```
feat: add dark mode toggle
fix: resolve header alignment issue
docs: update README with new features
```

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for all new functionality
- Test both happy path and edge cases
- Use descriptive test names
- Keep tests simple and focused

### Test Structure

```javascript
describe('Component Name', () => {
  beforeEach(() => {
    // Setup
  });

  test('should do something specific', () => {
    // Test implementation
  });
});
```

## 🎨 Code Style Guidelines

### JavaScript/TypeScript

- Use ES6+ features
- Prefer `const` over `let`
- Use meaningful variable names
- Add JSDoc comments for functions
- Follow ESLint rules

### CSS

- Use BEM methodology for class names
- Keep selectors specific but not overly complex
- Use CSS custom properties for theming
- Follow the existing naming conventions

### HTML

- Use semantic HTML elements
- Include proper accessibility attributes
- Keep markup clean and readable
- Use consistent indentation

## 🔍 Code Review Process

### Before Submitting

- [ ] Code builds successfully
- [ ] All tests pass
- [ ] No linting errors
- [ ] Code is properly formatted
- [ ] Documentation is updated
- [ ] No console.log statements left

### Review Checklist

- [ ] Code follows project conventions
- [ ] Tests are comprehensive
- [ ] Performance considerations addressed
- [ ] Security implications considered
- [ ] Accessibility requirements met

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshots if applicable

### Feature Requests

For new features:

- Describe the use case
- Explain the expected behavior
- Consider implementation complexity
- Check for existing similar requests

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for functions
- Include inline comments for complex logic
- Update README for significant changes
- Document API changes

### User Documentation

- Keep user-facing documentation clear
- Include examples where helpful
- Update screenshots for UI changes
- Maintain consistent tone

## 🚀 Deployment

### Automatic Deployment

- Main branch automatically deploys to production
- All tests must pass before deployment
- Build process is automated via GitHub Actions

### Manual Deployment

```bash
npm run build
npm run deploy
```

## 🤝 Getting Help

- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Join our community Discord/Slack
- Contact maintainers directly

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to GooToken! 🚀

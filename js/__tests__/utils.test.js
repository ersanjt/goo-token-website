// Sample test file for utility functions
describe('Utility Functions', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('DOM Utilities', () => {
    test('should create element with correct attributes', () => {
      const element = document.createElement('div');
      element.className = 'test-class';
      element.id = 'test-id';

      expect(element.tagName).toBe('DIV');
      expect(element.className).toBe('test-class');
      expect(element.id).toBe('test-id');
    });

    test('should handle localStorage operations', () => {
      const key = 'test-key';
      const value = 'test-value';

      localStorage.setItem(key, value);
      expect(localStorage.getItem(key)).toBe(value);
    });
  });

  describe('Animation Utilities', () => {
    test('should handle animation callbacks', () => {
      const mockCallback = jest.fn();
      const element = document.createElement('div');

      // Simulate animation end
      element.addEventListener('animationend', mockCallback);
      element.dispatchEvent(new Event('animationend'));

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Theme Utilities', () => {
    test('should toggle theme correctly', () => {
      const body = document.body;
      const initialTheme = body.classList.contains('dark-theme');

      // Toggle theme
      body.classList.toggle('dark-theme');

      expect(body.classList.contains('dark-theme')).toBe(!initialTheme);
    });
  });
});

/**
 * Tests for virtual scroll utilities
 */

import {
  calculateVisibleRange,
  createVirtualScrollManager,
  estimateTextHeight,
  isVirtualScrollSupported,
  VirtualScrollManager,
} from './virtualScrollUtils';

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: (entries: IntersectionObserverEntry[]) => void;
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;

  constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
    this.callback = callback;
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
  }
}

// Mock window.IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  value: MockIntersectionObserver,
  writable: true,
});

describe('VirtualScrollManager', () => {
  let manager: VirtualScrollManager;
  let mockContainer: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = createVirtualScrollManager();
    mockContainer = document.createElement('div');
  });

  afterEach(() => {
    manager.cleanup();
  });

  it('should create instance with default config', () => {
    expect(manager).toBeInstanceOf(VirtualScrollManager);
  });

  it('should initialize with container', () => {
    manager.initialize(mockContainer);
    // Should not throw and should create observer
    expect(manager).toBeDefined();
  });

  it('should cleanup properly', () => {
    manager.initialize(mockContainer);
    manager.cleanup();
    // Should not throw
    expect(manager).toBeDefined();
  });

  it('should handle visibility callbacks', () => {
    const callback = vi.fn();
    const unsubscribe = manager.onVisibilityChange(callback);

    expect(typeof unsubscribe).toBe('function');
    unsubscribe();

    // Initialize to trigger observer creation
    manager.initialize(mockContainer);

    // Should not throw when callback is triggered
    expect(manager).toBeDefined();
  });

  it('should observe and unobserve elements', () => {
    manager.initialize(mockContainer);

    const element = document.createElement('div');
    manager.observeElement(element, 'test-id');

    expect(element.getAttribute('data-item-id')).toBe('test-id');

    manager.unobserveElement(element);
    // Should not throw
    expect(manager).toBeDefined();
  });

  it('should track visible items', () => {
    manager.initialize(mockContainer);

    const element = document.createElement('div');
    manager.observeElement(element, 'test-id');

    // Initially should not be visible
    expect(manager.shouldRender('test-id')).toBe(false);
    expect(manager.getVisibleItems()).not.toContain('test-id');
  });

  it('should handle non-intersecting elements', () => {
    manager.initialize(mockContainer);

    const element = document.createElement('div');
    manager.observeElement(element, 'test-id');

    // Should not be visible initially
    expect(manager.shouldRender('test-id')).toBe(false);
    expect(manager.getVisibleItems()).not.toContain('test-id');
  });

  it('should handle when IntersectionObserver is not supported', () => {
    // Test the case where container is null (which triggers the same code path)
    manager.initialize(null as unknown as HTMLElement);

    // Should not throw and should work without observer
    expect(manager).toBeDefined();

    const element = document.createElement('div');
    manager.observeElement(element, 'test-id');

    // Should not be visible since observer is not available
    expect(manager.shouldRender('test-id')).toBe(false);
  });

  it('should handle intersection observer entries', () => {
    manager.initialize(mockContainer);

    const callback = vi.fn();
    manager.onVisibilityChange(callback);

    const element1 = document.createElement('div');
    const element2 = document.createElement('div');

    manager.observeElement(element1, 'test-id-1');
    manager.observeElement(element2, 'test-id-2');

    // Get the observer instance and trigger callback
    const mockObserver =
      manager.observer as unknown as MockIntersectionObserver;
    expect(mockObserver).toBeDefined();

    // Simulate intersection entries
    const entries = [
      {
        target: element1,
        isIntersecting: true,
      },
      {
        target: element2,
        isIntersecting: false,
      },
    ];

    mockObserver.callback(entries as unknown as IntersectionObserverEntry[]);

    expect(manager.shouldRender('test-id-1')).toBe(true);
    expect(manager.shouldRender('test-id-2')).toBe(false);
    expect(callback).toHaveBeenCalledWith(['test-id-1']);
  });

  it('should handle callback errors gracefully', () => {
    manager.initialize(mockContainer);

    const errorCallback = vi.fn(() => {
      throw new Error('Callback error');
    });
    const normalCallback = vi.fn();

    manager.onVisibilityChange(errorCallback);
    manager.onVisibilityChange(normalCallback);

    const element = document.createElement('div');
    manager.observeElement(element, 'test-id');

    // Get the observer and trigger callback
    const mockObserver =
      manager.observer as unknown as MockIntersectionObserver;
    const entries = [
      {
        target: element,
        isIntersecting: true,
      },
    ];

    // Should not throw even with callback error
    expect(() => {
      mockObserver.callback(entries as unknown as IntersectionObserverEntry[]);
    }).not.toThrow();

    // Normal callback should still be called
    expect(normalCallback).toHaveBeenCalledWith(['test-id']);
  });

  it('should handle elements without data-item-id', () => {
    manager.initialize(mockContainer);

    const callback = vi.fn();
    manager.onVisibilityChange(callback);

    const element = document.createElement('div');
    // Don't set data-item-id attribute
    manager.observeElement(element, 'test-id');
    element.removeAttribute('data-item-id');

    // Get the observer and trigger callback
    const mockObserver =
      manager.observer as unknown as MockIntersectionObserver;
    const entries = [
      {
        target: element,
        isIntersecting: true,
      },
    ];

    mockObserver.callback(entries as unknown as IntersectionObserverEntry[]);

    // Should not be visible since no data-item-id
    expect(manager.shouldRender('test-id')).toBe(false);
    expect(callback).toHaveBeenCalledWith([]);
  });

  it('should handle unobserveElement when observer is null', () => {
    // Don't initialize manager so observer remains null
    const element = document.createElement('div');

    // Should not throw even when observer is null
    expect(() => {
      manager.unobserveElement(element);
    }).not.toThrow();
  });
});

describe('createVirtualScrollManager', () => {
  it('should create VirtualScrollManager instance', () => {
    const manager = createVirtualScrollManager();
    expect(manager).toBeInstanceOf(VirtualScrollManager);
  });

  it('should accept custom config', () => {
    const config = { bufferSize: 5, itemHeight: 150, threshold: 0.2 };
    const manager = createVirtualScrollManager(config);
    expect(manager).toBeInstanceOf(VirtualScrollManager);
  });
});

describe('calculateVisibleRange', () => {
  const mockTexts = Array.from({ length: 100 }, (_, i) => ({
    id: `text-${i.toString()}`,
    content: `Text content ${i.toString()}`,
    type: 'generated' as const,
    position: i,
    paragraphIndex: i + 1,
  }));

  it('should calculate correct visible range', () => {
    const result = calculateVisibleRange(mockTexts, 500, 800, 120, 2);

    expect(result.startIndex).toBeGreaterThanOrEqual(0);
    expect(result.endIndex).toBeLessThan(mockTexts.length);
    expect(result.endIndex).toBeGreaterThan(result.startIndex);
  });

  it('should handle edge cases', () => {
    // Start of list
    const result1 = calculateVisibleRange(mockTexts, 0, 800, 120, 2);
    expect(result1.startIndex).toBe(0);

    // End of list
    const result2 = calculateVisibleRange(mockTexts, 10000, 800, 120, 2);
    expect(result2.endIndex).toBeLessThanOrEqual(mockTexts.length - 1);

    // Empty list
    const result3 = calculateVisibleRange([], 0, 800, 120, 2);
    expect(result3.startIndex).toBe(0);
    expect(result3.endIndex).toBe(-1);
  });
});

describe('isVirtualScrollSupported', () => {
  it('should return true when APIs are available', () => {
    expect(isVirtualScrollSupported()).toBe(true);
  });

  it('should check for required APIs', () => {
    // Test that the function checks for both IntersectionObserver and requestAnimationFrame
    expect(typeof window.IntersectionObserver).toBe('function');
    expect(typeof window.requestAnimationFrame).toBe('function');
    expect(isVirtualScrollSupported()).toBe(true);
  });
});

describe('estimateTextHeight', () => {
  it('should estimate height for short text', () => {
    const height = estimateTextHeight('Short text');
    expect(height).toBeGreaterThanOrEqual(60);
  });

  it('should estimate height for long text', () => {
    const longText = 'a'.repeat(1000);
    const height = estimateTextHeight(longText);
    expect(height).toBeGreaterThan(60);
  });

  it('should handle empty text', () => {
    const height = estimateTextHeight('');
    expect(height).toBeGreaterThanOrEqual(60);
  });
});

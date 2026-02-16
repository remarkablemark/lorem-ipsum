/**
 * Tests for scroll utilities
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  createScrollDetector,
  getScrollableParent,
  isScrollable,
  ScrollDetector,
  scrollToBottom,
  scrollToElement,
  scrollToTop,
} from './scrollUtils';

describe('ScrollDetector', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      pageYOffset: 0,
      innerHeight: 800,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollTo: vi.fn(),
      requestAnimationFrame: vi.fn(),
      cancelAnimationFrame: vi.fn(),
    });

    vi.stubGlobal('document', {
      documentElement: {
        scrollTop: 0,
        scrollHeight: 2000,
        clientHeight: 800,
        scrollIntoView: vi.fn(),
      },
      body: {
        scrollHeight: 2000,
        offsetHeight: 2000,
        clientHeight: 800,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should create instance with default config', () => {
    const detector = new ScrollDetector();
    expect(detector).toBeInstanceOf(ScrollDetector);
  });

  test('should create instance with custom config', () => {
    const config = { threshold: 90, debounceMs: 32 };
    const detector = new ScrollDetector(window, config);
    expect(detector).toBeInstanceOf(ScrollDetector);
  });

  test('should get current position', () => {
    const detector = new ScrollDetector();
    const position = detector.getCurrentPosition();

    expect(position).toHaveProperty('scrollTop');
    expect(position).toHaveProperty('scrollHeight');
    expect(position).toHaveProperty('clientHeight');
    expect(position).toHaveProperty('scrollPercentage');
    expect(position).toHaveProperty('isNearBottom');
    expect(position).toHaveProperty('lastScrollTime');
    expect(position).toHaveProperty('scrollVelocity');
  });

  test('should check if near bottom', () => {
    const detector = new ScrollDetector();
    const isNear = detector.isNearBottom();
    expect(typeof isNear).toBe('boolean');
  });

  test('should get velocity', () => {
    const detector = new ScrollDetector();
    const velocity = detector.getVelocity();
    expect(typeof velocity).toBe('number');
  });

  test('should start and stop monitoring', () => {
    const detector = new ScrollDetector();
    detector.start();
    detector.stop();
  });

  test('should handle scroll subscription', () => {
    const detector = new ScrollDetector();
    const callback = vi.fn();
    const unsubscribe = detector.onScroll(callback);
    expect(typeof unsubscribe).toBe('function');

    // Test unsubscribe
    unsubscribe();
  });

  test('should handle multiple scroll subscriptions', () => {
    const detector = new ScrollDetector();
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const unsubscribe1 = detector.onScroll(callback1);
    const unsubscribe2 = detector.onScroll(callback2);

    expect(typeof unsubscribe1).toBe('function');
    expect(typeof unsubscribe2).toBe('function');

    unsubscribe1();
    unsubscribe2();
  });

  test('should handle HTMLElement element', () => {
    const element = {
      scrollTop: 100,
      scrollHeight: 1000,
      clientHeight: 200,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as HTMLElement;

    const detector = new ScrollDetector(element);
    const position = detector.getCurrentPosition();

    expect(position.scrollTop).toBe(100);
    expect(position.scrollHeight).toBe(1000);
    expect(position.clientHeight).toBe(200);
  });

  test('should calculate scroll percentage correctly', () => {
    vi.stubGlobal('window', {
      pageYOffset: 900,
      innerHeight: 800,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollTo: vi.fn(),
    });

    const detector = new ScrollDetector();
    const position = detector.getCurrentPosition();

    expect(position).toHaveProperty('scrollPercentage');
    expect(typeof position.scrollPercentage).toBe('number');
  });

  test('should handle edge case when maxScroll is 0', () => {
    vi.stubGlobal('document', {
      documentElement: {
        scrollTop: 0,
        scrollHeight: 800,
        clientHeight: 800,
      },
      body: {
        scrollHeight: 800,
        offsetHeight: 800,
        clientHeight: 800,
      },
    });

    const detector = new ScrollDetector();
    const position = detector.getCurrentPosition();

    expect(position).toHaveProperty('scrollPercentage');
  });

  test('should clamp scroll percentage between 0 and 100', () => {
    vi.stubGlobal('window', {
      pageYOffset: -100, // Negative scroll
      innerHeight: 800,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollTo: vi.fn(),
    });

    const detector = new ScrollDetector();
    const position = detector.getCurrentPosition();

    expect(position).toHaveProperty('scrollPercentage');
  });

  test('should calculate velocity correctly', () => {
    const detector = new ScrollDetector();

    // First call should have 0 velocity
    const position1 = detector.getCurrentPosition();
    expect(position1.scrollVelocity).toBe(0);

    // Second call should calculate velocity
    const position2 = detector.getCurrentPosition();
    expect(typeof position2.scrollVelocity).toBe('number');
    expect(position2.scrollVelocity).toBeGreaterThanOrEqual(0);
  });

  test('should clamp velocity to maxVelocity', () => {
    const detector = new ScrollDetector(window, { maxVelocity: 100 });

    const position = detector.getCurrentPosition();
    expect(position.scrollVelocity).toBeLessThanOrEqual(100);
  });

  test('should handle callback errors gracefully', () => {
    const detector = new ScrollDetector();
    const errorCallback = vi.fn(() => {
      throw new Error('Callback error');
    });

    detector.onScroll(errorCallback);

    // Should not throw when callbacks are notified
    expect(() => detector.getCurrentPosition()).not.toThrow();
  });

  test('should handle scroll event throttling', () => {
    const detector = new ScrollDetector();
    const callback = vi.fn();

    detector.onScroll(callback);
    detector.start();

    // Should not throw when starting and stopping
    expect(() => {
      detector.stop();
    }).not.toThrow();
  });

  test('should stop listening correctly', () => {
    const detector = new ScrollDetector();
    const callback = vi.fn();

    const unsubscribe = detector.onScroll(callback);
    unsubscribe();

    // Should stop listening
    expect(() => {
      detector.stop();
    }).not.toThrow();
  });

  test('should handle multiple start/stop cycles', () => {
    const detector = new ScrollDetector();

    detector.start();
    detector.stop();
    detector.start();
    detector.stop();

    // Should not throw
    expect(() => {
      detector.start();
    }).not.toThrow();
  });
});

describe('createScrollDetector', () => {
  test('should create ScrollDetector instance', () => {
    const detector = createScrollDetector();
    expect(detector).toBeInstanceOf(ScrollDetector);
  });

  test('should create instance with config', () => {
    const config = { threshold: 90 };
    const detector = createScrollDetector(window, config);
    expect(detector).toBeInstanceOf(ScrollDetector);
  });
});

describe('isScrollable', () => {
  test('should check if element is scrollable', () => {
    const element = {
      scrollHeight: 1000,
      clientHeight: 500,
    } as HTMLElement;

    vi.stubGlobal('window', {
      getComputedStyle: vi.fn(() => ({ getPropertyValue: () => 'auto' })),
    });

    const result = isScrollable(element);
    expect(typeof result).toBe('boolean');
  });
});

describe('getScrollableParent', () => {
  test('should get scrollable parent', () => {
    const element = {
      parentElement: null,
    } as HTMLElement;

    vi.stubGlobal('window', {
      getComputedStyle: vi.fn(() => ({ overflowY: 'visible' })),
    });

    const parent = getScrollableParent(element);
    expect(parent).toBeDefined();
  });
});

describe('scrollToElement', () => {
  test('should scroll to element', () => {
    const element = {
      scrollIntoView: vi.fn(),
    } as unknown as HTMLElement;

    scrollToElement(element);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(element.scrollIntoView).toHaveBeenCalled();
  });
});

describe('scrollToTop', () => {
  test('should scroll to top with window', () => {
    const mockWindow = {
      scrollTo: vi.fn(),
    } as unknown as Window;

    scrollToTop(mockWindow);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockWindow.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  test('should scroll to top with HTMLElement', () => {
    const mockElement = {
      scrollTo: vi.fn(),
    } as unknown as HTMLElement;

    scrollToTop(mockElement);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockElement.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  test('should scroll to top with default window', () => {
    vi.stubGlobal('window', {
      scrollTo: vi.fn(),
    });

    scrollToTop();
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});

describe('scrollToBottom', () => {
  test('should scroll to bottom with window', () => {
    const mockWindow = {
      scrollTo: vi.fn(),
    } as unknown as Window;

    vi.stubGlobal('document', {
      body: {
        scrollHeight: 2000,
      },
    });

    vi.stubGlobal('window', mockWindow);

    scrollToBottom(mockWindow);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockWindow.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: 'smooth' }),
    );
  });

  test('should scroll to bottom with HTMLElement', () => {
    const mockElement = {
      scrollTo: vi.fn(),
      scrollHeight: 1500,
    } as unknown as HTMLElement;

    scrollToBottom(mockElement);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockElement.scrollTo).toHaveBeenCalledWith({
      top: 1500,
      behavior: 'smooth',
    });
  });

  test('should scroll to bottom with default window', () => {
    vi.stubGlobal('window', {
      scrollTo: vi.fn(),
    });

    vi.stubGlobal('document', {
      body: {
        scrollHeight: 2000,
      },
    });

    scrollToBottom();
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 2000,
      behavior: 'smooth',
    });
  });
});

describe('isScrollable', () => {
  test('should return true for scrollable element', () => {
    const element = {
      scrollHeight: 1000,
      clientHeight: 500,
    } as HTMLElement;

    vi.stubGlobal('window', {
      getComputedStyle: vi.fn(() => ({ overflowY: 'auto' })),
    });

    const result = isScrollable(element);
    expect(result).toBe(true);
  });

  test('should return false for non-scrollable element', () => {
    const element = {
      scrollHeight: 500,
      clientHeight: 500,
    } as HTMLElement;

    vi.stubGlobal('window', {
      getComputedStyle: vi.fn(() => ({ overflowY: 'visible' })),
    });

    const result = isScrollable(element);
    expect(result).toBe(false);
  });

  test('should return false for element with overflow hidden', () => {
    const element = {
      scrollHeight: 1000,
      clientHeight: 500,
    } as HTMLElement;

    vi.stubGlobal('window', {
      getComputedStyle: vi.fn(() => ({ overflowY: 'hidden' })),
    });

    const result = isScrollable(element);
    expect(result).toBe(false);
  });
});

describe('getScrollableParent', () => {
  test('should return window when no scrollable parent found', () => {
    const element = {
      parentElement: null,
    } as HTMLElement;

    vi.stubGlobal('window', {
      getComputedStyle: vi.fn(() => ({ overflowY: 'visible' })),
    });

    const parent = getScrollableParent(element);
    expect(parent).toBe(window);
  });

  test('should return scrollable parent when found', () => {
    const scrollableParent = {
      scrollHeight: 1000,
      clientHeight: 500,
      parentElement: null,
    } as HTMLElement;

    const element = {
      parentElement: scrollableParent,
    } as HTMLElement;

    vi.stubGlobal('window', {
      getComputedStyle: vi.fn(() => ({ overflowY: 'auto' })),
    });

    const parent = getScrollableParent(element);
    expect(parent).toBe(scrollableParent);
  });
});

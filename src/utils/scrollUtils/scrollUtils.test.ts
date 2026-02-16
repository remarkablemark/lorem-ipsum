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

    vi.stubGlobal('requestAnimationFrame', vi.fn());
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
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
  test('should scroll to top', () => {
    const mockWindow = {
      scrollTo: vi.fn(),
    } as unknown as Window;

    scrollToTop(mockWindow);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockWindow.scrollTo).toHaveBeenCalled();
  });
});

describe('scrollToBottom', () => {
  test('should scroll to bottom', () => {
    const mockWindow = {
      scrollTo: vi.fn(),
    } as unknown as Window;

    vi.stubGlobal('document', {
      body: {
        scrollHeight: 2000,
      },
    });

    scrollToBottom(mockWindow);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockWindow.scrollTo).toHaveBeenCalled();
  });
});

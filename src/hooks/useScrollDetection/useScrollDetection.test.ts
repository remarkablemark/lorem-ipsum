/**
 * Tests for useScrollDetection hook
 */

import { act, renderHook } from '@testing-library/react';

import type { ScrollPosition } from '../../types/scroll.types';
import {
  createScrollDetector,
  type ScrollDetector,
} from '../../utils/scrollUtils/scrollUtils';
import { useScrollDetection } from './useScrollDetection';

// Mock window methods
const mockScrollTo = vi.fn();

Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

Object.defineProperty(document.body, 'scrollHeight', {
  value: 2000,
  writable: true,
});

// Mock scrollUtils
vi.mock('../../utils/scrollUtils/scrollUtils', () => ({
  createScrollDetector: vi.fn(() => ({
    onScroll: vi.fn(() => vi.fn()),
    start: vi.fn(),
    stop: vi.fn(),
  })),
}));

const mockCreateScrollDetector = vi.mocked(createScrollDetector);

describe('useScrollDetection', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
    vi.clearAllMocks();
  });

  it('should return initial scroll position', () => {
    const { result } = renderHook(() => useScrollDetection());

    expect(result.current.position.scrollTop).toBe(0);
    expect(result.current.position.scrollHeight).toBe(1000);
    expect(result.current.position.clientHeight).toBe(800);
    expect(result.current.position.scrollPercentage).toBe(0);
    expect(result.current.position.isNearBottom).toBe(false);
    expect(result.current.isNearBottom).toBe(false);
    expect(result.current.velocity).toBe(0);
  });

  it('should accept custom element parameter', () => {
    const mockElement = document.createElement('div');
    const { result } = renderHook(() => useScrollDetection(mockElement));

    expect(result.current.position.scrollTop).toBe(0);
  });

  it('should accept custom config parameter', () => {
    const customConfig = {
      threshold: 90,
      debounceMs: 32,
      maxVelocity: 5000,
    };
    const { result } = renderHook(() =>
      useScrollDetection(undefined, customConfig),
    );

    expect(result.current.position.scrollTop).toBe(0);
  });

  it('should accept both custom element and config parameters', () => {
    const mockElement = document.createElement('div');
    const customConfig = {
      threshold: 95,
      debounceMs: 8,
      maxVelocity: 15000,
    };
    const { result } = renderHook(() =>
      useScrollDetection(mockElement, customConfig),
    );

    expect(result.current.position.scrollTop).toBe(0);
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useScrollDetection());

    const mockDetector = mockCreateScrollDetector.mock.results[0]
      ?.value as unknown as ScrollDetector;
    const mockStop = vi.fn();
    mockDetector.stop = mockStop;

    unmount();

    expect(mockStop).toHaveBeenCalled();
  });

  it('should update position when scroll event occurs', () => {
    let scrollCallback: ((position: ScrollPosition) => void) | undefined;

    mockCreateScrollDetector.mockReturnValue({
      element: window,
      config: { threshold: 85, debounceMs: 16, maxVelocity: 10000 },
      callbacks: new Set(),
      lastScrollTop: 0,
      lastScrollTime: 0,
      rafId: null,
      isListening: false,
      onScroll: vi.fn((callback: (position: ScrollPosition) => void) => {
        scrollCallback = callback;
        return vi.fn();
      }),
      start: vi.fn(),
      stop: vi.fn(),
      getCurrentPosition: vi.fn(),
      isNearBottom: vi.fn(),
      getVelocity: vi.fn(),
    } as unknown as ScrollDetector);

    const { result } = renderHook(() => useScrollDetection());

    const newPosition = {
      scrollTop: 100,
      scrollHeight: 1000,
      clientHeight: 800,
      scrollPercentage: 10,
      isNearBottom: false,
      lastScrollTime: Date.now(),
      scrollVelocity: 5,
    };

    act(() => {
      scrollCallback?.(newPosition);
    });

    expect(result.current.position).toEqual(newPosition);
  });

  // Edge case tests
  it('should handle extreme scroll values', () => {
    let scrollCallback: ((position: ScrollPosition) => void) | undefined;

    mockCreateScrollDetector.mockReturnValue({
      element: window,
      config: { threshold: 85, debounceMs: 16, maxVelocity: 10000 },
      callbacks: new Set(),
      lastScrollTop: 0,
      lastScrollTime: 0,
      rafId: null,
      isListening: false,
      onScroll: vi.fn((callback: (position: ScrollPosition) => void) => {
        scrollCallback = callback;
        return vi.fn();
      }),
      start: vi.fn(),
      stop: vi.fn(),
      getCurrentPosition: vi.fn(),
      isNearBottom: vi.fn(),
      getVelocity: vi.fn(),
    } as unknown as ScrollDetector);

    const { result } = renderHook(() => useScrollDetection());

    const extremePosition = {
      scrollTop: Number.MAX_SAFE_INTEGER,
      scrollHeight: Number.MAX_SAFE_INTEGER,
      clientHeight: 0,
      scrollPercentage: 100,
      isNearBottom: true,
      lastScrollTime: Date.now(),
      scrollVelocity: Number.MAX_SAFE_INTEGER,
    };

    act(() => {
      scrollCallback?.(extremePosition);
    });

    expect(result.current.position).toEqual(extremePosition);
  });

  it('should handle negative scroll values', () => {
    let scrollCallback: ((position: ScrollPosition) => void) | undefined;

    mockCreateScrollDetector.mockReturnValue({
      element: window,
      config: { threshold: 85, debounceMs: 16, maxVelocity: 10000 },
      callbacks: new Set(),
      lastScrollTop: 0,
      lastScrollTime: 0,
      rafId: null,
      isListening: false,
      onScroll: vi.fn((callback: (position: ScrollPosition) => void) => {
        scrollCallback = callback;
        return vi.fn();
      }),
      start: vi.fn(),
      stop: vi.fn(),
      getCurrentPosition: vi.fn(),
      isNearBottom: vi.fn(),
      getVelocity: vi.fn(),
    } as unknown as ScrollDetector);

    const { result } = renderHook(() => useScrollDetection());

    const negativePosition = {
      scrollTop: -100,
      scrollHeight: 1000,
      clientHeight: 800,
      scrollPercentage: -10,
      isNearBottom: false,
      lastScrollTime: Date.now(),
      scrollVelocity: -5,
    };

    act(() => {
      scrollCallback?.(negativePosition);
    });

    expect(result.current.position).toEqual(negativePosition);
  });

  it('should handle rapid scroll events', () => {
    let scrollCallback: ((position: ScrollPosition) => void) | undefined;

    mockCreateScrollDetector.mockReturnValue({
      element: window,
      config: { threshold: 85, debounceMs: 16, maxVelocity: 10000 },
      callbacks: new Set(),
      lastScrollTop: 0,
      lastScrollTime: 0,
      rafId: null,
      isListening: false,
      onScroll: vi.fn((callback: (position: ScrollPosition) => void) => {
        scrollCallback = callback;
        return vi.fn();
      }),
      start: vi.fn(),
      stop: vi.fn(),
      getCurrentPosition: vi.fn(),
      isNearBottom: vi.fn(),
      getVelocity: vi.fn(),
    } as unknown as ScrollDetector);

    const { result } = renderHook(() => useScrollDetection());

    // Simulate rapid scroll events
    for (let i = 0; i < 100; i++) {
      const position = {
        scrollTop: i * 10,
        scrollHeight: 1000,
        clientHeight: 800,
        scrollPercentage: (i * 10) / 10,
        isNearBottom: i > 85,
        lastScrollTime: Date.now(),
        scrollVelocity: i * 5,
      };

      act(() => {
        scrollCallback?.(position);
      });
    }

    // Should handle rapid events without crashing
    expect(result.current.position.scrollTop).toBe(990);
  });

  it('should handle null element gracefully', () => {
    const { result } = renderHook(() =>
      useScrollDetection(null as unknown as HTMLElement | Window | undefined),
    );

    expect(result.current.position.scrollTop).toBe(0);
  });

  it('should handle undefined config gracefully', () => {
    const { result } = renderHook(() =>
      useScrollDetection(undefined, undefined),
    );

    expect(result.current.position.scrollTop).toBe(0);
  });
});

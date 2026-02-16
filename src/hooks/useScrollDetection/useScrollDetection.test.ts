/**
 * Tests for useScrollDetection hook
 */

import { renderHook } from '@testing-library/react';

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

describe('useScrollDetection', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
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

  it('should have scrollToTop function', () => {
    const { result } = renderHook(() => useScrollDetection());

    expect(typeof result.current.scrollToTop).toBe('function');

    result.current.scrollToTop();

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('should have scrollToBottom function', () => {
    const { result } = renderHook(() => useScrollDetection());

    expect(typeof result.current.scrollToBottom).toBe('function');

    result.current.scrollToBottom();

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 2000,
      behavior: 'smooth',
    });
  });
});

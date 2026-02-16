/**
 * Tests for usePerformance hook
 */

import { renderHook } from '@testing-library/react';

import { usePerformance } from './usePerformance';

describe('usePerformance', () => {
  it('should return initial performance metrics', () => {
    const { result } = renderHook(() => usePerformance());

    expect(result.current.metrics.fps).toBe(60);
    expect(result.current.metrics.renderTime).toBe(16);
    expect(result.current.metrics.textGenerationTime).toBe(5);
    expect(result.current.metrics.memoryUsage).toBe(25);
    expect(result.current.metrics.scrollEventCount).toBe(0);
    expect(result.current.isPerformant).toBe(true);
  });

  it('should have cleanup function', () => {
    const { result } = renderHook(() => usePerformance());

    expect(typeof result.current.cleanup).toBe('function');

    // Should not throw when called
    expect(() => {
      result.current.cleanup();
    }).not.toThrow();
  });

  it('should determine performance status correctly', () => {
    const { result } = renderHook(() => usePerformance());

    // With mock metrics, should be performant
    expect(result.current.isPerformant).toBe(true);
  });
});

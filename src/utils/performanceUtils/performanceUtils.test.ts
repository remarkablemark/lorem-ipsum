/**
 * Tests for performance monitoring utilities
 */

import { describe, expect, test, vi } from 'vitest';

import {
  createPerformanceMonitor,
  debounce,
  isMemoryAPISupported,
  isPerformanceAPISupported,
  PerformanceMonitor,
  throttleByFPS,
} from './performanceUtils';

describe('PerformanceMonitor', () => {
  test('should create instance with default config', () => {
    const monitor = new PerformanceMonitor();
    expect(monitor).toBeInstanceOf(PerformanceMonitor);
  });

  test('should cleanup', () => {
    const monitor = new PerformanceMonitor();
    monitor.cleanup();
  });
});

describe('createPerformanceMonitor', () => {
  test('should create PerformanceMonitor instance', () => {
    const monitor = createPerformanceMonitor();
    expect(monitor).toBeInstanceOf(PerformanceMonitor);
  });
});

describe('throttleByFPS', () => {
  test('should create throttled function', () => {
    const fn = vi.fn();
    const throttledFn = throttleByFPS(fn, 60);
    expect(typeof throttledFn).toBe('function');
  });
});

describe('debounce', () => {
  test('should create debounced function', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);
    expect(typeof debouncedFn).toBe('function');
  });
});

describe('isPerformanceAPISupported', () => {
  test('should return boolean', () => {
    const result = isPerformanceAPISupported();
    expect(typeof result).toBe('boolean');
  });
});

describe('isMemoryAPISupported', () => {
  test('should return boolean', () => {
    const result = isMemoryAPISupported();
    expect(typeof result).toBe('boolean');
  });
});

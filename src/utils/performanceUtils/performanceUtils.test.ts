/**
 * Tests for performance monitoring utilities
 */

import {
  createPerformanceMonitor,
  debounce,
  isMemoryAPISupported,
  isPerformanceAPISupported,
  PerformanceMonitor,
  throttleByFPS,
} from './performanceUtils';

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('performance', {
      now: vi.fn(() => Date.now()),
      memory: {
        usedJSHeapSize: 50000000,
        totalJSHeapSize: 100000000,
        jsHeapSizeLimit: 200000000,
      },
    });

    vi.stubGlobal('window', {
      setInterval: vi.fn(),
      clearInterval: vi.fn(),
      requestAnimationFrame: vi.fn(),
      setTimeout: vi.fn(),
      clearTimeout: vi.fn(),
    });

    vi.stubGlobal('document', {
      querySelectorAll: vi.fn(() => []),
      documentElement: {
        textContent: 'test content',
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should create instance with default config', () => {
    const monitor = new PerformanceMonitor();
    expect(monitor).toBeInstanceOf(PerformanceMonitor);
  });

  it('should create instance with custom config', () => {
    const config = { targetFPS: 30, maxMemoryMB: 50, cleanupInterval: 15000 };
    const monitor = new PerformanceMonitor(config);
    expect(monitor).toBeInstanceOf(PerformanceMonitor);
  });

  it('should get current metrics', () => {
    const monitor = new PerformanceMonitor();
    const metrics = monitor.getMetrics();

    expect(metrics).toHaveProperty('fps');
    expect(metrics).toHaveProperty('renderTime');
    expect(metrics).toHaveProperty('textGenerationTime');
    expect(metrics).toHaveProperty('memoryUsage');
    expect(metrics).toHaveProperty('scrollEventCount');
    expect(metrics).toHaveProperty('lastCleanupTime');
    expect(typeof metrics.fps).toBe('number');
    expect(typeof metrics.renderTime).toBe('number');
    expect(typeof metrics.textGenerationTime).toBe('number');
    expect(typeof metrics.memoryUsage).toBe('number');
    expect(typeof metrics.scrollEventCount).toBe('number');
    expect(typeof metrics.lastCleanupTime).toBe('number');
  });

  it('should subscribe to metrics updates', () => {
    const monitor = new PerformanceMonitor();
    const callback = vi.fn();
    const unsubscribe = monitor.onMetricsUpdate(callback);

    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });

  it('should handle multiple subscribers', () => {
    const monitor = new PerformanceMonitor();
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const unsubscribe1 = monitor.onMetricsUpdate(callback1);
    const unsubscribe2 = monitor.onMetricsUpdate(callback2);

    unsubscribe1();
    unsubscribe2();
  });

  it('should check performance status', () => {
    const monitor = new PerformanceMonitor();
    const isPerformant = monitor.isPerformant();
    expect(typeof isPerformant).toBe('boolean');
  });

  it('should record scroll events', () => {
    const monitor = new PerformanceMonitor();
    const initialCount = monitor.getMetrics().scrollEventCount;
    monitor.recordScrollEvent();
    const newCount = monitor.getMetrics().scrollEventCount;
    expect(newCount).toBe(initialCount + 1);
  });

  it('should record text generation time', () => {
    const monitor = new PerformanceMonitor();
    const duration = 150;
    monitor.recordTextGenerationTime(duration);
    const metrics = monitor.getMetrics();
    expect(metrics.textGenerationTime).toBe(duration);
  });

  it('should cleanup manually', () => {
    const monitor = new PerformanceMonitor();
    const initialCleanupTime = monitor.getMetrics().lastCleanupTime;

    // Wait a bit to ensure different timestamp
    vi.advanceTimersByTime(100);
    monitor.cleanup();

    const newCleanupTime = monitor.getMetrics().lastCleanupTime;
    expect(newCleanupTime).toBeGreaterThan(initialCleanupTime);
  });

  it('should handle callback errors gracefully', () => {
    const monitor = new PerformanceMonitor();
    const errorCallback = vi.fn(() => {
      throw new Error('Callback error');
    });
    const normalCallback = vi.fn();

    monitor.onMetricsUpdate(errorCallback);
    monitor.onMetricsUpdate(normalCallback);

    // Should not throw despite callback error
    expect(() => {
      monitor.cleanup();
    }).not.toThrow();
  });

  it('should estimate memory usage without performance.memory API', () => {
    vi.stubGlobal('performance', {
      now: vi.fn(() => Date.now()),
    });

    const monitor = new PerformanceMonitor();
    const metrics = monitor.getMetrics();
    expect(typeof metrics.memoryUsage).toBe('number');
    expect(metrics.memoryUsage).toBeGreaterThanOrEqual(0);
  });

  it('should use performance.memory API when available', () => {
    vi.stubGlobal('performance', {
      now: vi.fn(() => Date.now()),
      memory: {
        usedJSHeapSize: 100000000,
        totalJSHeapSize: 200000000,
        jsHeapSizeLimit: 400000000,
      },
    });

    const monitor = new PerformanceMonitor();
    const metrics = monitor.getMetrics();
    expect(metrics.memoryUsage).toBe(Math.round(100000000 / 1048576)); // ~95MB
  });
});

describe('createPerformanceMonitor', () => {
  it('should create PerformanceMonitor instance', () => {
    const monitor = createPerformanceMonitor();
    expect(monitor).toBeInstanceOf(PerformanceMonitor);
  });
});

describe('throttleByFPS', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('performance', {
      now: vi.fn(() => Date.now()),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should create throttled function', () => {
    const fn = vi.fn();
    const throttledFn = throttleByFPS(fn, 60);
    expect(typeof throttledFn).toBe('function');
  });

  it('should throttle function calls', () => {
    const fn = vi.fn();
    const throttledFn = throttleByFPS(fn, 60);

    // First call should execute
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);

    // Immediate second call should be throttled
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);

    // Simulate time passing
    vi.advanceTimersByTime(20);
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should use default FPS when not specified', () => {
    const fn = vi.fn();
    const throttledFn = throttleByFPS(fn);
    expect(typeof throttledFn).toBe('function');
  });
});

describe('debounce', () => {
  it('should create debounced function', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);
    expect(typeof debouncedFn).toBe('function');
  });

  it('should return function that can be called', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    // Should not throw when called
    expect(() => {
      debouncedFn();
    }).not.toThrow();
  });
});

describe('isPerformanceAPISupported', () => {
  it('should return boolean', () => {
    const result = isPerformanceAPISupported();
    expect(typeof result).toBe('boolean');
  });
});

describe('isMemoryAPISupported', () => {
  it('should return boolean', () => {
    const result = isMemoryAPISupported();
    expect(typeof result).toBe('boolean');
  });
});

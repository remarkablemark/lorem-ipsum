/**
 * Performance monitoring utilities
 * Provides FPS monitoring, memory usage tracking, and cleanup functions
 */

import type {
  PerformanceConfig,
  PerformanceMetrics,
} from '../../types/performance.types';

/**
 * Default performance configuration
 */
const DEFAULT_CONFIG: PerformanceConfig = {
  targetFPS: 60,
  maxMemoryMB: 100,
  cleanupInterval: 30000, // 30 seconds
};

/**
 * Performance monitor class implementing performance tracking
 */
export class PerformanceMonitor {
  private config: PerformanceConfig;
  private callbacks = new Set<(metrics: PerformanceMetrics) => void>();
  private metrics: PerformanceMetrics;
  private frameCount = 0;
  private lastFrameTime = 0;
  private fpsUpdateInterval = 1000; // Update FPS every second
  private lastFPSUpdate = 0;
  private cleanupTimer: number | null = null;
  private isMonitoring = false;

  constructor(config?: Partial<PerformanceConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.metrics = this.initializeMetrics();
    this.lastFrameTime = performance.now();
    this.lastFPSUpdate = this.lastFrameTime;
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Subscribe to performance updates
   */
  onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.add(callback);
    this.startMonitoring();

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
      if (this.callbacks.size === 0) {
        this.stopMonitoring();
      }
    };
  }

  /**
   * Check if performance is acceptable
   */
  isPerformant(): boolean {
    return (
      this.metrics.fps >= this.config.targetFPS &&
      this.metrics.memoryUsage <= this.config.maxMemoryMB
    );
  }

  /**
   * Force cleanup
   */
  cleanup(): void {
    this.performCleanup();
  }

  /**
   * Start performance monitoring
   */
  private startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.startFrameMonitoring();
    this.startCleanupTimer();
  }

  /**
   * Stop performance monitoring
   */
  private stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    this.stopFrameMonitoring();
    this.stopCleanupTimer();
  }

  /**
   * Initialize metrics with default values
   */
  private initializeMetrics(): PerformanceMetrics {
    return {
      fps: 60,
      renderTime: 0,
      textGenerationTime: 0,
      memoryUsage: this.estimateMemoryUsage(),
      scrollEventCount: 0,
      lastCleanupTime: Date.now(),
    };
  }

  /**
   * Start frame monitoring for FPS calculation
   */
  private startFrameMonitoring(): void {
    const measureFrame = (currentTime: number) => {
      if (!this.isMonitoring) {
        return;
      }

      this.frameCount++;
      const deltaTime = currentTime - this.lastFrameTime;
      this.metrics.renderTime = deltaTime;

      // Update FPS every second
      if (currentTime - this.lastFPSUpdate >= this.fpsUpdateInterval) {
        this.metrics.fps = Math.round(
          (this.frameCount * 1000) / (currentTime - this.lastFPSUpdate),
        );
        this.frameCount = 0;
        this.lastFPSUpdate = currentTime;
        this.updateMemoryUsage();
        this.notifyCallbacks();
      }

      this.lastFrameTime = currentTime;
      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  }

  /**
   * Stop frame monitoring
   */
  private stopFrameMonitoring(): void {
    // Frame monitoring stops automatically when isMonitoring is false
  }

  /**
   * Start cleanup timer
   */
  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      return;
    }

    this.cleanupTimer = window.setInterval(() => {
      this.performCleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Stop cleanup timer
   */
  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Perform cleanup operations
   */
  private performCleanup(): void {
    this.updateMemoryUsage();
    this.metrics.lastCleanupTime = Date.now();
    this.notifyCallbacks();
  }

  /**
   * Update memory usage estimation
   */
  private updateMemoryUsage(): void {
    this.metrics.memoryUsage = this.estimateMemoryUsage();
  }

  /**
   * Estimate memory usage in MB
   */
  private estimateMemoryUsage(): number {
    // Use performance.memory if available (Chrome)
    if ('memory' in performance) {
      const memory = performance.memory as {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
      return Math.round(memory.usedJSHeapSize / 1048576); // Convert to MB
    }

    // Fallback estimation based on rough heuristics
    // This is a very rough estimate and not very accurate
    const estimatedBytes = this.estimateMemoryFromDOM();
    return Math.round(estimatedBytes / 1048576); // Convert to MB
  }

  /**
   * Estimate memory usage from DOM size (rough approximation)
   */
  private estimateMemoryFromDOM(): number {
    const textNodes = document.querySelectorAll('*').length;
    const textContent = document.documentElement.textContent.length;

    // Rough estimation: each node ~100 bytes, each character ~2 bytes
    const nodeMemory = textNodes * 100;
    const textMemory = textContent * 2;

    return nodeMemory + textMemory;
  }

  /**
   * Notify all callbacks of metrics update
   */
  private notifyCallbacks(): void {
    this.callbacks.forEach((callback) => {
      try {
        callback(this.metrics);
      } catch {
        // Silently handle callback errors to avoid breaking performance monitoring
      }
    });
  }

  /**
   * Record scroll event for metrics
   */
  recordScrollEvent(): void {
    this.metrics.scrollEventCount++;
  }

  /**
   * Record text generation time
   */
  recordTextGenerationTime(duration: number): void {
    this.metrics.textGenerationTime = duration;
  }
}

/**
 * Create a performance monitor instance with default configuration
 */
export function createPerformanceMonitor(
  config?: Partial<PerformanceConfig>,
): PerformanceMonitor {
  return new PerformanceMonitor(config);
}

/**
 * Utility function to measure FPS
 */
export function measureFPS(): Promise<number> {
  let frameCount = 0;
  const startTime = performance.now();

  return new Promise((resolve) => {
    const measureFrame = (currentTime: number) => {
      frameCount++;

      if (currentTime - startTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - startTime));
        resolve(fps);
        return;
      }

      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  });
}

/**
 * Utility function to measure render time
 */
export function measureRenderTime(): Promise<number> {
  const startTime = performance.now();

  return new Promise((resolve) => {
    requestAnimationFrame((endTime) => {
      resolve(endTime - startTime);
    });
  });
}

/**
 * Utility function to throttle function calls based on FPS
 */
export function throttleByFPS<T extends (...args: never[]) => unknown>(
  fn: T,
  targetFPS = 60,
): T {
  const interval = 1000 / targetFPS;
  let lastCall = 0;

  return ((...args: Parameters<T>) => {
    const now = performance.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      return fn(...args);
    }
  }) as T;
}

/**
 * Utility function to debounce function calls
 */
export function debounce<T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Utility function to check if performance API is available
 */
export function isPerformanceAPISupported(): boolean {
  return 'performance' in window && 'now' in performance;
}

/**
 * Utility function to check if memory API is available
 */
export function isMemoryAPISupported(): boolean {
  return (
    'memory' in performance &&
    !!(performance.memory as { usedJSHeapSize?: number }).usedJSHeapSize
  );
}

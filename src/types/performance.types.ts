/**
 * Performance-related type definitions
 */

/**
 * Monitors real-time performance for optimization
 */
export interface PerformanceMetrics {
  /** Current frames per second */
  fps: number;
  /** Last render time in milliseconds */
  renderTime: number;
  /** Time to generate text chunks */
  textGenerationTime: number;
  /** Estimated memory usage in MB */
  memoryUsage: number;
  /** Total scroll events processed */
  scrollEventCount: number;
  /** Last time memory cleanup ran */
  lastCleanupTime: number;
}

/**
 * Performance monitoring configuration
 */
export interface PerformanceConfig {
  /** Target frames per second */
  targetFPS: number;
  /** Maximum memory usage in MB */
  maxMemoryMB: number;
  /** Cleanup interval in milliseconds */
  cleanupInterval: number;
}

/**
 * Performance monitoring API interface
 */
export interface PerformanceAPI {
  /** Get current performance metrics */
  getMetrics(): PerformanceMetrics;
  /** Subscribe to performance updates */
  onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void): () => void;
  /** Check if performance is acceptable */
  isPerformant(): boolean;
  /** Force cleanup */
  cleanup(): void;
}

/**
 * Performance event data structure
 */
export interface PerformanceEvent {
  /** Event type */
  type: 'metrics-update' | 'cleanup' | 'warning';
  /** Current performance metrics */
  metrics?: PerformanceMetrics;
  /** Warning message if applicable */
  warning?: string;
  /** Event timestamp */
  timestamp: number;
}

/**
 * Mock performance hook for testing
 */

import type { PerformanceMetrics } from '../../types/performance.types';

/**
 * Mock performance metrics
 */
const mockPerformanceMetrics: PerformanceMetrics = {
  fps: 60,
  renderTime: 16,
  textGenerationTime: 5,
  memoryUsage: 25,
  scrollEventCount: 0,
  lastCleanupTime: Date.now(),
};

/**
 * Hook return type
 */
interface UsePerformanceReturn {
  /** Current performance metrics */
  metrics: PerformanceMetrics;
  /** Whether performance is acceptable */
  isPerformant: boolean;
  /** Force cleanup of performance data */
  cleanup: () => void;
}

/**
 * Mock performance hook
 */
// eslint-disable-next-line react-x/no-unnecessary-use-prefix
export function usePerformance(): UsePerformanceReturn {
  const isPerformant =
    mockPerformanceMetrics.fps >= 30 &&
    mockPerformanceMetrics.memoryUsage < 100;

  const cleanup = () => {
    // Mock cleanup
  };

  return {
    metrics: mockPerformanceMetrics,
    isPerformant,
    cleanup,
  };
}

/**
 * Custom hook for scroll detection
 */

import { useEffect, useRef, useState } from 'react';

import type {
  ScrollDetectionConfig,
  ScrollPosition,
} from '../../types/scroll.types';
import { createScrollDetector } from '../../utils/scrollUtils/scrollUtils';

/**
 * Default configuration for scroll detection
 */
const DEFAULT_CONFIG: ScrollDetectionConfig = {
  threshold: 85,
  debounceMs: 16, // ~60fps
  maxVelocity: 10000,
};

/**
 * Hook return type
 */
interface UseScrollDetectionReturn {
  /** Current scroll position */
  position: ScrollPosition;
  /** Whether user is near bottom of scrollable area */
  isNearBottom: boolean;
  /** Current scroll velocity */
  velocity: number;
}

/**
 * Custom hook for scroll detection
 */
export function useScrollDetection(
  element?: HTMLElement | Window,
  config?: Partial<ScrollDetectionConfig>,
): UseScrollDetectionReturn {
  const scrollConfig = { ...DEFAULT_CONFIG, ...config };
  const [position, setPosition] = useState<ScrollPosition>(() => ({
    scrollTop: 0,
    scrollHeight: 1000,
    clientHeight: 800,
    scrollPercentage: 0,
    isNearBottom: false,
    lastScrollTime: Date.now(),
    scrollVelocity: 0,
  }));

  const detectorRef = useRef(createScrollDetector(element, scrollConfig));

  const isNearBottom = position.isNearBottom;
  const velocity = position.scrollVelocity;

  useEffect(() => {
    const detector = detectorRef.current;

    // Subscribe to scroll events
    const unsubscribe = detector.onScroll((newPosition) => {
      setPosition((prevPosition) => ({ ...prevPosition, ...newPosition }));
    });

    // Start detection
    detector.start();

    // Cleanup on unmount
    return () => {
      unsubscribe();
      detector.stop();
    };
  }, []);

  return {
    position,
    isNearBottom,
    velocity,
  };
}

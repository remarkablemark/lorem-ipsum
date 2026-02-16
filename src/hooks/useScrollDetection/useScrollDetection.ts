/**
 * Mock scroll detection hook for testing
 */

import type { ScrollPosition } from '../../types/scroll.types';

/**
 * Mock scroll position
 */
const mockScrollPosition: ScrollPosition = {
  scrollTop: 0,
  scrollHeight: 1000,
  clientHeight: 800,
  scrollPercentage: 0,
  isNearBottom: false,
  lastScrollTime: Date.now(),
  scrollVelocity: 0,
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
  /** Scroll to top */
  scrollToTop: () => void;
  /** Scroll to bottom */
  scrollToBottom: () => void;
}

/**
 * Mock scroll detection hook
 */
// eslint-disable-next-line react-x/no-unnecessary-use-prefix
export function useScrollDetection(): UseScrollDetectionReturn {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return {
    position: mockScrollPosition,
    isNearBottom: false,
    velocity: 0,
    scrollToTop,
    scrollToBottom,
  };
}

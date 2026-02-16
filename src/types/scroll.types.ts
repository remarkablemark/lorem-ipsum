/**
 * Scroll-related type definitions
 */

/**
 * Tracks the user's current scroll state and proximity to content boundaries
 */
export interface ScrollPosition {
  /** Current scroll position from top */
  scrollTop: number;
  /** Total scrollable height */
  scrollHeight: number;
  /** Visible viewport height */
  clientHeight: number;
  /** Percentage scrolled (0-100) */
  scrollPercentage: number;
  /** True when within 10% of bottom */
  isNearBottom: boolean;
  /** Timestamp of last scroll event */
  lastScrollTime: number;
  /** Pixels per second */
  scrollVelocity: number;
}

/**
 * Scroll position state transitions
 */
export type ScrollState =
  | { type: 'idle' } // No scrolling activity
  | { type: 'scrolling'; velocity: number } // Active scrolling
  | { type: 'near-bottom'; threshold: number } // Approaching content end
  | { type: 'generating'; chunkSize: number }; // Triggering text generation

/**
 * Scroll event data structure
 */
export interface ScrollEvent {
  /** Event type */
  type: 'scroll';
  /** Current scroll position */
  position: ScrollPosition;
  /** Event timestamp */
  timestamp: number;
  /** Source of the scroll event */
  source: 'wheel' | 'touch' | 'keyboard' | 'programmatic';
}

/**
 * Scroll detection configuration
 */
export interface ScrollDetectionConfig {
  /** Percentage from bottom to trigger generation */
  threshold: number;
  /** Debounce delay for scroll events in milliseconds */
  debounceMs: number;
  /** Maximum scroll velocity to handle (pixels per second) */
  maxVelocity: number;
}

/**
 * Scroll detection API interface
 */
export interface ScrollDetectionAPI {
  /** Get current scroll position */
  getCurrentPosition(): ScrollPosition;
  /** Subscribe to scroll events */
  onScroll(callback: (position: ScrollPosition) => void): () => void;
  /** Check if user is near bottom */
  isNearBottom(threshold?: number): boolean;
  /** Get scroll velocity */
  getVelocity(): number;
  /** Start/stop monitoring */
  start(): void;
  stop(): void;
}

/**
 * Scroll utilities for detecting scroll position and velocity
 * Provides throttled scroll event handling and position tracking
 */

import { APP_CONFIG } from '../../constants/config';
import type {
  ScrollDetectionConfig,
  ScrollPosition,
} from '../../types/scroll.types';

/**
 * Scroll detector class implementing scroll position tracking
 */
export class ScrollDetector {
  private element: HTMLElement | Window;
  private config: ScrollDetectionConfig;
  private callbacks = new Set<(position: ScrollPosition) => void>();
  private lastScrollTop = 0;
  private lastScrollTime = 0;
  private rafId: number | null = null;
  private isListening = false;

  constructor(
    element: HTMLElement | Window = window,
    config?: Partial<ScrollDetectionConfig>,
  ) {
    this.element = element;
    this.config = { ...APP_CONFIG.scroll, ...config };
  }

  /**
   * Get current scroll position
   */
  getCurrentPosition(): ScrollPosition {
    const scrollTop = this.getScrollTop();
    const scrollHeight = this.getScrollHeight();
    const clientHeight = this.getClientHeight();
    const scrollPercentage = this.calculateScrollPercentage(
      scrollTop,
      scrollHeight,
      clientHeight,
    );
    const isNearBottom = this.checkNearBottom(scrollPercentage);
    const now = Date.now();
    const scrollVelocity = this.calculateVelocity(scrollTop, now);

    return {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollPercentage,
      isNearBottom,
      lastScrollTime: now,
      scrollVelocity,
    };
  }

  /**
   * Subscribe to scroll events
   */
  onScroll(callback: (_position: ScrollPosition) => void): () => void {
    this.callbacks.add(callback);
    this.startListening();

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
      if (this.callbacks.size === 0) {
        this.stopListening();
      }
    };
  }

  /**
   * Check if user is near bottom
   */
  isNearBottom(threshold?: number): boolean {
    const position = this.getCurrentPosition();
    const checkThreshold = threshold ?? this.config.threshold;
    return position.scrollPercentage >= checkThreshold;
  }

  /**
   * Get scroll velocity
   */
  getVelocity(): number {
    const now = Date.now();
    const scrollTop = this.getScrollTop();
    return this.calculateVelocity(scrollTop, now);
  }

  /**
   * Start monitoring scroll events
   */
  start(): void {
    this.startListening();
  }

  /**
   * Stop monitoring scroll events
   */
  stop(): void {
    this.stopListening();
  }

  /**
   * Start listening to scroll events
   */
  private startListening(): void {
    if (this.isListening) {
      return;
    }

    this.isListening = true;
    this.element.addEventListener('scroll', this.handleScroll, {
      passive: true,
    });
  }

  /**
   * Stop listening to scroll events
   */
  private stopListening(): void {
    if (!this.isListening) {
      return;
    }

    this.isListening = false;
    this.element.removeEventListener('scroll', this.handleScroll);

    /* v8 ignore next -- @preserve */
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Handle scroll events with throttling
   */
  /* v8 ignore start */
  private handleScroll = (): void => {
    if (this.rafId) {
      return; // Already throttled
    }

    this.rafId = requestAnimationFrame(() => {
      const position = this.getCurrentPosition();
      this.notifyCallbacks(position);
      this.rafId = null;
    });
  };
  /* v8 ignore end */

  /**
   * Notify all callbacks of scroll position change
   */
  private notifyCallbacks(_position: ScrollPosition): void {
    this.callbacks.forEach((callback) => {
      try {
        callback(_position);
      } catch {
        // Silently handle callback errors to avoid breaking scroll functionality
      }
    });
  }

  /**
   * Get scroll top position
   */
  private getScrollTop(): number {
    if (this.element === window) {
      return window.pageYOffset || document.documentElement.scrollTop;
    }
    return (this.element as HTMLElement).scrollTop;
  }

  /**
   * Get total scroll height
   */
  private getScrollHeight(): number {
    if (this.element === window) {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight,
      );
    }
    return (this.element as HTMLElement).scrollHeight;
  }

  /**
   * Get visible viewport height
   */
  private getClientHeight(): number {
    if (this.element === window) {
      return window.innerHeight || document.documentElement.clientHeight;
    }
    return (this.element as HTMLElement).clientHeight;
  }

  /**
   * Calculate scroll percentage
   */
  private calculateScrollPercentage(
    scrollTop: number,
    scrollHeight: number,
    clientHeight: number,
  ): number {
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      return 100;
    }
    return Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
  }

  /**
   * Check if near bottom of content
   */
  private checkNearBottom(scrollPercentage: number): boolean {
    return scrollPercentage >= this.config.threshold;
  }

  /**
   * Calculate scroll velocity in pixels per second
   */
  private calculateVelocity(
    currentScrollTop: number,
    currentTime: number,
  ): number {
    if (this.lastScrollTime === 0) {
      this.lastScrollTop = currentScrollTop;
      this.lastScrollTime = currentTime;
      return 0;
    }

    const timeDiff = currentTime - this.lastScrollTime;
    if (timeDiff === 0) {
      return 0;
    }

    const scrollDiff = currentScrollTop - this.lastScrollTop;
    const velocity = Math.abs((scrollDiff / timeDiff) * 1000); // Convert to pixels per second

    // Clamp to max velocity
    const clampedVelocity = Math.min(velocity, this.config.maxVelocity);

    // Update last values
    this.lastScrollTop = currentScrollTop;
    this.lastScrollTime = currentTime;

    return clampedVelocity;
  }
}

/**
 * Create a scroll detector instance with default configuration
 */
export function createScrollDetector(
  element?: HTMLElement | Window,
  config?: Partial<ScrollDetectionConfig>,
): ScrollDetector {
  return new ScrollDetector(element, config);
}

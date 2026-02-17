/**
 * Virtual scrolling utilities for optimizing large text rendering
 * Provides intersection observer-based virtualization for text elements
 */

import type { LoremText } from '../../types/loremText.types';

/**
 * Virtual scroll configuration
 */
export interface VirtualScrollConfig {
  /** Buffer size - number of items to render outside viewport */
  bufferSize: number;
  /** Item height estimation in pixels */
  itemHeight: number;
  /** Threshold for triggering item visibility */
  threshold: number;
}

/**
 * Default virtual scroll configuration
 */
const DEFAULT_CONFIG: VirtualScrollConfig = {
  bufferSize: 2,
  itemHeight: 120, // Estimated height for a paragraph
  threshold: 0.1,
};

/**
 * Virtual scroll manager for optimizing text rendering
 */
export class VirtualScrollManager {
  private config: VirtualScrollConfig;
  private observer: IntersectionObserver | null = null;
  private visibleItems = new Set<string>();
  private callbacks = new Set<(visibleIds: string[]) => void>();
  private container: HTMLElement | null = null;

  constructor(config?: Partial<VirtualScrollConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize virtual scrolling for a container
   */
  initialize(container: HTMLElement): void {
    this.container = container;
    this.setupIntersectionObserver();
  }

  /**
   * Cleanup virtual scrolling
   */
  cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.visibleItems.clear();
    this.callbacks.clear();
    this.container = null;
  }

  /**
   * Subscribe to visibility changes
   */
  onVisibilityChange(callback: (visibleIds: string[]) => void): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Get currently visible item IDs
   */
  getVisibleItems(): string[] {
    return Array.from(this.visibleItems);
  }

  /**
   * Check if an item should be rendered based on visibility
   */
  shouldRender(itemId: string): boolean {
    return this.visibleItems.has(itemId);
  }

  /**
   * Setup intersection observer for tracking visibility
   */
  private setupIntersectionObserver(): void {
    if (!this.container || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const itemId = entry.target.getAttribute('data-item-id');
          if (itemId) {
            if (entry.isIntersecting) {
              this.visibleItems.add(itemId);
            } else {
              this.visibleItems.delete(itemId);
            }
          }
        });
        this.notifyCallbacks();
      },
      {
        root: this.container,
        rootMargin: `${String(this.config.bufferSize * this.config.itemHeight)}px`,
        threshold: this.config.threshold,
      },
    );
  }

  /**
   * Observe a text element
   */
  observeElement(element: HTMLElement, itemId: string): void {
    if (this.observer) {
      element.setAttribute('data-item-id', itemId);
      this.observer.observe(element);
    }
  }

  /**
   * Unobserve a text element
   */
  unobserveElement(element: HTMLElement): void {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  /**
   * Notify all callbacks of visibility changes
   */
  private notifyCallbacks(): void {
    const visibleIds = Array.from(this.visibleItems);
    this.callbacks.forEach((callback) => {
      try {
        callback(visibleIds);
      } catch {
        // Silently handle callback errors
      }
    });
  }

  /**
   * Get the observer instance (for testing purposes only)
   */
  getObserverForTesting(): IntersectionObserver | null {
    /* v8 ignore next -- @preserve */
    return import.meta.env.MODE === 'test' ? this.observer : null;
  }
}

/**
 * Create a virtual scroll manager instance
 */
export function createVirtualScrollManager(
  config?: Partial<VirtualScrollConfig>,
): VirtualScrollManager {
  return new VirtualScrollManager(config);
}

/**
 * Utility function to calculate visible range for virtual scrolling
 */
export function calculateVisibleRange(
  texts: LoremText[],
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  bufferSize: number,
): { startIndex: number; endIndex: number } {
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - bufferSize,
  );
  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(
    texts.length - 1,
    startIndex + visibleItemCount + bufferSize * 2,
  );

  return { startIndex, endIndex };
}

/**
 * Utility function to check if virtual scrolling is supported
 */
export function isVirtualScrollSupported(): boolean {
  return 'IntersectionObserver' in window && 'requestAnimationFrame' in window;
}

/**
 * Utility function to estimate text container height
 */
export function estimateTextHeight(text: string): number {
  // Rough estimation: ~20px per line, ~3 lines per paragraph on average
  const lines = Math.ceil(text.length / 80); // ~80 characters per line
  return Math.max(60, lines * 20); // Minimum 60px height
}

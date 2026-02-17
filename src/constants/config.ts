/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  /** Scroll configuration */
  scroll: {
    /** Percentage from bottom to trigger generation (0-100) */
    threshold: 85,
    /** Debounce delay for scroll events in milliseconds */
    debounceMs: 16, // ~60fps
    /** Maximum scroll velocity to handle (pixels per second) */
    maxVelocity: 10000,
  },

  /** Text generation configuration */
  generation: {
    /** Number of paragraphs to generate when scrolling near bottom */
    scrollGenerationCount: 2,
    /** Number of paragraphs to generate when button is clicked */
    buttonGenerationCount: 3,
    /** Minimum number of paragraphs to always generate */
    minGenerationCount: 2,
    /** Number of words to generate per chunk */
    chunkSize: 50,
    /** Maximum number of paragraphs to generate */
    maxParagraphs: 100,
    /** Words per paragraph range */
    wordsPerParagraph: {
      min: 30,
      max: 100,
    },
    /** Sentences per paragraph range */
    sentencesPerParagraph: {
      min: 3,
      max: 8,
    },
    /** Seed for reproducible generation */
    seed: 'lorem-ipsum-2026',
  },

  /** Performance monitoring configuration */
  performance: {
    /** Target frames per second */
    targetFPS: 60,
    /** Maximum memory usage in MB */
    maxMemoryMB: 100,
    /** Cleanup interval in milliseconds */
    cleanupInterval: 30000, // 30 seconds
  },

  /** Clipboard configuration */
  clipboard: {
    /** Auto-hide delay for copy buttons in milliseconds */
    autoHideDelay: 2000,
    /** Duration to show "Copied!" feedback in milliseconds */
    feedbackDuration: 1000,
  },

  /** UI configuration */
  ui: {
    /** Show copy buttons on hover (desktop) */
    showCopyOnHover: true,
    /** Show copy buttons on tap (mobile) */
    showCopyOnTap: true,
    /** Show copy buttons on text selection */
    showCopyOnSelection: true,
  },
} as const;

/**
 * Default generation configuration
 */
export const DEFAULT_GENERATION_CONFIG = {
  scrollThreshold: APP_CONFIG.scroll.threshold,
  wordsPerParagraph: APP_CONFIG.generation.wordsPerParagraph,
  sentencesPerParagraph: APP_CONFIG.generation.sentencesPerParagraph,
  maxParagraphs: APP_CONFIG.generation.maxParagraphs,
  chunkSize: APP_CONFIG.generation.chunkSize,
  seed: APP_CONFIG.generation.seed,
} as const;

/**
 * Default copy button configuration
 */
export const DEFAULT_COPY_BUTTON_CONFIG = {
  showOnHover: APP_CONFIG.ui.showCopyOnHover,
  showOnTap: APP_CONFIG.ui.showCopyOnTap,
  showOnSelection: APP_CONFIG.ui.showCopyOnSelection,
  autoHideDelay: APP_CONFIG.clipboard.autoHideDelay,
  feedbackDuration: APP_CONFIG.clipboard.feedbackDuration,
} as const;

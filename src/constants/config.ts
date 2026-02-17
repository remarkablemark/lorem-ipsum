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
} as const;

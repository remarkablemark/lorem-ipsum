/**
 * Type definitions for Lorem Ipsum Generator
 * Based on data model from specs/001-lorem-ipsum/data-model.md
 */

/**
 * Represents the generated lorem ipsum content and its metadata
 */
export interface LoremText {
  /** Unique identifier for the text segment */
  id: string;
  /** The actual text content */
  content: string;
  /** Type of text: original vs algorithmically generated */
  type: 'original' | 'generated';
  /** Position in the document (0-based index) */
  position: number;
  /** Paragraph number (1-based) */
  paragraphIndex: number;
}

/**
 * Settings for text generation behavior
 */
export interface GenerationConfig {
  /** Percentage from bottom to trigger generation (0-100) */
  scrollThreshold: number;
  /** Words per paragraph range */
  wordsPerParagraph: {
    min: number;
    max: number;
  };
  /** Sentences per paragraph range */
  sentencesPerParagraph: {
    min: number;
    max: number;
  };
  /** Maximum paragraphs to generate */
  maxParagraphs: number;
  /** Words to generate per chunk */
  chunkSize: number;
  /** Random seed for reproducible generation */
  seed: string;
}

/**
 * Global application state combining all entities
 */
export interface AppState {
  /** All generated text segments */
  texts: LoremText[];
  /** Current scroll state */
  currentPosition: import('./scroll.types').ScrollPosition;
  /** Text generation in progress */
  isGenerating: boolean;
  /** Available words for generation */
  wordBank: string[];
  /** Text generation settings */
  generationConfig: GenerationConfig;
}

/**
 * Text generation API interface
 */
export interface TextGenerationAPI {
  /** Generate lorem ipsum paragraphs */
  generateParagraphs(count: number, seed?: string): Promise<LoremText[]>;
  /** Generate a single sentence */
  generateSentence(wordCount: number, seed?: string): string;
  /** Get the original lorem ipsum text */
  getOriginalText(): LoremText;
  /** Check if generation should be triggered */
  shouldGenerate(
    scrollPosition: import('./scroll.types').ScrollPosition,
  ): boolean;
}

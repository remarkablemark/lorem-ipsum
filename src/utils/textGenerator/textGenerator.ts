/**
 * Text generation utility for lorem ipsum
 * Provides algorithmic generation of lorem ipsum text
 */

import { ORIGINAL_LOREM_TEXT } from '../../constants/loremText';
import { WORD_BANK } from '../../constants/wordBank';
import type { GenerationConfig, LoremText } from '../../types/loremText.types';

/**
 * Seeded random number generator for reproducible text generation
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    this.seed = this.hashString(seed);
  }

  /** Hash string to create numeric seed */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /** Generate next random number between 0 and 1 */
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /** Generate random integer between min and max (inclusive) */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** Generate random array element */
  nextElement<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

/**
 * Text generator class implementing the TextGenerationAPI
 */
export class TextGenerator {
  private random: SeededRandom;
  private nextPosition = 0;
  private nextParagraphIndex = 1;

  constructor(config: GenerationConfig) {
    this.random = new SeededRandom(config.seed);
  }

  /**
   * Generate lorem ipsum paragraphs
   */
  generateParagraphs(count: number, seed?: string): LoremText[] {
    if (seed) {
      this.random = new SeededRandom(seed);
    }

    const paragraphs: LoremText[] = [];

    for (let i = 0; i < count; i++) {
      const paragraph = this.generateParagraph();
      paragraphs.push(paragraph);
    }

    return paragraphs;
  }

  /**
   * Generate a single sentence
   */
  generateSentence(wordCount: number, seed?: string): string {
    if (seed) {
      this.random = new SeededRandom(seed);
    }

    const words = this.generateWords(wordCount);
    return this.formatSentence(words);
  }

  /**
   * Get the original lorem ipsum text
   */
  getOriginalText(): LoremText {
    return {
      id: 'original-lorem-ipsum',
      content: ORIGINAL_LOREM_TEXT,
      type: 'original',
      position: 0,
      paragraphIndex: 1,
    };
  }

  /**
   * Check if generation should be triggered based on scroll position
   */
  shouldGenerate(
    scrollPosition: import('../../types/scroll.types').ScrollPosition,
  ): boolean {
    return scrollPosition.isNearBottom;
  }

  /**
   * Generate a single paragraph
   */
  private generateParagraph(): LoremText {
    const sentenceCount = this.random.nextInt(3, 8); // 3-8 sentences per paragraph
    const sentences: string[] = [];

    for (let i = 0; i < sentenceCount; i++) {
      const wordCount = this.random.nextInt(5, 15); // 5-15 words per sentence
      const sentence = this.generateSentence(wordCount);
      sentences.push(sentence);
    }

    const content = sentences.join(' ');

    const paragraph: LoremText = {
      id: `generated-${String(this.nextPosition)}`,
      content,
      type: 'generated',
      position: this.nextPosition,
      paragraphIndex: this.nextParagraphIndex,
    };

    this.nextPosition++;
    this.nextParagraphIndex++;

    return paragraph;
  }

  /**
   * Generate an array of random words
   */
  private generateWords(count: number): string[] {
    const words: string[] = [];

    for (let i = 0; i < count; i++) {
      const word = this.random.nextElement(WORD_BANK);
      words.push(word);
    }

    return words;
  }

  /**
   * Format words into a sentence with proper capitalization and punctuation
   */
  private formatSentence(words: string[]): string {
    if (words.length === 0) {
      return '';
    }

    // Capitalize first word
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

    // Add period at end
    const lastWord = words[words.length - 1];
    /* v8 ignore next -- @preserve */
    if (!lastWord.endsWith('.')) {
      words[words.length - 1] = lastWord + '.';
    }

    return words.join(' ');
  }
}

/**
 * Create a text generator instance with default configuration
 */
export function createTextGenerator(
  config?: Partial<GenerationConfig>,
): TextGenerator {
  const defaultConfig: GenerationConfig = {
    scrollThreshold: 85,
    wordsPerParagraph: { min: 30, max: 100 },
    sentencesPerParagraph: { min: 3, max: 8 },
    maxParagraphs: 100,
    chunkSize: 50,
    seed: 'lorem-ipsum-2024',
  };

  const finalConfig = { ...defaultConfig, ...config };
  return new TextGenerator(finalConfig);
}

/**
 * Utility function to generate lorem ipsum text quickly
 */
export function generateLoremText(
  paragraphCount: number,
  config?: Partial<GenerationConfig>,
): LoremText[] {
  const generator = createTextGenerator(config);
  return generator.generateParagraphs(paragraphCount);
}

/**
 * Generate a single lorem ipsum sentence
 */
export function generateLoremSentence(
  wordCount: number,
  seed?: string,
): string {
  const generator = createTextGenerator();
  return generator.generateSentence(wordCount, seed);
}

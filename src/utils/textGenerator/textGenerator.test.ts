/**
 * Tests for text generation utilities
 */

import {
  createTextGenerator,
  generateLoremSentence,
  generateLoremText,
  SeededRandom,
  TextGenerator,
} from './textGenerator';

describe('SeededRandom', () => {
  it('should create instance with seed', () => {
    const random = new SeededRandom('test-seed');
    expect(random).toBeInstanceOf(SeededRandom);
  });

  it('should generate random numbers', () => {
    const random = new SeededRandom('test-seed');
    const value = random.next();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });

  it('should generate random integers', () => {
    const random = new SeededRandom('test-seed');
    const value = random.nextInt(1, 10);
    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(10);
  });

  it('should select random array element', () => {
    const random = new SeededRandom('test-seed');
    const array = ['a', 'b', 'c', 'd'];
    const element = random.nextElement(array);
    expect(array).toContain(element);
  });
});

describe('TextGenerator', () => {
  it('should create instance with config', () => {
    const config = {
      scrollThreshold: 85,
      wordsPerParagraph: { min: 30, max: 100 },
      sentencesPerParagraph: { min: 3, max: 8 },
      maxParagraphs: 100,
      chunkSize: 50,
      seed: 'test-seed',
    };

    const generator = new TextGenerator(config);
    expect(generator).toBeInstanceOf(TextGenerator);
  });

  it('should generate paragraphs', () => {
    const config = {
      scrollThreshold: 85,
      wordsPerParagraph: { min: 30, max: 100 },
      sentencesPerParagraph: { min: 3, max: 8 },
      maxParagraphs: 100,
      chunkSize: 50,
      seed: 'test-seed',
    };

    const generator = new TextGenerator(config);
    const paragraphs = generator.generateParagraphs(3);

    expect(Array.isArray(paragraphs)).toBe(true);
    expect(paragraphs).toHaveLength(3);

    paragraphs.forEach((paragraph) => {
      expect(paragraph).toHaveProperty('id');
      expect(paragraph).toHaveProperty('content');
      expect(paragraph).toHaveProperty('type');
      expect(paragraph).toHaveProperty('position');
      expect(paragraph).toHaveProperty('paragraphIndex');
      expect(typeof paragraph.content).toBe('string');
      expect(paragraph.content.length).toBeGreaterThan(0);
    });
  });

  it('should generate sentence', () => {
    const config = {
      scrollThreshold: 85,
      wordsPerParagraph: { min: 30, max: 100 },
      sentencesPerParagraph: { min: 3, max: 8 },
      maxParagraphs: 100,
      chunkSize: 50,
      seed: 'test-seed',
    };

    const generator = new TextGenerator(config);
    const sentence = generator.generateSentence(10);

    expect(typeof sentence).toBe('string');
    expect(sentence.length).toBeGreaterThan(0);
    expect(sentence[0]).toBe(sentence[0].toUpperCase());
    expect(sentence.endsWith('.')).toBe(true);
  });

  it('should get original text', () => {
    const config = {
      scrollThreshold: 85,
      wordsPerParagraph: { min: 30, max: 100 },
      sentencesPerParagraph: { min: 3, max: 8 },
      maxParagraphs: 100,
      chunkSize: 50,
      seed: 'test-seed',
    };

    const generator = new TextGenerator(config);
    const originalText = generator.getOriginalText();

    expect(originalText).toHaveProperty('id');
    expect(originalText).toHaveProperty('content');
    expect(originalText).toHaveProperty('type');
    expect(originalText).toHaveProperty('position');
    expect(originalText).toHaveProperty('paragraphIndex');
    expect(originalText.type).toBe('original');
    expect(originalText.id).toBe('original-lorem-ipsum');
  });

  it('should generate paragraphs with seed', () => {
    const config = {
      scrollThreshold: 85,
      wordsPerParagraph: { min: 30, max: 100 },
      sentencesPerParagraph: { min: 3, max: 8 },
      maxParagraphs: 100,
      chunkSize: 50,
      seed: 'test-seed',
    };

    const generator = new TextGenerator(config);
    const paragraphs1 = generator.generateParagraphs(2, 'custom-seed');
    const paragraphs2 = generator.generateParagraphs(2, 'custom-seed');

    expect(Array.isArray(paragraphs1)).toBe(true);
    expect(paragraphs1).toHaveLength(2);
    expect(Array.isArray(paragraphs2)).toBe(true);
    expect(paragraphs2).toHaveLength(2);

    // Same seed should produce same results
    expect(paragraphs1[0].content).toBe(paragraphs2[0].content);
    expect(paragraphs1[1].content).toBe(paragraphs2[1].content);
  });

  it('should handle empty words array in sentence generation', () => {
    const config = {
      scrollThreshold: 85,
      wordsPerParagraph: { min: 30, max: 100 },
      sentencesPerParagraph: { min: 3, max: 8 },
      maxParagraphs: 100,
      chunkSize: 50,
      seed: 'test-seed',
    };

    const generator = new TextGenerator(config);

    // Access the private method through a public method that uses it
    const sentence = generator.generateSentence(0);
    expect(sentence).toBe('');
  });

  it('should format sentence with proper capitalization and punctuation', () => {
    const config = {
      scrollThreshold: 85,
      wordsPerParagraph: { min: 30, max: 100 },
      sentencesPerParagraph: { min: 3, max: 8 },
      maxParagraphs: 100,
      chunkSize: 50,
      seed: 'test-seed',
    };

    const generator = new TextGenerator(config);

    // Test single word sentence
    const singleWordSentence = generator.generateSentence(1);
    expect(singleWordSentence).toMatch(/^[A-Z][a-z]*\.$/);

    // Test multiple word sentence
    const multiWordSentence = generator.generateSentence(5);
    expect(multiWordSentence).toMatch(/^[A-Z][a-z]*(?: [a-z]+)*\.$/);
    expect(multiWordSentence.split(' ').length).toBeGreaterThan(1);

    // Test sentence with word that already has punctuation
    const sentenceWithPunct = generator.generateSentence(3);
    expect(sentenceWithPunct).toMatch(/^[A-Z][a-z]*(?: [a-z]+)*\.$/);
  });

  it('should check generation trigger', () => {
    const config = {
      scrollThreshold: 85,
      wordsPerParagraph: { min: 30, max: 100 },
      sentencesPerParagraph: { min: 3, max: 8 },
      maxParagraphs: 100,
      chunkSize: 50,
      seed: 'test-seed',
    };

    const generator = new TextGenerator(config);

    const scrollPosition = {
      scrollTop: 1000,
      scrollHeight: 2000,
      clientHeight: 800,
      scrollPercentage: 90,
      isNearBottom: true,
      lastScrollTime: Date.now(),
      scrollVelocity: 100,
    };

    const shouldGenerate = generator.shouldGenerate(scrollPosition);
    expect(shouldGenerate).toBe(true);

    const scrollPosition2 = {
      scrollTop: 100,
      scrollHeight: 2000,
      clientHeight: 800,
      scrollPercentage: 10,
      isNearBottom: false,
      lastScrollTime: Date.now(),
      scrollVelocity: 100,
    };

    const shouldGenerate2 = generator.shouldGenerate(scrollPosition2);
    expect(shouldGenerate2).toBe(false);
  });
});

describe('createTextGenerator', () => {
  it('should create TextGenerator instance', () => {
    const generator = createTextGenerator();
    expect(generator).toBeInstanceOf(TextGenerator);
  });

  it('should create instance with custom config', () => {
    const config = { seed: 'custom-seed' };
    const generator = createTextGenerator(config);
    expect(generator).toBeInstanceOf(TextGenerator);
  });
});

describe('generateLoremText', () => {
  it('should generate lorem text paragraphs', () => {
    const paragraphs = generateLoremText(3);

    expect(Array.isArray(paragraphs)).toBe(true);
    expect(paragraphs).toHaveLength(3);

    paragraphs.forEach((paragraph) => {
      expect(paragraph).toHaveProperty('id');
      expect(paragraph).toHaveProperty('content');
      expect(paragraph).toHaveProperty('type');
      expect(paragraph).toHaveProperty('position');
      expect(paragraph).toHaveProperty('paragraphIndex');
    });
  });

  it('should generate lorem text with custom config', () => {
    const config = { seed: 'test-seed' };
    const paragraphs = generateLoremText(2, config);

    expect(Array.isArray(paragraphs)).toBe(true);
    expect(paragraphs).toHaveLength(2);
  });
});

describe('generateLoremSentence', () => {
  it('should generate lorem sentence', () => {
    const sentence = generateLoremSentence(10);

    expect(typeof sentence).toBe('string');
    expect(sentence.length).toBeGreaterThan(0);
    expect(sentence.split(' ').length).toBeGreaterThan(0);
  });

  it('should generate lorem sentence with seed', () => {
    const sentence1 = generateLoremSentence(10, 'seed1');
    const sentence2 = generateLoremSentence(10, 'seed1');
    const sentence3 = generateLoremSentence(10, 'seed2');

    expect(sentence1).toBe(sentence2);
    expect(sentence2).not.toBe(sentence3);
  });

  // Edge case tests
  it('should handle zero word count', () => {
    const sentence = generateLoremSentence(0);
    expect(sentence).toBe('');
  });

  it('should handle negative word count', () => {
    const sentence = generateLoremSentence(-5);
    expect(sentence).toBe('');
  });

  it('should handle very large word count', () => {
    const sentence = generateLoremSentence(1000);
    expect(typeof sentence).toBe('string');
    expect(sentence.length).toBeGreaterThan(0);
  });

  it('should handle null and undefined seeds', () => {
    const sentence1 = generateLoremSentence(
      5,
      null as unknown as string | undefined,
    );
    const sentence2 = generateLoremSentence(5, undefined as string | undefined);

    expect(typeof sentence1).toBe('string');
    expect(typeof sentence2).toBe('string');
    expect(sentence1.length).toBeGreaterThan(0);
    expect(sentence2.length).toBeGreaterThan(0);
  });

  it('should handle empty string seed', () => {
    const sentence = generateLoremSentence(5, '');
    expect(typeof sentence).toBe('string');
    expect(sentence.length).toBeGreaterThan(0);
  });
});

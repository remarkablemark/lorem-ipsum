/**
 * Tests for text generation utilities
 */

import { describe, expect, test } from 'vitest';

import {
  createTextGenerator,
  generateLoremSentence,
  generateLoremText,
  SeededRandom,
  TextGenerator,
} from './textGenerator';

describe('SeededRandom', () => {
  test('should create instance with seed', () => {
    const random = new SeededRandom('test-seed');
    expect(random).toBeInstanceOf(SeededRandom);
  });

  test('should generate random numbers', () => {
    const random = new SeededRandom('test-seed');
    const value = random.next();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });

  test('should generate random integers', () => {
    const random = new SeededRandom('test-seed');
    const value = random.nextInt(1, 10);
    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(10);
  });

  test('should select random array element', () => {
    const random = new SeededRandom('test-seed');
    const array = ['a', 'b', 'c', 'd'];
    const element = random.nextElement(array);
    expect(array).toContain(element);
  });
});

describe('TextGenerator', () => {
  test('should create instance with config', () => {
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

  test('should generate paragraphs', () => {
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

  test('should generate sentence', () => {
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

  test('should get original text', () => {
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

  test('should check generation trigger', () => {
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
  test('should create TextGenerator instance', () => {
    const generator = createTextGenerator();
    expect(generator).toBeInstanceOf(TextGenerator);
  });

  test('should create instance with custom config', () => {
    const config = { seed: 'custom-seed' };
    const generator = createTextGenerator(config);
    expect(generator).toBeInstanceOf(TextGenerator);
  });
});

describe('generateLoremText', () => {
  test('should generate lorem text paragraphs', () => {
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

  test('should generate lorem text with custom config', () => {
    const config = { seed: 'test-seed' };
    const paragraphs = generateLoremText(2, config);

    expect(Array.isArray(paragraphs)).toBe(true);
    expect(paragraphs).toHaveLength(2);
  });
});

describe('generateLoremSentence', () => {
  test('should generate lorem sentence', () => {
    const sentence = generateLoremSentence(10);

    expect(typeof sentence).toBe('string');
    expect(sentence.length).toBeGreaterThan(0);
    expect(sentence.split(' ').length).toBeGreaterThan(0);
  });

  test('should generate lorem sentence with seed', () => {
    const sentence1 = generateLoremSentence(10, 'seed1');
    const sentence2 = generateLoremSentence(10, 'seed1');
    const sentence3 = generateLoremSentence(10, 'seed2');

    expect(sentence1).toBe(sentence2);
    expect(sentence2).not.toBe(sentence3);
  });
});

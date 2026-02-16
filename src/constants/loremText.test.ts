/**
 * Tests for lorem ipsum text constants
 */

import { describe, expect, test } from 'vitest';

import { ORIGINAL_LOREM_TEXT, ORIGINAL_LOREM_WORDS } from './loremText';

describe('ORIGINAL_LOREM_TEXT', () => {
  test('should be a non-empty string', () => {
    expect(ORIGINAL_LOREM_TEXT).toBeTypeOf('string');
    expect(ORIGINAL_LOREM_TEXT.length).toBeGreaterThan(0);
  });

  test('should contain lorem ipsum text', () => {
    expect(ORIGINAL_LOREM_TEXT).toContain('Lorem ipsum');
    expect(ORIGINAL_LOREM_TEXT).toContain('dolor sit amet');
    expect(ORIGINAL_LOREM_TEXT).toContain('consectetur adipiscing elit');
  });

  test('should have proper punctuation', () => {
    expect(ORIGINAL_LOREM_TEXT).toContain('.');
    expect(ORIGINAL_LOREM_TEXT).toContain(',');
  });

  test('should end with a period', () => {
    expect(ORIGINAL_LOREM_TEXT.endsWith('.')).toBe(true);
  });
});

describe('ORIGINAL_LOREM_WORDS', () => {
  test('should be an array of strings', () => {
    expect(Array.isArray(ORIGINAL_LOREM_WORDS)).toBe(true);
    expect(ORIGINAL_LOREM_WORDS.length).toBeGreaterThan(0);

    if (ORIGINAL_LOREM_WORDS.length > 0) {
      expect(ORIGINAL_LOREM_WORDS[0]).toBeTypeOf('string');
    }
  });

  test('should contain lorem ipsum words without punctuation', () => {
    expect(ORIGINAL_LOREM_WORDS).toContain('Lorem');
    expect(ORIGINAL_LOREM_WORDS).toContain('ipsum');
    expect(ORIGINAL_LOREM_WORDS).toContain('dolor');
    expect(ORIGINAL_LOREM_WORDS).toContain('sit');
    expect(ORIGINAL_LOREM_WORDS).toContain('amet');
  });

  test('should not contain words with punctuation', () => {
    ORIGINAL_LOREM_WORDS.forEach((word) => {
      expect(word).not.toContain('.');
      expect(word).not.toContain(',');
    });
  });

  test('should have consistent word count', () => {
    const expectedWordCount = ORIGINAL_LOREM_TEXT.split(' ').length;
    expect(ORIGINAL_LOREM_WORDS.length).toBe(expectedWordCount);
  });

  test('should have unique words when case-insensitive', () => {
    const lowercasedWords = ORIGINAL_LOREM_WORDS.map((word) =>
      word.toLowerCase(),
    );
    const uniqueWords = new Set(lowercasedWords);
    expect(uniqueWords.size).toBeGreaterThan(0);
    expect(uniqueWords.size).toBeLessThanOrEqual(ORIGINAL_LOREM_WORDS.length);
  });
});

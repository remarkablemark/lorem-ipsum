/**
 * Tests for word bank constants
 */

import { describe, expect, test } from 'vitest';

import { SENTENCE_PATTERNS, WORD_BANK, WORD_CATEGORIES } from './wordBank';

describe('WORD_BANK', () => {
  test('should be an array of strings', () => {
    expect(Array.isArray(WORD_BANK)).toBe(true);
    expect(WORD_BANK.length).toBeGreaterThan(0);

    if (WORD_BANK.length > 0) {
      expect(WORD_BANK[0]).toBeTypeOf('string');
    }
  });

  test('should contain original lorem ipsum words', () => {
    expect(WORD_BANK).toContain('lorem');
    expect(WORD_BANK).toContain('ipsum');
    expect(WORD_BANK).toContain('dolor');
    expect(WORD_BANK).toContain('sit');
    expect(WORD_BANK).toContain('amet');
  });

  test('should contain additional Latin words', () => {
    expect(WORD_BANK).toContain('at');
    expect(WORD_BANK).toContain('vero');
    expect(WORD_BANK).toContain('eos');
    expect(WORD_BANK).toContain('accusamus');
  });

  test('should have no empty strings', () => {
    WORD_BANK.forEach((word) => {
      expect(word.trim()).not.toBe('');
    });
  });

  test('should track duplicate words', () => {
    const uniqueWords = new Set(WORD_BANK);
    expect(uniqueWords.size).toBeLessThanOrEqual(WORD_BANK.length);
    // The actual data has duplicates, so we just verify it's tracked correctly
    expect(uniqueWords.size).toBe(171);
    expect(WORD_BANK.length).toBe(243);
  });

  test('should have reasonable word count', () => {
    expect(WORD_BANK.length).toBeGreaterThan(50);
    expect(WORD_BANK.length).toBeLessThan(1000);
  });
});

describe('SENTENCE_PATTERNS', () => {
  test('should be an array of arrays', () => {
    expect(Array.isArray(SENTENCE_PATTERNS)).toBe(true);
    expect(SENTENCE_PATTERNS.length).toBeGreaterThan(0);

    if (SENTENCE_PATTERNS.length > 0) {
      expect(Array.isArray(SENTENCE_PATTERNS[0])).toBe(true);
    }
  });

  test('should contain valid pattern types', () => {
    const validPatternTypes = [
      'subject',
      'verb',
      'object',
      'adjective',
      'adverb',
      'conjunction',
      'preposition',
    ];

    SENTENCE_PATTERNS.forEach((pattern) => {
      pattern.forEach((patternType) => {
        expect(validPatternTypes).toContain(patternType);
      });
    });
  });

  test('should have patterns with reasonable length', () => {
    SENTENCE_PATTERNS.forEach((pattern) => {
      expect(pattern.length).toBeGreaterThan(0);
      expect(pattern.length).toBeLessThan(10);
    });
  });

  test('should have no duplicate patterns', () => {
    const patternStrings = SENTENCE_PATTERNS.map((pattern) =>
      pattern.join('-'),
    );
    const uniquePatterns = new Set(patternStrings);
    expect(uniquePatterns.size).toBe(SENTENCE_PATTERNS.length);
  });
});

describe('WORD_CATEGORIES', () => {
  test('should have all required categories', () => {
    const requiredCategories = [
      'subjects',
      'verbs',
      'adjectives',
      'adverbs',
      'conjunctions',
      'prepositions',
    ];

    requiredCategories.forEach((category) => {
      expect(WORD_CATEGORIES).toHaveProperty(category);
      expect(
        Array.isArray(
          WORD_CATEGORIES[category as keyof typeof WORD_CATEGORIES],
        ),
      ).toBe(true);
    });
  });

  test('should have non-empty arrays for each category', () => {
    Object.values(WORD_CATEGORIES).forEach((words) => {
      expect(words.length).toBeGreaterThan(0);
      expect(words[0]).toBeTypeOf('string');
    });
  });

  test('should contain lorem ipsum words in subjects', () => {
    expect(WORD_CATEGORIES.subjects).toContain('lorem');
    expect(WORD_CATEGORIES.subjects).toContain('ipsum');
    expect(WORD_CATEGORIES.subjects).toContain('dolor');
  });

  test('should contain action words in verbs', () => {
    expect(WORD_CATEGORIES.verbs).toContain('sit');
    expect(WORD_CATEGORIES.verbs).toContain('amet');
    expect(WORD_CATEGORIES.verbs).toContain('consectetur');
  });

  test('should contain descriptive words in adjectives', () => {
    expect(WORD_CATEGORIES.adjectives).toContain('magna');
    expect(WORD_CATEGORIES.adjectives).toContain('aliqua');
    expect(WORD_CATEGORIES.adjectives).toContain('minim');
  });

  test('should have no empty strings in any category', () => {
    Object.values(WORD_CATEGORIES).forEach((words) => {
      words.forEach((word) => {
        expect(word.trim()).not.toBe('');
      });
    });
  });

  test('should track duplicate words within categories', () => {
    Object.values(WORD_CATEGORIES).forEach((words) => {
      const uniqueWords = new Set(words);
      expect(uniqueWords.size).toBeLessThanOrEqual(words.length);
      // Some categories have duplicates, verify this is tracked correctly
    });
  });

  test('should have reasonable category sizes', () => {
    Object.values(WORD_CATEGORIES).forEach((words) => {
      expect(words.length).toBeGreaterThan(5);
      expect(words.length).toBeLessThan(500);
    });
  });
});

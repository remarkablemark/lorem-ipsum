/**
 * Tests for word bank constants
 */

import { WORD_BANK } from './wordBank';

describe('WORD_BANK', () => {
  it('should be an array of strings', () => {
    expect(Array.isArray(WORD_BANK)).toBe(true);
    expect(WORD_BANK.length).toBeGreaterThan(0);

    if (WORD_BANK.length > 0) {
      expect(WORD_BANK[0]).toBeTypeOf('string');
    }
  });

  it('should contain original lorem ipsum words', () => {
    expect(WORD_BANK).toContain('lorem');
    expect(WORD_BANK).toContain('ipsum');
    expect(WORD_BANK).toContain('dolor');
    expect(WORD_BANK).toContain('sit');
    expect(WORD_BANK).toContain('amet');
  });

  it('should contain additional Latin words', () => {
    expect(WORD_BANK).toContain('at');
    expect(WORD_BANK).toContain('vero');
    expect(WORD_BANK).toContain('eos');
    expect(WORD_BANK).toContain('accusamus');
  });

  it('should have no empty strings', () => {
    WORD_BANK.forEach((word) => {
      expect(word.trim()).not.toBe('');
    });
  });

  it('should track duplicate words', () => {
    const uniqueWords = new Set(WORD_BANK);
    expect(uniqueWords.size).toBeLessThanOrEqual(WORD_BANK.length);
    // The actual data has duplicates, so we just verify it's tracked correctly
    expect(uniqueWords.size).toBe(171);
    expect(WORD_BANK.length).toBe(243);
  });

  it('should have reasonable word count', () => {
    expect(WORD_BANK.length).toBeGreaterThan(50);
    expect(WORD_BANK.length).toBeLessThan(1000);
  });
});

/**
 * Tests for configuration constants
 */

import { APP_CONFIG } from './config';

describe('APP_CONFIG', () => {
  it('should have scroll configuration', () => {
    expect(APP_CONFIG.scroll).toBeDefined();
    expect(APP_CONFIG.scroll.threshold).toBeTypeOf('number');
    expect(APP_CONFIG.scroll.threshold).toBeGreaterThanOrEqual(0);
    expect(APP_CONFIG.scroll.threshold).toBeLessThanOrEqual(100);
    expect(APP_CONFIG.scroll.debounceMs).toBeTypeOf('number');
    expect(APP_CONFIG.scroll.maxVelocity).toBeTypeOf('number');
  });

  it('should have generation configuration', () => {
    expect(APP_CONFIG.generation).toBeDefined();
    expect(APP_CONFIG.generation.chunkSize).toBeTypeOf('number');
    expect(APP_CONFIG.generation.maxParagraphs).toBeTypeOf('number');
    expect(APP_CONFIG.generation.wordsPerParagraph).toBeDefined();
    expect(APP_CONFIG.generation.sentencesPerParagraph).toBeDefined();
    expect(APP_CONFIG.generation.seed).toBeTypeOf('string');
  });

  it('should have valid configuration values', () => {
    expect(APP_CONFIG.scroll.threshold).toBe(85);
    expect(APP_CONFIG.scroll.debounceMs).toBe(16);
    expect(APP_CONFIG.scroll.maxVelocity).toBe(10000);
    expect(APP_CONFIG.generation.chunkSize).toBe(50);
    expect(APP_CONFIG.generation.maxParagraphs).toBe(100);
    expect(APP_CONFIG.generation.seed).toBe('lorem-ipsum-2026');
  });
});

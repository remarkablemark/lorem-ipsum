/**
 * Tests for configuration constants
 */

import { APP_CONFIG, DEFAULT_GENERATION_CONFIG } from './config';

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

describe('DEFAULT_GENERATION_CONFIG', () => {
  it('should have correct generation configuration', () => {
    expect(DEFAULT_GENERATION_CONFIG).toBeDefined();
    expect(DEFAULT_GENERATION_CONFIG.scrollThreshold).toBe(
      APP_CONFIG.scroll.threshold,
    );
    expect(DEFAULT_GENERATION_CONFIG.wordsPerParagraph).toBe(
      APP_CONFIG.generation.wordsPerParagraph,
    );
    expect(DEFAULT_GENERATION_CONFIG.sentencesPerParagraph).toBe(
      APP_CONFIG.generation.sentencesPerParagraph,
    );
    expect(DEFAULT_GENERATION_CONFIG.maxParagraphs).toBe(
      APP_CONFIG.generation.maxParagraphs,
    );
    expect(DEFAULT_GENERATION_CONFIG.chunkSize).toBe(
      APP_CONFIG.generation.chunkSize,
    );
    expect(DEFAULT_GENERATION_CONFIG.seed).toBe(APP_CONFIG.generation.seed);
  });
});

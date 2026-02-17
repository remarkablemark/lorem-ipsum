/**
 * Tests for lorem ipsum text constants
 */

import { ORIGINAL_LOREM_TEXT } from './loremText';

describe('ORIGINAL_LOREM_TEXT', () => {
  it('should be a non-empty string', () => {
    expect(ORIGINAL_LOREM_TEXT).toBeTypeOf('string');
    expect(ORIGINAL_LOREM_TEXT.length).toBeGreaterThan(0);
  });

  it('should contain lorem ipsum text', () => {
    expect(ORIGINAL_LOREM_TEXT).toContain('Lorem ipsum');
    expect(ORIGINAL_LOREM_TEXT).toContain('dolor sit amet');
    expect(ORIGINAL_LOREM_TEXT).toContain('consectetur adipiscing elit');
  });

  it('should have proper punctuation', () => {
    expect(ORIGINAL_LOREM_TEXT).toContain('.');
    expect(ORIGINAL_LOREM_TEXT).toContain(',');
  });

  it('should end with a period', () => {
    expect(ORIGINAL_LOREM_TEXT.endsWith('.')).toBe(true);
  });
});

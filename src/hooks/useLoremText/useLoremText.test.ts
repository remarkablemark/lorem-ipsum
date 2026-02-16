/**
 * Tests for useLoremText hook
 */

import { act, renderHook } from '@testing-library/react';

import { useLoremText } from './useLoremText';

// Mock the text generator utility
vi.mock('../../utils/textGenerator/textGenerator', () => ({
  createTextGenerator: vi.fn(() => ({
    random: {
      next: vi.fn(() => 0.5),
      nextInt: vi.fn(() => 5),
      nextElement: vi.fn((array: string[]) => array[0]),
    },
    nextPosition: 0,
    nextParagraphIndex: 1,
    generateParagraphs: vi.fn((count: number) =>
      Array.from({ length: count }, (_, index) => ({
        id: `generated-${String(index + 1)}`,
        content: `Generated lorem ipsum text ${String(index + 1)}.`,
        type: 'generated',
        position: index + 1,
        paragraphIndex: index + 2,
      })),
    ),
    generateSentence: vi.fn(() => 'Generated sentence.'),
    getOriginalText: vi.fn(() => ({
      id: 'original-lorem-ipsum',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      type: 'original',
      position: 0,
      paragraphIndex: 1,
    })),
    shouldGenerate: vi.fn(() => false),
  })),
}));

describe('useLoremText', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with original text only', () => {
    const { result } = renderHook(() => useLoremText());

    expect(result.current.texts).toHaveLength(1);
    expect(result.current.texts[0].type).toBe('original');
    expect(result.current.texts[0].content).toContain(
      'Lorem ipsum dolor sit amet',
    );
    expect(result.current.originalText.type).toBe('original');
    expect(result.current.isGenerating).toBe(false);
  });

  it('should generate more text when generateMore is called', async () => {
    const { result } = renderHook(() => useLoremText());

    expect(result.current.texts).toHaveLength(1);

    // Call generateMore and wait for state update
    await act(async () => {
      result.current.generateMore(2);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.texts).toHaveLength(3); // Original + 2 generated
    expect(result.current.texts[1].type).toBe('generated');
    expect(result.current.texts[2].type).toBe('generated');
  });

  it('should reset to original text only', async () => {
    const { result } = renderHook(() => useLoremText());

    // Add some generated text first
    await act(async () => {
      result.current.generateMore(1);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.texts).toHaveLength(2);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.texts).toHaveLength(1);
    expect(result.current.texts[0].type).toBe('original');
  });

  it('should get all text as string', () => {
    const { result } = renderHook(() => useLoremText());

    const allText = result.current.getAllText();

    expect(allText).toBe(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    );
  });

  it('should get word count', () => {
    const { result } = renderHook(() => useLoremText());

    const wordCount = result.current.getWordCount();

    expect(wordCount).toBe(8); // "Lorem ipsum dolor sit amet, consectetur adipiscing elit." = 8 words
  });

  it('should handle generation state correctly', async () => {
    const { result } = renderHook(() => useLoremText());

    expect(result.current.isGenerating).toBe(false);

    // Start generation
    act(() => {
      result.current.generateMore(2);
    });

    // Should be generating during the operation
    expect(result.current.isGenerating).toBe(true);

    // Wait for generation to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Should be done after generation
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.texts.length).toBeGreaterThan(1);
  });

  it('should use default count when generateMore is called without parameters', async () => {
    const { result } = renderHook(() => useLoremText());

    await act(async () => {
      result.current.generateMore();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Should generate default number of paragraphs (3)
    expect(result.current.texts.length).toBe(4); // Original + 3 generated
  });

  it('should maintain text order by position', async () => {
    const { result } = renderHook(() => useLoremText());

    await act(async () => {
      result.current.generateMore(3);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const texts = result.current.texts;

    // Original should be first (position 0)
    expect(texts[0].position).toBe(0);
    expect(texts[0].type).toBe('original');

    // Generated texts should follow in order
    expect(texts[1].position).toBe(1);
    expect(texts[2].position).toBe(2);
    expect(texts[3].position).toBe(3);
  });

  it('should not generate when already generating', async () => {
    const { result } = renderHook(() => useLoremText());

    // Start generation
    act(() => {
      result.current.generateMore(2);
    });

    expect(result.current.isGenerating).toBe(true);

    // Try to generate again while still generating
    act(() => {
      result.current.generateMore(2);
    });

    // Should still be generating and not have added more texts
    expect(result.current.isGenerating).toBe(true);

    // Wait for first generation to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Should have only the first generation's texts
    expect(result.current.texts.length).toBe(3); // Original + 2 from first call
  });

  it('should calculate word count correctly for multiple texts', async () => {
    const { result } = renderHook(() => useLoremText());

    // Add some generated text
    await act(async () => {
      result.current.generateMore(1);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const wordCount = result.current.getWordCount();

    expect(wordCount).toBe(13); // 8 (original) + 5 (generated)
  });
});

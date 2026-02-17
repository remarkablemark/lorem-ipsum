/**
 * Tests for useLoremText custom hook
 */

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useLoremText } from './useLoremText';

// Mock the text generator
vi.mock('../../utils/textGenerator/textGenerator', () => ({
  createTextGenerator: vi.fn(() => ({
    getOriginalText: vi.fn(() => ({
      id: 'original-lorem-ipsum',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      type: 'original' as const,
      position: 0,
      paragraphIndex: 1,
    })),
    generateParagraphs: vi.fn((count: number) =>
      Array.from({ length: count }, (_, i) => ({
        id: `generated-${String(i)}`,
        content: `Generated paragraph ${String(i + 1)}.`,
        type: 'generated' as const,
        position: i + 1,
        paragraphIndex: i + 2,
      })),
    ),
  })),
}));

describe('useLoremText', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with original text', () => {
    const { result } = renderHook(() => useLoremText());

    expect(result.current.texts).toHaveLength(1);
    expect(result.current.texts[0].type).toBe('original');
    expect(result.current.originalText.type).toBe('original');
    expect(result.current.isGenerating).toBe(false);
  });

  it('should generate more text', async () => {
    const { result } = renderHook(() => useLoremText());

    expect(result.current.texts).toHaveLength(1);

    // Generate more text
    act(() => {
      result.current.generateMore(2);
    });

    // Wait for the setTimeout to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.texts).toHaveLength(3); // Original + 2 generated
    expect(result.current.texts[1].type).toBe('generated');
    expect(result.current.texts[2].type).toBe('generated');
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

  it('should not generate when already generating', () => {
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

    // Should still be generating from first call
    expect(result.current.isGenerating).toBe(true);
  });

  it('should use default count when none provided', async () => {
    const { result } = renderHook(() => useLoremText());

    act(() => {
      result.current.generateMore();
    });

    // Wait for the setTimeout to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Should use default count of 3
    expect(result.current.texts).toHaveLength(4); // Original + 3 generated
  });
});

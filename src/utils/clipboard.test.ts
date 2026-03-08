import type { LoremText } from 'src/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { concatenateLoremText, copyToClipboard } from './clipboard';

describe('concatenateLoremText', () => {
  it('should concatenate originalText and texts with double newlines', () => {
    const originalText: LoremText = {
      id: '1',
      content: 'Lorem ipsum',
      type: 'original',
      position: 0,
      paragraphIndex: 1,
    };
    const texts: LoremText[] = [
      {
        id: '2',
        content: 'Dolor sit',
        type: 'generated',
        position: 1,
        paragraphIndex: 2,
      },
      {
        id: '3',
        content: 'Amet consectetur',
        type: 'generated',
        position: 2,
        paragraphIndex: 3,
      },
    ];

    const result = concatenateLoremText(originalText, texts);

    expect(result).toBe('Lorem ipsum\n\nDolor sit\n\nAmet consectetur');
  });

  it('should handle empty texts array', () => {
    const originalText: LoremText = {
      id: '1',
      content: 'Lorem ipsum',
      type: 'original',
      position: 0,
      paragraphIndex: 1,
    };
    const texts: LoremText[] = [];

    const result = concatenateLoremText(originalText, texts);

    expect(result).toBe('Lorem ipsum');
  });

  it('should preserve paragraph order', () => {
    const originalText: LoremText = {
      id: '1',
      content: 'First',
      type: 'original',
      position: 0,
      paragraphIndex: 1,
    };
    const texts: LoremText[] = [
      {
        id: '2',
        content: 'Second',
        type: 'generated',
        position: 1,
        paragraphIndex: 2,
      },
      {
        id: '3',
        content: 'Third',
        type: 'generated',
        position: 2,
        paragraphIndex: 3,
      },
    ];

    const result = concatenateLoremText(originalText, texts);

    expect(result).toBe('First\n\nSecond\n\nThird');
  });
});

describe('copyToClipboard', () => {
  const mockWriteText = vi.fn();

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call navigator.clipboard.writeText with text', async () => {
    mockWriteText.mockResolvedValue(undefined);

    await copyToClipboard('test text');

    expect(mockWriteText).toHaveBeenCalledWith('test text');
  });

  it('should propagate clipboard API errors', async () => {
    const error = new DOMException('Permission denied', 'NotAllowedError');
    mockWriteText.mockRejectedValue(error);

    await expect(copyToClipboard('test')).rejects.toThrow('Permission denied');
  });
});

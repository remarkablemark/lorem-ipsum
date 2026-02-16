/**
 * Tests for clipboard utilities
 */

import type { CopyResult } from '../../types/clipboard.types';
import type { LoremText } from '../../types/loremText.types';
import {
  ClipboardManager,
  copyAllLoremText,
  copyText,
  createClipboardManager,
  getSelectedText,
  isClipboardSupported,
} from './clipboardUtils';

// Mock the clipboard API
const mockWriteText = vi.fn();
const mockClipboard = {
  writeText: mockWriteText,
};

// Mock window.getSelection
const mockGetSelection = vi.fn();
const mockSelection = {
  toString: vi.fn(),
};

// Mock document methods
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

describe('ClipboardManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
    });
    Object.defineProperty(window, 'getSelection', {
      value: mockGetSelection,
      writable: true,
    });
    Object.defineProperty(document, 'addEventListener', {
      value: mockAddEventListener,
      writable: true,
    });
    Object.defineProperty(document, 'removeEventListener', {
      value: mockRemoveEventListener,
      writable: true,
    });
    mockGetSelection.mockReturnValue(mockSelection);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isSupported', () => {
    it('should return true when clipboard API is available', () => {
      const manager = new ClipboardManager();
      expect(manager.isSupported()).toBe(true);
    });

    it('should return false when clipboard API is not available', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      });
      const manager = new ClipboardManager();
      expect(manager.isSupported()).toBe(false);
    });

    it('should cache the result', () => {
      const manager = new ClipboardManager();
      manager.isSupported();
      manager.isSupported();
      expect(mockGetSelection).toHaveBeenCalledTimes(0); // Should not re-check
    });
  });

  describe('copyAll', () => {
    it('should copy all texts joined by newlines', async () => {
      const manager = new ClipboardManager();
      const texts: LoremText[] = [
        {
          id: '1',
          content: 'First paragraph',
          type: 'generated',
          position: 0,
          paragraphIndex: 1,
        },
        {
          id: '2',
          content: 'Second paragraph',
          type: 'generated',
          position: 1,
          paragraphIndex: 2,
        },
      ];

      mockWriteText.mockResolvedValue(undefined);

      const result: CopyResult = await manager.copyAll(texts);

      expect(mockWriteText).toHaveBeenCalledWith(
        'First paragraph\n\nSecond paragraph',
      );
      expect(result).toEqual({
        success: true,
        copyType: 'all',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp: expect.any(Number),
      });
    });

    it('should handle empty texts array', async () => {
      const manager = new ClipboardManager();
      const texts: LoremText[] = [];

      mockWriteText.mockResolvedValue(undefined);

      const result: CopyResult = await manager.copyAll(texts);

      expect(mockWriteText).toHaveBeenCalledWith('');
      expect(result).toEqual({
        success: true,
        copyType: 'all',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp: expect.any(Number),
      });
    });

    it('should handle clipboard API failure', async () => {
      const manager = new ClipboardManager();
      const texts: LoremText[] = [
        {
          id: '1',
          content: 'Test text',
          type: 'generated',
          position: 0,
          paragraphIndex: 1,
        },
      ];

      mockWriteText.mockRejectedValue(new Error('Clipboard denied'));

      const result: CopyResult = await manager.copyAll(texts);

      expect(result).toEqual({
        success: false,
        copyType: 'all',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp: expect.any(Number),
        error: 'Clipboard API not supported or failed',
      });
    });
  });

  describe('copySelection', () => {
    it('should copy selected text', async () => {
      const manager = new ClipboardManager();
      const selectedText = 'Selected text';

      mockWriteText.mockResolvedValue(undefined);

      const result: CopyResult = await manager.copySelection(selectedText);

      expect(mockWriteText).toHaveBeenCalledWith(selectedText);
      expect(result).toEqual({
        success: true,
        copyType: 'selection',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp: expect.any(Number),
      });
    });

    it('should handle clipboard API failure', async () => {
      const manager = new ClipboardManager();
      const selectedText = 'Selected text';

      mockWriteText.mockRejectedValue(new Error('Clipboard denied'));

      const result: CopyResult = await manager.copySelection(selectedText);

      expect(result).toEqual({
        success: false,
        copyType: 'selection',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp: expect.any(Number),
        error: 'Clipboard API not supported or failed',
      });
    });
  });

  describe('getSelectedText', () => {
    it('should return selected text from selection', () => {
      const manager = new ClipboardManager();
      mockSelection.toString.mockReturnValue('Selected text');

      const result = manager.getSelectedText();

      expect(result).toBe('Selected text');
      expect(mockGetSelection).toHaveBeenCalled();
      expect(mockSelection.toString).toHaveBeenCalled();
    });

    it('should return empty string when no selection', () => {
      const manager = new ClipboardManager();
      mockGetSelection.mockReturnValue(null);

      const result = manager.getSelectedText();

      expect(result).toBe('');
    });

    it('should return empty string when selection is empty', () => {
      const manager = new ClipboardManager();
      mockSelection.toString.mockReturnValue('');

      const result = manager.getSelectedText();

      expect(result).toBe('');
    });
  });

  describe('onSelectionChange', () => {
    it('should subscribe to selection change events', () => {
      const manager = new ClipboardManager();
      const callback = vi.fn();
      mockSelection.toString.mockReturnValue('Test selection');

      const unsubscribe = manager.onSelectionChange(callback);

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'selectionchange',
        expect.any(Function),
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function),
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'keyup',
        expect.any(Function),
      );
      expect(typeof unsubscribe).toBe('function');
    });

    it('should call callback when selection changes', () => {
      const manager = new ClipboardManager();
      const callback = vi.fn();
      mockSelection.toString.mockReturnValue('Test selection');

      manager.onSelectionChange(callback);

      // Get the handler function that was passed to addEventListener
      const selectionChangeHandler = mockAddEventListener.mock
        .calls[0][1] as () => void;
      selectionChangeHandler();

      expect(callback).toHaveBeenCalledWith('Test selection');
    });

    it('should unsubscribe from events when returned function is called', () => {
      const manager = new ClipboardManager();
      const callback = vi.fn();

      const unsubscribe = manager.onSelectionChange(callback);
      unsubscribe();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'selectionchange',
        expect.any(Function),
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function),
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'keyup',
        expect.any(Function),
      );
    });
  });
});

describe('Utility functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
    });
    Object.defineProperty(window, 'getSelection', {
      value: mockGetSelection,
      writable: true,
    });
    mockGetSelection.mockReturnValue(mockSelection);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createClipboardManager', () => {
    it('should create a ClipboardManager instance', () => {
      const manager = createClipboardManager();
      expect(manager).toBeInstanceOf(ClipboardManager);
    });
  });

  describe('copyText', () => {
    it('should copy text using clipboard manager', async () => {
      const text = 'Test text';
      mockWriteText.mockResolvedValue(undefined);

      const result: CopyResult = await copyText(text);

      expect(mockWriteText).toHaveBeenCalledWith(text);
      expect(result).toEqual({
        success: true,
        copyType: 'selection',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp: expect.any(Number),
      });
    });

    it('should handle clipboard API failure', async () => {
      const text = 'Test text';
      mockWriteText.mockRejectedValue(new Error('Clipboard denied'));

      const result: CopyResult = await copyText(text);

      expect(result).toEqual({
        success: false,
        copyType: 'selection',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp: expect.any(Number),
        error: 'Clipboard API not supported or failed',
      });
    });
  });

  describe('isClipboardSupported', () => {
    it('should return true when clipboard API is available', () => {
      const result = isClipboardSupported();
      expect(result).toBe(true);
    });

    it('should return false when clipboard API is not available', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      });

      const result = isClipboardSupported();
      expect(result).toBe(false);
    });
  });

  describe('getSelectedText', () => {
    it('should get selected text using clipboard manager', () => {
      mockSelection.toString.mockReturnValue('Selected text');

      const result = getSelectedText();

      expect(result).toBe('Selected text');
    });

    it('should return empty string when no selection', () => {
      mockGetSelection.mockReturnValue(null);

      const result = getSelectedText();

      expect(result).toBe('');
    });
  });

  describe('copyAllLoremText', () => {
    it('should copy all lorem texts using clipboard manager', async () => {
      const texts: LoremText[] = [
        {
          id: '1',
          content: 'First paragraph',
          type: 'generated',
          position: 0,
          paragraphIndex: 1,
        },
        {
          id: '2',
          content: 'Second paragraph',
          type: 'generated',
          position: 1,
          paragraphIndex: 2,
        },
      ];
      mockWriteText.mockResolvedValue(undefined);

      const result: CopyResult = await copyAllLoremText(texts);

      expect(mockWriteText).toHaveBeenCalledWith(
        'First paragraph\n\nSecond paragraph',
      );
      expect(result).toEqual({
        success: true,
        copyType: 'all',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp: expect.any(Number),
      });
    });

    it('should handle clipboard API failure', async () => {
      const texts: LoremText[] = [
        {
          id: '1',
          content: 'Test text',
          type: 'generated',
          position: 0,
          paragraphIndex: 1,
        },
      ];
      mockWriteText.mockRejectedValue(new Error('Clipboard denied'));

      const result: CopyResult = await copyAllLoremText(texts);

      expect(result).toEqual({
        success: false,
        copyType: 'all',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp: expect.any(Number),
        error: 'Clipboard API not supported or failed',
      });
    });
  });
});

describe('Edge cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle missing clipboard API gracefully', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });

    const manager = new ClipboardManager();
    const result: CopyResult = await manager.copySelection('test');

    expect(result).toEqual({
      success: false,
      copyType: 'selection',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      timestamp: expect.any(Number),
      error: 'Clipboard API not supported or failed',
    });
  });

  it('should handle clipboard API with only writeText', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    });
    mockWriteText.mockResolvedValue(undefined);

    const manager = new ClipboardManager();
    expect(manager.isSupported()).toBe(true);

    const result: CopyResult = await manager.copySelection('test');
    expect(result.success).toBe(true);
  });

  it('should handle null selection', () => {
    Object.defineProperty(window, 'getSelection', {
      value: () => null,
      writable: true,
    });

    const manager = new ClipboardManager();
    const result = manager.getSelectedText();

    expect(result).toBe('');
  });

  it('should handle undefined selection', () => {
    Object.defineProperty(window, 'getSelection', {
      value: () => undefined,
      writable: true,
    });

    const manager = new ClipboardManager();
    const result = manager.getSelectedText();

    expect(result).toBe('');
  });
});

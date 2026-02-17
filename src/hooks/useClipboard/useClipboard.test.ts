/**
 * Tests for useClipboard hook
 */

import { renderHook } from '@testing-library/react';
import type { ClipboardManager } from 'src/utils/clipboardUtils/clipboardUtils';
import { describe, expect, it, vi } from 'vitest';

import { useClipboard } from './useClipboard';

// Mock clipboard utilities
vi.mock('src/utils/clipboardUtils/clipboardUtils', () => ({
  createClipboardManager: vi.fn(),
  isClipboardSupported: vi.fn(() => true),
}));

const mockCreateClipboardManager = vi.mocked(
  (await import('src/utils/clipboardUtils/clipboardUtils'))
    .createClipboardManager,
);

describe('useClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial clipboard state', () => {
    const mockManager = {
      isSupported: vi.fn(() => true),
      copyAll: vi.fn(),
      copySelection: vi.fn(),
      getSelectedText: vi.fn(() => ''),
      onSelectionChange: vi.fn(() => vi.fn()),
      isSupportedCache: null as boolean | null,
      copyToClipboard: vi.fn(),
      checkClipboardSupport: vi.fn(),
    };

    mockCreateClipboardManager.mockReturnValue(
      mockManager as unknown as ClipboardManager,
    );

    const { result } = renderHook(() => useClipboard());

    expect(result.current.isSupported).toBe(true);
    expect(result.current.selectedText).toBe('');
    expect(typeof result.current.copyAll).toBe('function');
    expect(typeof result.current.copySelection).toBe('function');
    expect(typeof result.current.getSelectedText).toBe('function');
  });

  it('should call copyAll when copyAll function is called', async () => {
    const mockCopyAll = vi.fn().mockResolvedValue({
      success: true,
      copyType: 'all',
      timestamp: Date.now(),
    });
    const mockManager = {
      isSupported: vi.fn(() => true),
      copyAll: mockCopyAll,
      copySelection: vi.fn(),
      getSelectedText: vi.fn(() => ''),
      onSelectionChange: vi.fn(() => vi.fn()),
      isSupportedCache: null as boolean | null,
      copyToClipboard: vi.fn(),
      checkClipboardSupport: vi.fn(),
    };

    mockCreateClipboardManager.mockReturnValue(
      mockManager as unknown as ClipboardManager,
    );

    const { result } = renderHook(() => useClipboard());
    const mockTexts = [
      {
        id: '1',
        content: 'Test text',
        type: 'generated' as const,
        position: 0,
        paragraphIndex: 1,
      },
    ];

    await result.current.copyAll(mockTexts);

    expect(mockCopyAll).toHaveBeenCalledWith(mockTexts);
  });

  it('should call copySelection when copySelection function is called', async () => {
    const mockCopySelection = vi.fn().mockResolvedValue({
      success: true,
      copyType: 'selection',
      timestamp: Date.now(),
    });
    const mockManager = {
      isSupported: vi.fn(() => true),
      copyAll: vi.fn(),
      copySelection: mockCopySelection,
      getSelectedText: vi.fn(() => ''),
      onSelectionChange: vi.fn(() => vi.fn()),
      isSupportedCache: null as boolean | null,
      copyToClipboard: vi.fn(),
      checkClipboardSupport: vi.fn(),
    };

    mockCreateClipboardManager.mockReturnValue(
      mockManager as unknown as ClipboardManager,
    );

    const { result } = renderHook(() => useClipboard());

    await result.current.copySelection('Selected text');

    expect(mockCopySelection).toHaveBeenCalledWith('Selected text');
  });

  it('should return selected text from getSelectedText', () => {
    const mockGetSelectedText = vi.fn(() => 'Current selection');
    const mockManager = {
      isSupported: vi.fn(() => true),
      copyAll: vi.fn(),
      copySelection: vi.fn(),
      getSelectedText: mockGetSelectedText,
      onSelectionChange: vi.fn(() => vi.fn()),
      isSupportedCache: null as boolean | null,
      copyToClipboard: vi.fn(),
      checkClipboardSupport: vi.fn(),
    };

    mockCreateClipboardManager.mockReturnValue(
      mockManager as unknown as ClipboardManager,
    );

    const { result } = renderHook(() => useClipboard());

    const selectedText = result.current.getSelectedText();

    expect(selectedText).toBe('Current selection');
    expect(mockGetSelectedText).toHaveBeenCalled();
  });

  it('should handle unsupported clipboard', () => {
    const mockManager = {
      isSupported: vi.fn(() => false),
      copyAll: vi.fn(),
      copySelection: vi.fn(),
      getSelectedText: vi.fn(() => ''),
      onSelectionChange: vi.fn(() => vi.fn()),
      isSupportedCache: null as boolean | null,
      copyToClipboard: vi.fn(),
      checkClipboardSupport: vi.fn(),
    };

    mockCreateClipboardManager.mockReturnValue(
      mockManager as unknown as ClipboardManager,
    );

    const { result } = renderHook(() => useClipboard());

    expect(result.current.isSupported).toBe(false);
  });

  it('should cleanup on unmount', () => {
    const mockUnsubscribe = vi.fn();
    const mockManager = {
      isSupported: vi.fn(() => true),
      copyAll: vi.fn(),
      copySelection: vi.fn(),
      getSelectedText: vi.fn(() => ''),
      onSelectionChange: vi.fn(() => mockUnsubscribe),
      isSupportedCache: null as boolean | null,
      copyToClipboard: vi.fn(),
      checkClipboardSupport: vi.fn(),
    };

    mockCreateClipboardManager.mockReturnValue(
      mockManager as unknown as ClipboardManager,
    );

    const { unmount } = renderHook(() => useClipboard());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});

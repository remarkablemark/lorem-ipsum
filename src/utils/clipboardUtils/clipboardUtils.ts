/**
 * Clipboard utilities for copying text to clipboard
 * Provides modern clipboard API support with basic fallbacks
 */

import type { CopyResult } from '../../types/clipboard.types';

/**
 * Clipboard manager class implementing clipboard operations
 */
export class ClipboardManager {
  private isSupportedCache: boolean | null = null;

  /**
   * Check clipboard support
   */
  isSupported(): boolean {
    if (this.isSupportedCache !== null) {
      return this.isSupportedCache;
    }

    this.isSupportedCache = this.checkClipboardSupport();
    return this.isSupportedCache;
  }

  /**
   * Copy all generated text
   */
  async copyAll(
    texts: import('../../types/loremText.types').LoremText[],
  ): Promise<CopyResult> {
    const allText = texts.map((text) => text.content).join('\n\n');
    return this.copyToClipboard(allText, 'all');
  }

  /**
   * Copy selected text
   */
  async copySelection(selectedText: string): Promise<CopyResult> {
    return this.copyToClipboard(selectedText, 'selection');
  }

  /**
   * Get currently selected text
   */
  getSelectedText(): string {
    const selection = window.getSelection();
    return selection?.toString() ?? '';
  }

  /**
   * Subscribe to selection changes
   */
  onSelectionChange(callback: (selectedText: string) => void): () => void {
    const handleSelectionChange = () => {
      const selectedText = this.getSelectedText();
      callback(selectedText);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);

    // Return unsubscribe function
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
    };
  }

  /**
   * Copy text to clipboard
   */
  private async copyToClipboard(
    text: string,
    copyType: 'all' | 'selection',
  ): Promise<CopyResult> {
    const timestamp = Date.now();

    try {
      // Try modern Clipboard API
      await navigator.clipboard.writeText(text);
      return {
        success: true,
        copyType,
        timestamp,
      };
    } catch {
      // Return error result if clipboard API fails
      return {
        success: false,
        copyType,
        timestamp,
        error: 'Clipboard API not supported or failed',
      };
    }
  }

  /**
   * Check if clipboard API is supported
   */
  private checkClipboardSupport(): boolean {
    return (
      'clipboard' in navigator &&
      typeof navigator.clipboard.writeText === 'function'
    );
  }
}

/**
 * Create a clipboard manager instance
 */
export function createClipboardManager(): ClipboardManager {
  return new ClipboardManager();
}

/**
 * Utility function to copy text to clipboard quickly
 */
export async function copyText(text: string): Promise<CopyResult> {
  const manager = createClipboardManager();
  return manager.copySelection(text);
}

/**
 * Utility function to check if clipboard is supported
 */
export function isClipboardSupported(): boolean {
  const manager = createClipboardManager();
  return manager.isSupported();
}

/**
 * Utility function to get selected text
 */
export function getSelectedText(): string {
  const manager = createClipboardManager();
  return manager.getSelectedText();
}

/**
 * Utility function to copy all lorem ipsum texts
 */
export async function copyAllLoremText(
  texts: import('../../types/loremText.types').LoremText[],
): Promise<CopyResult> {
  const manager = createClipboardManager();
  return manager.copyAll(texts);
}

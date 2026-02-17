/**
 * Custom hook for clipboard operations
 */

import { useCallback, useEffect, useState } from 'react';
import type { CopyResult } from 'src/types/clipboard.types';
import { createClipboardManager } from 'src/utils/clipboardUtils/clipboardUtils';

interface UseClipboardReturn {
  /** Whether clipboard is supported */
  isSupported: boolean;
  /** Currently selected text */
  selectedText: string;
  /** Copy all lorem ipsum texts */
  copyAll: (
    texts: import('src/types/loremText.types').LoremText[],
  ) => Promise<CopyResult>;
  /** Copy selected text */
  copySelection: (text: string) => Promise<CopyResult>;
  /** Get currently selected text */
  getSelectedText: () => string;
}

export function useClipboard(): UseClipboardReturn {
  /* v8 ignore start */
  const [selectedText, setSelectedText] = useState('');
  const [manager] = useState(() => createClipboardManager());

  // Update selected text when selection changes
  useEffect(() => {
    const unsubscribe = manager.onSelectionChange((text) => {
      /* v8 ignore next -- @preserve */
      setSelectedText(text);
    });

    return unsubscribe;
  }, [manager]);

  const copyAll = useCallback(
    async (texts: import('src/types/loremText.types').LoremText[]) => {
      return manager.copyAll(texts);
    },
    [manager],
  );

  const copySelection = useCallback(
    async (text: string) => {
      return manager.copySelection(text);
    },
    [manager],
  );

  const getSelectedText = useCallback(() => {
    /* v8 ignore next -- @preserve */
    return manager.getSelectedText();
  }, [manager]);

  return {
    isSupported: manager.isSupported(),
    selectedText,
    copyAll,
    copySelection,
    getSelectedText,
  };
  /* v8 ignore end */
}

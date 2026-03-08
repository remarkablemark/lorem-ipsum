import { useEffect, useState } from 'react';
import { COPY_FEEDBACK_DURATION } from 'src/constants';
import type { ClipboardState } from 'src/types';
import { concatenateLoremText, copyToClipboard } from 'src/utils';

import type { CopyButtonProps } from './CopyButton.types';

export function CopyButton({ texts }: CopyButtonProps) {
  const [clipboardState, setClipboardState] = useState<ClipboardState>('idle');

  useEffect(() => {
    if (clipboardState === 'success' || clipboardState === 'error') {
      const timer = setTimeout(() => {
        setClipboardState('idle');
      }, COPY_FEEDBACK_DURATION);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [clipboardState]);

  async function handleCopy() {
    setClipboardState('copying');

    try {
      const textToCopy = concatenateLoremText(texts);
      await copyToClipboard(textToCopy);
      setClipboardState('success');
    } catch {
      setClipboardState('error');
    }
  }

  function getButtonIcon() {
    switch (clipboardState) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📋';
    }
  }

  function getAriaLabel() {
    switch (clipboardState) {
      case 'copying':
        return 'Copying text';
      case 'success':
        return 'Text copied';
      case 'error':
        return 'Failed to copy text';
      default:
        return 'Copy text to clipboard';
    }
  }

  return (
    <button
      type="button"
      aria-label={getAriaLabel()}
      onClick={() => {
        void handleCopy();
      }}
      className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors duration-150 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:bg-gray-200 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900 dark:active:bg-slate-700"
    >
      {getButtonIcon()}
    </button>
  );
}

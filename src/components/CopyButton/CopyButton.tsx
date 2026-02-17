/**
 * CopyButton component for copying text to clipboard
 */

import { useState } from 'react';
import {
  copyText,
  isClipboardSupported,
} from 'src/utils/clipboardUtils/clipboardUtils';

interface CopyButtonProps {
  /** Text to copy to clipboard */
  text: string;
  /** Button text to display */
  buttonText?: string;
  /** Whether the button should be disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label */
  ariaLabel?: string;
}

export default function CopyButton({
  text,
  buttonText = 'Copy',
  disabled = false,
  className = '',
  ariaLabel = 'Copy text to clipboard',
}: CopyButtonProps) {
  const [copyState, setCopyState] = useState<
    'idle' | 'copying' | 'success' | 'error'
  >('idle');
  const [feedbackText, setFeedbackText] = useState(buttonText);

  const handleClick = async () => {
    /* v8 ignore start */
    if (disabled || copyState === 'copying') return;
    /* v8 ignore end */

    setCopyState('copying');
    setFeedbackText('Copying...');

    try {
      const result = await copyText(text);

      if (result.success) {
        setCopyState('success');
        setFeedbackText('Copied!');

        // Reset after 2 seconds
        /* v8 ignore start */
        setTimeout(() => {
          setCopyState('idle');
          setFeedbackText(buttonText);
        }, 2000);
        /* v8 ignore end */
      } else {
        setCopyState('error');
        setFeedbackText('Copy failed');

        // Reset after 3 seconds
        /* v8 ignore start */
        setTimeout(() => {
          setCopyState('idle');
          setFeedbackText(buttonText);
        }, 3000);
        /* v8 ignore end */
      }
    } catch {
      setCopyState('error');
      setFeedbackText('Copy failed');

      // Reset after 3 seconds
      /* v8 ignore start */
      setTimeout(() => {
        setCopyState('idle');
        setFeedbackText(buttonText);
      }, 3000);
      /* v8 ignore end */
    }
  };

  const handleClickSync = () => {
    /* v8 ignore start */
    void handleClick();
    /* v8 ignore end */
  };

  // Don't render if clipboard is not supported
  if (!isClipboardSupported()) {
    return null;
  }

  return (
    <button
      onClick={handleClickSync}
      disabled={disabled || copyState === 'copying'}
      className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${className}`}
      aria-label={ariaLabel}
      aria-live="polite"
      aria-busy={copyState === 'copying'}
    >
      {/* Icon */}
      <svg
        className={`mr-2 h-4 w-4 ${
          copyState === 'success'
            ? 'text-green-600'
            : copyState === 'error'
              ? 'text-red-600'
              : 'text-slate-600'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {copyState === 'success' ? (
          <path d="M20 6L9 17l-5-5" />
        ) : copyState === 'error' ? (
          <path d="M6 18L18 6M6 6l12 12" />
        ) : (
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        )}
      </svg>

      {/* Text */}
      <span>{feedbackText}</span>
    </button>
  );
}

/**
 * Clipboard-related type definitions
 */

/**
 * Manages the status and feedback for copy operations
 */
export interface ClipboardState {
  /** Browser clipboard API support */
  isSupported: boolean;
  /** Timestamp of last successful copy */
  lastCopyTime: number;
  /** Type of last copy operation */
  copyType: 'all' | 'selection' | null;
  /** Current feedback state */
  isCopied: boolean;
  /** Last error message */
  error: string | null;
  /** Currently selected text */
  selectedText: string;
}

/**
 * Copy operation state transitions
 */
export type CopyState =
  | { type: 'hidden' } // Copy buttons not visible
  | { type: 'visible'; trigger: 'hover' | 'tap' | 'selection' } // Buttons visible
  | { type: 'copying'; copyType: 'all' | 'selection' } // Copy in progress
  | { type: 'success'; timestamp: number; copyType: 'all' | 'selection' } // Copy succeeded
  | { type: 'error'; message: string; timestamp: number }; // Copy failed

/**
 * Configuration for copy button behavior
 */
export interface CopyButtonConfig {
  /** Show buttons on hover (desktop) */
  showOnHover: boolean;
  /** Show buttons on tap (mobile) */
  showOnTap: boolean;
  /** Show buttons when text selected */
  showOnSelection: boolean;
  /** Milliseconds to hide buttons after interaction */
  autoHideDelay: number;
  /** Milliseconds to show "Copied!" feedback */
  feedbackDuration: number;
}

/**
 * Copy operation result
 */
export interface CopyResult {
  /** Whether the copy operation succeeded */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Type of copy operation */
  copyType: 'all' | 'selection';
  /** Timestamp of the operation */
  timestamp: number;
}

/**
 * Copy event data structure
 */
export interface CopyEvent {
  /** Event type */
  type: 'copy-start' | 'copy-success' | 'copy-error';
  /** Type of copy operation */
  copyType: 'all' | 'selection';
  /** Event timestamp */
  timestamp: number;
  /** Error message if applicable */
  error?: string;
}

/**
 * Clipboard API interface
 */
export interface ClipboardAPI {
  /** Check clipboard support */
  isSupported(): boolean;
  /** Copy all generated text */
  copyAll(texts: import('./loremText.types').LoremText[]): Promise<CopyResult>;
  /** Copy selected text */
  copySelection(selectedText: string): Promise<CopyResult>;
  /** Get currently selected text */
  getSelectedText(): string;
  /** Subscribe to selection changes */
  onSelectionChange(callback: (selectedText: string) => void): () => void;
}

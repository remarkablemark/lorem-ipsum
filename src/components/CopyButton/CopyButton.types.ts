import type { LoremText } from 'src/types';

/**
 * Props for the CopyButton component
 */
export interface CopyButtonProps {
  /** The original lorem ipsum text */
  originalText: LoremText;
  /** Array of generated lorem ipsum paragraphs */
  texts: LoremText[];
}

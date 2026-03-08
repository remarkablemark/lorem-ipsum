import type { LoremText } from 'src/types';

/**
 * Props for the CopyButton component
 */
export interface CopyButtonProps {
  /** Array of all lorem ipsum paragraphs (includes original as first element) */
  texts: LoremText[];
}

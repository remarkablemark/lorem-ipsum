/**
 * Types for TextContainer component
 */

export interface TextContainerProps {
  className?: string;
  'data-testid'?: string;
}

export interface TextContainerRef {
  scrollToTop(): void;
  scrollToBottom(): void;
  getSelectedText(): string;
}

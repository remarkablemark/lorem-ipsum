import type { LoremText } from 'src/types';

/**
 * Concatenates lorem ipsum text with double newline separators
 */
export function concatenateLoremText(
  originalText: LoremText,
  texts: LoremText[],
): string {
  const allTexts = [originalText, ...texts];
  return allTexts.map((text) => text.content).join('\n\n');
}

/**
 * Copies text to clipboard using Clipboard API
 * @throws Error If Clipboard API is not available
 * @throws DOMException If clipboard write fails
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

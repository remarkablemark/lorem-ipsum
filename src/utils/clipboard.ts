import type { LoremText } from 'src/types';

/**
 * Concatenates lorem ipsum text with double newline separators
 * Note: texts array should already include the original text as the first element
 */
export function concatenateLoremText(texts: LoremText[]): string {
  return texts.map((text) => text.content).join('\n\n');
}

/**
 * Copies text to clipboard using Clipboard API
 * @throws Error If Clipboard API is not available
 * @throws DOMException If clipboard write fails
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

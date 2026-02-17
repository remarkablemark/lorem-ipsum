/**
 * Custom hook for managing lorem ipsum text generation and state
 */

import { useCallback, useRef, useState } from 'react';

import { APP_CONFIG } from '../../constants/config';
import type { GenerationConfig, LoremText } from '../../types/loremText.types';
import { createTextGenerator } from '../../utils/textGenerator/textGenerator';

/**
 * Hook return type
 */
interface UseLoremTextReturn {
  /** All generated text segments */
  texts: LoremText[];
  /** The original lorem ipsum text */
  originalText: LoremText;
  /** Whether text generation is in progress */
  isGenerating: boolean;
  /** Generate more lorem ipsum text */
  generateMore: (count?: number) => void;
}

/**
 * Custom hook for managing lorem ipsum text generation
 */
export function useLoremText(
  config?: Partial<GenerationConfig>,
): UseLoremTextReturn {
  const generationConfig = {
    scrollThreshold: APP_CONFIG.scroll.threshold,
    ...APP_CONFIG.generation,
    ...config,
  };
  const generatorRef = useRef(createTextGenerator(generationConfig));

  const [texts, setTexts] = useState<LoremText[]>(() => [
    generatorRef.current.getOriginalText(),
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const originalText = texts[0]; // First text is always the original

  const generateMore = useCallback(
    (count = 3): void => {
      if (isGenerating) {
        return;
      }

      setIsGenerating(true);

      // Use setTimeout to make the state update observable in tests
      setTimeout(() => {
        try {
          const newParagraphs = generatorRef.current.generateParagraphs(count);
          setTexts((prevTexts) => [...prevTexts, ...newParagraphs]);
        } finally {
          setIsGenerating(false);
        }
      }, 0);
    },
    [isGenerating],
  );

  return {
    texts,
    originalText,
    isGenerating,
    generateMore,
  };
}

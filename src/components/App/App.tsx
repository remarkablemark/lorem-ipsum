/**
 * Main App component for Lorem Ipsum Generator
 */

import { useEffect } from 'react';
import { useLoremText, useScrollDetection } from 'src/hooks';

export default function App() {
  const { texts, originalText, isGenerating, generateMore } = useLoremText();
  const { isNearBottom } = useScrollDetection();

  // Trigger text generation when near bottom
  useEffect(() => {
    if (isNearBottom && !isGenerating) {
      generateMore(2); // Generate 2 paragraphs when near bottom
    }
  }, [isNearBottom, isGenerating, generateMore]);

  return (
    <div className="min-h-screen" data-testid="app">
      <header className="border-b border-slate-200 text-center">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Lorem Ipsum Generator
          </h1>
          <p className="mt-2 text-slate-600">
            Generate lorem ipsum text with progressive scrolling
          </p>
        </div>
      </header>

      <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <section
          className="space-y-6"
          role="region"
          aria-label="Lorem ipsum text"
          data-testid="text-container"
        >
          {/* Original text */}
          <article className="prose prose-slate max-w-none">
            <p className="leading-relaxed text-slate-700">
              {originalText.content}
            </p>
          </article>

          {/* Generated texts */}
          {texts.length > 1 && (
            <div className="space-y-6">
              {texts.slice(1).map((text) => (
                <article key={text.id} className="prose prose-slate max-w-none">
                  <p className="leading-relaxed text-slate-700">
                    {text.content}
                  </p>
                </article>
              ))}
            </div>
          )}

          {/* Loading state */}
          {isGenerating && (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-600">Generating more text...</div>
            </div>
          )}

          {/* Empty state */}
          {texts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-slate-500">No text generated yet</p>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-auto border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            Lorem Ipsum Generator - Built with React & TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}

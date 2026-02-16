/**
 * Main App component for Lorem Ipsum Generator
 */

import { useEffect } from 'react';
import { APP_CONFIG } from 'src/constants/config';
import { useLoremText, useScrollDetection } from 'src/hooks';

export default function App() {
  const { texts, originalText, isGenerating, generateMore } = useLoremText();
  const { isNearBottom } = useScrollDetection();

  // Trigger text generation when near bottom
  useEffect(() => {
    if (isNearBottom && !isGenerating) {
      generateMore(APP_CONFIG.generation.scrollGenerationCount);
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
          {/* Manual trigger */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <button
              onClick={() => {
                generateMore(APP_CONFIG.generation.buttonGenerationCount);
              }}
              disabled={isGenerating}
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isGenerating
                ? 'Generating...'
                : `Generate ${APP_CONFIG.generation.buttonGenerationCount.toString()} Paragraphs`}
            </button>
            <p className="mt-2 text-sm text-slate-600">
              Or scroll down to trigger automatic generation
            </p>
          </div>

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

          {/* Spacer to make page scrollable */}
          <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-slate-300">
            <div className="text-center text-slate-500">
              <p className="text-lg">📜</p>
              <p>Scroll down to trigger automatic text generation</p>
              <p className="mt-2 text-sm">
                Or use the button above to generate manually
              </p>
            </div>
          </div>
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

/**
 * Main App component for Lorem Ipsum Generator
 */

import { useLoremText, usePerformance, useScrollDetection } from 'src/hooks';

export default function App() {
  const { texts, originalText, isGenerating } = useLoremText();
  const { position } = useScrollDetection();
  const { metrics, isPerformant } = usePerformance();

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

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <section
          className="space-y-8"
          role="region"
          aria-label="Lorem ipsum text"
          data-testid="text-container"
        >
          {/* Original text */}
          <article className="prose prose-slate max-w-none">
            <h2 className="text-xl font-semibold text-slate-900">
              Original Text
            </h2>
            <p className="leading-relaxed text-slate-700">
              {originalText.content}
            </p>
          </article>

          {/* Generated texts */}
          {texts.length > 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Generated Text
              </h2>
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

          {/* Debug info (remove in production) */}
          <div className="mt-16 border-t border-slate-200 pt-8">
            <h3 className="mb-2 text-sm font-medium text-slate-900">
              Debug Information
            </h3>
            <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
              <div>Texts: {texts.length}</div>
              <div>Scroll: {position.scrollPercentage.toFixed(1)}%</div>
              <div>FPS: {metrics.fps}</div>
              <div>Memory: {metrics.memoryUsage}MB</div>
              <div>Performant: {isPerformant ? 'Yes' : 'No'}</div>
              <div>Generating: {isGenerating ? 'Yes' : 'No'}</div>
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

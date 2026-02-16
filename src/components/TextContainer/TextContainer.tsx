/**
 * TextContainer component for displaying lorem ipsum text
 */

import { useLoremText } from 'src/hooks';

export default function TextContainer() {
  const { texts, originalText, isGenerating } = useLoremText();

  return (
    <section
      className="space-y-8"
      role="region"
      aria-label="Lorem ipsum text"
      data-testid="text-container"
    >
      {/* Original text */}
      <article className="prose prose-slate max-w-none">
        <h2 className="text-xl font-semibold text-slate-900">Original Text</h2>
        <p className="leading-relaxed text-slate-700">{originalText.content}</p>
      </article>

      {/* Generated texts */}
      {texts.length > 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Generated Text
          </h2>
          {texts.slice(1).map((text) => (
            <article key={text.id} className="prose prose-slate max-w-none">
              <p className="leading-relaxed text-slate-700">{text.content}</p>
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
  );
}

# API Contracts: Lorem Ipsum Generator via Scrolling

**Feature**: 001-lorem-ipsum | **Date**: 2026-02-16  
**Purpose**: Define internal API contracts and interfaces for the lorem ipsum generator

## Overview

This is a client-side application with no external API dependencies. All "contracts" defined here are internal interfaces between components, hooks, and utility functions.

## Internal API Contracts

### Text Generation API

```typescript
interface TextGenerationAPI {
  // Generate lorem ipsum paragraphs
  generateParagraphs(count: number, seed?: string): Promise<LoremText[]>;

  // Generate a single sentence
  generateSentence(wordCount: number, seed?: string): string;

  // Get the original lorem ipsum text
  getOriginalText(): LoremText;

  // Check if generation should be triggered
  shouldGenerate(scrollPosition: ScrollPosition): boolean;
}
```

### Scroll Detection API

```typescript
interface ScrollDetectionAPI {
  // Get current scroll position
  getCurrentPosition(): ScrollPosition;

  // Subscribe to scroll events
  onScroll(callback: (position: ScrollPosition) => void): () => void;

  // Check if user is near bottom
  isNearBottom(threshold?: number): boolean;

  // Get scroll velocity
  getVelocity(): number;

  // Start/stop monitoring
  start(): void;
  stop(): void;
}
```

### Clipboard API

```typescript
interface ClipboardAPI {
  // Check clipboard support
  isSupported(): boolean;

  // Copy all generated text
  copyAll(texts: LoremText[]): Promise<CopyResult>;

  // Copy selected text
  copySelection(selectedText: string): Promise<CopyResult>;

  // Get currently selected text
  getSelectedText(): string;

  // Subscribe to selection changes
  onSelectionChange(callback: (selectedText: string) => void): () => void;
}
```

### Performance Monitoring API

```typescript
interface PerformanceAPI {
  // Get current performance metrics
  getMetrics(): PerformanceMetrics;

  // Subscribe to performance updates
  onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void): () => void;

  // Check if performance is acceptable
  isPerformant(): boolean;

  // Force cleanup
  cleanup(): void;
}
```

## Component Contracts

### TextContainer Component

```typescript
interface TextContainerProps {
  texts: LoremText[];
  isGenerating: boolean;
  onScroll: (position: ScrollPosition) => void;
  onSelect: (selectedText: string) => void;
  onGenerateMore: () => void;
  className?: string;
}

interface TextContainerRef {
  scrollToTop(): void;
  scrollToBottom(): void;
  getSelectedText(): string;
}
```

### CopyButton Component

```typescript
interface CopyButtonProps {
  type: 'all' | 'selection';
  onCopy: () => Promise<void>;
  isVisible: boolean;
  isCopied: boolean;
  disabled: boolean;
  config: CopyButtonConfig;
  className?: string;
}
```

### ResetButton Component

```typescript
interface ResetButtonProps {
  onReset: () => void;
  hasGeneratedContent: boolean;
  disabled: boolean;
  className?: string;
}
```

## Hook Contracts

### useLoremText Hook

```typescript
interface UseLoremTextReturn {
  texts: LoremText[];
  originalText: LoremText;
  isGenerating: boolean;
  generateMore: (count?: number) => Promise<void>;
  reset: () => void;
  getAllText: () => string;
  getWordCount: () => number;
}
```

### useScrollDetection Hook

```typescript
interface UseScrollDetectionReturn {
  position: ScrollPosition;
  isNearBottom: boolean;
  velocity: number;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}
```

### useClipboard Hook

```typescript
interface UseClipboardReturn {
  state: ClipboardState;
  copyAll: () => Promise<boolean>;
  copySelection: () => Promise<boolean>;
  isSupported: boolean;
  reset: () => void;
}
```

### usePerformance Hook

```typescript
interface UsePerformanceReturn {
  metrics: PerformanceMetrics;
  isPerformant: boolean;
  cleanup: () => void;
}
```

## Event Contracts

### Scroll Events

```typescript
interface ScrollEvent {
  type: 'scroll';
  position: ScrollPosition;
  timestamp: number;
  source: 'wheel' | 'touch' | 'keyboard' | 'programmatic';
}
```

### Copy Events

```typescript
interface CopyEvent {
  type: 'copy-start' | 'copy-success' | 'copy-error';
  copyType: 'all' | 'selection';
  timestamp: number;
  error?: string;
}
```

### Generation Events

```typescript
interface GenerationEvent {
  type:
    | 'generation-start'
    | 'generation-progress'
    | 'generation-complete'
    | 'generation-error';
  paragraphs?: LoremText[];
  progress?: number;
  error?: string;
  timestamp: number;
}
```

## Utility Contracts

### Text Generation Utilities

```typescript
interface TextGenerator {
  generateWords(count: number): string[];
  generateSentence(wordCount: number): string;
  generateParagraph(sentenceCount: number): string;
  seedRandom(seed: string): () => number;
}
```

### Performance Utilities

```typescript
interface PerformanceUtils {
  measureFPS(): number;
  measureRenderTime(): number;
  estimateMemoryUsage(): number;
  throttle<T extends (...args: any[]) => any>(fn: T, delay: number): T;
  debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T;
}
```

### DOM Utilities

```typescript
interface DOMUtils {
  getScrollElement(): HTMLElement;
  getSelectedText(): string;
  copyToClipboard(text: string): Promise<boolean>;
  scrollTo(element: HTMLElement, options: ScrollToOptions): void;
  measureElement(element: HTMLElement): DOMRect;
}
```

## Configuration Contracts

### Application Configuration

```typescript
interface AppConfig {
  scroll: {
    threshold: number;
    debounceMs: number;
    maxVelocity: number;
  };
  generation: {
    chunkSize: number;
    maxParagraphs: number;
    wordsPerParagraph: { min: number; max: number };
    sentencesPerParagraph: { min: number; max: number };
  };
  performance: {
    targetFPS: number;
    maxMemoryMB: number;
    cleanupInterval: number;
  };
  clipboard: {
    autoHideDelay: number;
    feedbackDuration: number;
  };
}
```

## Error Handling Contracts

### Error Types

```typescript
interface AppError {
  type: 'generation' | 'clipboard' | 'performance' | 'scroll' | 'unknown';
  message: string;
  timestamp: number;
  context?: Record<string, any>;
}

interface ErrorHandler {
  handle(error: AppError): void;
  report(error: AppError): void;
  recover(type: AppError['type']): boolean;
}
```

## Testing Contracts

### Mock Interfaces

```typescript
interface MockTextGenerator extends TextGenerator {
  setGeneratedText(text: string[]): void;
  clearGeneratedText(): void;
}

interface MockScrollDetector extends ScrollDetectionAPI {
  setPosition(position: Partial<ScrollPosition>): void;
  triggerScroll(): void;
}

interface MockClipboard extends ClipboardAPI {
  setCopiedText(text: string): void;
  setSupported(supported: boolean): void;
}
```

### Test Utilities

```typescript
interface TestUtils {
  createMockLoremText(overrides?: Partial<LoremText>): LoremText;
  createMockScrollPosition(overrides?: Partial<ScrollPosition>): ScrollPosition;
  createMockClipboardState(overrides?: Partial<ClipboardState>): ClipboardState;
  waitFor(condition: () => boolean, timeout?: number): Promise<void>;
  simulateScroll(element: HTMLElement, position: number): void;
  simulateCopy(text: string): Promise<void>;
}
```

## Integration Points

### React Integration

All contracts are designed to work seamlessly with React 19:

- Components accept props as defined in component contracts
- Hooks return values as defined in hook contracts
- State management uses React built-in state hooks
- Event handling follows React event patterns

### Browser API Integration

Contracts abstract browser-specific implementations:

- Clipboard API abstraction for cross-browser compatibility
- Scroll detection unified across wheel/touch/keyboard events
- Performance monitoring using browser APIs where available

### Testing Integration

Contracts enable comprehensive testing:

- Mock implementations for all external dependencies
- Test utilities for common test scenarios
- Type-safe interfaces for test doubles
- Performance testing capabilities

These contracts provide a robust foundation for implementing the lorem ipsum generator with clear boundaries, type safety, and comprehensive testing support.

# Quick Start Guide: Lorem Ipsum Generator via Scrolling

**Feature**: 001-lorem-ipsum | **Date**: 2026-02-16  
**Purpose**: Quick reference for developers implementing the lorem ipsum generator

## Overview

A single-page React application that generates lorem ipsum text progressively as users scroll. The application features smooth 60fps scrolling, copy functionality, and full accessibility support.

## Architecture Summary

```
src/
├── components/
│   ├── App/
│   │   ├── App.tsx                 # Main application component
│   │   ├── App.types.ts            # App props interfaces
│   │   ├── App.test.tsx            # App component tests
│   │   └── index.ts                # Barrel export
│   ├── TextContainer/
│   │   ├── TextContainer.tsx       # Text display and scroll handling
│   │   ├── TextContainer.types.ts  # Text container interfaces
│   │   ├── TextContainer.test.tsx  # Text container tests
│   │   └── index.ts                # Barrel export
│   ├── CopyButton/
│   │   ├── CopyButton.tsx          # Copy functionality
│   │   ├── CopyButton.types.ts     # Copy button interfaces
│   │   ├── CopyButton.test.tsx     # Copy button tests
│   │   └── index.ts                # Barrel export
│   └── ResetButton/
│       ├── ResetButton.tsx         # Reset functionality
│       ├── ResetButton.types.ts    # Reset button interfaces
│       ├── ResetButton.test.tsx    # Reset button tests
│       └── index.ts                # Barrel export
├── hooks/
│   ├── useLoremText/
│   │   ├── useLoremText.ts         # Text generation logic
│   │   ├── useLoremText.test.ts    # Hook tests
│   │   └── index.ts                # Barrel export
│   ├── useScrollDetection/
│   │   ├── useScrollDetection.ts   # Scroll position monitoring
│   │   ├── useScrollDetection.test.ts # Scroll detection tests
│   │   └── index.ts                # Barrel export
│   ├── useClipboard/
│   │   ├── useClipboard.ts         # Clipboard operations
│   │   ├── useClipboard.test.ts    # Clipboard tests
│   │   └── index.ts                # Barrel export
│   └── usePerformance/
│       ├── usePerformance.ts       # Performance monitoring
│       ├── usePerformance.test.ts  # Performance tests
│       └── index.ts                # Barrel export
├── utils/
│   ├── textGenerator/
│   │   ├── textGenerator.ts        # Lorem ipsum generation algorithm
│   │   ├── textGenerator.test.ts   # Generation tests
│   │   └── index.ts                # Barrel export
│   ├── scrollUtils/
│   │   ├── scrollUtils.ts          # Scroll utilities
│   │   ├── scrollUtils.test.ts     # Scroll utility tests
│   │   └── index.ts                # Barrel export
│   ├── clipboardUtils/
│   │   ├── clipboardUtils.ts       # Clipboard utilities
│   │   ├── clipboardUtils.test.ts  # Clipboard utility tests
│   │   └── index.ts                # Barrel export
│   └── performanceUtils/
│       ├── performanceUtils.ts     # Performance utilities
│       ├── performanceUtils.test.ts # Performance tests
│       └── index.ts                # Barrel export
├── types/
│   ├── loremText.types.ts          # Text-related types
│   ├── scroll.types.ts             # Scroll-related types
│   ├── clipboard.types.ts          # Clipboard-related types
│   ├── performance.types.ts        # Performance-related types
│   └── index.ts                    # Barrel export
├── constants/
│   ├── config.ts                   # Application configuration
│   ├── loremText.ts                # Original lorem ipsum text
│   └── wordBank.ts                 # Word bank for generation
└── main.test.tsx                   # Entry point test
```

## Key Components

### App Component

**Purpose**: Main application container and state orchestration
**Key Features**:

- Combines all hooks for state management
- Handles component composition
- Manages application lifecycle

### TextContainer Component

**Purpose**: Display text and handle scroll detection
**Key Features**:

- Renders lorem ipsum text paragraphs
- Detects scroll position and triggers generation
- Handles text selection events
- Maintains smooth scrolling performance

### CopyButton Component

**Purpose**: Copy functionality for all/selected text
**Key Features**:

- Copy all generated text or selection
- Shows/hides based on user interaction
- Provides visual feedback
- Handles clipboard API fallbacks

### ResetButton Component

**Purpose**: Reset application to initial state
**Key Features**:

- Clears all generated text
- Returns to original lorem ipsum paragraph
- Only visible when content exists

## Key Hooks

### useLoremText

**Purpose**: Manage text generation and state
**Key Features**:

- Generates lorem ipsum text algorithmically
- Maintains text array and metadata
- Handles generation triggers
- Provides reset functionality

### useScrollDetection

**Purpose**: Monitor scroll position and velocity
**Key Features**:

- Tracks scroll position in real-time
- Detects when user approaches bottom
- Calculates scroll velocity
- Throttled for performance

### useClipboard

**Purpose**: Handle clipboard operations
**Key Features**:

- Copy all text or selection
- Browser compatibility handling
- Visual feedback management
- Error handling and recovery

### usePerformance

**Purpose**: Monitor and optimize performance
**Key Features**:

- FPS monitoring
- Memory usage tracking
- Cleanup management
- Performance threshold alerts

## Implementation Checklist

### Phase 1: Core Infrastructure

- [ ] Set up component structure with TypeScript interfaces
- [ ] Implement basic text generation algorithm
- [ ] Create scroll detection mechanism
- [ ] Set up performance monitoring
- [ ] Write initial test suites

### Phase 2: User Interaction

- [ ] Implement copy functionality with clipboard API
- [ ] Add copy button visibility logic
- [ ] Create reset functionality
- [ ] Handle mobile touch interactions
- [ ] Add keyboard navigation support

### Phase 3: Performance & Polish

- [ ] Optimize scrolling performance to 60fps
- [ ] Implement virtual scrolling for large text
- [ ] Add accessibility features (ARIA labels, etc.)
- [ ] Implement error boundaries
- [ ] Add comprehensive error handling

### Phase 4: Testing & Quality

- [ ] Achieve 100% test coverage
- [ ] Add performance benchmarks
- [ ] Implement accessibility testing
- [ ] Add cross-browser compatibility tests
- [ ] Validate WCAG 2.1 AA compliance

## Development Commands

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests in watch mode
npm test
```

### Quality Checks

```bash
# Lint code
npm run lint

# Type check
npm run lint:tsc

# Run tests with coverage
npm run test:ci

# Build for production
npm run build
```

### Testing Commands

```bash
# Run specific test file
npm test -- src/components/App/App.test.tsx

# Run tests with coverage for specific file
npm run test:ci -- src/hooks/useLoremText/useLoremText.test.ts

# Run performance tests
npm test -- --grep "performance"
```

## Key Implementation Details

### Text Generation Algorithm

- Use hardcoded word bank (~200 words)
- Generate sentences with 5-15 words
- Create paragraphs with 3-7 sentences
- Use seeded random for consistency
- Generate in chunks to prevent blocking

### Scroll Detection

- Use Intersection Observer API for efficiency
- Throttle events with requestAnimationFrame
- Detect bottom approach at 90% threshold
- Handle both wheel and touch events
- Calculate velocity for performance optimization

### Copy Functionality

- Primary: `navigator.clipboard.writeText()`
- Fallback: `document.execCommand('copy')`
- Show buttons on hover/selection/tap
- Provide visual feedback
- Handle clipboard permissions gracefully

### Performance Optimization

- React Compiler for automatic optimization
- Virtual scrolling for large text amounts
- Text chunking to prevent blocking
- Memory cleanup for large generations
- FPS monitoring and alerts

## Accessibility Requirements

### Semantic HTML

- Use `<main>`, `<section>`, `<button>` elements
- Proper heading hierarchy
- Logical content structure

### ARIA Support

- `aria-live` regions for copy feedback
- `aria-label` for all interactive elements
- `aria-describedby` for contextual information
- Focus management for keyboard navigation

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space for button activation
- Arrow keys for scrolling support
- Escape for modal dismissal

### Color & Contrast

- WCAG 2.1 AA compliant colors
- Sufficient contrast ratios
- Focus indicators visible
- High contrast mode support

## Browser Compatibility

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills Needed

- None required (React 19 handles most)
- Clipboard API fallback for older browsers
- Intersection Observer polyfill if needed

### Mobile Support

- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+
- Touch event handling unified with scroll

## Performance Targets

### Core Metrics

- 60fps scrolling during text generation
- <100ms interaction response time
- <2s initial page load
- <50MB memory usage with 10,000+ words

### Optimization Techniques

- React Compiler automatic optimization
- Virtual scrolling implementation
- Text generation chunking
- Event throttling and debouncing
- Memory cleanup management

## Troubleshooting

### Common Issues

- **Scroll lag**: Check event throttling and React optimization
- **Copy not working**: Verify clipboard API support and permissions
- **Memory issues**: Implement virtual scrolling and cleanup
- **Mobile problems**: Check touch event handling and responsive design

### Debug Tools

- React DevTools for component inspection
- Performance tab for FPS monitoring
- Memory tab for leak detection
- Accessibility inspector for ARIA testing

This quick start guide provides the essential information needed to implement the lorem ipsum generator efficiently and effectively.

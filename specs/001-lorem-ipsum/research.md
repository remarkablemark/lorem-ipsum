# Research: Lorem Ipsum Generator via Scrolling

**Feature**: 001-lorem-ipsum | **Date**: 2026-02-16  
**Purpose**: Resolve technical unknowns and establish best practices for implementation

## Scroll Detection & Performance

### Decision: Use Intersection Observer API with scroll event throttling

**Rationale**: Intersection Observer provides efficient, performant detection of scroll position without the performance overhead of continuous scroll event listeners. Combined with requestAnimationFrame throttling for smooth 60fps performance.
**Alternatives considered**:

- Pure scroll event listeners (rejected: performance issues with rapid scrolling)
- Waypoint elements (rejected: adds DOM complexity, less flexible)

### Implementation Details

- Use `IntersectionObserver` to detect when user approaches bottom of content (90% threshold)
- Throttle scroll events using `requestAnimationFrame` for performance
- Generate text in chunks to prevent blocking the main thread
- Use `React.startTransition` for non-urgent text generation updates

## Text Generation Algorithm

### Decision: Hardcoded word bank with Markov chain-inspired generation

**Rationale**: Provides deterministic, fast text generation without external dependencies while maintaining lorem ipsum-like word patterns.
**Alternatives considered**:

- External API calls (rejected: violates offline requirement)
- Simple random word selection (rejected: less natural text flow)

### Implementation Details

- Word bank: ~200 common lorem ipsum words
- Generate sentences with 5-15 words following typical lorem ipsum patterns
- Paragraph structure: 3-7 sentences per paragraph
- Use seeded random generation for consistent results

## Copy to Clipboard Implementation

### Decision: Modern Clipboard API with fallback

**Rationale**: `navigator.clipboard.writeText()` provides secure, modern clipboard access with proper permissions handling.
**Alternatives considered**:

- `document.execCommand('copy')` (rejected: deprecated, less reliable)

### Implementation Details

- Primary: `navigator.clipboard.writeText()` for modern browsers
- Fallback: `document.execCommand('copy')` for older browsers
- Provide visual feedback via button state changes
- Handle clipboard permissions gracefully

## Mobile Touch Interaction

### Decision: Unified touch and scroll event handling

**Rationale**: Single event handler approach reduces complexity and ensures consistent behavior across devices.
**Alternatives considered**:

- Separate touch/mouse handlers (rejected: code duplication, inconsistent behavior)

### Implementation Details

- Use `touchstart`/`touchend` events for mobile copy button visibility
- Combine with `mouseover`/`mouseout` for desktop hover behavior
- Unified scroll detection works for both touch and wheel events

## Memory Management

### Decision: Virtual scrolling approach for large text amounts

**Rationale**: Prevents memory issues with very large generated text while maintaining performance.
**Alternatives considered**:

- Keep all text in DOM (rejected: memory issues with 10,000+ words)
- Pagination (rejected: breaks continuous scrolling experience)

### Implementation Details

- Keep only visible text + buffer in DOM
- Remove off-screen text nodes but maintain in memory state
- Re-render text nodes as needed during scrolling
- Implement text generation limits to prevent infinite growth

## Accessibility Implementation

### Decision: Semantic HTML with ARIA enhancements

**Rationale**: Ensures WCAG 2.1 AA compliance with minimal complexity.
**Alternatives considered**:

- Custom ARIA widgets (rejected: unnecessary complexity)

### Implementation Details

- Use `<main>`, `<section>`, `<button>` semantic elements
- `aria-live` regions for copy feedback announcements
- `aria-label` for all interactive elements
- Keyboard navigation support (Tab, Enter, Space)
- Focus management for copy buttons

## React Component Architecture

### Decision: Functional components with custom hooks

**Rationale**: Leverages React 19 features and React Compiler for optimal performance.
**Alternatives considered**:

- Class components (rejected: legacy pattern, less performant)

### Implementation Details

- `useScrollDetection` hook for scroll position monitoring
- `useTextGeneration` hook for lorem ipsum generation logic
- `usePerformanceMonitoring` hook for 60fps tracking
- Component structure: `App`, `ResetButton`

## Testing Strategy

### Decision: Vitest with Testing Library following TDD principles

**Rationale**: Aligns with project standards and provides comprehensive testing capabilities.
**Alternatives considered**:

- Manual testing only (rejected: violates constitution requirements)

### Implementation Details

- Unit tests for all utility functions and hooks
- Component tests for user interactions
- Performance tests for scrolling behavior
- Accessibility tests with axe-core integration
- Mock clipboard API for testing copy functionality

## Performance Optimization

### Decision: React Compiler + manual optimizations

**Rationale**: React Compiler handles most optimizations, with targeted manual optimizations for critical paths.
**Alternatives considered**:

- Manual memoization only (rejected: error-prone, React Compiler is superior)

### Implementation Details

- Let React Compiler optimize component re-renders
- Use `React.startTransition` for text generation
- Implement text chunking to prevent blocking
- Monitor performance with `usePerformanceMonitoring` hook
- Bundle size optimization via code splitting

## Technology Stack Confirmation

All technologies align with the constitution requirements:

- ✅ React 19 with TypeScript 5 (strict mode)
- ✅ Vite 7 for build tooling
- ✅ Vitest 4 for testing framework
- ✅ Tailwind CSS 4 for styling
- ✅ ESLint 9 with Prettier for code quality
- ✅ No additional dependencies required

## Risk Assessment & Mitigation

### High Risk: Scroll Performance

**Mitigation**: Intersection Observer + requestAnimationFrame throttling + React.startTransition

### Medium Risk: Mobile Touch Support

**Mitigation**: Unified event handling approach with comprehensive device testing

### Low Risk: Memory Usage

**Mitigation**: Virtual scrolling approach with text generation limits

### Low Risk: Browser Compatibility

**Mitigation**: Clipboard API fallbacks and progressive enhancement

## Implementation Dependencies

No external dependencies required. All functionality can be implemented with:

- React 19 built-in hooks and APIs
- Browser native APIs (Clipboard, Intersection Observer)
- Project's existing toolchain (Vite, Vitest, Tailwind)

## Next Steps

With all technical unknowns resolved, proceed to Phase 1: Design & Contracts

- Generate data model from entities identified in spec
- Create API contracts (though minimal for client-side app)
- Update agent context with new patterns
- Finalize constitution check compliance

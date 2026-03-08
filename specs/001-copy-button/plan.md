# Implementation Plan: Copy Button

**Branch**: `001-copy-button` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-copy-button/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add an icon-only copy button (📋) to the header that copies all visible lorem ipsum text to the clipboard using the Clipboard API. The button provides visual feedback (📋 → ✓) for 2-3 seconds after successful copy, is keyboard accessible with WCAG 2.1 AA compliance, and handles clipboard permission denials gracefully.

## Technical Context

**Language/Version**: TypeScript 5 with React 19
**Primary Dependencies**: Vite 7, Vitest 4, Tailwind CSS 4, Clipboard API (browser native)
**Storage**: N/A (client-side only, clipboard managed by browser)
**Testing**: Vitest 4 with @testing-library/react, @testing-library/user-event for interactions
**Target Platform**: Web browser (responsive, desktop and mobile)
**Project Type**: Web application (single-page)
**Performance Goals**: <200ms copy operation, <100ms visual feedback, 60fps UI updates
**Constraints**: Must work without backend, accessibility WCAG 2.1 AA, handle clipboard permission denials
**Scale/Scope**: Single copy button component in header, handles text up to 10,000+ words
**Browser APIs**: Clipboard API (navigator.clipboard.writeText), requires HTTPS or localhost
**State Management**: React hooks for clipboard state (idle/copying/success/error) and feedback timer
**Accessibility**: ARIA labels for icon-only button, keyboard navigation (Tab/Enter/Space), visible focus indicators
**Error Handling**: Graceful fallback for clipboard API unavailable/denied, user-friendly error messages

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- ✅ **User Experience First**: Copy button provides immediate visual feedback (<100ms), smooth state transitions, responsive on all devices
- ✅ **React Component Architecture**: CopyButton as functional component with TypeScript interfaces, uses React hooks for state
- ✅ **Test-First Development**: TDD mandatory - tests written first for copy operation, visual feedback, keyboard access, error handling
- ✅ **Accessibility & Semantic HTML**: Semantic <button> element, ARIA labels for screen readers, keyboard accessible, visible focus ring
- ✅ **Performance & Optimization**: Copy operation <200ms, no UI blocking, efficient text concatenation, timer cleanup on unmount

**Gate Status**: ✅ PASS - All constitutional principles satisfied, no violations to justify

## Project Structure

### Documentation (this feature)

```text
specs/001-copy-button/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── App/
│   │   ├── App.tsx              # Update to include CopyButton in header
│   │   ├── App.types.ts
│   │   ├── App.test.tsx         # Update tests for CopyButton integration
│   │   └── index.ts
│   ├── CopyButton/              # NEW: Copy button component
│   │   ├── CopyButton.tsx       # Main component with clipboard logic
│   │   ├── CopyButton.types.ts  # ClipboardState, CopyButtonProps interfaces
│   │   ├── CopyButton.test.tsx  # Comprehensive tests (clipboard API, feedback, a11y)
│   │   └── index.ts             # Barrel export
│   └── ErrorBoundary/
├── hooks/
│   ├── useLoremText/            # Existing hook - provides text to copy
│   ├── useScrollDetection/
│   └── index.ts
├── types/
│   ├── clipboard.types.ts       # NEW: Shared clipboard-related types
│   ├── loremText.types.ts
│   ├── scroll.types.ts
│   └── index.ts
├── utils/
│   ├── clipboard.ts             # NEW: Clipboard utility functions
│   ├── clipboard.test.ts        # NEW: Clipboard utility tests
│   └── index.ts
├── constants/
│   ├── config.ts                # May add COPY_FEEDBACK_DURATION constant
│   └── index.ts
├── main.tsx
├── main.test.tsx
├── setupTests.ts
└── style.css

public/                          # Static assets (no changes)
```

**Structure Decision**: Add CopyButton component following existing patterns. Create clipboard utilities for text concatenation and API interaction. Update App component to render CopyButton in header. All new code follows established component structure with TypeScript interfaces, comprehensive tests, and barrel exports.

## Constitution Check (Post-Design Re-evaluation)

_Re-evaluated after Phase 1 design completion_

### I. User Experience First ✅

- **Copy operation**: <200ms for up to 10,000 words (efficient Array.join)
- **Visual feedback**: <100ms state transitions (React state updates)
- **Smooth interactions**: No UI blocking (async clipboard operations)
- **Responsive**: Works on desktop and mobile/touch devices
- **Feedback duration**: 2.5 seconds balances visibility with UX

**Status**: PASS - All UX requirements met

### II. React Component Architecture ✅

- **CopyButton**: Functional component with TypeScript interfaces
- **Props-based data flow**: originalText and texts passed from App
- **React hooks**: useState for state, useEffect for timer cleanup
- **Type safety**: All props and state properly typed
- **Component structure**: Follows established pattern (tsx, types.ts, test.tsx, index.ts)

**Status**: PASS - Follows React 19 and project patterns

### III. Test-First Development ✅

- **TDD workflow**: Tests written before implementation (RED-GREEN-REFACTOR)
- **Coverage**: 100% required for all new files
- **Test files**: clipboard.test.ts, CopyButton.test.tsx
- **Test cases**: Copy success/failure, visual feedback, keyboard access, ARIA labels, rapid clicks
- **Mocking**: Clipboard API mocked for deterministic tests

**Status**: PASS - TDD workflow enforced in quickstart.md

### IV. Accessibility & Semantic HTML ✅

- **Semantic HTML**: `<button>` element (not div with role)
- **ARIA labels**: Dynamic aria-label based on state
- **Keyboard navigation**: Tab, Enter, Space all supported
- **Focus indicators**: Visible focus ring (focus:ring-2, blue, 2px)
- **Screen readers**: State changes announced via aria-label updates
- **WCAG 2.1 AA**: All requirements met (1.3.1, 2.1.1, 2.4.7, 4.1.2)

**Status**: PASS - Full accessibility compliance

### V. Performance & Optimization ✅

- **Copy operation**: <200ms target (clipboard API + text concatenation)
- **Text concatenation**: O(n) complexity, <10ms for typical usage
- **Timer cleanup**: useEffect cleanup prevents memory leaks
- **No manual optimization**: React Compiler handles memoization
- **Bundle size**: No new dependencies (uses browser native Clipboard API)

**Status**: PASS - Performance targets met, no unnecessary dependencies

### Overall Assessment

**Gate Status**: ✅ PASS - All constitutional principles satisfied

**New Dependencies**: None (Clipboard API is browser native)

**Complexity Justification**: Not required - no violations

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |

**Note**: No constitutional violations. All principles satisfied by design.

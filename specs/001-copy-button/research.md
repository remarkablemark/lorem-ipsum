# Research: Copy Button Feature

**Feature**: Copy Button  
**Date**: 2026-03-07  
**Phase**: 0 - Research & Discovery

## Overview

This document consolidates research findings for implementing a copy-to-clipboard button in the Lorem Ipsum Generator React application. The research focuses on Clipboard API usage, React patterns, accessibility requirements, and error handling strategies.

---

## 1. Clipboard API Implementation

### Decision: Use navigator.clipboard.writeText()

**Rationale**:

- Modern, promise-based API supported in all target browsers
- Requires HTTPS or localhost (development environment compatible)
- Provides built-in permission handling
- Returns promise for error handling
- No need for document.execCommand() fallback in modern browsers

**Browser Compatibility**:

- Chrome 66+ ✅
- Firefox 63+ ✅
- Safari 13.1+ ✅
- Edge 79+ ✅
- Mobile browsers (iOS Safari 13.4+, Chrome Android 66+) ✅

**Implementation Pattern**:

```typescript
async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
```

**Alternatives Considered**:

- **document.execCommand('copy')**: Deprecated, synchronous, requires DOM manipulation
- **Clipboard.js library**: Unnecessary dependency, adds bundle size, native API sufficient
- **Manual textarea selection**: Complex, poor UX, not needed with modern API

**Reference**: [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)

---

## 2. React State Management for Clipboard Operations

### Decision: useState for clipboard state + useEffect for timer cleanup

**Rationale**:

- Simple state machine: idle → copying → success/error → idle
- useEffect handles timer cleanup on unmount (prevents memory leaks)
- No need for useCallback/useMemo (React Compiler optimizes automatically)
- Aligns with React 19 best practices and project constitution

**State Shape**:

```typescript
type ClipboardState = 'idle' | 'copying' | 'success' | 'error';

const [clipboardState, setClipboardState] = useState<ClipboardState>('idle');
```

**Timer Pattern**:

```typescript
useEffect(() => {
  if (clipboardState === 'success' || clipboardState === 'error') {
    const timer = setTimeout(() => {
      setClipboardState('idle');
    }, FEEDBACK_DURATION);

    return () => clearTimeout(timer);
  }
}, [clipboardState]);
```

**Alternatives Considered**:

- **useReducer**: Over-engineered for simple state machine, adds complexity
- **Custom hook (useCopyToClipboard)**: Could extract later if reused, start simple
- **External state library**: Violates constitution (no new dependencies without justification)

**Reference**: [React Hooks Documentation](https://react.dev/reference/react)

---

## 3. Accessibility Best Practices for Icon-Only Buttons

### Decision: Semantic <button> with aria-label and visible focus ring

**Rationale**:

- WCAG 2.1 AA requires accessible name for all interactive elements
- Icon-only buttons need aria-label for screen readers
- Visible focus indicator required for keyboard navigation
- Semantic HTML improves compatibility with assistive technologies

**Implementation Pattern**:

```typescript
<button
  type="button"
  aria-label={clipboardState === 'success' ? 'Text copied' : 'Copy text to clipboard'}
  className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
  onClick={handleCopy}
>
  {clipboardState === 'success' ? '✅' : '📋'}
</button>
```

**WCAG 2.1 AA Requirements**:

- ✅ **1.3.1 Info and Relationships**: Semantic <button> element
- ✅ **2.1.1 Keyboard**: Accessible via Tab, Enter, Space
- ✅ **2.4.7 Focus Visible**: Visible focus ring (Tailwind focus:ring-2)
- ✅ **4.1.2 Name, Role, Value**: aria-label provides accessible name

**Alternatives Considered**:

- **<div role="button">**: Non-semantic, requires manual keyboard handling, fails WCAG
- **aria-describedby**: Unnecessary complexity, aria-label sufficient for simple button
- **title attribute only**: Not announced by screen readers, insufficient for a11y

**Reference**: [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 4. Error Handling for Clipboard Permissions

### Decision: Try-catch with user-friendly error messages and state feedback

**Rationale**:

- Clipboard API throws DOMException when permission denied
- Users need clear feedback when copy fails
- Error state should be temporary (2-3 seconds) like success state
- Graceful degradation maintains UX even when clipboard unavailable

**Error Scenarios**:

1. **Permission Denied**: User explicitly denied clipboard access
2. **API Unavailable**: Browser doesn't support Clipboard API (rare in modern browsers)
3. **HTTPS Required**: Page served over HTTP (development uses localhost, production uses HTTPS)
4. **Security Context**: Clipboard API called outside user gesture (shouldn't happen with button click)

**Implementation Pattern**:

```typescript
async function handleCopy() {
  setClipboardState('copying');

  try {
    await navigator.clipboard.writeText(textToCopy);
    setClipboardState('success');
  } catch (error) {
    console.error('Failed to copy text:', error);
    setClipboardState('error');
  }
}
```

**Error Feedback**:

- Visual: Button shows error icon (❌) for 2-3 seconds
- Accessible: aria-label updates to "Failed to copy text"
- Console: Error logged for debugging (development only)

**Alternatives Considered**:

- **Silent failure**: Poor UX, user doesn't know copy failed
- **Alert/modal**: Disruptive, over-engineered for simple error
- **Fallback to execCommand**: Adds complexity, modern browsers support Clipboard API

**Reference**: [MDN Clipboard API Error Handling](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText#exceptions)

---

## 5. Visual Feedback Patterns

### Decision: Emoji state transition (📋 → ✅) with 2-3 second timeout

**Rationale**:

- Emoji provides universal, language-agnostic feedback
- State transition clearly indicates action completion
- 2-3 second duration balances visibility with UX (not too fast, not too slow)
- No additional dependencies (no icon libraries needed)

**Feedback States**:

- **Idle**: 📋 (clipboard emoji)
- **Copying**: 📋 (same, operation is fast <200ms)
- **Success**: ✅ (checkmark, 2-3 seconds)
- **Error**: ❌ (cross mark, 2-3 seconds)

**Timing Constant**:

```typescript
export const COPY_FEEDBACK_DURATION = 2500; // 2.5 seconds
```

**Hover/Focus Styling**:

- Default: No background, cursor pointer
- Hover: Light gray background (Tailwind: hover:bg-gray-100)
- Focus: Blue focus ring (Tailwind: focus:ring-2 focus:ring-blue-500)
- Active: Slightly darker gray (Tailwind: active:bg-gray-200)

**Alternatives Considered**:

- **Text labels ("Copy" → "Copied!")**: Requires more space, less clean for icon-only button
- **Icon libraries (Lucide, Heroicons)**: Unnecessary dependency for simple emoji
- **Color change only**: Less accessible, harder to perceive for colorblind users
- **Animation**: Over-engineered, adds complexity, emoji transition sufficient

**Reference**: [Material Design - Feedback Patterns](https://m2.material.io/design/communication/confirmation-acknowledgement.html)

---

## 6. Text Concatenation Strategy

### Decision: Join originalText.content + texts array with double newlines

**Rationale**:

- Preserves paragraph structure when pasted
- Double newlines (\n\n) create visual separation in plain text
- Efficient for large text (10,000+ words) using Array.join()
- Matches user expectation of paragraph formatting

**Implementation Pattern**:

```typescript
function concatenateLoremText(
  originalText: LoremText,
  texts: LoremText[],
): string {
  const allTexts = [originalText, ...texts];
  return allTexts.map((text) => text.content).join('\n\n');
}
```

**Performance Consideration**:

- Array.join() is O(n) and optimized by JS engines
- For 10,000 words (~50 paragraphs), concatenation takes <10ms
- Well within <200ms copy operation budget

**Alternatives Considered**:

- **Single newline (\n)**: Paragraphs run together, poor readability
- **String concatenation (+)**: Less efficient for large arrays, creates intermediate strings
- **Template literals**: Same performance as join(), less readable for array operations

---

## 7. Testing Strategy

### Decision: TDD with @testing-library/react and mocked Clipboard API

**Rationale**:

- Tests written first per constitution (mandatory TDD)
- Mock navigator.clipboard for deterministic tests
- @testing-library/user-event simulates real user interactions
- 100% coverage required (all branches, error paths)

**Test Cases**:

1. **Copy operation success**: Mock clipboard.writeText resolves, verify success state
2. **Copy operation failure**: Mock clipboard.writeText rejects, verify error state
3. **Visual feedback timing**: Verify state returns to idle after timeout
4. **Keyboard accessibility**: Tab to button, press Enter/Space, verify copy
5. **ARIA labels**: Verify aria-label updates based on state
6. **Focus indicators**: Verify focus ring visible when focused
7. **Multiple rapid clicks**: Verify timer resets correctly
8. **Clipboard API unavailable**: Verify graceful error handling

**Mock Pattern**:

```typescript
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});
```

**Reference**: [Testing Library Best Practices](https://testing-library.com/docs/react-testing-library/intro/)

---

## 8. Integration with Existing App

### Decision: Add CopyButton to App header, pass text via props

**Rationale**:

- App component already has header structure
- useLoremText hook provides originalText and texts state
- Props-based data flow keeps components decoupled
- No global state needed (text already available in App)

**Integration Pattern**:

```typescript
// In App.tsx
const { originalText, texts } = useLoremText();

<header>
  <h1>Lorem Ipsum Generator</h1>
  <CopyButton originalText={originalText} texts={texts} />
</header>
```

**Component Interface**:

```typescript
interface CopyButtonProps {
  originalText: LoremText;
  texts: LoremText[];
}
```

**Alternatives Considered**:

- **Context API**: Over-engineered, adds complexity, props sufficient
- **Separate hook in CopyButton**: Duplicates state, violates single source of truth
- **Global state library**: Violates constitution (no new dependencies)

---

## Summary of Key Decisions

| Area                   | Decision                        | Rationale                             |
| ---------------------- | ------------------------------- | ------------------------------------- |
| **Clipboard API**      | navigator.clipboard.writeText() | Modern, promise-based, well-supported |
| **State Management**   | useState + useEffect            | Simple, aligns with React 19 patterns |
| **Accessibility**      | Semantic <button> + aria-label  | WCAG 2.1 AA compliance                |
| **Error Handling**     | Try-catch with state feedback   | Graceful, user-friendly               |
| **Visual Feedback**    | Emoji transition (📋 → ✅)      | Universal, no dependencies            |
| **Text Concatenation** | Array.join('\n\n')              | Efficient, preserves formatting       |
| **Testing**            | TDD with mocked Clipboard API   | Constitutional requirement            |
| **Integration**        | Props from App component        | Decoupled, simple data flow           |

---

## Open Questions Resolved

All technical unknowns from the feature specification have been resolved:

- ✅ **Clipboard API usage**: navigator.clipboard.writeText()
- ✅ **Browser compatibility**: All modern browsers supported
- ✅ **Error handling**: Try-catch with user-friendly state feedback
- ✅ **Accessibility patterns**: WCAG 2.1 AA compliant with aria-label and focus ring
- ✅ **Visual feedback**: Emoji state transition with 2.5 second timeout
- ✅ **Text concatenation**: Array.join() with double newlines
- ✅ **Testing approach**: TDD with mocked Clipboard API
- ✅ **Integration strategy**: Props-based data flow from App component

**Status**: ✅ Phase 0 Complete - Ready for Phase 1 Design

# Component Interface Contract: CopyButton

**Version**: 1.0.0  
**Date**: 2026-03-07  
**Status**: Done

## Overview

This contract defines the public interface for the `CopyButton` component, including props, events, accessibility requirements, and visual states.

---

## Component Signature

```typescript
import type { LoremText } from 'src/types';

interface CopyButtonProps {
  /** Array of all lorem ipsum paragraphs (includes original as first element) */
  texts: LoremText[];
}

export function CopyButton(props: CopyButtonProps): JSX.Element;
```

---

## Props Contract

### Required Props

#### `texts: LoremText[]`

- **Required**: Yes
- **Description**: Array of all lorem ipsum paragraphs including the original text as the first element
- **Type**: `LoremText[]` (array of `LoremText` objects)
- **Usage**: All text content to be copied to clipboard
- **Validation**: Must contain at least one element (the original text)
- **Note**: The first element (`texts[0]`) is always the original lorem ipsum text
- **Example**:
  ```typescript
  [
    { id: '1', content: 'Lorem ipsum dolor sit amet...' },
    { id: '2', content: 'Consectetur adipiscing elit...' },
    { id: '3', content: 'Sed do eiusmod tempor...' },
  ];
  ```

---

## Visual States

### State: Idle

- **Icon**: 📋 (clipboard emoji)
- **ARIA Label**: "Copy text to clipboard"
- **Background**: None (transparent)
- **Cursor**: pointer
- **Hover**: Light gray background (`hover:bg-gray-100`)
- **Focus**: Blue focus ring (`focus:ring-2 focus:ring-blue-500`)

### State: Copying

- **Icon**: 📋 (clipboard emoji, same as idle)
- **ARIA Label**: "Copying text"
- **Duration**: Transient (<200ms)
- **Visual**: Same as idle (operation too fast for visual change)

### State: Success

- **Icon**: ✅ (checkmark)
- **ARIA Label**: "Text copied"
- **Duration**: 2500ms (2.5 seconds)
- **Auto-reset**: Returns to idle after timeout

### State: Error

- **Icon**: ❌ (cross mark)
- **ARIA Label**: "Failed to copy text"
- **Duration**: 2500ms (2.5 seconds)
- **Auto-reset**: Returns to idle after timeout

---

## Accessibility Contract

### WCAG 2.1 AA Compliance

#### 1.3.1 Info and Relationships (Level A)

- ✅ Uses semantic `<button>` element
- ✅ Proper role and structure for assistive technologies

#### 2.1.1 Keyboard (Level A)

- ✅ Accessible via Tab key navigation
- ✅ Activates with Enter key
- ✅ Activates with Space key
- ✅ No keyboard traps

#### 2.4.7 Focus Visible (Level AA)

- ✅ Visible focus indicator (blue ring, 2px width)
- ✅ Focus ring has sufficient contrast (3:1 minimum)
- ✅ Focus ring visible in all states

#### 4.1.2 Name, Role, Value (Level A)

- ✅ `aria-label` provides accessible name
- ✅ `aria-label` updates based on state
- ✅ Role="button" implicit from semantic HTML
- ✅ State changes announced to screen readers

### Screen Reader Announcements

| State   | Announcement                     |
| ------- | -------------------------------- |
| Idle    | "Copy text to clipboard, button" |
| Copying | "Copying text, button"           |
| Success | "Text copied, button"            |
| Error   | "Failed to copy text, button"    |

---

## Behavior Contract

### User Interactions

#### Click/Tap

1. User clicks/taps button
2. State changes to 'copying'
3. Text concatenated from `originalText` and `texts`
4. Clipboard API called with concatenated text
5. On success: State changes to 'success', timer starts
6. On error: State changes to 'error', timer starts
7. After 2500ms: State resets to 'idle'

#### Keyboard Activation

1. User navigates to button with Tab
2. Button receives focus (visible focus ring)
3. User presses Enter or Space
4. Same behavior as click/tap

#### Rapid Clicks

- Multiple clicks during feedback period reset timer
- Last click determines final state
- No queuing of operations (latest operation wins)

### Text Concatenation Rules

- Combine `originalText.content` with all `texts[].content`
- Separate paragraphs with double newlines (`\n\n`)
- Preserve order: originalText first, then texts in array order
- No trimming or modification of content

**Example**:

```typescript
// Input
originalText = { id: '1', content: 'Lorem ipsum' };
texts = [
  { id: '2', content: 'Dolor sit' },
  { id: '3', content: 'Amet consectetur' },
];

// Clipboard content
('Lorem ipsum\n\nDolor sit\n\nAmet consectetur');
```

---

## Error Handling Contract

### Error Scenarios

#### 1. Clipboard API Not Available

- **Cause**: Browser doesn't support `navigator.clipboard`
- **Behavior**: State changes to 'error'
- **User Feedback**: Error icon (❌) for 2.5 seconds
- **Console**: Error logged (development only)

#### 2. Permission Denied

- **Cause**: User denied clipboard access
- **Behavior**: State changes to 'error'
- **User Feedback**: Error icon (❌) for 2.5 seconds
- **Console**: Error logged (development only)

#### 3. Security Context Error

- **Cause**: Clipboard API called outside secure context (HTTP, not HTTPS)
- **Behavior**: State changes to 'error'
- **User Feedback**: Error icon (❌) for 2.5 seconds
- **Console**: Error logged (development only)

### Error Recovery

- All errors are temporary (auto-reset after 2.5 seconds)
- User can retry immediately after error state clears
- No persistent error state or error messages
- No modal dialogs or alerts

---

## Performance Contract

### Timing Requirements

| Operation                         | Maximum Duration | Target |
| --------------------------------- | ---------------- | ------ |
| Copy operation                    | 200ms            | <100ms |
| Visual feedback                   | 100ms            | <50ms  |
| State transition                  | 16ms             | <8ms   |
| Text concatenation (10,000 words) | 50ms             | <10ms  |

### Resource Management

- Timer cleanup on component unmount (no memory leaks)
- Timer cleanup on state change (no stale timeouts)
- No event listener leaks
- Efficient re-renders (React Compiler optimization)

---

## Styling Contract

### Default Styles (Tailwind CSS)

```typescript
// Base button styles
'inline-flex items-center justify-center p-2 rounded-md transition-colors duration-150';

// State-specific styles
'hover:bg-gray-100 active:bg-gray-200';
'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
```

### Customization

- Component uses fixed Tailwind classes for consistent styling
- All styling is internal to maintain accessibility requirements

---

## Testing Contract

### Required Test Coverage

1. **Copy operation success**
   - Mock clipboard API to resolve
   - Verify state transitions: idle → copying → success → idle
   - Verify correct text copied to clipboard

2. **Copy operation failure**
   - Mock clipboard API to reject
   - Verify state transitions: idle → copying → error → idle
   - Verify error handling

3. **Visual feedback timing**
   - Verify success state lasts 2500ms
   - Verify error state lasts 2500ms
   - Verify state resets to idle after timeout

4. **Keyboard accessibility**
   - Tab to button, verify focus ring visible
   - Press Enter, verify copy operation
   - Press Space, verify copy operation

5. **ARIA labels**
   - Verify aria-label updates based on state
   - Verify screen reader announcements

6. **Multiple rapid clicks**
   - Click button multiple times quickly
   - Verify timer resets correctly
   - Verify no stale timeouts

7. **Text concatenation**
   - Verify originalText + texts concatenated correctly
   - Verify double newline separators
   - Verify order preserved

8. **Component unmount**
   - Unmount during success/error state
   - Verify timer cleanup (no memory leaks)

### Test Tools

- **Testing Library**: `@testing-library/react`
- **User Events**: `@testing-library/user-event`
- **Test Framework**: Vitest
- **Mocking**: `vi.fn()` for clipboard API

---

## Version History

| Version | Date       | Changes                     |
| ------- | ---------- | --------------------------- |
| 1.0.0   | 2026-03-07 | Initial contract definition |

---

## References

- [Clipboard API Specification](https://w3c.github.io/clipboard-apis/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Component Patterns](https://react.dev/learn)
- [Testing Library Best Practices](https://testing-library.com/docs/react-testing-library/intro/)

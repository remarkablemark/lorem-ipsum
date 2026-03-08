# Data Model: Copy Button Feature

**Feature**: Copy Button  
**Date**: 2026-03-07  
**Phase**: 1 - Design

## Overview

This document defines the data structures, types, and state management for the copy-to-clipboard feature. The model focuses on clipboard operation state, visual feedback timing, and text aggregation.

---

## 1. Core Entities

### 1.1 ClipboardState

**Purpose**: Represents the current state of the clipboard operation

**Type Definition**:

```typescript
type ClipboardState = 'idle' | 'copying' | 'success' | 'error';
```

**States**:

- **idle**: Default state, button ready for user interaction
- **copying**: Transient state during async clipboard operation (typically <200ms)
- **success**: Copy operation completed successfully, visual feedback active
- **error**: Copy operation failed, error feedback active

**State Transitions**:

```
idle → copying → success → idle (after timeout)
idle → copying → error → idle (after timeout)
```

**Validation Rules**:

- State must be one of the four defined values
- Transitions must follow the defined flow (no direct idle → success)
- Timeout must reset success/error states to idle

---

### 1.2 CopyButtonProps

**Purpose**: Component interface for CopyButton

**Type Definition**:

```typescript
interface CopyButtonProps {
  originalText: LoremText;
  texts: LoremText[];
}
```

**Fields**:

- **originalText** (required): The initial lorem ipsum text displayed on page load
  - Type: `LoremText` (from existing types)
  - Validation: Must have valid `content` property
- **texts** (required): Array of generated lorem ipsum paragraphs
  - Type: `LoremText[]` (from existing types)
  - Validation: Can be empty array (only originalText copied)

**Relationships**:

- Depends on existing `LoremText` type from `src/types/loremText.types.ts`
- Used by `App` component to pass text data

---

### 1.3 FeedbackTimer

**Purpose**: Manages the duration of success/error feedback display

**Implementation**: React useEffect cleanup pattern

**Configuration**:

```typescript
export const COPY_FEEDBACK_DURATION = 2500; // milliseconds (2.5 seconds)
```

**Behavior**:

- Timer starts when state changes to 'success' or 'error'
- Timer resets if state changes before completion (e.g., rapid clicks)
- Timer cleanup on component unmount prevents memory leaks
- Timer cleanup on state change prevents stale timeouts

**Validation Rules**:

- Duration must be positive integer
- Timer must be cleared on unmount
- Timer must be cleared on state change

---

## 2. Utility Functions

### 2.1 concatenateLoremText

**Purpose**: Combines all lorem ipsum text into a single string for clipboard

**Signature**:

```typescript
function concatenateLoremText(
  originalText: LoremText,
  texts: LoremText[],
): string;
```

**Parameters**:

- **originalText**: The initial text (always present)
- **texts**: Array of generated paragraphs (may be empty)

**Returns**:

- Single string with all text content separated by double newlines (`\n\n`)

**Algorithm**:

1. Combine originalText and texts array into single array
2. Map each LoremText to its content property
3. Join all content strings with `\n\n` separator

**Example**:

```typescript
// Input
originalText = { id: '1', content: 'Lorem ipsum dolor sit amet' };
texts = [
  { id: '2', content: 'Consectetur adipiscing elit' },
  { id: '3', content: 'Sed do eiusmod tempor' },
];

// Output
('Lorem ipsum dolor sit amet\n\nConsectetur adipiscing elit\n\nSed do eiusmod tempor');
```

**Performance**:

- Time complexity: O(n) where n is total number of paragraphs
- Space complexity: O(m) where m is total character count
- Handles 10,000+ words efficiently (<10ms)

---

### 2.2 copyToClipboard

**Purpose**: Wrapper for Clipboard API with error handling

**Signature**:

```typescript
async function copyToClipboard(text: string): Promise<void>;
```

**Parameters**:

- **text**: String to copy to clipboard

**Returns**:

- Promise that resolves on success, rejects on error

**Error Cases**:

- `NotAllowedError`: User denied clipboard permission
- `SecurityError`: Clipboard API not available (HTTP context, not user gesture)
- `TypeError`: Invalid text parameter

**Implementation**:

```typescript
async function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API not available');
  }
  await navigator.clipboard.writeText(text);
}
```

---

## 3. Component State

### 3.1 CopyButton Component State

**State Variables**:

```typescript
const [clipboardState, setClipboardState] = useState<ClipboardState>('idle');
```

**Derived Values**:

- **buttonIcon**: Computed from clipboardState
  - idle/copying: '📋'
  - success: '✓'
  - error: '❌'
- **ariaLabel**: Computed from clipboardState
  - idle: 'Copy text to clipboard'
  - copying: 'Copying text'
  - success: 'Text copied'
  - error: 'Failed to copy text'

**State Updates**:

- User clicks button → setClipboardState('copying')
- Clipboard write succeeds → setClipboardState('success')
- Clipboard write fails → setClipboardState('error')
- Timeout expires → setClipboardState('idle')

---

## 4. Type Definitions Summary

### New Types (to be created)

**File**: `src/types/clipboard.types.ts`

```typescript
/**
 * Represents the current state of a clipboard operation
 */
export type ClipboardState = 'idle' | 'copying' | 'success' | 'error';
```

**File**: `src/components/CopyButton/CopyButton.types.ts`

```typescript
import type { LoremText } from 'src/types';

/**
 * Props for the CopyButton component
 */
export interface CopyButtonProps {
  /** The original lorem ipsum text */
  originalText: LoremText;
  /** Array of generated lorem ipsum paragraphs */
  texts: LoremText[];
}
```

**File**: `src/utils/clipboard.ts`

```typescript
import type { LoremText } from 'src/types';

/**
 * Concatenates lorem ipsum text with double newline separators
 */
export function concatenateLoremText(
  originalText: LoremText,
  texts: LoremText[],
): string;

/**
 * Copies text to clipboard using Clipboard API
 * @throws {Error} If Clipboard API is not available
 * @throws {DOMException} If clipboard write fails
 */
export async function copyToClipboard(text: string): Promise<void>;
```

**File**: `src/constants/config.ts` (addition)

```typescript
/**
 * Duration in milliseconds to display copy feedback (success/error)
 */
export const COPY_FEEDBACK_DURATION = 2500;
```

### Existing Types (used)

**File**: `src/types/loremText.types.ts` (existing)

```typescript
export interface LoremText {
  id: string;
  content: string;
}
```

---

## 5. Data Flow

### Copy Operation Flow

```
User clicks CopyButton
  ↓
handleCopy() called
  ↓
setClipboardState('copying')
  ↓
concatenateLoremText(originalText, texts) → string
  ↓
copyToClipboard(string) → Promise
  ↓
  ├─ Success: setClipboardState('success')
  │    ↓
  │    setTimeout(2500ms)
  │    ↓
  │    setClipboardState('idle')
  │
  └─ Error: setClipboardState('error')
       ↓
       setTimeout(2500ms)
       ↓
       setClipboardState('idle')
```

### Component Integration Flow

```
App Component
  ↓
useLoremText() → { originalText, texts }
  ↓
<CopyButton originalText={originalText} texts={texts} />
  ↓
CopyButton renders with current state
  ↓
User interaction triggers copy operation
```

---

## 6. Validation & Constraints

### Input Validation

- **originalText**: Must be valid LoremText object with non-empty content
- **texts**: Must be array (can be empty)
- **clipboardState**: Must be one of four defined states
- **COPY_FEEDBACK_DURATION**: Must be positive integer (2000-5000ms recommended)

### Business Rules

- Copy button always enabled (app always has originalText on load)
- Feedback duration consistent for success and error states
- State resets to idle after timeout, not on user interaction
- Multiple rapid clicks reset timer (last click wins)

### Performance Constraints

- Copy operation must complete in <200ms for up to 10,000 words
- Visual feedback must appear within 100ms of state change
- Timer cleanup must prevent memory leaks
- Text concatenation must be efficient (O(n) complexity)

---

## 7. Testing Considerations

### Test Data

**Minimal Case**:

```typescript
originalText = { id: '1', content: 'Lorem ipsum' };
texts = [];
// Expected output: "Lorem ipsum"
```

**Standard Case**:

```typescript
originalText = { id: '1', content: 'Lorem ipsum' };
texts = [
  { id: '2', content: 'Paragraph 2' },
  { id: '3', content: 'Paragraph 3' },
];
// Expected output: "Lorem ipsum\n\nParagraph 2\n\nParagraph 3"
```

**Large Case**:

```typescript
// 50 paragraphs, ~10,000 words
// Should complete in <200ms
```

### State Transitions to Test

- idle → copying → success → idle
- idle → copying → error → idle
- success → copying (rapid click during feedback)
- Timer cleanup on unmount
- Timer reset on state change

---

## Summary

The copy button feature uses a simple state machine (`ClipboardState`) to manage clipboard operations and visual feedback. Data flows from the App component through props to CopyButton, which handles user interaction, text concatenation, and clipboard API calls. The model prioritizes simplicity, type safety, and performance while maintaining accessibility and error handling requirements.

**Key Design Decisions**:

- Minimal state (single `clipboardState` variable)
- Reuse existing `LoremText` type
- Utility functions for text concatenation and clipboard operations
- Timer-based feedback reset (no manual user dismissal)
- Props-based data flow (no global state)

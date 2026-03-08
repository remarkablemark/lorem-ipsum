# Utility Functions Contract: Clipboard Operations

**Version**: 1.0.0  
**Date**: 2026-03-07  
**Status**: Draft

## Overview

This contract defines the utility functions for clipboard operations and text concatenation used by the CopyButton component.

---

## Function: concatenateLoremText

### Signature

```typescript
function concatenateLoremText(
  originalText: LoremText,
  texts: LoremText[],
): string;
```

### Purpose

Combines the original lorem ipsum text with all generated paragraphs into a single string suitable for clipboard copying.

### Parameters

#### `originalText: LoremText`

- **Description**: The initial lorem ipsum text
- **Type**: `LoremText`
- **Required**: Yes
- **Validation**: Must have non-empty `content` property
- **Example**: `{ id: '1', content: 'Lorem ipsum dolor sit amet' }`

#### `texts: LoremText[]`

- **Description**: Array of generated paragraphs
- **Type**: `LoremText[]`
- **Required**: Yes (can be empty array)
- **Validation**: Must be array
- **Example**: `[{ id: '2', content: 'Paragraph 2' }]`

### Return Value

- **Type**: `string`
- **Format**: All paragraph content joined with double newlines (`\n\n`)
- **Empty case**: If `texts` is empty, returns only `originalText.content`

### Behavior

1. Combine `originalText` and `texts` into single array
2. Extract `content` property from each `LoremText` object
3. Join all content strings with `\n\n` separator
4. Return concatenated string

### Examples

#### Example 1: Single paragraph (texts empty)

```typescript
const result = concatenateLoremText({ id: '1', content: 'Lorem ipsum' }, []);
// Returns: "Lorem ipsum"
```

#### Example 2: Multiple paragraphs

```typescript
const result = concatenateLoremText({ id: '1', content: 'Lorem ipsum' }, [
  { id: '2', content: 'Dolor sit amet' },
  { id: '3', content: 'Consectetur adipiscing' },
]);
// Returns: "Lorem ipsum\n\nDolor sit amet\n\nConsectetur adipiscing"
```

#### Example 3: Large text (10,000 words)

```typescript
const result = concatenateLoremText(
  originalText,
  Array(50).fill({ id: 'x', content: '200 words...' }),
);
// Returns: String with 51 paragraphs separated by \n\n
// Performance: <10ms
```

### Performance Contract

- **Time Complexity**: O(n) where n is total number of paragraphs
- **Space Complexity**: O(m) where m is total character count
- **Maximum Duration**: 50ms for 10,000 words
- **Target Duration**: <10ms for typical usage

### Edge Cases

| Case              | Input                          | Output                                  |
| ----------------- | ------------------------------ | --------------------------------------- |
| Empty texts array | `originalText, []`             | `originalText.content`                  |
| Single text       | `originalText, [text1]`        | `originalText.content\n\ntext1.content` |
| Empty content     | `{ id: '1', content: '' }, []` | `""`                                    |
| Large array       | `originalText, Array(100)`     | All paragraphs joined                   |

### Error Handling

This function does not throw errors. It assumes valid input per TypeScript types.

**Assumptions**:

- `originalText` is valid `LoremText` object
- `texts` is valid array of `LoremText` objects
- TypeScript enforces type safety at compile time

---

## Function: copyToClipboard

### Signature

```typescript
async function copyToClipboard(text: string): Promise<void>;
```

### Purpose

Copies text to the system clipboard using the Clipboard API with proper error handling.

### Parameters

#### `text: string`

- **Description**: Text to copy to clipboard
- **Type**: `string`
- **Required**: Yes
- **Validation**: Any string (including empty string)
- **Example**: `"Lorem ipsum\n\nDolor sit amet"`

### Return Value

- **Type**: `Promise<void>`
- **Success**: Promise resolves with no value
- **Failure**: Promise rejects with error

### Behavior

1. Check if `navigator.clipboard` is available
2. If not available, throw error
3. Call `navigator.clipboard.writeText(text)`
4. Return promise (resolves on success, rejects on failure)

### Implementation

```typescript
async function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API not available');
  }
  await navigator.clipboard.writeText(text);
}
```

### Error Cases

#### 1. Clipboard API Not Available

- **Cause**: `navigator.clipboard` is `undefined`
- **Error Type**: `Error`
- **Error Message**: `"Clipboard API not available"`
- **When**: Old browsers, insecure context (HTTP)

#### 2. Permission Denied

- **Cause**: User denied clipboard access
- **Error Type**: `DOMException`
- **Error Name**: `"NotAllowedError"`
- **When**: User explicitly denied permission

#### 3. Security Error

- **Cause**: Clipboard API called outside user gesture or secure context
- **Error Type**: `DOMException`
- **Error Name**: `"SecurityError"`
- **When**: HTTP (not HTTPS), not triggered by user action

#### 4. Invalid State

- **Cause**: Document not focused or other browser-specific restriction
- **Error Type**: `DOMException`
- **Error Name**: `"InvalidStateError"`
- **When**: Browser-specific edge cases

### Examples

#### Example 1: Success

```typescript
try {
  await copyToClipboard('Lorem ipsum');
  // Success - text copied to clipboard
} catch (error) {
  // Not reached
}
```

#### Example 2: Permission Denied

```typescript
try {
  await copyToClipboard('Lorem ipsum');
} catch (error) {
  // error.name === "NotAllowedError"
  // Handle permission denied
}
```

#### Example 3: API Not Available

```typescript
// In old browser without Clipboard API
try {
  await copyToClipboard('Lorem ipsum');
} catch (error) {
  // error.message === "Clipboard API not available"
  // Handle unsupported browser
}
```

### Performance Contract

- **Maximum Duration**: 200ms
- **Target Duration**: <50ms
- **Blocking**: Async, does not block UI
- **Retries**: No automatic retries (caller handles)

### Browser Compatibility

| Browser        | Minimum Version | Support |
| -------------- | --------------- | ------- |
| Chrome         | 66+             | ✅ Full |
| Firefox        | 63+             | ✅ Full |
| Safari         | 13.1+           | ✅ Full |
| Edge           | 79+             | ✅ Full |
| Chrome Android | 66+             | ✅ Full |
| Safari iOS     | 13.4+           | ✅ Full |

### Security Requirements

- **HTTPS**: Required in production (localhost allowed in development)
- **User Gesture**: Must be called in response to user action (click, keypress)
- **Document Focus**: Document must be focused
- **Permissions**: May require user permission grant

---

## Testing Contract

### concatenateLoremText Tests

```typescript
describe('concatenateLoremText', () => {
  it('should concatenate originalText and texts with double newlines');
  it('should handle empty texts array');
  it('should preserve paragraph order');
  it('should handle large text arrays efficiently');
  it('should not modify input objects');
});
```

### copyToClipboard Tests

```typescript
describe('copyToClipboard', () => {
  it('should call navigator.clipboard.writeText with text');
  it('should throw error if Clipboard API not available');
  it('should propagate clipboard API errors');
  it('should handle permission denied error');
  it('should handle security errors');
});
```

### Mock Setup

```typescript
// Mock navigator.clipboard
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// Test success
mockWriteText.mockResolvedValue(undefined);

// Test failure
mockWriteText.mockRejectedValue(
  new DOMException('Permission denied', 'NotAllowedError'),
);
```

---

## File Location

**Path**: `src/utils/clipboard.ts`

**Exports**:

```typescript
export { concatenateLoremText, copyToClipboard };
```

**Imports**:

```typescript
import type { LoremText } from 'src/types';
```

---

## Version History

| Version | Date       | Changes                     |
| ------- | ---------- | --------------------------- |
| 1.0.0   | 2026-03-07 | Initial contract definition |

---

## References

- [Clipboard API Specification](https://w3c.github.io/clipboard-apis/)
- [MDN: Clipboard.writeText()](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)
- [MDN: DOMException](https://developer.mozilla.org/en-US/docs/Web/API/DOMException)

# Quickstart Guide: Copy Button Implementation

**Feature**: Copy Button  
**Date**: 2026-03-07  
**Branch**: `001-copy-button`

## Overview

This guide provides a step-by-step implementation path for the copy-to-clipboard feature. Follow the TDD workflow: write tests first, verify they fail, then implement.

---

## Prerequisites

- Node.js 24 installed
- Repository cloned and dependencies installed (`npm install`)
- Feature branch created: `git checkout -b 001-copy-button`
- Familiarity with React 19, TypeScript 5, and Vitest 4

---

## Implementation Order

### Phase 1: Utility Functions (Foundation)

#### Step 1.1: Create clipboard types

**File**: `src/types/clipboard.types.ts`

```typescript
/**
 * Represents the current state of a clipboard operation
 */
export type ClipboardState = 'idle' | 'copying' | 'success' | 'error';
```

**File**: `src/types/index.ts` (update)

```typescript
export type { ClipboardState } from './clipboard.types';
```

**Verification**: `npm run lint:tsc` (no errors)

---

#### Step 1.2: Write clipboard utility tests (TDD - RED)

**File**: `src/utils/clipboard.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { concatenateLoremText, copyToClipboard } from './clipboard';
import type { LoremText } from 'src/types';

describe('concatenateLoremText', () => {
  it('should concatenate originalText and texts with double newlines', () => {
    const originalText: LoremText = { id: '1', content: 'Lorem ipsum' };
    const texts: LoremText[] = [
      { id: '2', content: 'Dolor sit' },
      { id: '3', content: 'Amet consectetur' },
    ];

    const result = concatenateLoremText(originalText, texts);

    expect(result).toBe('Lorem ipsum\n\nDolor sit\n\nAmet consectetur');
  });

  it('should handle empty texts array', () => {
    const originalText: LoremText = { id: '1', content: 'Lorem ipsum' };
    const texts: LoremText[] = [];

    const result = concatenateLoremText(originalText, texts);

    expect(result).toBe('Lorem ipsum');
  });

  it('should preserve paragraph order', () => {
    const originalText: LoremText = { id: '1', content: 'First' };
    const texts: LoremText[] = [
      { id: '2', content: 'Second' },
      { id: '3', content: 'Third' },
    ];

    const result = concatenateLoremText(originalText, texts);

    expect(result).toBe('First\n\nSecond\n\nThird');
  });
});

describe('copyToClipboard', () => {
  const mockWriteText = vi.fn();

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call navigator.clipboard.writeText with text', async () => {
    mockWriteText.mockResolvedValue(undefined);

    await copyToClipboard('test text');

    expect(mockWriteText).toHaveBeenCalledWith('test text');
  });

  it('should throw error if Clipboard API not available', async () => {
    Object.assign(navigator, { clipboard: undefined });

    await expect(copyToClipboard('test')).rejects.toThrow(
      'Clipboard API not available',
    );
  });

  it('should propagate clipboard API errors', async () => {
    const error = new DOMException('Permission denied', 'NotAllowedError');
    mockWriteText.mockRejectedValue(error);

    await expect(copyToClipboard('test')).rejects.toThrow(error);
  });
});
```

**Verification**: `npm test -- src/utils/clipboard.test.ts` (tests should FAIL - files don't exist yet)

---

#### Step 1.3: Implement clipboard utilities (TDD - GREEN)

**File**: `src/utils/clipboard.ts`

```typescript
import type { LoremText } from 'src/types';

/**
 * Concatenates lorem ipsum text with double newline separators
 */
export function concatenateLoremText(
  originalText: LoremText,
  texts: LoremText[],
): string {
  const allTexts = [originalText, ...texts];
  return allTexts.map((text) => text.content).join('\n\n');
}

/**
 * Copies text to clipboard using Clipboard API
 * @throws {Error} If Clipboard API is not available
 * @throws {DOMException} If clipboard write fails
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API not available');
  }
  await navigator.clipboard.writeText(text);
}
```

**File**: `src/utils/index.ts` (update)

```typescript
export { concatenateLoremText, copyToClipboard } from './clipboard';
```

**Verification**:

- `npm test -- src/utils/clipboard.test.ts` (tests should PASS)
- `npm run lint` (no errors)
- `npm run lint:tsc` (no errors)

---

#### Step 1.4: Add feedback duration constant

**File**: `src/constants/config.ts` (update)

```typescript
/**
 * Duration in milliseconds to display copy feedback (success/error)
 */
export const COPY_FEEDBACK_DURATION = 2500;
```

**File**: `src/constants/index.ts` (update)

```typescript
export { COPY_FEEDBACK_DURATION } from './config';
```

---

### Phase 2: CopyButton Component

#### Step 2.1: Create component types

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

---

#### Step 2.2: Write CopyButton tests (TDD - RED)

**File**: `src/components/CopyButton/CopyButton.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CopyButton } from './CopyButton';
import type { LoremText } from 'src/types';

describe('CopyButton', () => {
  const mockWriteText = vi.fn();
  const originalText: LoremText = { id: '1', content: 'Lorem ipsum' };
  const texts: LoremText[] = [
    { id: '2', content: 'Dolor sit' },
    { id: '3', content: 'Amet consectetur' }
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should render copy button with clipboard icon', () => {
    render(<CopyButton originalText={originalText} texts={texts} />);

    const button = screen.getByRole('button', { name: /copy text to clipboard/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('📋');
  });

  it('should copy text to clipboard on click', async () => {
    const user = userEvent.setup({ delay: null });
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyButton originalText={originalText} texts={texts} />);
    const button = screen.getByRole('button', { name: /copy text to clipboard/i });

    await user.click(button);

    expect(mockWriteText).toHaveBeenCalledWith('Lorem ipsum\n\nDolor sit\n\nAmet consectetur');
  });

  it('should show success feedback after successful copy', async () => {
    const user = userEvent.setup({ delay: null });
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyButton originalText={originalText} texts={texts} />);
    const button = screen.getByRole('button', { name: /copy text to clipboard/i });

    await user.click(button);

    expect(screen.getByRole('button', { name: /text copied/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('✓');
  });

  it('should reset to idle state after feedback timeout', async () => {
    const user = userEvent.setup({ delay: null });
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyButton originalText={originalText} texts={texts} />);
    const button = screen.getByRole('button', { name: /copy text to clipboard/i });

    await user.click(button);
    expect(screen.getByRole('button', { name: /text copied/i })).toBeInTheDocument();

    vi.advanceTimersByTime(2500);

    expect(screen.getByRole('button', { name: /copy text to clipboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('📋');
  });

  it('should show error feedback on copy failure', async () => {
    const user = userEvent.setup({ delay: null });
    mockWriteText.mockRejectedValue(new Error('Permission denied'));

    render(<CopyButton originalText={originalText} texts={texts} />);
    const button = screen.getByRole('button', { name: /copy text to clipboard/i });

    await user.click(button);

    expect(screen.getByRole('button', { name: /failed to copy text/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('❌');
  });

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup({ delay: null });
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyButton originalText={originalText} texts={texts} />);

    await user.tab();
    const button = screen.getByRole('button', { name: /copy text to clipboard/i });
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(mockWriteText).toHaveBeenCalled();
  });

  it('should have visible focus indicator', () => {
    render(<CopyButton originalText={originalText} texts={texts} />);
    const button = screen.getByRole('button', { name: /copy text to clipboard/i });

    expect(button).toHaveClass('focus:ring-2');
  });

  it('should handle rapid clicks correctly', async () => {
    const user = userEvent.setup({ delay: null });
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyButton originalText={originalText} texts={texts} />);
    const button = screen.getByRole('button', { name: /copy text to clipboard/i });

    await user.click(button);
    vi.advanceTimersByTime(1000);
    await user.click(button);

    expect(screen.getByRole('button', { name: /text copied/i })).toBeInTheDocument();

    vi.advanceTimersByTime(2500);
    expect(screen.getByRole('button', { name: /copy text to clipboard/i })).toBeInTheDocument();
  });
});
```

**Verification**: `npm test -- src/components/CopyButton/CopyButton.test.tsx` (tests should FAIL)

---

#### Step 2.3: Implement CopyButton component (TDD - GREEN)

**File**: `src/components/CopyButton/CopyButton.tsx`

```typescript
import { useEffect, useState } from 'react';
import { COPY_FEEDBACK_DURATION } from 'src/constants';
import type { ClipboardState } from 'src/types';
import { concatenateLoremText, copyToClipboard } from 'src/utils';

import type { CopyButtonProps } from './CopyButton.types';

export function CopyButton({ originalText, texts }: CopyButtonProps) {
  const [clipboardState, setClipboardState] = useState<ClipboardState>('idle');

  useEffect(() => {
    if (clipboardState === 'success' || clipboardState === 'error') {
      const timer = setTimeout(() => {
        setClipboardState('idle');
      }, COPY_FEEDBACK_DURATION);

      return () => clearTimeout(timer);
    }
  }, [clipboardState]);

  async function handleCopy() {
    setClipboardState('copying');

    try {
      const textToCopy = concatenateLoremText(originalText, texts);
      await copyToClipboard(textToCopy);
      setClipboardState('success');
    } catch (error) {
      setClipboardState('error');
    }
  }

  const getButtonIcon = () => {
    switch (clipboardState) {
      case 'success':
        return '✓';
      case 'error':
        return '❌';
      default:
        return '📋';
    }
  };

  const getAriaLabel = () => {
    switch (clipboardState) {
      case 'copying':
        return 'Copying text';
      case 'success':
        return 'Text copied';
      case 'error':
        return 'Failed to copy text';
      default:
        return 'Copy text to clipboard';
    }
  };

  const getBackgroundClass = () => {
    switch (clipboardState) {
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      default:
        return '';
    }
  };

  return (
    <button
      type="button"
      aria-label={getAriaLabel()}
      onClick={handleCopy}
      className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${getBackgroundClass()}`}
    >
      {getButtonIcon()}
    </button>
  );
}
```

**File**: `src/components/CopyButton/index.ts`

```typescript
export { CopyButton } from './CopyButton';
export type { CopyButtonProps } from './CopyButton.types';
```

**Verification**:

- `npm test -- src/components/CopyButton/CopyButton.test.tsx` (tests should PASS)
- `npm run lint` (no errors)
- `npm run lint:tsc` (no errors)

---

### Phase 3: App Integration

#### Step 3.1: Update App component tests (TDD - RED)

**File**: `src/components/App/App.test.tsx` (add test)

```typescript
it('should render copy button in header', () => {
  render(<App />);

  const copyButton = screen.getByRole('button', { name: /copy text to clipboard/i });
  expect(copyButton).toBeInTheDocument();
});
```

**Verification**: `npm test -- src/components/App/App.test.tsx` (new test should FAIL)

---

#### Step 3.2: Integrate CopyButton into App (TDD - GREEN)

**File**: `src/components/App/App.tsx` (update header)

```typescript
import { CopyButton } from 'src/components/CopyButton';

// In the header section
<header className="...">
  <h1>Lorem Ipsum Generator</h1>
  <CopyButton originalText={originalText} texts={texts} />
</header>
```

**Verification**:

- `npm test -- src/components/App/App.test.tsx` (all tests should PASS)
- `npm run lint` (no errors)
- `npm run lint:tsc` (no errors)

---

### Phase 4: Full Test Suite & Coverage

#### Step 4.1: Run full test suite

```bash
npm run test:ci
```

**Expected**: 100% coverage for all new files (clipboard.ts, CopyButton.tsx)

---

#### Step 4.2: Manual testing

```bash
npm start
```

**Test Checklist**:

- [ ] Copy button visible in header
- [ ] Click button copies text to clipboard
- [ ] Paste in external app shows correct text with paragraph breaks
- [ ] Success feedback (✓) appears for 2.5 seconds
- [ ] Button returns to idle state (📋) after timeout
- [ ] Tab to button shows focus ring
- [ ] Enter/Space activates copy
- [ ] Hover shows gray background
- [ ] Multiple rapid clicks work correctly
- [ ] Error state appears if clipboard denied (test in browser settings)

---

## Development Commands

```bash
# Start dev server
npm start

# Run tests (watch mode)
npm test

# Run tests with coverage
npm run test:ci

# Run specific test file
npm test -- path/to/test.test.tsx

# Type check
npm run lint:tsc

# Lint
npm run lint

# Lint with auto-fix
npm run lint:fix

# Build for production
npm run build
```

---

## Troubleshooting

### Clipboard API not working

**Issue**: Copy operation fails with "Clipboard API not available"

**Solutions**:

- Ensure dev server runs on localhost (HTTPS not required)
- Check browser console for security errors
- Verify browser supports Clipboard API (Chrome 66+, Firefox 63+, Safari 13.1+)

### Tests failing with timer issues

**Issue**: Feedback timeout tests fail intermittently

**Solutions**:

- Ensure `vi.useFakeTimers()` in beforeEach
- Use `vi.advanceTimersByTime()` instead of `vi.runAllTimers()`
- Clean up timers in afterEach with `vi.clearAllTimers()`

### Focus ring not visible

**Issue**: Focus indicator doesn't appear on Tab

**Solutions**:

- Check Tailwind CSS is loaded
- Verify `focus:ring-2` class applied
- Test in different browsers (some have default focus styles)

---

## Success Criteria Verification

After implementation, verify all success criteria from spec:

- [ ] **SC-001**: Copy operation <200ms for 10,000 words (test with large text)
- [ ] **SC-002**: Keyboard accessible, WCAG 2.1 AA focus indicators (test with Tab/Enter)
- [ ] **SC-003**: Visual feedback <100ms (observe in browser)
- [ ] **SC-004**: Works in Chrome, Firefox, Safari, Edge (manual testing)
- [ ] **SC-005**: 98% success rate (should be 100% in supported browsers)
- [ ] **SC-006**: Error messages <500ms (test by denying clipboard permission)

---

## Next Steps

After implementation complete:

1. Run `/speckit.tasks` to generate task breakdown
2. Create pull request with branch `001-copy-button`
3. Ensure all CI checks pass (lint, type check, tests, coverage)
4. Request code review
5. Address feedback
6. Merge to main

---

## References

- [Feature Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Research Document](./research.md)
- [Data Model](./data-model.md)
- [Component Interface Contract](./contracts/component-interface.md)
- [Utility Functions Contract](./contracts/utility-functions.md)

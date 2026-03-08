# Feature Specification: Copy Button

**Feature Branch**: `001-copy-button`  
**Created**: 2026-03-07  
**Status**: Draft  
**Input**: User description: "copy button"

## Clarifications

### Session 2026-03-07

- Q: Where is the copy button rendered? In the header? → A: In the header/navigation area (persistent across all views)
- Q: Is there ever a state with no text to copy? → A: No, the app always displays original lorem ipsum text on load, so copy button is always enabled
- Q: Is the button a text button or icon button? → A: Icon-only button
- Q: What icon will be used? → A: Clipboard emoji 📋
- Q: How will user know text is copied? → A: Button emoji changes temporarily (📋 → ✓ or checkmark for 2.5 seconds)
- Q: How is the text copied? → A: All visible text on the page (original + all generated paragraphs)
- Q: What method extracts the text? → A: Concatenate originalText.content + texts array content values
- Q: Are newlines preserved between paragraphs? → A: Yes, separate paragraphs with double newlines (\n\n)
- Q: Icon button styling, will there be cursor pointer? → A: Yes, cursor pointer on hover
- Q: What about hover and focus state styling? → A: Light gray background on hover, focus ring on focus

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Copy Generated Text (Priority: P1)

User can copy the generated lorem ipsum text to their clipboard with a single button click, enabling quick use in other applications.

**Why this priority**: Core functionality - provides the primary value of quickly transferring generated text without manual selection

**Independent Test**: Can be fully tested by generating text, clicking the copy button, and verifying clipboard content matches the displayed text

**Acceptance Scenarios**:

1. **Given** lorem ipsum text is displayed, **When** user clicks the copy button, **Then** the text is copied to the clipboard
2. **Given** text was copied successfully, **When** user pastes in another application, **Then** the pasted content exactly matches the generated text
3. **Given** user clicks the copy button, **When** the copy operation completes, **Then** visual feedback confirms the successful copy

---

### User Story 2 - Visual Feedback for Copy Action (Priority: P2)

User receives clear visual confirmation when text is successfully copied to clipboard.

**Why this priority**: Enhances user experience - provides confidence that the action completed successfully

**Independent Test**: Can be tested by clicking copy button and observing visual state changes (button text, icon, or color change)

**Acceptance Scenarios**:

1. **Given** user clicks copy button, **When** copy succeeds, **Then** button emoji changes from 📋 to ✅ (checkmark)
2. **Given** copy confirmation is shown, **When** 2.5 seconds elapse, **Then** button emoji returns to original 📋 state
3. **Given** user hovers over copy button, **When** cursor is over button, **Then** cursor changes to pointer indicating clickability

---

### User Story 3 - Keyboard Accessible Copy (Priority: P3)

User can activate the copy button using keyboard navigation for accessibility compliance.

**Why this priority**: Accessibility requirement - ensures all users can copy text regardless of input method

**Independent Test**: Can be tested by navigating to copy button with Tab key and activating with Enter/Space

**Acceptance Scenarios**:

1. **Given** user navigates with keyboard, **When** user presses Tab, **Then** copy button receives focus with visible focus indicator
2. **Given** copy button has focus, **When** user presses Enter or Space, **Then** text is copied to clipboard
3. **Given** copy button is focused, **When** screen reader is active, **Then** button purpose is announced clearly

---

### Edge Cases

- What happens when clipboard API is not available or denied by browser permissions?
- What happens when user clicks copy button multiple times in rapid succession? (See tasks.md T036)
- How does the copy button behave on touch devices (mobile/tablet)?
- What happens when the generated text is extremely large (10,000+ words)?
- How does the system handle copy failures (network issues, browser restrictions)?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide an icon-only copy button using the clipboard emoji (📋) in the header/navigation area that is persistent across all views, with light gray background on hover, and cursor pointer on hover
- **FR-002**: Copy button MUST use the Clipboard API (navigator.clipboard.writeText) to copy all visible text (originalText + all generated paragraphs) to the user's clipboard, with paragraphs separated by double newlines (\n\n)
- **FR-003**: System MUST provide visual feedback when copy operation succeeds by changing the button emoji from 📋 to ✅ (checkmark) for 2-3 seconds before reverting
- **FR-004**: Copy button MUST be keyboard accessible with visible focus ring indicators
- **FR-005**: System MUST handle clipboard API permission denials gracefully by displaying button emoji as ❌ for 2.5 seconds with ARIA label "Copy failed - clipboard access denied"
- **FR-006**: Copy button MUST include appropriate ARIA labels (e.g., "Copy text to clipboard") for screen reader accessibility since it is icon-only
- **FR-007**: System MUST reset visual feedback state after 2.5 seconds timeout
- **FR-008**: System MUST handle copy failures by displaying button emoji as ❌ for 2.5 seconds with ARIA label "Copy failed - please try again"
- **FR-009**: Copy button MUST work on both desktop and mobile/touch devices

### Key Entities

- **CopyButton**: Interactive element that triggers clipboard copy operation
- **ClipboardState**: Status of copy operation (idle, copying, success, error)
- **FeedbackTimer**: Manages the duration of success/error feedback display
- **LoremText**: The generated text content to be copied (includes originalText.content and all texts array content values concatenated with \n\n separators)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Copy operation completes in under 200ms for text up to 10,000 words
- **SC-002**: Copy button is keyboard accessible and meets WCAG 2.1 AA standards for focus indicators
- **SC-003**: Visual feedback appears within 100ms of successful copy operation
- **SC-004**: Copy functionality works successfully on 95% of modern browsers (Chrome, Firefox, Safari, Edge)
- **SC-005**: Users can successfully copy text on first attempt without errors in 98% of cases
- **SC-006**: Error messages appear within 500ms when clipboard access is denied or fails

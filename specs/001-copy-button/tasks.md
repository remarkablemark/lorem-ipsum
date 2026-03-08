# Tasks: Copy Button Feature

**Input**: Design documents from `/specs/001-copy-button/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: TDD is mandatory per project constitution - all test tasks are included and MUST be written first

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create feature branch `001-copy-button` from main
- [ ] T002 Verify Node.js 24 installed and dependencies up to date with `npm install`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create ClipboardState type in src/types/clipboard.types.ts
- [x] T004 [P] Export ClipboardState from src/types/index.ts
- [x] T005 [P] Add COPY_FEEDBACK_DURATION constant (2500ms) to src/constants/config.ts
- [x] T006 [P] Export COPY_FEEDBACK_DURATION from src/constants/index.ts
- [x] T007 Write tests for concatenateLoremText in src/utils/clipboard.test.ts (TDD - RED)
- [x] T008 Write tests for copyToClipboard in src/utils/clipboard.test.ts (TDD - RED)
- [x] T009 Verify tests fail with `npm test -- src/utils/clipboard.test.ts`
- [x] T010 [P] Implement concatenateLoremText function in src/utils/clipboard.ts (TDD - GREEN)
- [x] T011 [P] Implement copyToClipboard function in src/utils/clipboard.ts (TDD - GREEN)
- [x] T012 Export clipboard utilities from src/utils/index.ts
- [x] T013 Verify tests pass with `npm test -- src/utils/clipboard.test.ts`
- [ ] T014 Create CopyButtonProps interface in src/components/CopyButton/CopyButton.types.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Copy Generated Text (Priority: P1) 🎯 MVP

**Goal**: User can copy the generated lorem ipsum text to their clipboard with a single button click, enabling quick use in other applications.

**Independent Test**: Can be fully tested by generating text, clicking the copy button, and verifying clipboard content matches the displayed text

### Tests for User Story 1 (TDD - RED)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T015 [P] [US1] Write test for rendering copy button with clipboard icon in src/components/CopyButton/CopyButton.test.tsx
- [ ] T016 [P] [US1] Write test for copying text to clipboard on click in src/components/CopyButton/CopyButton.test.tsx
- [ ] T017 [P] [US1] Write test for clipboard API error handling in src/components/CopyButton/CopyButton.test.tsx
- [ ] T018 [P] [US1] Write test for component unmount cleanup in src/components/CopyButton/CopyButton.test.tsx
- [ ] T019 [US1] Verify all tests fail with `npm test -- src/components/CopyButton/CopyButton.test.tsx`

### Implementation for User Story 1 (TDD - GREEN)

- [ ] T020 [US1] Implement CopyButton component with basic copy functionality in src/components/CopyButton/CopyButton.tsx
- [ ] T021 [US1] Add clipboard state management (useState) in src/components/CopyButton/CopyButton.tsx
- [ ] T022 [US1] Add handleCopy async function with try-catch error handling in src/components/CopyButton/CopyButton.tsx
- [ ] T023 [US1] Add useEffect for timer cleanup on unmount in src/components/CopyButton/CopyButton.tsx
- [ ] T024 [US1] Create barrel export in src/components/CopyButton/index.ts
- [ ] T025 [US1] Verify tests pass with `npm test -- src/components/CopyButton/CopyButton.test.tsx`
- [ ] T026 [US1] Write integration test for CopyButton in App header in src/components/App/App.test.tsx
- [ ] T027 [US1] Verify integration test fails with `npm test -- src/components/App/App.test.tsx`
- [ ] T028 [US1] Import CopyButton in src/components/App/App.tsx
- [ ] T029 [US1] Add CopyButton to header with originalText and texts props in src/components/App/App.tsx
- [ ] T030 [US1] Verify integration test passes with `npm test -- src/components/App/App.test.tsx`
- [ ] T031 [US1] Run full test suite with coverage `npm run test:ci`
- [ ] T032 [US1] Verify 100% coverage for clipboard.ts and CopyButton.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - basic copy functionality works

---

## Phase 4: User Story 2 - Visual Feedback for Copy Action (Priority: P2)

**Goal**: User receives clear visual confirmation when text is successfully copied to clipboard.

**Independent Test**: Can be tested by clicking copy button and observing visual state changes (button icon changes from 📋 to ✓)

### Tests for User Story 2 (TDD - RED)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T033 [P] [US2] Write test for success feedback display (✓ icon) in src/components/CopyButton/CopyButton.test.tsx
- [ ] T034 [P] [US2] Write test for error feedback display (❌ icon) in src/components/CopyButton/CopyButton.test.tsx
- [ ] T035 [P] [US2] Write test for feedback timeout (2500ms reset to idle) in src/components/CopyButton/CopyButton.test.tsx
- [ ] T036 [P] [US2] Write test for rapid clicks resetting timer in src/components/CopyButton/CopyButton.test.tsx
- [ ] T037 [P] [US2] Write test for hover state styling in src/components/CopyButton/CopyButton.test.tsx
- [ ] T038 [US2] Verify all new tests fail with `npm test -- src/components/CopyButton/CopyButton.test.tsx`

### Implementation for User Story 2 (TDD - GREEN)

- [ ] T039 [US2] Add getButtonIcon function with state-based emoji logic in src/components/CopyButton/CopyButton.tsx
- [ ] T040 [US2] Add getBackgroundClass function for success/error background colors in src/components/CopyButton/CopyButton.tsx
- [ ] T041 [US2] Update useEffect to handle success/error state timeout reset in src/components/CopyButton/CopyButton.tsx
- [ ] T042 [US2] Add Tailwind classes for hover (hover:bg-gray-100) and active (active:bg-gray-200) states in src/components/CopyButton/CopyButton.tsx
- [ ] T043 [US2] Add cursor-pointer class to button in src/components/CopyButton/CopyButton.tsx
- [ ] T044 [US2] Add transition-colors duration-150 for smooth state changes in src/components/CopyButton/CopyButton.tsx
- [ ] T045 [US2] Verify all tests pass with `npm test -- src/components/CopyButton/CopyButton.test.tsx`
- [ ] T046 [US2] Manual test: Start dev server with `npm start` and verify visual feedback works
- [ ] T047 [US2] Manual test: Verify success state (✓) appears for 2.5 seconds after copy
- [ ] T048 [US2] Manual test: Verify hover shows light gray background
- [ ] T049 [US2] Manual test: Verify cursor changes to pointer on hover

**Checkpoint**: At this point, User Story 2 should be fully functional - visual feedback provides clear confirmation

---

## Phase 5: User Story 3 - Keyboard Accessible Copy (Priority: P3)

**Goal**: User can activate the copy button using keyboard navigation for accessibility compliance.

**Independent Test**: Can be tested by navigating to copy button with Tab key and activating with Enter/Space

### Tests for User Story 3 (TDD - RED)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T050 [P] [US3] Write test for Tab key navigation to button in src/components/CopyButton/CopyButton.test.tsx
- [ ] T051 [P] [US3] Write test for Enter key activation in src/components/CopyButton/CopyButton.test.tsx
- [ ] T052 [P] [US3] Write test for Space key activation in src/components/CopyButton/CopyButton.test.tsx
- [ ] T053 [P] [US3] Write test for visible focus ring indicator in src/components/CopyButton/CopyButton.test.tsx
- [ ] T054 [P] [US3] Write test for ARIA label updates based on state in src/components/CopyButton/CopyButton.test.tsx
- [ ] T055 [US3] Verify all new tests fail with `npm test -- src/components/CopyButton/CopyButton.test.tsx`

### Implementation for User Story 3 (TDD - GREEN)

- [ ] T056 [US3] Add getAriaLabel function with state-based labels in src/components/CopyButton/CopyButton.tsx
- [ ] T057 [US3] Add aria-label attribute to button element in src/components/CopyButton/CopyButton.tsx
- [ ] T058 [US3] Add focus ring classes (focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2) in src/components/CopyButton/CopyButton.tsx
- [ ] T059 [US3] Ensure button type="button" for proper keyboard handling in src/components/CopyButton/CopyButton.tsx
- [ ] T060 [US3] Verify all tests pass with `npm test -- src/components/CopyButton/CopyButton.test.tsx`
- [ ] T061 [US3] Manual test: Tab to button and verify visible focus ring appears
- [ ] T062 [US3] Manual test: Press Enter while focused and verify copy operation
- [ ] T063 [US3] Manual test: Press Space while focused and verify copy operation
- [ ] T064 [US3] Manual test: Test with screen reader (VoiceOver/NVDA) and verify announcements

**Checkpoint**: At this point, User Story 3 should be fully functional - keyboard accessibility meets WCAG 2.1 AA standards

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation across all user stories

- [ ] T065 [P] Run full test suite with coverage `npm run test:ci`
- [ ] T066 [P] Verify 100% coverage for all new files (clipboard.ts, CopyButton.tsx)
- [ ] T067 [P] Run type check `npm run lint:tsc` and fix any errors
- [ ] T068 [P] Run lint `npm run lint` and fix any errors
- [ ] T069 [P] Run lint with auto-fix `npm run lint:fix`
- [ ] T070 Build production bundle with `npm run build` and verify no errors
- [ ] T071 Preview production build with `npm run preview` and test copy functionality
- [ ] T072 Test copy operation with large text (10,000+ words) and verify <200ms performance
- [ ] T073 Test in Chrome, Firefox, Safari, and Edge browsers
- [ ] T074 Test on mobile device (iOS/Android) for touch interaction
- [ ] T075 Test clipboard permission denial scenario and verify error handling
- [ ] T076 Verify all success criteria from spec.md are met (SC-001 through SC-006)
- [ ] T077 Update BACKLOG.md or project documentation if needed
- [ ] T078 Commit all changes with conventional commit message

**Checkpoint**: All user stories should now be independently functional and production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion - MVP functionality
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion - Enhances with visual feedback
- **User Story 3 (Phase 5)**: Depends on User Story 1 completion - Adds accessibility
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (builds on basic copy functionality)
- **User Story 3 (P3)**: Depends on User Story 1 (adds accessibility to existing button)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD approach)
- Types and utilities created in Foundational phase
- Component implementation follows test creation
- Integration tests follow component implementation
- Manual testing validates automated tests
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks can run in parallel
- All Foundational tasks marked [P] can run in parallel (T003-T006, T010-T011)
- All tests within a user story marked [P] can be written in parallel
- User Story 2 and User Story 3 can be worked on in parallel after User Story 1 completes (both depend only on US1)
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all type definitions together:
Task T003: "Create ClipboardState type in src/types/clipboard.types.ts"
Task T004: "Export ClipboardState from src/types/index.ts"
Task T005: "Add COPY_FEEDBACK_DURATION constant to src/constants/config.ts"
Task T006: "Export COPY_FEEDBACK_DURATION from src/constants/index.ts"

# After tests are written, implement utilities in parallel:
Task T010: "Implement concatenateLoremText function in src/utils/clipboard.ts"
Task T011: "Implement copyToClipboard function in src/utils/clipboard.ts"
```

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all User Story 1 tests together:
Task T015: "Write test for rendering copy button with clipboard icon"
Task T016: "Write test for copying text to clipboard on click"
Task T017: "Write test for clipboard API error handling"
Task T018: "Write test for component unmount cleanup"
```

---

## Parallel Example: User Story 2 and 3 (After US1)

```bash
# After User Story 1 is complete, both US2 and US3 can proceed in parallel:
Developer A works on User Story 2 (Visual Feedback) - Tasks T033-T049
Developer B works on User Story 3 (Keyboard Accessibility) - Tasks T050-T064
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T014) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T015-T032)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - basic copy functionality works

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Enhanced UX!)
4. Add User Story 3 → Test independently → Deploy/Demo (Full accessibility!)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T014)
2. Once Foundational is done:
   - Developer A: User Story 1 (T015-T032)
3. Once User Story 1 is done:
   - Developer A: User Story 2 (T033-T049)
   - Developer B: User Story 3 (T050-T064) - can work in parallel with US2
4. Team completes Polish together (T065-T078)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD REQUIRED**: Verify tests fail before implementing (constitutional requirement)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All tasks follow strict checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
- Tests are mandatory per project constitution (100% coverage required)
- User Story 2 and 3 can be worked on in parallel after User Story 1 completes

---

## Summary

**Total Tasks**: 78
**Task Count by Phase**:

- Setup: 2 tasks
- Foundational: 12 tasks
- User Story 1 (P1): 18 tasks
- User Story 2 (P2): 17 tasks
- User Story 3 (P3): 15 tasks
- Polish: 14 tasks

**Task Count by User Story**:

- US1 (Copy Generated Text): 18 tasks
- US2 (Visual Feedback): 17 tasks
- US3 (Keyboard Accessible): 15 tasks

**Parallel Opportunities**:

- Foundational phase: 6 tasks can run in parallel (T003-T006, T010-T011)
- User Story 1 tests: 4 tasks can run in parallel (T015-T018)
- User Story 2 tests: 5 tasks can run in parallel (T033-T037)
- User Story 3 tests: 5 tasks can run in parallel (T050-T054)
- US2 and US3 can be worked on in parallel after US1 completes
- Polish phase: 4 tasks can run in parallel (T065-T069)

**Independent Test Criteria**:

- US1: Click copy button, paste in external app, verify text matches with paragraph breaks
- US2: Click copy button, observe ✓ icon for 2.5 seconds, verify hover states
- US3: Tab to button (focus ring visible), press Enter/Space, verify copy works

**Suggested MVP Scope**: User Story 1 only (basic copy functionality)

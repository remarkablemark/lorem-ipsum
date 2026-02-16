---
description: 'Task list for Lorem Ipsum Generator via Scrolling feature implementation'
---

# Tasks: Lorem Ipsum Generator via Scrolling

**Input**: Design documents from `/specs/001-lorem-ipsum/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED - TDD approach specified in constitution and research.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **React SPA**: `src/` at repository root, tests co-located with source files
- **Web app**: React single-page application structure
- Paths shown below assume React project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create React component structure per implementation plan
- [x] T002 Initialize TypeScript project with React 19 dependencies
- [x] T003 [P] Configure ESLint, Prettier, and Tailwind CSS
- [x] T004 [P] Create directory structure for components, hooks, utils, types, constants

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Setup lorem ipsum text generation utility in src/utils/textGenerator/textGenerator.ts
- [x] T006 [P] Create TypeScript interfaces for all entities in src/types/
- [x] T007 [P] Implement base React hooks for state management
- [x] T008 Configure performance monitoring utilities in src/utils/performanceUtils/performanceUtils.ts
- [x] T009 Setup scroll utilities in src/utils/scrollUtils/scrollUtils.ts
- [x] T010 Setup clipboard utilities in src/utils/clipboardUtils/clipboardUtils.ts
- [x] T011 Create application constants in src/constants/config.ts
- [x] T012 [P] Create original lorem ipsum text constant in src/constants/loremText.ts
- [x] T013 [P] Create word bank for text generation in src/constants/wordBank.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generate Lorem Ipsum Text via Scrolling (Priority: P1) 🎯 MVP

**Goal**: User can generate lorem ipsum placeholder text by scrolling down the page, with text appearing progressively as they scroll

**Independent Test**: Can be fully tested by scrolling and verifying text appears progressively with smooth performance

### Tests for User Story 1 (REQUIRED - TDD approach) ⚠️

> **CRITICAL TDD REQUIREMENT**: Write these tests FIRST, verify they FAIL, then implement
> **Constitution III**: Test-First Development is NON-NEGOTIABLE - tests must be written and approved before implementation

- [x] T014 [P] [US1] Component test for App in src/components/App/App.test.tsx (WRITE FIRST, VERIFY FAIL)
- [x] T015 [P] [US1] Component test for TextContainer in src/components/TextContainer/TextContainer.test.tsx (WRITE FIRST, VERIFY FAIL)
- [x] T016 [P] [US1] Hook test for useLoremText in src/hooks/useLoremText/useLoremText.test.ts (WRITE FIRST, VERIFY FAIL)
- [ ] T017 [P] [US1] Hook test for useScrollDetection in src/hooks/useScrollDetection/useScrollDetection.test.ts (WRITE FIRST, VERIFY FAIL)
- [x] T018 [P] [US1] Utility test for textGenerator in src/utils/textGenerator/textGenerator.test.ts (WRITE FIRST, VERIFY FAIL)
- [x] T019 [P] [US1] Utility test for scrollUtils in src/utils/scrollUtils/scrollUtils.test.ts (WRITE FIRST, VERIFY FAIL)
- [x] T020 [P] [US1] Integration test for scroll generation flow in src/main.test.tsx (WRITE FIRST, VERIFY FAIL)

### Implementation for User Story 1

- [x] T021 [P] [US1] Create LoremText type in src/types/loremText.types.ts
- [x] T022 [P] [US1] Create ScrollPosition type in src/types/scroll.types.ts
- [x] T023 [P] [US1] Create PerformanceMetrics type in src/types/performance.types.ts
- [x] T024 [P] [US1] Create GenerationConfig type in src/types/loremText.types.ts
- [x] T025 [US1] Implement useLoremText hook in src/hooks/useLoremText/useLoremText.ts (depends on T021, T024)
- [x] T026 [US1] Implement useScrollDetection hook in src/hooks/useScrollDetection/useScrollDetection.ts (depends on T022)
- [x] T027 [US1] Implement usePerformance hook in src/hooks/usePerformance/usePerformance.ts (depends on T023)
- [x] T028 [US1] Implement text generation algorithm in src/utils/textGenerator/textGenerator.ts
- [x] T029 [US1] Implement scroll utilities in src/utils/scrollUtils/scrollUtils.ts
- [x] T029a [US1] Implement scroll event throttling for rapid scrolling performance in src/utils/scrollUtils/scrollUtils.ts (covers FR-009)
- [x] T030 [US1] Create App component in src/components/App/App.tsx (depends on T025, T026, T027)
- [x] T031 [US1] Create TextContainer component in src/components/TextContainer/TextContainer.tsx (depends on T025, T026)
- [x] T032 [US1] Add accessibility attributes and keyboard navigation to TextContainer
- [x] T033 [US1] Add smooth scrolling optimization for large text blocks
- [x] T034 [US1] Create App component types in src/components/App/App.types.ts
- [x] T035 [US1] Create TextContainer component types in src/components/TextContainer/TextContainer.types.ts
- [x] T036 [P] [US1] Create barrel exports for App component in src/components/App/index.ts
- [x] T037 [P] [US1] Create barrel exports for TextContainer component in src/components/TextContainer/index.ts
- [x] T038 [P] [US1] Create barrel exports for hooks in src/hooks/useLoremText/index.ts
- [x] T039 [P] [US1] Create barrel exports for hooks in src/hooks/useScrollDetection/index.ts
- [x] T040 [P] [US1] Create barrel exports for hooks in src/hooks/usePerformance/index.ts
- [x] T041 [P] [US1] Create barrel exports for utils in src/utils/textGenerator/index.ts
- [x] T042 [P] [US1] Create barrel exports for utils in src/utils/scrollUtils/index.ts
- [x] T043 [US1] Add manual text generation button with loading states
- [x] T044 [US1] Add scrollable spacer content for testing scroll-triggered generation
- [x] T045 [US1] Update paragraph generation settings to use existing config file
- [x] T046 [US1] Implement configuration-based text generation with consolidated config

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Copy Generated Text (Priority: P2)

**Goal**: User can copy all or portions of the generated lorem ipsum text to clipboard for use in other applications

**Independent Test**: Can be fully tested by copying text and verifying clipboard content matches generated text

### Tests for User Story 2 (REQUIRED - TDD approach) ⚠️

- [ ] T043 [P] [US2] Component test for CopyButton in src/components/CopyButton/CopyButton.test.tsx
- [ ] T044 [P] [US2] Hook test for useClipboard in src/hooks/useClipboard/useClipboard.test.ts
- [ ] T045 [P] [US2] Utility test for clipboardUtils in src/utils/clipboardUtils/clipboardUtils.test.ts
- [ ] T046 [P] [US2] Integration test for clipboard functionality in src/main.test.tsx

### Implementation for User Story 2

- [ ] T047 [P] [US2] Create ClipboardState type in src/types/clipboard.types.ts
- [ ] T048 [P] [US2] Create CopyButtonConfig type in src/types/clipboard.types.ts
- [ ] T049 [US2] Implement useClipboard hook in src/hooks/useClipboard/useClipboard.ts (depends on T047, T048)
- [ ] T050 [US2] Implement clipboard utilities in src/utils/clipboardUtils/clipboardUtils.ts
- [ ] T051 [US2] Create CopyButton component in src/components/CopyButton/CopyButton.tsx (depends on T049)
- [ ] T052 [US2] Add copy button visibility logic (hover/selection/tap)
- [ ] T053 [US2] Add visual feedback for copy operations (button text changes)
- [ ] T054 [US2] Handle clipboard API fallbacks for older browsers
- [ ] T055 [US2] Create CopyButton component types in src/components/CopyButton/CopyButton.types.ts
- [ ] T056 [P] [US2] Create barrel exports for CopyButton component in src/components/CopyButton/index.ts
- [ ] T057 [P] [US2] Create barrel exports for hooks in src/hooks/useClipboard/index.ts
- [ ] T058 [P] [US2] Create barrel exports for utils in src/utils/clipboardUtils/index.ts
- [ ] T059 [US2] Integrate CopyButton with TextContainer component
- [ ] T060 [US2] Add mobile touch interaction support for copy buttons

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Reset and Start Over (Priority: P3)

**Goal**: User can reset the generated text and start fresh with a new scrolling session, returning to the original lorem ipsum paragraph

**Independent Test**: Can be tested by clicking reset and verifying page returns to initial state

### Tests for User Story 3 (REQUIRED - TDD approach) ⚠️

- [ ] T061 [P] [US3] Component test for ResetButton in src/components/ResetButton/ResetButton.test.tsx
- [ ] T062 [P] [US3] Integration test for reset functionality in src/main.test.tsx

### Implementation for User Story 3

- [ ] T063 [P] [US3] Create ResetButton component in src/components/ResetButton/ResetButton.tsx
- [ ] T064 [US3] Add reset functionality to useLoremText hook
- [ ] T065 [US3] Add reset button visibility logic (only show when content exists)
- [ ] T066 [US3] Create ResetButton component types in src/components/ResetButton/ResetButton.types.ts
- [ ] T067 [P] [US3] Create barrel exports for ResetButton component in src/components/ResetButton/index.ts
- [ ] T068 [US3] Integrate ResetButton with App component
- [ ] T069 [US3] Add keyboard navigation support for reset button

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T070 [P] Component documentation updates for all components
- [ ] T071 Code cleanup and refactoring across all modules
- [ ] T072 Performance optimization for scrolling (virtual scrolling implementation)
- [ ] T073 [P] Additional unit tests for edge cases in all test files
- [ ] T074 Accessibility audit and improvements (WCAG 2.1 AA compliance)
- [ ] T075 Run component integration validation across all stories
- [ ] T076 Add error boundaries for robust error handling
- [ ] T077 Implement memory cleanup for large text generations
- [ ] T078 Add comprehensive error handling and user feedback
- [ ] T079 Create type barrel exports in src/types/index.ts
- [ ] T080 Create constants barrel exports in src/constants/index.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD approach)
- Types before implementation
- Utilities before hooks
- Hooks before components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Types within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (TDD - write failing tests first):
Task: "T014 [P] [US1] Component test for App in src/components/App/App.test.tsx"
Task: "T015 [P] [US1] Component test for TextContainer in src/components/TextContainer/TextContainer.test.tsx"
Task: "T016 [P] [US1] Hook test for useLoremText in src/hooks/useLoremText/useLoremText.test.ts"
Task: "T017 [P] [US1] Hook test for useScrollDetection in src/hooks/useScrollDetection/useScrollDetection.test.ts"

# Launch all types for User Story 1 together:
Task: "T021 [P] [US1] Create LoremText type in src/types/loremText.types.ts"
Task: "T022 [P] [US1] Create ScrollPosition type in src/types/scroll.types.ts"
Task: "T023 [P] [US1] Create PerformanceMetrics type in src/types/performance.types.ts"
Task: "T024 [P] [US1] Create GenerationConfig type in src/types/loremText.types.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Summary

- **Total Tasks**: 81 tasks
- **Task Count per User Story**:
  - User Story 1: 30 tasks (including tests)
  - User Story 2: 18 tasks (including tests)
  - User Story 3: 9 tasks (including tests)
- **Parallel Opportunities**: 47 tasks marked as parallelizable
- **Independent Test Criteria**: Each user story has clear independent test criteria
- **Suggested MVP Scope**: User Story 1 only (30 tasks) - provides core scrolling text generation
- **TDD Approach**: Tests required for all user stories following constitution requirements

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD REQUIRED**: Verify tests fail before implementing (constitution requirement)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- **100% test coverage required** per constitution and project standards

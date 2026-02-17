---
description: 'Task list template for feature implementation'
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **React SPA**: `src/` at repository root, tests co-located with source files
- **Web app**: React single-page application structure
- **Mobile**: React Native structure (if applicable)
- Paths shown below assume React project structure from plan.md

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create React component structure per implementation plan
- [ ] T002 Initialize TypeScript project with React 19 dependencies
- [ ] T003 [P] Configure ESLint, Prettier, and Tailwind CSS

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup lorem ipsum text generation utility in src/utils/textGenerator/textGenerator.ts
- [ ] T005 [P] Implement React hooks for text generation state in src/hooks/
- [ ] T006 [P] Setup component structure and barrel exports
- [ ] T007 Create base TypeScript interfaces that all components depend on in src/types/
- [ ] T008 Configure performance monitoring utilities
- [ ] T009 Setup scroll utilities for scroll detection

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Component test for App in src/components/App/App.test.tsx
- [ ] T011 [P] [US1] Integration test for scroll generation flow in src/main.test.tsx

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create LoremText type in src/types/loremText.types.ts
- [ ] T013 [P] [US1] Create GenerationConfig type in src/types/loremText.types.ts
- [ ] T014 [US1] Implement useLoremText hook in src/hooks/useLoremText/useLoremText.ts (depends on T012, T013)
- [ ] T015 [US1] Implement useScrollDetection hook in src/hooks/useScrollDetection/useScrollDetection.ts
- [ ] T016 [US1] Create App component in src/components/App/App.tsx (depends on T014, T015)
- [ ] T017 [US1] Add accessibility attributes and keyboard navigation to App component

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T018 [P] [US2] Component test for ResetButton in src/components/ResetButton/ResetButton.test.tsx
- [ ] T019 [P] [US2] Integration test for reset functionality in src/main.test.tsx

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create ResetButton component in src/components/ResetButton/ResetButton.tsx
- [ ] T021 [US2] Add reset functionality to useLoremText hook
- [ ] T022 [US2] Add reset button visibility logic (only show when content exists)
- [ ] T023 [US2] Integrate ResetButton with App component

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T024 [P] [US3] Component test for [ComponentName] in tests/components/[ComponentName].test.tsx
- [ ] T025 [P] [US3] Integration test for [functionality] in tests/integration/[feature].test.tsx

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create [ComponentName] component in src/components/[ComponentName]/[ComponentName].tsx
- [ ] T027 [US3] Implement [utility] utilities in src/utils/[utility].ts
- [ ] T028 [US3] Add [feature] functionality

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Component documentation updates
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization for scrolling
- [ ] TXXX [P] Additional unit tests in tests/unit/
- [ ] TXXX Accessibility audit and improvements
- [ ] TXXX Run component integration validation

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
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Component test for [ComponentName] in tests/components/[ComponentName].test.tsx"
Task: "Integration test for [user journey] in tests/integration/[journey].test.tsx"

# Launch all types/models for User Story 1 together:
Task: "Create [TypeName] type in src/types/[type].ts"
Task: "Create [EntityName] type in src/types/[entity].ts"
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

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- Added sections: All sections (new constitution)
- Templates requiring updates: ⚠ pending (plan-template.md, spec-template.md, tasks-template.md, command files)
- Follow-up TODOs: None
-->

# Lorem Ipsum Generator Constitution

## Core Principles

### I. User Experience First

The lorem ipsum generator MUST prioritize smooth scrolling and responsive user interaction. All features MUST enhance the user's ability to generate and interact with placeholder text. Performance MUST be optimized for seamless scrolling experiences across devices.

### II. React Component Architecture

All UI elements MUST be implemented as reusable React components with TypeScript. Components MUST follow functional patterns with proper props interfaces. State management MUST use React hooks and the React Compiler for automatic optimization.

### III. Test-First Development (NON-NEGOTIABLE)

TDD is mandatory: Tests MUST be written before implementation, approved by the user, verified to fail, then implementation follows. Red-Green-Refactor cycle is strictly enforced. 100% test coverage is required for all non-barrel-export files.

### IV. Accessibility & Semantic HTML

All components MUST use semantic HTML elements with proper ARIA labels and keyboard navigation support. The generator MUST be fully accessible to screen readers and keyboard-only users. Color contrast and responsive design MUST meet WCAG 2.1 AA standards.

### V. Performance & Optimization

Scrolling performance MUST be optimized using React best practices. Bundle size MUST be minimized through code splitting and tree shaking. The generator MUST handle large amounts of lorem ipsum text without UI degradation.

## Technology Standards

React 19 with TypeScript 5 in strict mode, Vite 7 for build tooling, Vitest 4 for testing, Tailwind CSS 4 for styling, ESLint 9 with Prettier for code quality. No additional dependencies may be added without explicit justification and review.

## Development Workflow

All code changes MUST pass linting, type checking, and test coverage requirements. Git commits MUST follow conventional commit format and pass commitlint validation. Pre-commit hooks MUST enforce code quality standards. All features MUST be demonstrated in the development environment before merge approval.

## Governance

This constitution supersedes all other development practices. Amendments require documentation, team approval, and migration plan. All pull requests and reviews must verify constitutional compliance. Complexity must be justified with clear user value. Use AGENTS.md for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-02-16 | **Last Amended**: 2026-02-16

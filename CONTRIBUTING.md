# Contributing to LIFE / RECEIPTS

Thank you for your interest in contributing to **LIFE / RECEIPTS**! This document outlines our code standards, development workflow, and testing guidelines.

---

## 🛠️ Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/you836/WEBRUSH.git
   cd WEBRUSH
   ```

2. **Branch Naming Conventions**
   - `feat/`: New features (e.g., `feat/interactive-graph`)
   - `fix/`: Bug fixes (e.g., `fix/csv-parser-edgecase`)
   - `perf/`: Performance optimizations
   - `docs/`: Documentation additions

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## 📐 Code Quality & Standards

All contributions must adhere to the following standards:

1. **Zero Linter Warnings**: We enforce Oxlint with 0 tolerance for warnings or errors.
   ```bash
   npm run lint
   ```
2. **100% Test Pass Rate**: Ensure all existing and new unit tests pass cleanly.
   ```bash
   npm test
   ```
3. **TypeScript Strict Mode**: No `any` escapes without documented rationale.
4. **Privacy-First**: No external API calls or logging of raw personal data.

---

## 🧪 Adding Tests

When introducing new analysis heuristics or UI adapters, add corresponding unit tests in `src/__tests__/`:
- Use `vitest` for test assertions.
- Use `@testing-library/react` for component behavior.

---

## 📝 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
```
feat(stories): add narrative tone switcher
fix(connections): prevent duplicate edge rendering
docs(readme): add heuristic correlation mathematical formula
test(privacy): add merchant sanitization assertions
```

# Prompts & Engineering Log: News Blog Performance Optimization (ENG-84718)

This document records the actual prompts and engineering instructions executed during the development of the News Blog Performance Optimization project.

---

## 1. Test-Driven Development (TDD) — Red Phase

### Prompt
```markdown
We are starting the mandatory Test-Driven Development (TDD) phase for the News Blog Performance Optimization project (ENG-84718).

Before implementing any application functionality, analyze the project requirements and create a comprehensive Vitest test suite.

Technical setup:
- React + Vite
- Vitest
- React Testing Library
- @testing-library/jest-dom
- jsdom

Acceptance criteria to cover through tests:

1. Dashboard renders correctly with a clear heading and structured performance information.
2. Users can view and search performance records.
3. Empty search results display a user-friendly "No data found" message.
4. Asynchronous operations display a visible loading indicator.
5. Forms reject missing or malformed inputs.
6. Invalid fields receive accessible error messages and red error styling.
7. Text inputs are sanitized before being stored.
8. Primary user actions trigger the console message:
   [Analytics] User interacted with Performance Optimization
9. Buttons and inputs have accessible labels and support keyboard navigation.
10. Interactive functionality works correctly without unexpected crashes.

Important instructions:
- Write tests FIRST. Do not implement the dashboard or application functionality yet.
- Create test files using Vitest and React Testing Library.
- Use realistic test cases, including edge cases.
- Mock asynchronous operations where necessary.
- Do not modify existing application components just to make tests pass.
- Explain what each test verifies.
- Run the test suite and report which tests fail because functionality has not yet been implemented.
- Do not claim tests pass unless they actually pass.

Wait for approval before starting implementation.
```

### Result
- Comprehensive 31-test suite created in `src/App.test.jsx`.
- Verified 30 test failures and 1 baseline mount check passing on un-implemented starter template.
- Test suite locked and awaiting approval.

---

## 2. Implementation Phase — Green Phase

### Prompt
```markdown
The TDD Red Phase is complete. I approve starting the implementation phase for ENG-84718.

Now implement the News Blog Performance Optimization dashboard in React to make the existing Vitest test suite pass.

IMPORTANT: Do not delete, weaken, skip, or modify existing tests simply to make them pass.

Implementation requirements:

1. Build a professional, clean, monochromatic corporate dashboard.
2. Display performance summary cards:
   - Average Load Time
   - Total Records
   - Performance Score / Core Web Vitals
3. Display performance records in a structured, accessible table.
4. Implement case-insensitive search.
5. Show "No data found" when search has no matching results.
6. Add a Refresh Metrics action with a visible loading indicator and aria-busy state.
7. Create a form with Title, URL and Load Time fields.
8. Validate required fields, URL format and positive numeric load time.
9. Display accessible validation messages, aria-invalid attributes and visible red error styling.
10. Sanitize user-provided text before storing it. Prevent XSS by rendering user content as text, never injecting untrusted HTML.
11. Log exactly:
[Analytics] User interacted with Performance Optimization
when primary actions are completed.
12. Ensure all inputs and buttons have accessible names and keyboard support.
13. Handle empty data, malformed inputs, slow operations and boundary values safely.
14. Use useMemo for derived calculations and filtered records, and useCallback for appropriate event handlers.
15. Keep the code modular, readable and responsive.
16. Follow a monochromatic design system using consistent 16px/32px spacing.
17. Do not hardcode API keys or sensitive personal information.

Implementation workflow:
- Inspect the existing tests and project structure first.
- Implement functionality in appropriate React components.
- Preserve the existing test suite.
- Run `npm test -- --run`.
- Fix implementation issues until all tests pass.
- Run `npm run lint` and `npm run build`.
- Report exact test, lint and build results.
- Do not claim 100% Lighthouse accessibility unless it has actually been measured.

Also create or update PROMPTS.md with the actual successful prompts used in this project.

Do not deploy or push to GitHub yet. First complete local implementation and verification.
```

### Result
- Implemented modular component architecture:
  - `src/App.jsx`: Main dashboard container with `useMemo`, `useCallback`, state, and loading banner.
  - `src/components/MetricsCards.jsx`: Performance KPI cards (Average Load Time, Total Records, Core Web Vitals).
  - `src/components/SearchBox.jsx`: Accessible search filter.
  - `src/components/PerformanceTable.jsx`: Structured data table with empty state handling and XSS prevention.
  - `src/components/RecordForm.jsx`: Validated form with accessible error messages, red error styling, and keyboard navigation.
  - `src/utils/sanitize.js`: Sanitization and validation utilities.
  - `src/utils/analytics.js`: Interaction tracking logging.
  - `src/App.css` & `src/index.css`: Monochromatic corporate design system (16px / 32px spacing).
- Verification results:
  - Vitest: **31 / 31 passed (100%)**
  - ESLint: **0 errors, 0 warnings (100% clean)**
  - Vite build: **Successful production bundle in 556ms**

---

## 3. Lighthouse SEO Enhancements

### Prompt
```markdown
Fix the two Lighthouse SEO issues in my News Blog Performance Optimization project.

1. Update the root `index.html`:
   - Add a meaningful meta description:
     `Monitor news article performance, page load times, and website responsiveness with the News Blog Performance Optimization dashboard.`
   - Update the page title to `News Blog Performance Optimization`.
   - Preserve all existing Vite and React setup.

2. Create `public/robots.txt` with exactly:

   User-agent: *
   Allow: /

3. Ensure the robots.txt file is copied to the production build root as `dist/robots.txt`.

4. Do not modify existing React components, CSS, functionality, or tests.

5. Run `npm run build` and verify that `dist/robots.txt` exists and contains valid robots.txt directives.

Report the exact files changed and verification results.
```

### Result
- Updated `index.html` with title `"News Blog Performance Optimization"` and requested meta description.
- Created `public/robots.txt` with `User-agent: *` and `Allow: /`.
- Verified production build output `dist/robots.txt` exists and contains exact directives.
- Preserved all React components, styles, tests, and functionality without modifications.
- Vitest: 31/31 passed. ESLint: 0 errors/warnings. Build: Succeeded in 311ms.

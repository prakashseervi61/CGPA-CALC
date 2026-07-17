# Testing

## Current State

No test framework is configured. The project has no unit tests, integration tests, or E2E tests.

## Recommended Setup

When tests are added:

| Layer | Tool | Command |
|-------|------|---------|
| Unit | Vitest | `npx vitest` |
| Component | React Testing Library | With Vitest |
| E2E | Playwright | `npx playwright test` |

## What to Test

### Priority 1: CGPA Calculation Logic

The `SgpaCalculator` utility (if extracted) or the calculation functions in `DataContext` are the most critical:

- SGPA calculation with known inputs/outputs
- CGPA calculation across multiple semesters
- Semester exclusion from CGPA
- Edge cases: zero credits, empty grades, all F grades

### Priority 2: Grade Scale Mapping

- Custom grade-to-point mapping
- Invalid grade handling

### Priority 3: Auth Flow

- PIN validation (4 digits, match confirmation)
- Login/register form validation
- Protected route redirect

## Running Tests

```bash
# Once test framework is configured:
npm test
npx vitest run
npx playwright test
```

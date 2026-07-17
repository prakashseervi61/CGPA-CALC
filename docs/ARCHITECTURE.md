# Architecture

## Overview

Semora is a single-page React application with no backend. All data lives in `localStorage`. The app uses React Context for state management and React Router for navigation.

## Data Flow

```
User Input → SubjectTable → DataContext (localStorage) → CGPASummary / CGPATrendsPage
                              ↓
                         AuthContext (localStorage) → ProtectedRoute → Dashboard
```

## Key Layers

### Contexts (State)

| Context | Purpose | Storage |
|---------|---------|---------|
| `AuthContext` | Login/logout, user profile, PIN verification | `localStorage.user` |
| `DataContext` | Semesters, grades, grade scale, CGPA calculation | `localStorage.semesters`, `localStorage.gradeScale` |
| `ThemeContext` | Dark/light mode toggle | `localStorage.theme` + `html.dark` class |

### Components

| Layer | Components | Responsibility |
|-------|-----------|----------------|
| `auth/` | `AuthForm` | Login + register forms (shared, mode prop) |
| `dashboard/` | `SubjectTable`, `CGPASummary`, `CGPATrendsPage`, `GradeDistribution`, `GradeScale`, `SettingsPage`, `HelpPage` | Grade entry, analytics, settings |
| `layout/` | `Sidebar`, `Navbar` | Navigation shell |
| `ui/` | `Button`, `Card`, `Badge`, `CustomSelect`, `PinInput`, `ThemeToggle` | Reusable primitives |

### Data

| File | Purpose |
|------|---------|
| `data/curriculum.js` | Preset courses for SKCET B.Tech IT (Regulation 2022) |

## Routing

| Path | Component | Auth |
|------|-----------|------|
| `/login` | `AuthForm` (mode=login) | Public |
| `/register` | `AuthForm` (mode=register) | Public |
| `/dashboard` | `SubjectTable` + `GradeScale` + sidebar | Protected |
| `/trends` | `CGPATrendsPage` | Protected |
| `/settings` | `SettingsPage` | Protected |
| `/help` | `HelpPage` | Protected |

## CGPA Calculation

SGPA = Σ(credits × grade_point) / Σ(credits)
CGPA = Σ(all_semester_credits × grade_point) / Σ(all_semester_credits)

Semesters can be excluded from CGPA via the toggle without deleting data.

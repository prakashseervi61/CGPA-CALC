# Semora — Design System

A clean, modern CGPA calculator design system for university students, academic portals, and grade trackers. Built for responsive multi-device experiences (desktop, tablet, mobile).

---

## Design Philosophy

- **Edtech-first**: built around academic workflows — grade entry, credit tracking, semester breakdown, GPA trends, target-score simulation.
- **Responsive**: mobile-first, adaptive navigation (sidebar on desktop, drawer on mobile), reflowing tables into cards below `lg`.
- **Light / Dark**: first-class dark mode with semantically inverted tokens.
- **YAGNI**: every token and component exists because a screen needs it. No speculative additions.

---

## Color Tokens

All colors live in `src/index.css` under `@theme`. Components must reference CSS variables, never hex literals.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-primary` | `#6366F1` | `#818CF8` | Primary actions, links, active states |
| `--color-primary-hover` | `#4F46E5` | `#6366F1` | Hover / active primary |
| `--color-primary-active` | `#4338CA` | `#4F46E5` | Pressed / active state |
| `--color-primary-light` | `#EEF2FF` | `#312E81` | Primary backgrounds, subtle fills |
| `--color-primary-border` | `#C7D2FE` | `#4338CA` | Primary borders |

### Semantic

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-success` | `#10B981` | `#34D399` | Positive grades (O, A+), success states |
| `--color-success-light` | `#D4E8D6` | `#4A6E4D` | Success chip / badge fill |
| `--color-success-border` | `#B8D4BB` | `#4A6E4D` | Success chip border |
| `--color-success-text` | `#2D5A30` | `#86EFAC` | Success text |
| `--color-warning` | `#F59E0B` | `#FBBF24` | Caution, target-not-yet-met |
| `--color-warning-light` | `#FEF3C7` | `#78350F` | Warning chip fill |
| `--color-warning-border` | `#FCD34D` | `#D97706` | Warning chip border |
| `--color-danger` | `#EF4444` | `#F87171` | Destructive actions, fail grade (U) |
| `--color-danger-light` | `#FECACA` | `#EF4444` | Danger chip fill |
| `--color-danger-border` | `#FCA5A5` | `#EF4444` | Danger chip border |
| `--color-danger-text` | `#991B1B` | `#FCA5A5` | Danger text |

### Surfaces & Background

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-surface` | `#FFFFFF` | `#0F172A` | Card backgrounds |
| `--color-surface-variant` | `#F8FAFC` | `#1E293B` | Elevated surfaces |
| `--color-background` | `#F8FAFC` | `#020617` | Page background |
| `--color-background-secondary` | `#F1F5F9` | `#0F172A` | Secondary background |

### Text

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-text-primary` | `#0F172A` | `#F8FAFC` | Headings, primary text |
| `--color-text-secondary` | `#475569` | `#CBD5E1` | Body, secondary text |
| `--color-text-tertiary` | `#94A3B8` | `#64748B` | Captions, metadata |
| `--color-text-inverse` | `#FFFFFF` | `#0F172A` | Text on colored backgrounds |
| `--color-text-disabled` | `#CBD5E1` | `#475569` | Disabled states |

### Borders

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-border` | `#E2E8F0` | `#334155` | Default borders |
| `--color-border-weak` | `#F1F5F9` | `#1E293B` | Subtle borders |
| `--color-border-strong` | `#CBD5E1` | `#475569` | Strong borders |
| `--color-border-focus` | `#6366F1` | `#818CF8` | Focus ring borders |

---

## Typography

- **Family**: `Inter` (300–900), loaded via Google Fonts in `src/index.css`.
- **Scale**:
  - `text-[9px]` / `text-[10px]` / `text-[11px]` — captions, labels, metadata
  - `text-xs` / `text-sm` — body, form inputs
  - `text-base` / `text-lg` — section headings
  - `text-xl` — page headings
  - `text-5xl` — big numbers (CGPA)
- **Weights**: `font-extrabold` (default), `font-black` (headings / big numbers).

---

## Spacing & Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 0.5rem | Small elements |
| `--radius-md` | 0.75rem | Cards, inputs, buttons |
| `--radius-lg` | 1rem | Prominent cards |
| `--radius-xl` | 1.5rem | Hero cards |
| `--radius-full` | 9999px | Pill badges, avatar rings |

---

## Components

### Button
Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `success`.
Sizes: `sm`, `md`, `lg`.
Props: `loading` (spinner), `disabled`.
States: default, hover, active (scale 0.95), focus-visible (ring), disabled.

### Card
Variants: `default`, `elevated`, `outline`, `glass`.
Padding prop: `padding` (default `p-6`).
States: hover lift, focus-within ring.

### Input
Labels with required indicator, error states, touch-friendly padding (`px-4 py-3`), numeric input mode support.

### Select
Custom chevron icon, error states, touch-friendly padding.

### Badge
Variants: `primary`, `success`, `warning`, `danger`, `slate`, `outline`.
Sizes: `sm`, `md`, `lg`.

### ThemeToggle
Sun/moon icon with optional label. Respects `dark` class on `<html>`.

---

## Layout Patterns

- **Desktop**: Fixed left sidebar (`w-[260px]`) + top sticky navbar + scrollable main content.
- **Mobile**: Drawer sidebar (slide-in from left, `lg:hidden`) + top navbar with hamburger.
- **Tables → Lists**: Subject grade entry renders as a linear list (one subject per row) on all breakpoints.
- **KPI Grids**: `grid-cols-2 sm:grid-cols-4 lg:grid-cols-7` for grade scale chips.
- **No layout shifts**: Content anchors use fixed heights and predictable containers.

---

## Pages

| Path | Purpose |
|---|---|
| `/` | Dashboard — subject grade entry (linear list), SGPA/CGPA, grade scale, distribution |
| `/trends` | GPA trend charts, semester breakdown, target simulator |
| `/settings` | Profile, 4-digit PIN, target CGPA, data reset |
| `/help` | Formula guide, FAQ, regulation grade reference |

---

## Data

- Grades stored in `localStorage` key `cgpa_app_semesters`.
- Profile (name, ID, target CGPA, PIN) in `localStorage` key `cgpa_app_profile`.
- No authentication — app opens directly to dashboard.

---

## Micro-interactions

- **Press state**: `active:scale-95` on buttons
- **Hover lift**: `hover-lift` class translates `-2px` on hover
- **Focus rings**: `focus-visible:ring-2 focus-visible:ring-primary/30` on interactive elements
- **List stagger**: `stagger-child` animates list items in sequence
- **Transitions**: `--transition-fast` (150ms), `--transition-base` (250ms), `--transition-slow` (350ms)

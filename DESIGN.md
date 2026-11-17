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
| `--color-primary-light` | `#EEF2FF` | `#312E81` | Primary backgrounds, subtle fills |
| `--color-success` | `#10B981` | `#10B981` | Positive grades (O, A+), success states |
| `--color-success-light` | `#D4E8D6` | `#4A6E4D`/20 | Success chip / badge fill |
| `--color-success-border` | `#B8D4BB` | `#4A6E4D`/40 | Success chip border |
| `--color-warning` | `#F59E0B` | `#F59E0B` | Caution, target-not-yet-met |
| `--color-danger` | `#EF4444` | `#EF4444` | Destructive actions, fail grade (U) |
| `--color-danger-light` | `#FECACA` | `#EF4444`/20 | Danger chip / badge fill |
| `--color-stone-50` / `--color-stone-950` | stone scale | stone scale | Surface, background, text |

**Semantic grade colors** (used in GradeDistribution & GradeScale):

| Grade | Color |
|---|---|
| O | success |
| A+ | primary |
| A | amber |
| B+ | orange |
| B | stone |
| C | stone (muted) |
| U | danger |

---

## Typography

- **Family**: `Inter` (300–800), loaded via Google Fonts in `src/index.css`.
- **Scale**:
  - `text-[10px]` / `text-[11px]` — captions, labels, metadata
  - `text-sm` / `text-base` — body, form inputs
  - `text-lg` / `text-xl` — section headings
  - `text-2xl` — page headings
  - `text-4xl` — brand wordmark
- **Weights**: `font-semibold` (default), `font-bold`, `font-extrabold`, `font-black` (headings / big numbers).

---

## Spacing & Border Radius

| Token | Value | Usage |
|---|---|---|
| Radius | `rounded-xl` (0.75rem) | Cards, inputs, buttons, badges |
| Radius | `rounded-2xl` (1rem) | Prominent cards, section containers |
| Radius | `rounded-[24px]` | Hero / summary cards |
| Radius | `rounded-full` | Avatar rings, pill badges |
| Spacing | `p-6` (1.5rem) | Card body padding (desktop) |
| Spacing | `p-4` (1rem) | Card body padding (mobile / compact) |
| Spacing | `gap-2` to `gap-6` | Internal component gaps |

---

## Components

### Button
Variants: `primary`, `secondary`, `outline`, `pastelGreen`.
Sizes: `sm`, `md`, `lg`.
States: default, hover, active (scale 0.95), disabled.

### Card
Base: `bg-white dark:bg-stone-900 rounded-[24px] border border-stone-100 dark:border-stone-800 shadow-sm shadow-primary/5 p-6`.
Override `p-4` for compact/mobile cards.

### Badge
Variants: `purple`, `green`, `red`, `slate`.
Sizes: `sm`, `md`, `lg`.
Use for: grade letters, credit pills, status labels, semester include/exclude.

### ThemeToggle
Sun/moon icon with optional "Light / Dark" label (hidden below `sm`). Respects `dark` class on `<html>`.

---

## Layout Patterns

- **Desktop**: Fixed left sidebar (`w-[260px]`) + top sticky navbar + scrollable main content.
- **Mobile**: Drawer sidebar (slide-in from left, `lg:hidden`) + top navbar with hamburger.
- **Tables → Cards**: `SubjectTable` renders a `<table>` on `lg+` and a card list below `lg`.
- **KPI Grids**: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` for trend cards.

---

## Pages

| Path | Purpose |
|---|---|
| `/` | Dashboard — subject grade entry, SGPA/CGPA, grade scale, distribution |
| `/trends` | GPA trend charts, semester breakdown, target simulator |
| `/settings` | Profile, 4-digit PIN, target CGPA, data reset |
| `/help` | Formula guide, FAQ, regulation grade reference |

---

## Data

- Grades stored in `localStorage` key `cgpa_app_semesters`.
- Profile (name, ID, target CGPA, PIN) in `localStorage` key `cgpa_app_profile`.
- No authentication — app opens directly to dashboard.

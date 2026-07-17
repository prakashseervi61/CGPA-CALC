# Development

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |

## Code Style

- Functional components with hooks
- Tailwind CSS for all styling (no CSS modules, no styled-components)
- `const`/`let` over `var`
- `async/await` over `.then()` chains
- Descriptive variable names

## Adding a Feature

1. Create component in appropriate `src/components/` subdirectory
2. Add route in `src/App.jsx` if it's a new page
3. Add state/context in `src/contexts/` if shared data is needed
4. Use existing UI primitives from `src/components/ui/` (Button, Card, Badge, etc.)

## State Management

All state lives in React Context:

- **AuthContext**: user profile, login/logout, PIN verification
- **DataContext**: semesters, grades, grade scale, CGPA calculation
- **ThemeContext**: dark/light mode

No external state library (Redux, Zustand). Context + useState is sufficient for this app's scope.

## Data Persistence

Everything stores to `localStorage`:

| Key | Data |
|-----|------|
| `user` | Current user profile (name, registerNumber, pin) |
| `semesters` | All semester data with grades |
| `gradeScale` | Custom grade-to-point mapping |
| `theme` | Dark/light preference |

No server, no API calls, no database.

## Styling

Tailwind v4 with `@theme` tokens in `src/index.css`. The primary palette is earthy terracotta:

- Primary: `#C27856` (light) / `#D4956F` (dark)
- Success: `#7A9E7E`
- Warning: `#D4A843`
- Danger: `#C75B5B`

Use `text-primary`, `bg-primary`, `border-primary` etc. in Tailwind classes.

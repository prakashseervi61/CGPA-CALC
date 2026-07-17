# Configuration

## Build

Vite 6 with React plugin and Tailwind CSS 4 Vite plugin. No separate `tailwind.config.js` or `postcss.config.js` — Tailwind v4 uses CSS-based config via `@theme` in `src/index.css`.

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19 | UI framework |
| react-dom | 19 | DOM renderer |
| react-router-dom | 7 | Client-side routing |
| recharts | 3.9 | Charts (area, bar, donut) |
| lucide-react | 1.23 | Icons |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vite | 6 | Build tool |
| @vitejs/plugin-react | 4.3 | React fast refresh |
| tailwindcss | 4 | Utility-first CSS |
| @tailwindcss/vite | 4 | Tailwind Vite integration |

## Theme Customization

Colors are defined in `src/index.css` via Tailwind v4's `@theme` block:

```css
@theme {
  --color-primary: #C27856;      /* Terracotta */
  --color-primary-hover: #A8623E;
  --color-primary-light: #FDF2EC;
  --color-success: #7A9E7E;
  --color-warning: #D4A843;
  --color-danger: #C75B5B;
}
```

Override these values to change the app's color scheme globally.

## Grade Scale

Customizable via the UI in the dashboard. Stored in `localStorage` under key `gradeScale`. Default scale maps letter grades (O, A+, A, ..., F) to points (10, 9, 8, ..., 0).

## Curriculum Data

Preset courses are defined in `src/data/curriculum.js`. To add a new branch or regulation, export a new array of `Course` objects with `{ id, name, code, credits, semester }` and update the branch mapping logic in `DataContext`.

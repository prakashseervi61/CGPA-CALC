# Semora

> CGPA calculator for SKCET B.Tech IT students — no backend, no accounts required, just your browser.

<p>
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite_6-646CFF?style=flat-square&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Recharts-FF6384?style=flat-square" alt="Recharts">
  <img src="https://img.shields.io/badge/Lucide-000000?style=flat-square&logo=lucide" alt="Lucide">
  <img src="https://img.shields.io/badge/React_Router_DOM-7-CA4245?style=flat-square" alt="React Router">
</p>

---

## Highlights

- **Zero backend** — all data stays in `localStorage`. Nothing leaves your device.
- **Real-time CGPA** — updates instantly as you enter grades.
- **Multi-profile** — PIN-protected separate accounts on the same browser.
- **Full dark mode** — with system preference detection and manual toggle.
- **Responsive** — works on phone, tablet, and desktop.

## Features

| Feature | Description |
|---------|-------------|
| Preset curriculum | SKCET IT courses, codes, and credits pre-loaded (Regulation 2022) |
| Real-time SGPA/CGPA | Recalculates on every keystroke |
| Multi-profile | PIN-protected accounts with isolated data |
| Semester toggle | Exclude semesters from CGPA calculation |
| Custom grade scale | Add, edit, or reset grade-to-point mapping |
| SGPA & CGPA trends | Line chart across semesters |
| Grade distribution | Donut chart breakdown of achieved grades |
| Target CGPA | Required future GPA to hit your goal |
| Dark / Light mode | Manual toggle, remembers preference |
| Deep-link support | GitHub Pages SPA routing via 404.html redirect |

## Getting started

```bash
# clone
git clone https://github.com/prakashseervi61/CGPA-CALC.git
cd CGPA-CALC

# install dependencies
npm install

# start dev server
npm run dev
```

Opens at [http://localhost:5173/CGPA-CALC/](http://localhost:5173/CGPA-CALC/)

## Production build

```bash
npm run build       # outputs to dist/
npm run preview     # preview the build locally
npm run deploy      # publish to GitHub Pages (gh-pages branch)
```

## Tech stack

| Layer | Tool | Version |
|-------|------|---------|
| Framework | React | 19 |
| Build tool | Vite | 6 |
| Styling | Tailwind CSS | 4 |
| Charts | Recharts | 3.9 |
| Icons | Lucide React | — |
| Routing | React Router DOM | 7 |
| Deployment | gh-pages | — |

## Project structure

```
src/
├── components/
│   ├── auth/              # Login / register form
│   ├── dashboard/         # Subject table, CGPA summary, charts, settings, help
│   ├── layout/            # Sidebar (desktop), mobile nav
│   └── ui/                # Button, Card, Badge, ThemeToggle
├── contexts/
│   ├── AuthContext.jsx     # User session, login / logout
│   ├── DataContext.jsx     # Grades, semesters, CGPA calculation
│   └── ThemeContext.jsx    # Dark / light mode
├── data/
│   └── courses.js          # SKCET IT curriculum (8 semesters)
├── App.jsx                 # Routes, ProtectedRoute
├── main.jsx                # Entry point, BrowserRouter
└── index.css               # Tailwind v4 config, theme vars
```

## How it works

1. **Register** — choose a username, register number, and 4-digit PIN.
2. **Log in** — enter credentials to access your dashboard.
3. **Enter grades** — select grades from dropdowns; SGPA and CGPA update live.
4. **Track trends** — view semester-wise performance charts and grade distribution.
5. **Set targets** — configure a target CGPA in Settings to see required future performance.



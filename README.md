<p align="center">
  <h1 align="center">Semora</h1>
  <p align="center">CGPA calculator that stays out of your way</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite_6-646CFF?style=flat-square&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Recharts-FF6384?style=flat-square" alt="Recharts">
</p>

---

## What it does

Track grades across semesters, see your CGPA update in real time, and visualize trends — all stored locally in your browser. No account, no server, no data leaves your machine.

Built for **SKCET B.Tech IT** (2024–2028, Regulation 2022) with preset course data. Grade scale is fully customizable.

## Features

| | Feature | Details |
|---|---------|---------|
| | Preset curriculum | Courses, codes, credits pre-loaded |
| | Real-time SGPA/CGPA | Updates as you type |
| | Multi-profile | PIN-protected separate accounts |
| | Semester toggle | Exclude semesters from CGPA |
| | Custom grade scale | Add/edit grade-to-point mapping |
| | Trends chart | SGPA & CGPA over time |
| | Grade distribution | Donut chart breakdown |
| | Target CGPA | Required future GPA to hit your goal |
| | Dark/Light mode | Toggle with system preference |
| | Responsive | Works on phone, tablet, desktop |

## Quick start

```bash
git clone https://github.com/prakashseervi61/CGPA-CALC.git
cd CGPA-CALC
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build      # production build in dist/
npm run preview    # preview the build locally
```

## Tech stack

| Layer | Tool |
|-------|------|
| Framework | React 19 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts 3.9 |
| Icons | Lucide React |
| Routing | React Router DOM 7 |

## Project structure

```
src/
├── components/
│   ├── auth/          # Login/register forms
│   ├── dashboard/     # Grades, charts, settings, help
│   ├── layout/        # Sidebar, navbar
│   └── ui/            # Button, Card, Badge, CustomSelect
├── contexts/          # Auth, Data, Theme providers
└── data/              # Curriculum courses
```

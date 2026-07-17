# Getting Started

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

## Installation

```bash
git clone https://github.com/prakashseervi61/CGPA-CALC.git
cd CGPA-CALC
npm install
```

## Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173).

## First Use

1. Register a new account with username, register number, and 4-digit PIN
2. Login with your credentials
3. Select a semester from the dropdown
4. Enter grades for each subject — SGPA/CGPA update in real time
5. Use the sidebar to view trends, adjust settings, or customize the grade scale

## Build for Production

```bash
npm run build    # output in dist/
npm run preview  # preview the build
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # AuthForm (login + register)
│   ├── dashboard/     # SubjectTable, CGPASummary, charts, settings
│   ├── layout/        # Sidebar, Navbar
│   └── ui/            # Button, Card, Badge, CustomSelect, PinInput, ThemeToggle
├── contexts/          # AuthContext, DataContext, ThemeContext
├── data/              # curriculum.js (preset courses)
├── App.jsx            # Routes, ProtectedRoute, DashboardLayout
├── main.jsx           # Entry point
└── index.css          # Tailwind theme + global styles
```

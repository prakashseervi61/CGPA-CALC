# Apex GPA — Minimalist SGPA & CGPA Calculator

Apex GPA is a clean, modern, and minimalist engineering GPA/CGPA calculator designed with a light-theme first aesthetic, supporting glassmorphism design patterns, responsive layouts, and auto-saving. It features pre-loaded curriculum datasets specifically tailored for students.

---

## 🚀 Live Demo & Hosting

You can easily host this repository on GitHub Pages:
1. Go to repository **Settings** -> **Pages**.
2. Select **Deploy from a branch** as the source.
3. Choose the **`main`** branch and the **`/ (root)`** folder, then click **Save**.
4. Your site will be live at `https://<your-username>.github.io/CGPA-CALC/`.

---

## ✨ Features

- **Preset Curriculum**: Pre-populated courses, codes, and credit hours for the **SKCET B.Tech Information Technology (2024-2028 Batch) Regulation 2022**.
- **Real-time Live Calculation**: Dynamic computation of SGPA for each semester and overall CGPA as you input your grades.
- **Glassmorphic UI**: Beautiful modern design using Tailwind CSS with clean backdrop blur panels and transitions.
- **Dark Mode Support**: Seamless toggle between elegant light and dark modes.
- **Persistence (Auto-Save)**: Your entered grades and selections are instantly cached in `localStorage` so they persist even after page refreshes.
- **Modular Exclusions**: Toggle individual semesters in or out of the CGPA calculation with a simple switch.
- **Responsive Mobile Dashboard**: Fully customized mobile interface using a modern bottom tab navigation bar.

---

## 🛠️ Tech Stack

- **Markup**: Semantic HTML5
- **Styling**: Tailwind CSS & Vanilla CSS (with responsive utility classes)
- **Icons**: FontAwesome 6 (CDN)
- **Fonts**: Outfit (via Google Fonts)
- **Logic**: Vanilla ES6 JavaScript (No frameworks, pure and lightweight)

---

## 📂 Project Structure

```text
CGPA-CALC/
│
├── index.html            # Main markup file & skeleton
├── README.md             # Project documentation
│
└── assets/
    ├── css/
    │   └── style.css     # Custom minimalist animations and utility styles
    │
    └── js/
        ├── curriculum.js # Curriculum definitions and presets
        └── app.js        # Core state manager, calculator logic & DOM events
```

---

## ⚡ How to Run Locally

Since this is a client-side static application, you don't need any local server setup to run it:

1. Clone this repository:
   ```bash
   git clone https://github.com/prakashseervi61/CGPA-CALC.git
   ```
2. Open `index.html` directly in any modern web browser.

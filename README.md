# Apex GPA — Modern Educational SGPA & CGPA Calculator

Apex GPA is a modern, educational, and accessible GPA/CGPA calculator designed to support students throughout their academic journey. Built with React 19, Vite, and Tailwind CSS, it features an intuitive interface, persistent data storage, goal-setting tools, learning resource integration, and comprehensive analytics to foster academic success.

## ✨ Features

### Core Functionality
- **Preset Curriculum**: Pre-loaded courses, codes, and credit hours for the SKCET B.Tech Information Technology (2024-2028 Batch) Regulation 2022.
- **Real-time Calculation**: Instant SGPA and CGPA computation as grades are entered.
- **Multi-user Support**: Separate profiles for different students or semesters with 4-digit PIN protection.
- **Data Persistence**: Automatic saving to browser localStorage — data survives page refreshes and browser restarts.
- **Semester Inclusion Toggle**: Include or exclude specific semesters from CGPA calculation.
- **Data Export/Import**: Export grades as CSV for backup or sharing; reset data when needed.

### Educational Enhancements
- **Goal Setting**: Set target CGPA and visualize progress with required future GPA calculations.
- **Learning Resources**: Get personalized video/article recommendations based on course performance.
- **Study Planner**: Schedule study sessions with calendar integration (coming soon).
- **Strengths & Weaknesses Analysis**: Identify subjects where you excel or need improvement.
- **Grade Trend Analysis**: Interactive charts showing SGPA/CGPA progression and credit distribution.

### User Experience
- **Clean, Minimalist Interface**: Soft color palette with ample whitespace for reduced cognitive load.
- **Responsive Design**: Optimized for mobile, tablet, and desktop with adaptive layouts.
- **Accessibility First**: Full keyboard navigation, screen reader support, and WCAG AA compliance.
- **Dark/Light Mode**: Seamless toggle between light and dark themes.
- **Micro-interactions**: Subtle animations and feedback for engaging user experience.
- **PWA Support**: Install as a progressive web app for offline use and home screen access.

### Data Visualization
- **SGPA vs CGPA Progression Chart**: Area chart comparing semester performance to cumulative average.
- **Credit Load Bar Chart**: Visualizing course credit distribution per semester.
- **Grade Distribution Donut Chart**: Breakdown of achieved grades with interactive legend.
- **Semester Performance Table**: Detailed table view of all academic metrics.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS 4
- **State Management**: React Context API withuseState/useReducer
- **Data Persistence**: browser localStorage (with custom hooks)
- **Charts**: Recharts 3.9
- **Icons**: Lucide React
- **Animations**: Framer Motion (for micro-interactions)
- **Build Tool**: Vite with React plugin and Tailwind integration
- **Code Quality**: ESLint, Prettier (configured via project settings)

## 📱 Platforms
- Web App (responsive design)
- Progressive Web App (installable on mobile/desktop)
- (Future) Android/iOS via Capacitor

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Sri Krishna College of Engineering & Technology for curriculum data
- Open-source community for React, Vite, Tailwind, and Recharts
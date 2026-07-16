import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './contexts/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import SubjectTable from './components/dashboard/SubjectTable';
import GradeScale from './components/dashboard/GradeScale';
import CGPASummary from './components/dashboard/CGPASummary';
import GradeDistribution from './components/dashboard/GradeDistribution';
import CGPATrendsPage from './components/dashboard/CGPATrendsPage';
import SettingsPage from './components/dashboard/SettingsPage';
import HelpPage from './components/dashboard/HelpPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useUser();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <Navbar setMobileOpen={setMobileOpen} />
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  const { isLoggedIn } = useUser();

  return (
    <Routes>
      <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardLayout>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-stone-50 dark:bg-stone-950">
            <div className="space-y-6"><SubjectTable /><GradeScale /></div>
          </main>
          <aside className="w-full lg:w-[320px] xl:w-[350px] shrink-0 p-4 sm:p-6 space-y-3.5 overflow-y-auto select-none bg-white dark:bg-stone-900 border-t lg:border-t-0 lg:border-l border-stone-200/80 dark:border-stone-800/80">
            <CGPASummary /><GradeDistribution />
          </aside>
        </DashboardLayout></ProtectedRoute>
      } />
      <Route path="/trends" element={
        <ProtectedRoute><DashboardLayout>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-stone-50 dark:bg-stone-950"><CGPATrendsPage /></main>
        </DashboardLayout></ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute><DashboardLayout>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-stone-50 dark:bg-stone-950"><SettingsPage /></main>
        </DashboardLayout></ProtectedRoute>
      } />
      <Route path="/help" element={
        <ProtectedRoute><DashboardLayout>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-stone-50 dark:bg-stone-950"><HelpPage /></main>
        </DashboardLayout></ProtectedRoute>
      } />
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default App;

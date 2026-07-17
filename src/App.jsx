import { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './contexts/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import SubjectTable from './components/dashboard/SubjectTable';
import GradeScale from './components/dashboard/GradeScale';
import CGPASummary from './components/dashboard/CGPASummary';
import GradeDistribution from './components/dashboard/GradeDistribution';
import SettingsPage from './components/dashboard/SettingsPage';
import HelpPage from './components/dashboard/HelpPage';
import AuthForm from './components/auth/AuthForm';

const CGPATrendsPage = lazy(() => import('./components/dashboard/CGPATrendsPage'));

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useUser();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function DashboardLayout({ children, aside }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <Navbar setMobileOpen={setMobileOpen} />
        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden lg:flex lg:flex-row">
          {/* Mobile: single scrollable column */}
          <div className="lg:hidden p-3 space-y-4">
            {children}
            {aside}
          </div>
          {/* Desktop: side-by-side */}
          {aside ? (
            <div className="hidden lg:flex lg:flex-1 lg:flex-row lg:min-h-0 lg:overflow-hidden">
              <main className="flex-1 overflow-y-auto p-6 xl:p-8 bg-stone-50 dark:bg-stone-950">
                {children}
              </main>
              <aside className="w-[280px] xl:w-[320px] shrink-0 p-6 space-y-3 select-none bg-white dark:bg-stone-900 border-l border-stone-200/80 dark:border-stone-800/80 flex flex-col min-h-0 overflow-y-auto">
                {aside}
              </aside>
            </div>
          ) : (
            <div className="hidden lg:block flex-1 overflow-y-auto p-6 xl:p-8 bg-stone-50 dark:bg-stone-950">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const { isLoggedIn } = useUser();
  const mainCls = "flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 bg-stone-50 dark:bg-stone-950";

  return (
    <Routes>
      <Route path="/login" element={!isLoggedIn ? <AuthForm mode="login" /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!isLoggedIn ? <AuthForm mode="register" /> : <Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardLayout aside={<><CGPASummary /><GradeDistribution /></>}>
          <div className="space-y-4"><SubjectTable /><GradeScale /></div>
        </DashboardLayout></ProtectedRoute>
      } />
      <Route path="/trends" element={
        <ProtectedRoute><DashboardLayout>
          <Suspense fallback={<div className="flex items-center justify-center h-64 text-stone-500 dark:text-stone-400">Loading...</div>}>
            <CGPATrendsPage />
          </Suspense>
        </DashboardLayout></ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute><DashboardLayout>
          <SettingsPage />
        </DashboardLayout></ProtectedRoute>
      } />
      <Route path="/help" element={
        <ProtectedRoute><DashboardLayout>
          <HelpPage />
        </DashboardLayout></ProtectedRoute>
      } />
      <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default App;

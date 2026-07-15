import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useUser } from './hooks/useUser';
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

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user, handleLogout, handleLogin } = useUser();

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Dashboard page content
  const DashboardContent = () => {
    return (
      <>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <SubjectTable />
            <GradeScale />
          </div>
        </main>
        <aside className="w-full xl:w-[350px] shrink-0 p-4 sm:p-6 space-y-3.5 overflow-hidden select-none bg-white border-l border-slate-100/80">
          <CGPASummary />
          <GradeDistribution />
        </aside>
      </>
    );
  };

  // App shell layout
  const AppShell = ({ children }) => (
    <>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar setMobileOpen={setMobileOpen} />
        <div className="flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </>
  );

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/login"
        element={!isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" replace />}
      />
      {/* Register Route */}
      <Route
        path="/register"
        element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
      />
      {/* Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <DashboardContent />
            </AppShell>
          </ProtectedRoute>
        }
      />
      {/* CGPA Trends Route */}
      <Route
        path="/trends"
        element={
          <ProtectedRoute>
            <AppShell>
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                <CGPATrendsPage />
              </main>
            </AppShell>
          </ProtectedRoute>
        }
      />
      {/* Settings Route */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppShell>
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                <SettingsPage />
              </main>
            </AppShell>
          </ProtectedRoute>
        }
      />
      {/* Help Route */}
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <AppShell>
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                <HelpPage onReturnToDashboard={() => navigate('/dashboard')} />
              </main>
            </AppShell>
          </ProtectedRoute>
        }
      />
      {/* Redirect root to login or dashboard */}
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />
      {/* Catch-all */}
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}

export default App;
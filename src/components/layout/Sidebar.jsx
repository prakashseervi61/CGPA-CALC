import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  HelpCircle,
  X,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cgpa-trends', path: '/trends', label: 'Trends', icon: TrendingUp },
  { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
  { id: 'help', path: '/help', label: 'Help & Support', icon: HelpCircle },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface dark:bg-surface-variant border-r border-border dark:border-border-strong p-5 w-[260px] shrink-0 select-none">
      {/* Top Logo */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-black text-text-primary tracking-tight leading-tight">
            Semora
          </h1>
          <p className="text-[10px] font-extrabold text-text-tertiary -mt-1 uppercase tracking-wider">
            Academic Portal
          </p>
        </div>

        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end
              onClick={() => {
                if (setMobileOpen) setMobileOpen(false);
              }}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-extrabold transition-all duration-200 ${isActive ? 'bg-primary-light text-primary-hover font-black shadow-sm dark:bg-primary-hover/20 dark:text-primary-light' : 'text-text-secondary hover:text-text-primary hover:bg-stone-50 dark:hover:bg-stone-800/50'}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="p-2 rounded-lg transition-colors duration-200 shrink-0">
                    <Icon className="w-4 h-4 text-current" />
                  </div>
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 text-text-tertiary ml-auto shrink-0" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: version / help hint */}
      <div className="mt-auto pt-5 border-t border-border dark:border-border-strong">
        <p className="text-[9px] font-extrabold text-text-tertiary uppercase tracking-widest">
          v1.0.0 &bull; SKCET IT
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block sticky top-0 h-screen z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 animate-[slide-in_300ms_cubic-bezier(0.4,0,0.2,1)_both]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

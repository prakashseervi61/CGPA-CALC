import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  TrendingUp, 
  Settings, 
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cgpa-trends', label: 'CGPA Trends', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F5F3FF] border-r border-slate-200/60 p-6 w-[260px] shrink-0 select-none">
      {/* Top Logo */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-800 leading-tight">
              CGPA Calculator
            </h1>
            <p className="text-[11px] text-slate-400 font-medium -mt-1">Academic Portal</p>
          </div>
        </div>

        {/* Mobile close button */}
        {setMobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (setMobileOpen) setMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200
                ${isActive 
                  ? 'bg-[#E0E7FF] text-[#4F46E5] shadow-sm shadow-indigo-500/5 font-extrabold' 
                  : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                }
              `}
            >
              <div className={`
                p-2 rounded-xl transition-colors duration-200 shrink-0
                ${isActive 
                  ? 'bg-[#4F46E5] text-white shadow-sm shadow-indigo-500/20' 
                  : 'bg-white text-slate-500 border border-slate-100'
                }
              `}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Logout Button */}
      <div className="pt-4 mt-auto border-t border-slate-200/60">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-rose-100/80 text-rose-600 group-hover:bg-rose-200/80 shrink-0 transition-colors">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="font-extrabold">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block sticky top-0 h-screen z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

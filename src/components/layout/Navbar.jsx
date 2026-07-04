import React from 'react';
import { Menu, ChevronDown } from 'lucide-react';

export default function Navbar({ 
  currentSemesterId, 
  setCurrentSemesterId, 
  semesters, 
  setMobileOpen,
  userName = 'Prakash'
}) {
  return (
    <header className="px-6 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
      {/* Left Greeting */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2 leading-tight">
            Hello, {userName}! <span className="inline-block animate-bounce">👋</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold">
            Let's calculate your SGPA & CGPA
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Semester Select Dropdown */}
        <div className="relative">
          <div className="flex items-center bg-[#F5F3FF] border border-slate-200/80 rounded-xl px-3 py-1.5 hover:border-[#4F46E5]/50 transition-colors">
            <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider hidden sm:inline">Active:</span>
            <select
              value={currentSemesterId}
              onChange={(e) => setCurrentSemesterId(Number(e.target.value))}
              className="bg-transparent text-slate-800 font-extrabold text-xs focus:outline-none cursor-pointer pr-4 appearance-none"
            >
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.id} className="bg-white text-slate-800">
                  {sem.name} {sem.courses?.length ? `(${sem.courses.length} subjects)` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-3" />
          </div>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { ViewMode, User, Course } from '../types';
import {
  Calendar,
  ListTodo,
  Clock,
  Plus,
  Share2,
  Moon,
  Sun,
  Cloud,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  courses: Course[];
  user: User | null;
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  courses,
  user,
  onOpenAddModal,
  onOpenExportModal,
  onOpenAuthModal,
  onLogout,
  theme,
  toggleTheme,
}) => {
  const totalSks = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & SKS Counter */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setViewMode('weekly')}>
              <img src="/logo.svg" alt="JadwalinAja Logo" className="w-9 h-9 rounded-xl shadow-sm" />
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                  JadwalinAja
                </span>
                <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-200/50 dark:border-indigo-800/40">
                  Cloudflare Edge
                </span>
              </div>
            </div>

            {/* SKS Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{totalSks} SKS Total</span>
              <span className="text-slate-400">({courses.length} Matkul)</span>
            </div>
          </div>

          {/* Navigation Tabs (Center) */}
          <nav className="hidden lg:flex items-center p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl">
            <button
              onClick={() => setViewMode('weekly')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'weekly'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Mingguan</span>
            </button>

            <button
              onClick={() => setViewMode('agenda')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'agenda'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Agenda Hari Ini</span>
            </button>

            <button
              onClick={() => setViewMode('tasks')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'tasks'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>Tugas & Deadline</span>
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Add Course Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 rounded-xl shadow-sm hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Matkul</span>
              <span className="sm:hidden">Tambah</span>
            </button>

            {/* Export & Share Button */}
            <button
              onClick={onOpenExportModal}
              title="Export & Share (Wallpaper, iCal, Backup)"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* User Profile / Google Sign-in */}
            {user ? (
              <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full ring-2 ring-indigo-500/30 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
              >
                <Cloud className="w-4 h-4 text-sky-500" />
                <span className="hidden sm:inline">Google Sync</span>
                <span className="sm:hidden">Sync</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile View Switcher Tabs (Row below on small screens) */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-200/60 dark:border-slate-800/60">
          <button
            onClick={() => setViewMode('weekly')}
            className={`flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold ${
              viewMode === 'weekly'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Mingguan</span>
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={`flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold ${
              viewMode === 'agenda'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Agenda Hari Ini</span>
          </button>
          <button
            onClick={() => setViewMode('tasks')}
            className={`flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold ${
              viewMode === 'tasks'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Tugas</span>
          </button>
        </div>
      </div>
    </header>
  );
};

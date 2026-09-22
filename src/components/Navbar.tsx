import React from 'react';
import { ViewMode, User, Course } from '../types';
import {
  Calendar,
  ListTodo,
  Clock,
  Plus,
  Share2,
  Cloud,
  LogOut,
  Wand2,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  courses: Course[];
  user: User | null;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onOpenExportModal: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  courses,
  user,
  onOpenAddModal,
  onOpenImportModal,
  onOpenExportModal,
  onOpenAuthModal,
  onLogout,
}) => {
  const totalSks = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & SKS Counter */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => setViewMode('weekly')}
            >
              <img
                src="/logo.svg"
                alt="JadwalinAja Logo"
                className="w-8 h-8 rounded-lg group-hover:scale-105 transition-transform"
              />
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black tracking-tight text-neutral-900">
                  JadwalinAja
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-neutral-100 text-neutral-600 rounded border border-neutral-200">
                  Kuliah
                </span>
              </div>
            </div>

            {/* SKS Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-xs font-semibold text-neutral-700 border border-neutral-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{totalSks} SKS</span>
              <span className="text-neutral-400 font-normal">({courses.length} Matkul)</span>
            </div>
          </div>

          {/* Navigation Tabs (Center) */}
          <nav className="hidden lg:flex items-center p-1 bg-neutral-100 rounded-xl border border-neutral-200">
            <button
              onClick={() => setViewMode('weekly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'weekly'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jadwal Mingguan</span>
            </button>

            <button
              onClick={() => setViewMode('agenda')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'agenda'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Agenda Harian</span>
            </button>

            <button
              onClick={() => setViewMode('attendance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'attendance'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Presensi & Absen</span>
            </button>

            <button
              onClick={() => setViewMode('tasks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'tasks'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Tugas & Ujian</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Smart Import Button */}
            <button
              onClick={onOpenImportModal}
              title="Impor Cepat dari Teks SIAKAD Kampus"
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-all cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-neutral-700" />
              <span className="hidden sm:inline">Impor SIAKAD</span>
            </button>

            {/* Quick Add Course Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>

            {/* Export & Share Button */}
            <button
              onClick={onOpenExportModal}
              title="Export (Wallpaper PNG, iCal, Cetak PDF)"
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all border border-neutral-200 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* User Profile / Google Sign-in */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-7 h-7 rounded-full ring-1 ring-neutral-300 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-all cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5 text-neutral-500" />
                <span className="hidden sm:inline">Google Sync</span>
                <span className="sm:hidden">Sync</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile View Switcher (Scrollable) */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-neutral-200/70 overflow-x-auto">
          <button
            onClick={() => setViewMode('weekly')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              viewMode === 'weekly'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Mingguan</span>
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              viewMode === 'agenda'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Harian</span>
          </button>
          <button
            onClick={() => setViewMode('attendance')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              viewMode === 'attendance'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Presensi</span>
          </button>
          <button
            onClick={() => setViewMode('tasks')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-bold whitespace-nowrap ${
              viewMode === 'tasks'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600'
            }`}
          >
            <ListTodo className="w-3 h-3" />
            <span>Tugas</span>
          </button>
        </div>
      </div>
    </header>
  );
};

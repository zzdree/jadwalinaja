import { useState, useEffect } from 'react';
import { Course, Task, User, ViewMode, DayOfWeek, AttendanceRecord } from './types';
import {
  loadCourses,
  saveCourses,
  loadTasks,
  saveTasks,
  loadUser,
  saveUser,
  syncWithCloudflareD1,
} from './lib/storage';
import { getDayName } from './lib/utils';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { NextClassBanner } from './components/NextClassBanner';
import { WeeklyTimetable } from './components/WeeklyTimetable';
import { DailyAgenda } from './components/DailyAgenda';
import { AttendanceTracker } from './components/AttendanceTracker';
import { TaskTracker } from './components/TaskTracker';
import { CourseModal } from './components/CourseModal';
import { ExportModal } from './components/ExportModal';
import { SmartImportModal } from './components/SmartImportModal';
import { AuthModal } from './components/AuthModal';
import { CloudCheck, Heart } from 'lucide-react';

export function App() {
  const [courses, setCourses] = useState<Course[]>(loadCourses);
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [user, setUser] = useState<User | null>(loadUser);
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');

  // Modals state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState<Course | null>(null);
  const [quickAddDay, setQuickAddDay] = useState<DayOfWeek | undefined>(undefined);
  const [quickAddHour, setQuickAddHour] = useState<number | undefined>(undefined);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast / sync feedback
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Save courses and tasks locally whenever they change
  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Sync to Cloudflare D1 automatically if user is logged in
  useEffect(() => {
    if (user) {
      syncWithCloudflareD1(user, courses, tasks).then((res) => {
        if (res.success) {
          setSyncToast('Jadwal tersinkronisasi ke Cloudflare D1');
          setTimeout(() => setSyncToast(null), 3000);
        }
      });
    }
  }, [user, courses, tasks]);

  // Course handlers
  const handleSaveCourse = (saved: Course) => {
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      if (exists) {
        return prev.map((c) => (c.id === saved.id ? saved : c));
      } else {
        return [...prev, saved];
      }
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setTasks((prev) =>
      prev.map((t) => (t.courseId === courseId ? { ...t, courseId: undefined } : t))
    );
  };

  const handleOpenEdit = (course: Course) => {
    setSelectedCourseForEdit(course);
    setQuickAddDay(undefined);
    setQuickAddHour(undefined);
    setIsCourseModalOpen(true);
  };

  const handleQuickAdd = (day: DayOfWeek, hour: number) => {
    setSelectedCourseForEdit(null);
    setQuickAddDay(day);
    setQuickAddHour(hour);
    setIsCourseModalOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedCourseForEdit(null);
    setQuickAddDay(1);
    setQuickAddHour(8);
    setIsCourseModalOpen(true);
  };

  const handleUpdateAttendance = (courseId: string, updated: AttendanceRecord) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, attendance: updated } : c))
    );
  };

  // Task handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const created: Task = {
      ...newTask,
      id: `t_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [created, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // User Auth handlers
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    saveUser(loggedInUser);
    setSyncToast(`Selamat datang, ${loggedInUser.name}!`);
    setTimeout(() => setSyncToast(null), 3500);
  };

  const handleLogout = () => {
    if (confirm('Yakin ingin keluar dari akun?')) {
      setUser(null);
      saveUser(null);
      setSyncToast('Berhasil keluar akun');
      setTimeout(() => setSyncToast(null), 2500);
    }
  };

  const handleImportCourses = (importedCourses: Course[], importedTasks: Task[]) => {
    setCourses(importedCourses);
    if (importedTasks.length > 0) setTasks(importedTasks);
  };

  const handleSmartImport = (imported: Course[]) => {
    setCourses((prev) => [...prev, ...imported]);
    setSyncToast(`${imported.length} mata kuliah berhasil diimpor!`);
    setTimeout(() => setSyncToast(null), 3000);
  };

  const totalSks = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);

  // 1. If NOT logged in, show Landing Page with Preview & Google Login
  if (!user) {
    return (
      <>
        <LandingPage
          onLoginClick={() => setIsAuthModalOpen(true)}
          sampleCourses={courses}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          user={user}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // 2. If LOGGED IN, show the Full Interactive App Dashboard
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-neutral-900 selection:bg-neutral-200">
      {/* Top Navigation */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        courses={courses}
        user={user}
        onOpenAddModal={handleOpenAdd}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Cloud Sync Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-2xl shadow-lg border border-neutral-700 animate-in fade-in slide-in-from-bottom-3 duration-200 no-print">
          <CloudCheck className="w-4 h-4 text-emerald-400" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 no-print">
        {/* Realtime Next Class Hero Banner */}
        <NextClassBanner courses={courses} onCourseClick={handleOpenEdit} />

        {/* View Content based on active tab */}
        {viewMode === 'weekly' && (
          <section className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-neutral-900 tracking-tight">
                  Jadwal Kuliah Mingguan
                </h2>
                <p className="text-xs text-neutral-500">
                  Visualisasi jadwal Senin - Sabtu dengan deteksi bentrok otomatis.
                </p>
              </div>
            </div>

            <WeeklyTimetable
              courses={courses}
              onCourseClick={handleOpenEdit}
              onQuickAdd={handleQuickAdd}
            />
          </section>
        )}

        {viewMode === 'agenda' && (
          <section className="space-y-3 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-black text-neutral-900 tracking-tight">
                Agenda Harian
              </h2>
              <p className="text-xs text-neutral-500">
                Linimasa perkuliahan per hari dengan status jadwal terkini.
              </p>
            </div>

            <DailyAgenda
              courses={courses}
              onCourseClick={handleOpenEdit}
              onAddCourse={(day) => {
                setSelectedCourseForEdit(null);
                setQuickAddDay(day);
                setQuickAddHour(8);
                setIsCourseModalOpen(true);
              }}
            />
          </section>
        )}

        {viewMode === 'attendance' && (
          <section className="space-y-3 animate-in fade-in duration-150">
            <AttendanceTracker
              courses={courses}
              onUpdateAttendance={handleUpdateAttendance}
            />
          </section>
        )}

        {viewMode === 'tasks' && (
          <section className="space-y-3 animate-in fade-in duration-150">
            <TaskTracker
              tasks={tasks}
              courses={courses}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          </section>
        )}
      </main>

      {/* Official Printable A4 Schedule (Visible ONLY during print) */}
      <div className="print-only p-8 text-black bg-white font-sans">
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-2xl font-black uppercase tracking-wider">
            Kartu Rencana Studi & Jadwal Kuliah Mingguan
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Mahasiswa: <span className="font-bold">{user.name}</span> ({user.email}) • Total Beban: <span className="font-bold">{totalSks} SKS</span> ({courses.length} Mata Kuliah)
          </p>
        </div>

        <table className="w-full text-xs border-collapse border border-black mb-8">
          <thead>
            <tr className="bg-neutral-100">
              <th className="border border-black p-2 text-left w-8">No</th>
              <th className="border border-black p-2 text-left">Kode</th>
              <th className="border border-black p-2 text-left">Mata Kuliah</th>
              <th className="border border-black p-2 text-center w-12">SKS</th>
              <th className="border border-black p-2 text-left w-28">Hari & Jam</th>
              <th className="border border-black p-2 text-left w-24">Ruang</th>
              <th className="border border-black p-2 text-left">Dosen Pengampu</th>
            </tr>
          </thead>
          <tbody>
            {courses
              .slice()
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
              .map((c, i) => (
                <tr key={c.id}>
                  <td className="border border-black p-2 text-center">{i + 1}</td>
                  <td className="border border-black p-2 font-mono">{c.code || '-'}</td>
                  <td className="border border-black p-2 font-bold">{c.name}</td>
                  <td className="border border-black p-2 text-center">{c.credits}</td>
                  <td className="border border-black p-2">
                    {getDayName(c.dayOfWeek)}, {c.startTime} - {c.endTime}
                  </td>
                  <td className="border border-black p-2">{c.room || '-'}</td>
                  <td className="border border-black p-2">{c.lecturer || '-'}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Signature Area */}
        <div className="grid grid-cols-2 text-center text-xs pt-8">
          <div>
            <p>Mengetahui,</p>
            <p className="font-semibold">Dosen Pembimbing Akademik</p>
            <div className="h-16" />
            <p>(........................................................)</p>
          </div>
          <div>
            <p>Mahasiswa yang bersangkutan,</p>
            <div className="h-16" />
            <p className="font-bold underline">{user.name}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-200 bg-white py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-neutral-900">
              JadwalinAja
            </span>
            <span>• Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk mahasiswa Indonesia</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Cloudflare Pages & D1 Edge
            </span>
            <a
              href="https://github.com/zzdree/jadwalinaja"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>zzdree/jadwalinaja</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSave={handleSaveCourse}
        onDelete={handleDeleteCourse}
        initialCourse={selectedCourseForEdit}
        defaultDay={quickAddDay}
        defaultHour={quickAddHour}
        allCourses={courses}
      />

      <SmartImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleSmartImport}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        courses={courses}
        tasks={tasks}
        onImportCourses={handleImportCourses}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;

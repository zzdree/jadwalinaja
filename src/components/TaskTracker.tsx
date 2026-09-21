import React, { useState } from 'react';
import { Task, Course, Priority } from '../types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  BookOpen,
  Filter,
} from 'lucide-react';

interface TaskTrackerProps {
  tasks: Task[];
  courses: Course[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskTracker: React.FC<TaskTrackerProps> = ({
  tasks,
  courses,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const filteredTasks = tasks.filter((t) => {
    if (filterCourse !== 'all' && t.courseId !== filterCourse) return false;
    if (filterStatus === 'pending' && t.isCompleted) return false;
    if (filterStatus === 'completed' && !t.isCompleted) return false;
    return true;
  });

  const handleToggle = (task: Task) => {
    if (!task.isCompleted) {
      // Trigger pleasant celebratory confetti!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
    onToggleTask(task.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      courseId: courseId || undefined,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      priority,
      isCompleted: false,
    });

    setTitle('');
    setDescription('');
    setCourseId('');
    setDueDate('');
    setPriority('medium');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Tugas & Deadline Kuliah</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
              {tasks.filter((t) => !t.isCompleted).length} Tersisa
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola tugas kuliah, kuis, dan ujian terintegrasi dengan mata kuliah Anda.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tugas Baru</span>
        </button>
      </div>

      {/* Inline Form to Add Task */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 rounded-2xl p-5 shadow-md space-y-4 animate-in fade-in duration-200"
        >
          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
            Form Tambah Tugas Baru
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Judul Tugas / Catatan *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Tugas 2 - Makalah Arsitektur Jaringan"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mata Kuliah Terkait
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              >
                <option value="">-- Umum / Tanpa Matkul --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.credits} SKS)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Batas Pengumpulan (Deadline)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi (Mendesak)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Deskripsi / Petunjuk Tambahan
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Format PDF, link Google Classroom, dsb..."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Simpan Tugas
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>

        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-200"
        >
          <option value="all">Semua Mata Kuliah</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
              filterStatus === 'pending'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Belum Selesai
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
              filterStatus === 'completed'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Tidak ada tugas yang ditemukan
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Semua tugas di filter ini sudah beres atau belum ada yang ditambahkan.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const course = courses.find((c) => c.id === task.courseId);

            // Priority badge styling
            let priorityBadge = null;
            if (task.priority === 'high') {
              priorityBadge = (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  Mendesak
                </span>
              );
            } else if (task.priority === 'medium') {
              priorityBadge = (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  Sedang
                </span>
              );
            }

            return (
              <div
                key={task.id}
                className={`flex items-start justify-between gap-3 p-4 bg-white dark:bg-slate-900 border rounded-2xl transition-all shadow-xs ${
                  task.isCompleted
                    ? 'border-slate-200 dark:border-slate-800/60 opacity-60'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggle(task)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-sm font-bold ${
                          task.isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h4>
                      {priorityBadge}
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                      {course && (
                        <span
                          className="flex items-center gap-1 font-semibold"
                          style={{ color: course.color }}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          {course.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          Deadline: {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  title="Hapus tugas"
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

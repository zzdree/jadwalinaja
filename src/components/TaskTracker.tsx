import React, { useState } from 'react';
import { Task, Course, Priority, TaskCategory, TASK_CATEGORIES } from '../types';
import { getDeadlineStatus } from '../lib/utils';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  BookOpen,
  Filter,
  ExternalLink,
  Clock,
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
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<TaskCategory>('tugas');
  const [linkUrl, setLinkUrl] = useState('');

  // Sort and filter tasks
  const filteredTasks = tasks
    .filter((t) => {
      if (filterCourse !== 'all' && t.courseId !== filterCourse) return false;
      if (filterStatus === 'pending' && t.isCompleted) return false;
      if (filterStatus === 'completed' && !t.isCompleted) return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      return true;
    })
    .sort((a, b) => {
      // Completed at bottom
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      // Closer deadline first
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const handleToggle = (task: Task) => {
    if (!task.isCompleted) {
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
      category,
      linkUrl: linkUrl.trim() || undefined,
      isCompleted: false,
    });

    setTitle('');
    setDescription('');
    setCourseId('');
    setDueDate('');
    setPriority('medium');
    setCategory('tugas');
    setLinkUrl('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div>
          <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
            <span>Tugas, Kuis & Jadwal Ujian</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-bold border border-neutral-200">
              {tasks.filter((t) => !t.isCompleted).length} Belum Selesai
            </span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Daftar tenggat tugas terintegrasi langsung dengan mata kuliah Anda.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Tugas Baru</span>
        </button>
      </div>

      {/* Inline Form to Add Task */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-neutral-300 rounded-2xl p-5 shadow-xs space-y-4 animate-in fade-in duration-150"
        >
          <h4 className="font-extrabold text-sm text-neutral-900">
            Form Tambah Tugas / Jadwal Ujian Baru
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Judul Tugas / Nama Ujian *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Tugas 2 - Makalah Analisis Algoritma"
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Kategori Kegiatan
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900 font-semibold"
              >
                {TASK_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Mata Kuliah Terkait
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
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
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Batas Pengumpulan (Deadline)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi (Mendesak)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Link Pengumpulan / Soal (Opsional)
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://classroom.google.com/..."
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Deskripsi / Catatan Tambahan
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Format PDF, batas submit jam 23:59..."
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              Simpan Tugas
            </button>
          </div>
        </form>
      )}

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>

        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="text-xs font-semibold bg-white border border-neutral-200 px-3 py-1.5 rounded-lg text-neutral-800"
        >
          <option value="all">Semua Mata Kuliah</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-xs font-semibold bg-white border border-neutral-200 px-3 py-1.5 rounded-lg text-neutral-800"
        >
          <option value="all">Semua Kategori</option>
          {TASK_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>

        <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
              filterStatus === 'all'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
              filterStatus === 'pending'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500'
            }`}
          >
            Belum Selesai
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
              filterStatus === 'completed'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500'
            }`}
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-200 rounded-2xl p-10 text-center space-y-2">
          <CheckCircle2 className="w-9 h-9 text-neutral-300 mx-auto" />
          <h4 className="text-sm font-bold text-neutral-800">
            Tidak ada tugas di filter ini
          </h4>
          <p className="text-xs text-neutral-500">
            Semua tugas sudah beres atau belum ada yang ditambahkan.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const course = courses.find((c) => c.id === task.courseId);
            const deadline = getDeadlineStatus(task.dueDate);

            const categoryConfig = TASK_CATEGORIES.find((cat) => cat.id === task.category);

            return (
              <div
                key={task.id}
                className={`flex items-start justify-between gap-3 p-4 bg-white border rounded-2xl transition-all shadow-2xs ${
                  task.isCompleted
                    ? 'border-neutral-200 opacity-60'
                    : deadline.isOverdue
                    ? 'border-rose-200 bg-rose-50/30'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggle(task)}
                    className="mt-0.5 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-sm font-bold ${
                          task.isCompleted
                            ? 'line-through text-neutral-400'
                            : 'text-neutral-900'
                        }`}
                      >
                        {task.title}
                      </h4>

                      {/* Category Badge */}
                      {categoryConfig && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryConfig.badgeColor}`}>
                          {categoryConfig.label}
                        </span>
                      )}

                      {/* Deadline countdown badge */}
                      {!task.isCompleted && task.dueDate && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            deadline.isOverdue
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : deadline.isToday
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              : deadline.isUrgent
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{deadline.label}</span>
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-neutral-500">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 pt-1">
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
                        <span className="flex items-center gap-1 font-medium text-neutral-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {task.dueDate}
                        </span>
                      )}
                      {task.linkUrl && (
                        <a
                          href={task.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-neutral-700 font-bold hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Buka Tautan Tugas</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  title="Hapus tugas"
                  className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

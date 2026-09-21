import React, { useState, useEffect } from 'react';
import { Course, DAYS_CONFIG, PRESET_COLORS, DayOfWeek, ClassType } from '../types';
import { isCoursesConflicting, timeToMinutes, minutesToTime } from '../lib/utils';
import { X, AlertTriangle, Trash2, Clock } from 'lucide-react';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  onDelete?: (courseId: string) => void;
  initialCourse?: Course | null;
  defaultDay?: DayOfWeek;
  defaultHour?: number;
  allCourses: Course[];
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialCourse,
  defaultDay,
  defaultHour,
  allCourses,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState<number>(3);
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(defaultDay || 1);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:40');
  const [room, setRoom] = useState('');
  const [building, setBuilding] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [classType, setClassType] = useState<ClassType>('teori');
  const [color, setColor] = useState(PRESET_COLORS[0].hex);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialCourse) {
      setName(initialCourse.name);
      setCode(initialCourse.code || '');
      setCredits(initialCourse.credits || 3);
      setDayOfWeek(initialCourse.dayOfWeek);
      setStartTime(initialCourse.startTime);
      setEndTime(initialCourse.endTime);
      setRoom(initialCourse.room || '');
      setBuilding(initialCourse.building || '');
      setLecturer(initialCourse.lecturer || '');
      setClassType(initialCourse.classType || 'teori');
      setColor(initialCourse.color || PRESET_COLORS[0].hex);
      setNotes(initialCourse.notes || '');
    } else {
      setName('');
      setCode('');
      setCredits(3);
      setDayOfWeek(defaultDay || 1);
      const startH = defaultHour !== undefined ? defaultHour : 8;
      const startStr = `${startH.toString().padStart(2, '0')}:00`;
      setStartTime(startStr);
      setEndTime(minutesToTime(startH * 60 + 150));
      setRoom('');
      setBuilding('');
      setLecturer('');
      setClassType('teori');
      setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].hex);
      setNotes('');
    }
  }, [initialCourse, defaultDay, defaultHour, isOpen]);

  const currentTempCourse: Course = {
    id: initialCourse ? initialCourse.id : 'temp_preview_id',
    name,
    code,
    credits,
    dayOfWeek,
    startTime,
    endTime,
    room,
    building,
    lecturer,
    classType,
    color,
    notes,
  };

  const conflictingCourses = allCourses.filter((c) =>
    isCoursesConflicting(currentTempCourse, c)
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...currentTempCourse,
      id: initialCourse ? initialCourse.id : `c_${Date.now()}`,
      name: name.trim(),
    });
    onClose();
  };

  const handleQuickDuration = (minutes: number) => {
    const startMin = timeToMinutes(startTime);
    setEndTime(minutesToTime(startMin + minutes));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-neutral-200 p-6 sm:p-7 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-lg font-extrabold text-neutral-900">
              {initialCourse ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Isi data jadwal perkuliahan Anda dengan lengkap.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Conflict Alert Banner */}
        {conflictingCourses.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <h5 className="font-extrabold text-rose-700">
                Peringatan: Jadwal Bentrok Terdeteksi!
              </h5>
              <p className="text-rose-600">
                Jam ini bertabrakan dengan:{' '}
                <span className="font-bold">
                  {conflictingCourses.map((c) => `${c.name} (${c.startTime}-${c.endTime})`).join(', ')}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {/* Course Name */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Nama Mata Kuliah *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Algoritma & Pemrograman"
              className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900 font-semibold"
            />
          </div>

          {/* Code & SKS */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Kode Matkul (Opsional)
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Contoh: IF2102"
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Bobot SKS
              </label>
              <select
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900 font-bold"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} SKS
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Day & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Hari
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(Number(e.target.value) as DayOfWeek)}
                className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900 font-bold"
              >
                {DAYS_CONFIG.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Mulai
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Selesai
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
              />
            </div>
          </div>

          {/* Quick Duration Preset Buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-400 text-[11px] flex items-center gap-1">
              <Clock className="w-3 h-3" /> Durasi cepat:
            </span>
            <button
              type="button"
              onClick={() => handleQuickDuration(50)}
              className="px-2 py-0.5 text-[10px] font-bold bg-neutral-100 border border-neutral-200 rounded-md hover:bg-neutral-200 text-neutral-700"
            >
              50m (1 SKS)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDuration(100)}
              className="px-2 py-0.5 text-[10px] font-bold bg-neutral-100 border border-neutral-200 rounded-md hover:bg-neutral-200 text-neutral-700"
            >
              100m (2 SKS)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDuration(150)}
              className="px-2 py-0.5 text-[10px] font-bold bg-neutral-100 border border-neutral-200 rounded-md hover:bg-neutral-200 text-neutral-700"
            >
              150m (3 SKS)
            </button>
          </div>

          {/* Room & Building */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Ruangan
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Contoh: R.401 / Lab 2"
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Gedung
              </label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="Contoh: Gedung B"
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
              />
            </div>
          </div>

          {/* Lecturer & Class Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Nama Dosen
              </label>
              <input
                type="text"
                value={lecturer}
                onChange={(e) => setLecturer(e.target.value)}
                placeholder="Contoh: Pak Budi"
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Tipe Kuliah
              </label>
              <select
                value={classType}
                onChange={(e) => setClassType(e.target.value as ClassType)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
              >
                <option value="teori">Teori (Kelas Biasa)</option>
                <option value="praktikum">Praktikum / Laboratorium</option>
                <option value="seminar">Seminar / Workshop</option>
                <option value="online">Online / Daring (Zoom)</option>
              </select>
            </div>
          </div>

          {/* Color Picker Palette */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              Warna Penanda Matkul
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((preset) => (
                <button
                  type="button"
                  key={preset.hex}
                  onClick={() => setColor(preset.hex)}
                  title={preset.label}
                  className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                    color === preset.hex
                      ? 'ring-2 ring-offset-2 ring-neutral-900 scale-110'
                      : 'hover:scale-105 opacity-85'
                  }`}
                  style={{ backgroundColor: preset.hex }}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Catatan Khusus (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Bawa jas lab, link materi kuliah..."
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            {initialCourse && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Hapus matkul "${initialCourse.name}"?`)) {
                    onDelete(initialCourse.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Matkul</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {initialCourse ? 'Simpan Perubahan' : 'Tambah ke Jadwal'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

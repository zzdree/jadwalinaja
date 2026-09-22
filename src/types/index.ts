export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ClassType = 'teori' | 'praktikum' | 'seminar' | 'online';

export type Priority = 'low' | 'medium' | 'high';

export type TaskCategory = 'tugas' | 'kuis' | 'proyek' | 'uts' | 'uas' | 'lainnya';

export type ViewMode = 'weekly' | 'agenda' | 'tasks' | 'attendance';

export interface AttendanceRecord {
  attended: number;        // Jumlah sesi hadir
  totalSessions: number;   // Total sesi semester (umumnya 14 atau 16)
  maxAbsenceAllowed: number; // Maksimal jatah absen/bolos (umumnya 3 atau 4 = 25%)
  permission: number;      // Sakit / Izin
  absence: number;         // Alpa / Bolos tanpa keterangan
}

export interface Course {
  id: string;
  semesterId?: string;
  code: string;
  name: string;
  credits: number; // SKS
  dayOfWeek: DayOfWeek; // 1 = Senin, 2 = Selasa, ..., 6 = Sabtu, 7 = Minggu
  startTime: string; // "08:00"
  endTime: string; // "09:40"
  room: string;
  building?: string;
  lecturer: string;
  classType: ClassType;
  color: string; // Hex color
  notes?: string;
  meetUrl?: string;     // Link Zoom / Google Meet
  whatsappUrl?: string; // Link Grup WhatsApp Kelas
  lmsUrl?: string;      // Link LMS / Google Classroom / Spada
  attendance?: AttendanceRecord;
}

export interface Task {
  id: string;
  courseId?: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  category: TaskCategory;
  linkUrl?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface Semester {
  id: string;
  name: string;
  academicYear: string;
  targetSks: number;
  isActive: boolean;
}

export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}

export interface ScheduleConflict {
  courseA: Course;
  courseB: Course;
  message: string;
}

export const DAYS_CONFIG = [
  { id: 1 as DayOfWeek, name: 'Senin', short: 'Sen' },
  { id: 2 as DayOfWeek, name: 'Selasa', short: 'Sel' },
  { id: 3 as DayOfWeek, name: 'Rabu', short: 'Rab' },
  { id: 4 as DayOfWeek, name: 'Kamis', short: 'Kam' },
  { id: 5 as DayOfWeek, name: 'Jumat', short: 'Jum' },
  { id: 6 as DayOfWeek, name: 'Sabtu', short: 'Sab' },
];

export const PRESET_COLORS = [
  { hex: '#2563eb', label: 'Biru' },
  { hex: '#059669', label: 'Hijau' },
  { hex: '#d97706', label: 'Amber' },
  { hex: '#7c3aed', label: 'Ungu' },
  { hex: '#dc2626', label: 'Merah' },
  { hex: '#0891b2', label: 'Sian' },
  { hex: '#ea580c', label: 'Oranye' },
  { hex: '#4b5563', label: 'Slate' },
];

export const TASK_CATEGORIES: { id: TaskCategory; label: string; badgeColor: string }[] = [
  { id: 'tugas', label: 'Tugas Harian', badgeColor: 'bg-neutral-100 text-neutral-800' },
  { id: 'kuis', label: 'Kuis', badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200' },
  { id: 'proyek', label: 'Proyek / Makalah', badgeColor: 'bg-blue-50 text-blue-800 border border-blue-200' },
  { id: 'uts', label: 'Ujian UTS', badgeColor: 'bg-rose-50 text-rose-800 border border-rose-200' },
  { id: 'uas', label: 'Ujian UAS', badgeColor: 'bg-red-100 text-red-900 border border-red-300' },
  { id: 'lainnya', label: 'Lainnya', badgeColor: 'bg-neutral-100 text-neutral-600' },
];

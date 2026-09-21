export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ClassType = 'teori' | 'praktikum' | 'seminar' | 'online';

export type Priority = 'low' | 'medium' | 'high';

export type ViewMode = 'weekly' | 'agenda' | 'tasks';

export interface Course {
  id: string;
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
}

export interface Task {
  id: string;
  courseId?: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  isCompleted: boolean;
  createdAt: string;
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
  { hex: '#4f46e5', label: 'Indigo' },
  { hex: '#0284c7', label: 'Sky' },
  { hex: '#0d9488', label: 'Teal' },
  { hex: '#16a34a', label: 'Emerald' },
  { hex: '#ca8a04', label: 'Amber' },
  { hex: '#ea580c', label: 'Orange' },
  { hex: '#e11d48', label: 'Rose' },
  { hex: '#9333ea', label: 'Purple' },
  { hex: '#475569', label: 'Slate' },
];

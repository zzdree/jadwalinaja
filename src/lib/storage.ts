import { Course, Task, User } from '../types';

const COURSES_KEY = 'jadwalinaja_courses';
const TASKS_KEY = 'jadwalinaja_tasks';
const USER_KEY = 'jadwalinaja_user';
const THEME_KEY = 'jadwalinaja_theme';

export const INITIAL_SAMPLE_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'IF3101',
    name: 'Pemrograman Web Modern',
    credits: 3,
    dayOfWeek: 1, // Senin
    startTime: '08:00',
    endTime: '10:30',
    room: 'Lab Komputer 3',
    building: 'Gedung B',
    lecturer: 'Dr. Ir. Hendra Wijaya, M.T.',
    classType: 'praktikum',
    color: '#4f46e5', // Indigo
    notes: 'Bawa laptop dan install Node.js',
  },
  {
    id: 'c2',
    code: 'IF3104',
    name: 'Basis Data Terdistribusi',
    credits: 3,
    dayOfWeek: 1, // Senin
    startTime: '13:00',
    endTime: '15:30',
    room: 'Ruang 304',
    building: 'Gedung A',
    lecturer: 'Prof. Sri Rahayu, Ph.D.',
    classType: 'teori',
    color: '#0284c7', // Sky
    notes: 'Kuis mingguan tiap pertemuan',
  },
  {
    id: 'c3',
    code: 'IF3201',
    name: 'Rekayasa Perangkat Lunak',
    credits: 4,
    dayOfWeek: 2, // Selasa
    startTime: '09:00',
    endTime: '12:20',
    room: 'Auditorium 2',
    building: 'Gedung Rektorat Baru',
    lecturer: 'Budi Santoso, S.Kom., M.Sc.',
    classType: 'teori',
    color: '#16a34a', // Emerald
    notes: 'Pembentukan kelompok tugas besar',
  },
  {
    id: 'c4',
    code: 'IF3205',
    name: 'Kecerdasan Buatan (AI)',
    credits: 3,
    dayOfWeek: 3, // Rabu
    startTime: '10:00',
    endTime: '12:30',
    room: 'Ruang 402',
    building: 'Gedung C',
    lecturer: 'Dr. Ahmad Fauzi, M.Cs.',
    classType: 'teori',
    color: '#9333ea', // Purple
    notes: 'Materi machine learning & deep learning',
  },
  {
    id: 'c5',
    code: 'IF3208',
    name: 'Keamanan Jaringan & Siber',
    credits: 3,
    dayOfWeek: 4, // Kamis
    startTime: '08:00',
    endTime: '10:30',
    room: 'Lab Jaringan',
    building: 'Gedung B',
    lecturer: 'Rian Pratama, M.Kom.',
    classType: 'praktikum',
    color: '#ea580c', // Orange
    notes: 'Simulasi penetration testing',
  },
  {
    id: 'c6',
    code: 'UM201',
    name: 'Kewirausahaan Teknologi',
    credits: 2,
    dayOfWeek: 5, // Jumat
    startTime: '08:30',
    endTime: '10:10',
    room: 'Online (Zoom Meeting)',
    building: 'Daring',
    lecturer: 'Dina Kusuma, S.E., MBA',
    classType: 'online',
    color: '#e11d48', // Rose
    notes: 'Link Zoom di grup WhatsApp',
  },
];

export const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: 't1',
    courseId: 'c1',
    title: 'Tugas 1: Slice UI Dashboard dengan Tailwind',
    description: 'Kumpulkan link repository GitHub dan live demo di Cloudflare',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'high',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    courseId: 'c3',
    title: 'Proposal Proyek Tugas Besar RPL',
    description: 'Format PDF maksimal 10 halaman, bab 1 latar belakang dan use case',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't3',
    courseId: 'c2',
    title: 'Review Bab 4: Sharding & Replikasi SQL',
    description: 'Persiapan kuis hari Senin',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'low',
    isCompleted: true,
    createdAt: new Date().toISOString(),
  },
];

export function loadCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    if (!raw) {
      saveCourses(INITIAL_SAMPLE_COURSES);
      return INITIAL_SAMPLE_COURSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAMPLE_COURSES;
  }
}

export function saveCourses(courses: Course[]): void {
  try {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  } catch (err) {
    console.error('Failed to save courses to localStorage', err);
  }
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) {
      saveTasks(INITIAL_SAMPLE_TASKS);
      return INITIAL_SAMPLE_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAMPLE_TASKS;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}

export function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (err) {
    console.error('Failed to save user', err);
  }
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (err) {
    console.error('Failed to save theme', err);
  }
}

// Cloudflare D1 Sync Service
export async function syncWithCloudflareD1(
  user: User,
  courses: Course[],
  tasks: Task[]
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        courses,
        tasks,
      }),
    });

    if (!res.ok) {
      throw new Error(`Sync failed with status ${res.status}`);
    }

    return { success: true, message: 'Jadwal berhasil disinkronkan ke Cloudflare D1' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown sync error';
    return { success: false, message: msg };
  }
}

import { Course, DAYS_CONFIG, DayOfWeek } from '../types';

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function isCoursesConflicting(a: Course, b: Course): boolean {
  if (a.id === b.id) return false;
  if (a.dayOfWeek !== b.dayOfWeek) return false;

  const startA = timeToMinutes(a.startTime);
  const endA = timeToMinutes(a.endTime);
  const startB = timeToMinutes(b.startTime);
  const endB = timeToMinutes(b.endTime);

  return Math.max(startA, startB) < Math.min(endA, endB);
}

export function findCourseConflicts(course: Course, allCourses: Course[]): Course[] {
  return allCourses.filter((other) => isCoursesConflicting(course, other));
}

export function getAllConflicts(courses: Course[]): Map<string, string[]> {
  const conflictMap = new Map<string, string[]>();

  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      if (isCoursesConflicting(courses[i], courses[j])) {
        const existingA = conflictMap.get(courses[i].id) || [];
        existingA.push(courses[j].name);
        conflictMap.set(courses[i].id, existingA);

        const existingB = conflictMap.get(courses[j].id) || [];
        existingB.push(courses[i].name);
        conflictMap.set(courses[j].id, existingB);
      }
    }
  }

  return conflictMap;
}

export function getNextClassInfo(courses: Course[]): {
  status: 'ongoing' | 'upcoming' | 'none';
  course?: Course;
  minutesLeft?: number;
  message?: string;
} {
  const now = new Date();
  // JavaScript getDay(): 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  const jsDay = now.getDay();
  const currentDayOfWeek: DayOfWeek = jsDay === 0 ? 7 : (jsDay as DayOfWeek);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Filter courses for today
  const todayCourses = courses
    .filter((c) => c.dayOfWeek === currentDayOfWeek)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  // 1. Check if there is an ongoing class
  const ongoing = todayCourses.find((c) => {
    const start = timeToMinutes(c.startTime);
    const end = timeToMinutes(c.endTime);
    return currentMinutes >= start && currentMinutes <= end;
  });

  if (ongoing) {
    const end = timeToMinutes(ongoing.endTime);
    return {
      status: 'ongoing',
      course: ongoing,
      minutesLeft: end - currentMinutes,
      message: `Sedang berlangsung (selesai dalam ${end - currentMinutes} menit)`,
    };
  }

  // 2. Check if there is an upcoming class today
  const upcoming = todayCourses.find((c) => {
    const start = timeToMinutes(c.startTime);
    return start > currentMinutes;
  });

  if (upcoming) {
    const start = timeToMinutes(upcoming.startTime);
    const diff = start - currentMinutes;
    return {
      status: 'upcoming',
      course: upcoming,
      minutesLeft: diff,
      message:
        diff > 60
          ? `Mulai dalam ${Math.floor(diff / 60)} jam ${diff % 60} menit`
          : `Mulai dalam ${diff} menit`,
    };
  }

  return {
    status: 'none',
    message: todayCourses.length > 0 ? 'Semua kelas hari ini telah selesai!' : 'Tidak ada jadwal kelas hari ini.',
  };
}

export function generateICS(courses: Course[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JadwalinAja//College Timetable//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Jadwal Kuliah - JadwalinAja',
    'X-WR-TIMEZONE:Asia/Jakarta',
  ];

  // Map 1-7 (Senin-Minggu) to iCal RRULE BYDAY (MO, TU, WE, TH, FR, SA, SU)
  const dayMap: Record<number, string> = {
    1: 'MO',
    2: 'TU',
    3: 'WE',
    4: 'TH',
    5: 'FR',
    6: 'SA',
    7: 'SU',
  };

  const now = new Date();
  const formatTime = (date: Date) =>
    date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  for (const c of courses) {
    const [startH, startM] = c.startTime.split(':').map(Number);
    const [endH, endM] = c.endTime.split(':').map(Number);

    const eventDate = new Date();
    const currentDay = eventDate.getDay() === 0 ? 7 : eventDate.getDay();
    const dayDiff = (c.dayOfWeek - currentDay + 7) % 7;
    eventDate.setDate(eventDate.getDate() + dayDiff);
    eventDate.setHours(startH, startM, 0, 0);

    const endDate = new Date(eventDate);
    endDate.setHours(endH, endM, 0, 0);

    lines.push(
      'BEGIN:VEVENT',
      `UID:${c.id}@jadwalinaja.com`,
      `DTSTAMP:${formatTime(now)}`,
      `DTSTART:${formatTime(eventDate)}`,
      `DTEND:${formatTime(endDate)}`,
      `RRULE:FREQ=WEEKLY;BYDAY=${dayMap[c.dayOfWeek] || 'MO'}`,
      `SUMMARY:${c.name} (${c.credits} SKS)`,
      `LOCATION:${c.room || ''} ${c.building ? '- Gedung ' + c.building : ''}`.trim(),
      `DESCRIPTION:Dosen: ${c.lecturer || '-'}\\nKode: ${c.code || '-'}\\nCatatan: ${c.notes || '-'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getDayName(dayOfWeek: DayOfWeek): string {
  const found = DAYS_CONFIG.find((d) => d.id === dayOfWeek);
  return found ? found.name : 'Hari';
}

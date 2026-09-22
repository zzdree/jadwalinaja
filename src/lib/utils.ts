import { Course, DAYS_CONFIG, DayOfWeek, AttendanceRecord, PRESET_COLORS } from '../types';

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  // Support both 08:00 and 08.00 format
  const normalized = timeStr.replace('.', ':');
  const [hours, minutes] = normalized.split(':').map(Number);
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
  const jsDay = now.getDay();
  const currentDayOfWeek: DayOfWeek = jsDay === 0 ? 7 : (jsDay as DayOfWeek);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayCourses = courses
    .filter((c) => c.dayOfWeek === currentDayOfWeek)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

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

export function getDeadlineStatus(dueDate: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  isUrgent: boolean;
  daysDiff: number;
} {
  if (!dueDate) {
    return { label: 'Tanpa tanggal', isOverdue: false, isToday: false, isUrgent: false, daysDiff: 999 };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Terlewat ${Math.abs(diffDays)} hari`,
      isOverdue: true,
      isToday: false,
      isUrgent: true,
      daysDiff: diffDays,
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Hari ini!',
      isOverdue: false,
      isToday: true,
      isUrgent: true,
      daysDiff: 0,
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Besok',
      isOverdue: false,
      isToday: false,
      isUrgent: true,
      daysDiff: 1,
    };
  }

  return {
    label: `H-${diffDays}`,
    isOverdue: false,
    isToday: false,
    isUrgent: diffDays <= 3,
    daysDiff: diffDays,
  };
}

export function calculateAttendance(record?: AttendanceRecord): {
  attended: number;
  total: number;
  percentage: number;
  absenceLeft: number;
  isWarning: boolean;
  isDanger: boolean;
} {
  const attended = record?.attended ?? 0;
  const total = record?.totalSessions ?? 14;
  const maxAbsence = record?.maxAbsenceAllowed ?? 3;
  const absencesUsed = (record?.absence ?? 0);
  const absenceLeft = Math.max(0, maxAbsence - absencesUsed);
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 100;

  return {
    attended,
    total,
    percentage,
    absenceLeft,
    isWarning: absenceLeft === 1,
    isDanger: absenceLeft === 0,
  };
}

// Smart Parser for SIAKAD / Campus Schedule Text
export function parseSiakadText(text: string): Partial<Course>[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const results: Partial<Course>[] = [];

  const dayRegexMap: { [key: string]: DayOfWeek } = {
    senin: 1,
    sen: 1,
    selasa: 2,
    sel: 2,
    rabu: 3,
    rab: 3,
    kamis: 4,
    kam: 4,
    jumat: 5,
    jum: 5,
    sabtu: 6,
    sab: 6,
  };

  const timeRegex = /(\d{1,2}[:.]\d{2})\s*[-–—/]\s*(\d{1,2}[:.]\d{2})/;
  const sksRegex = /(\d+)\s*(?:sks|credit|credits)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line contains day
    let detectedDay: DayOfWeek = 1;
    let foundDay = false;
    const lower = line.toLowerCase();

    for (const [dayKey, dayVal] of Object.entries(dayRegexMap)) {
      const regex = new RegExp(`\\b${dayKey}\\b`, 'i');
      if (regex.test(lower)) {
        detectedDay = dayVal;
        foundDay = true;
        break;
      }
    }

    // Check if line contains time range
    const timeMatch = line.match(timeRegex);

    if (foundDay || timeMatch) {
      let startTime = '08:00';
      let endTime = '09:40';

      if (timeMatch) {
        startTime = timeMatch[1].replace('.', ':').padStart(5, '0');
        endTime = timeMatch[2].replace('.', ':').padStart(5, '0');
      }

      // Detect SKS
      const sksMatch = line.match(sksRegex);
      const credits = sksMatch ? parseInt(sksMatch[1], 10) : 3;

      // Extract Course Name (clean from time and day keywords)
      let cleaned = line
        .replace(timeRegex, '')
        .replace(sksRegex, '')
        .replace(/\b(senin|selasa|rabu|kamis|jumat|sabtu)\b/gi, '')
        .replace(/[|\t;]+/g, ' ')
        .trim();

      // If text is separated by dashes or commas, extract first substantial chunk as name
      const parts = cleaned.split(/[-–,]/).map((p) => p.trim()).filter((p) => p.length > 0);
      const name = parts[0] || `Mata Kuliah ${results.length + 1}`;
      const room = parts[1] || '';

      const randomColor = PRESET_COLORS[results.length % PRESET_COLORS.length].hex;

      results.push({
        id: `parsed_${Date.now()}_${results.length}`,
        name: name.slice(0, 40),
        credits: Math.min(6, Math.max(1, credits)),
        dayOfWeek: detectedDay,
        startTime,
        endTime,
        room,
        lecturer: parts[2] || '',
        classType: name.toLowerCase().includes('praktikum') || name.toLowerCase().includes('lab') ? 'praktikum' : 'teori',
        color: randomColor,
        attendance: {
          attended: 0,
          totalSessions: 14,
          maxAbsenceAllowed: 3,
          permission: 0,
          absence: 0,
        },
      });
    }
  }

  return results;
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

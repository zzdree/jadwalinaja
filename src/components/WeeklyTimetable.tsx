import React, { useMemo } from 'react';
import { Course, DAYS_CONFIG, DayOfWeek } from '../types';
import { timeToMinutes, getAllConflicts } from '../lib/utils';
import { MapPin, AlertTriangle, BookOpen } from 'lucide-react';

interface WeeklyTimetableProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
  onQuickAdd: (day: DayOfWeek, hour: number) => void;
}

const START_HOUR = 7; // 07:00
const END_HOUR = 21; // 21:00
const TOTAL_HOURS = END_HOUR - START_HOUR;
const ROW_HEIGHT_PX = 60; // 60px per hour

export const WeeklyTimetable: React.FC<WeeklyTimetableProps> = ({
  courses,
  onCourseClick,
  onQuickAdd,
}) => {
  const conflictsMap = useMemo(() => getAllConflicts(courses), [courses]);

  // Group courses by day
  const coursesByDay = useMemo(() => {
    const map = new Map<DayOfWeek, Course[]>();
    DAYS_CONFIG.forEach((d) => map.set(d.id, []));
    courses.forEach((c) => {
      const list = map.get(c.dayOfWeek) || [];
      list.push(c);
      map.set(c.dayOfWeek, list);
    });
    return map;
  }, [courses]);

  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
      {/* Timetable Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <div className="min-w-[760px] select-none">
          {/* Header Row: Days of the week */}
          <div className="grid grid-cols-[70px_repeat(6,1fr)] border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 sticky top-0 z-20">
            {/* Time Column Header */}
            <div className="p-3 text-center text-xs font-bold text-slate-400 border-r border-slate-200 dark:border-slate-800 flex items-center justify-center">
              Jam
            </div>

            {/* Day Columns */}
            {DAYS_CONFIG.map((day) => {
              const dayCourses = coursesByDay.get(day.id) || [];
              const daySks = dayCourses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);

              return (
                <div
                  key={day.id}
                  className="py-3 px-2 text-center border-r border-slate-200 dark:border-slate-800 last:border-r-0"
                >
                  <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    {day.name}
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                    <span>{dayCourses.length} Kelas</span>
                    {daySks > 0 && <span>• {daySks} SKS</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid Body: Time slots and Course blocks */}
          <div className="grid grid-cols-[70px_repeat(6,1fr)] relative">
            {/* Time Labels Column */}
            <div className="border-r border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40">
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{ height: `${ROW_HEIGHT_PX}px` }}
                  className="text-xs font-semibold text-slate-400 dark:text-slate-500 pr-2 pt-1.5 text-right border-b border-slate-100 dark:border-slate-800/60"
                >
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>
              ))}
            </div>

            {/* Day Columns with Relative Positioning for Course Cards */}
            {DAYS_CONFIG.map((day) => {
              const dayCourses = coursesByDay.get(day.id) || [];

              return (
                <div
                  key={day.id}
                  className="relative border-r border-slate-200 dark:border-slate-800 last:border-r-0 group/col"
                  style={{ height: `${TOTAL_HOURS * ROW_HEIGHT_PX}px` }}
                >
                  {/* Background Hour Guidelines & Click to add */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      onClick={() => onQuickAdd(day.id, hour)}
                      style={{ height: `${ROW_HEIGHT_PX}px` }}
                      title={`Klik untuk tambah matkul di hari ${day.name} jam ${hour}:00`}
                      className="border-b border-slate-100 dark:border-slate-800/60 transition-colors hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 cursor-pointer relative group/slot"
                    >
                      <span className="hidden group-hover/slot:inline-block absolute top-1 left-2 text-[10px] text-indigo-500 font-semibold">
                        + Tambah
                      </span>
                    </div>
                  ))}

                  {/* Render Courses positioned absolutely */}
                  {dayCourses.map((course) => {
                    const startMin = timeToMinutes(course.startTime);
                    const endMin = timeToMinutes(course.endTime);
                    const baseMin = START_HOUR * 60;

                    // Calculate top offset and height in pixels
                    const topPx = ((startMin - baseMin) / 60) * ROW_HEIGHT_PX;
                    const durationMin = Math.max(30, endMin - startMin);
                    const heightPx = (durationMin / 60) * ROW_HEIGHT_PX;

                    const hasConflict = conflictsMap.has(course.id);
                    const conflictWith = conflictsMap.get(course.id) || [];

                    return (
                      <div
                        key={course.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCourseClick(course);
                        }}
                        style={{
                          top: `${Math.max(0, topPx)}px`,
                          height: `${heightPx - 3}px`,
                          borderLeftColor: course.color,
                        }}
                        className={`absolute left-1 right-1 rounded-xl p-2.5 shadow-xs cursor-pointer border-l-4 transition-all hover:scale-[1.02] hover:z-30 hover:shadow-md overflow-hidden flex flex-col justify-between ${
                          hasConflict
                            ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 ring-2 ring-rose-400/50'
                            : 'bg-slate-50/95 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-750'
                        }`}
                      >
                        {/* Top: Name & Time */}
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h5 className="font-extrabold text-xs leading-snug line-clamp-2 text-slate-900 dark:text-slate-100">
                              {course.name}
                            </h5>
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0"
                              style={{
                                backgroundColor: `${course.color}20`,
                                color: course.color,
                              }}
                            >
                              {course.credits} SKS
                            </span>
                          </div>

                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                            {course.startTime} - {course.endTime}
                          </div>
                        </div>

                        {/* Bottom: Room / Conflict Indicator */}
                        <div className="mt-1 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px]">
                          {hasConflict ? (
                            <span
                              title={`Bentrok dengan: ${conflictWith.join(', ')}`}
                              className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              Bentrok Jam!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 truncate font-medium">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{course.room || 'Ruang -'}</span>
                            </span>
                          )}

                          {course.classType === 'praktikum' && (
                            <span className="text-[9px] px-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold">
                              Lab
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timetable Footer Info */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>Tip: Klik slot jam kosong untuk menambah kelas langsung di hari tersebut.</span>
        </div>
        {conflictsMap.size > 0 && (
          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Terdeteksi {conflictsMap.size / 2} jadwal bentrok!</span>
          </div>
        )}
      </div>
    </div>
  );
};

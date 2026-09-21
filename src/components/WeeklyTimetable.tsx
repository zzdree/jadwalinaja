import React, { useMemo } from 'react';
import { Course, DAYS_CONFIG, DayOfWeek } from '../types';
import { timeToMinutes, getAllConflicts } from '../lib/utils';
import { MapPin, AlertTriangle, Plus } from 'lucide-react';

interface WeeklyTimetableProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
  onQuickAdd: (day: DayOfWeek, hour: number) => void;
}

const START_HOUR = 7;
const END_HOUR = 21;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const ROW_HEIGHT_PX = 62;

export const WeeklyTimetable: React.FC<WeeklyTimetableProps> = ({
  courses,
  onCourseClick,
  onQuickAdd,
}) => {
  const conflictsMap = useMemo(() => getAllConflicts(courses), [courses]);

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
    <div className="w-full bg-white border border-neutral-200 rounded-2xl shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[780px] select-none">
          {/* Header Row: Days */}
          <div className="grid grid-cols-[64px_repeat(6,1fr)] border-b border-neutral-200 bg-white sticky top-0 z-20">
            {/* Time Corner */}
            <div className="p-3 text-center text-[11px] font-bold text-neutral-400 border-r border-neutral-200 flex items-center justify-center">
              Jam
            </div>

            {/* Day Columns */}
            {DAYS_CONFIG.map((day) => {
              const dayCourses = coursesByDay.get(day.id) || [];
              const daySks = dayCourses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);

              return (
                <div
                  key={day.id}
                  className="py-3 px-2 text-center border-r border-neutral-200 last:border-r-0"
                >
                  <div className="text-sm font-extrabold text-neutral-900">
                    {day.name}
                  </div>
                  <div className="text-[11px] font-medium text-neutral-400 mt-0.5">
                    {dayCourses.length} Kelas {daySks > 0 ? `• ${daySks} SKS` : ''}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid Body */}
          <div className="grid grid-cols-[64px_repeat(6,1fr)] relative">
            {/* Time Labels Column */}
            <div className="border-r border-neutral-200 bg-neutral-50/50">
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{ height: `${ROW_HEIGHT_PX}px` }}
                  className="text-[11px] font-bold text-neutral-400 pr-2 pt-1.5 text-right border-b border-neutral-100"
                >
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {DAYS_CONFIG.map((day) => {
              const dayCourses = coursesByDay.get(day.id) || [];

              return (
                <div
                  key={day.id}
                  className="relative border-r border-neutral-200 last:border-r-0"
                  style={{ height: `${TOTAL_HOURS * ROW_HEIGHT_PX}px` }}
                >
                  {/* Hour slots background */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      onClick={() => onQuickAdd(day.id, hour)}
                      style={{ height: `${ROW_HEIGHT_PX}px` }}
                      title={`Klik untuk tambah matkul ${day.name} jam ${hour}:00`}
                      className="border-b border-neutral-100 hover:bg-neutral-50/80 cursor-pointer transition-colors relative group/slot"
                    >
                      <span className="hidden group-hover/slot:flex items-center gap-1 absolute top-1 left-1.5 text-[10px] text-neutral-500 font-bold">
                        <Plus className="w-3 h-3" /> Tambah
                      </span>
                    </div>
                  ))}

                  {/* Course Cards */}
                  {dayCourses.map((course) => {
                    const startMin = timeToMinutes(course.startTime);
                    const endMin = timeToMinutes(course.endTime);
                    const baseMin = START_HOUR * 60;

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
                        className={`absolute left-1 right-1 rounded-xl p-2.5 shadow-2xs cursor-pointer border-l-4 transition-all hover:scale-[1.01] hover:z-30 hover:shadow-xs overflow-hidden flex flex-col justify-between ${
                          hasConflict
                            ? 'bg-rose-50/90 border-rose-500 ring-1 ring-rose-400'
                            : 'bg-white border border-neutral-200/90 hover:border-neutral-300'
                        }`}
                      >
                        {/* Top: Title & SKS */}
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h5 className="font-extrabold text-xs leading-snug line-clamp-2 text-neutral-900">
                              {course.name}
                            </h5>
                            <span
                              className="text-[9px] font-black px-1 py-0.5 rounded shrink-0"
                              style={{
                                backgroundColor: `${course.color}15`,
                                color: course.color,
                              }}
                            >
                              {course.credits} SKS
                            </span>
                          </div>

                          <div className="text-[11px] font-semibold text-neutral-500 mt-0.5">
                            {course.startTime} - {course.endTime}
                          </div>
                        </div>

                        {/* Bottom: Room / Conflict Indicator */}
                        <div className="mt-1 pt-1 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                          {hasConflict ? (
                            <span
                              title={`Bentrok dengan: ${conflictWith.join(', ')}`}
                              className="flex items-center gap-1 font-bold text-rose-600"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              Bentrok!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-neutral-600 truncate font-medium">
                              <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                              <span className="truncate">{course.room || 'Ruang -'}</span>
                            </span>
                          )}

                          {course.classType === 'praktikum' && (
                            <span className="text-[9px] px-1 rounded bg-neutral-100 text-neutral-600 font-semibold">
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

      {/* Footer Info */}
      <div className="p-3 border-t border-neutral-200 bg-neutral-50/50 flex flex-wrap items-center justify-between text-xs text-neutral-500 gap-2">
        <span>Klik pada slot jam kosong untuk menambah kelas langsung di hari tersebut.</span>
        {conflictsMap.size > 0 && (
          <div className="flex items-center gap-1 text-rose-600 font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Terdeteksi {conflictsMap.size / 2} jadwal bentrok!</span>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Course, DAYS_CONFIG, DayOfWeek } from '../types';
import { timeToMinutes } from '../lib/utils';
import { MapPin, User, Clock, Plus, FileText } from 'lucide-react';

interface DailyAgendaProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
  onAddCourse: (day: DayOfWeek) => void;
}

export const DailyAgenda: React.FC<DailyAgendaProps> = ({
  courses,
  onCourseClick,
  onAddCourse,
}) => {
  const currentJsDay = new Date().getDay();
  const initialDay: DayOfWeek = (currentJsDay === 0 ? 1 : currentJsDay) as DayOfWeek;

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(initialDay);

  const dayCourses = courses
    .filter((c) => c.dayOfWeek === selectedDay)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = (currentJsDay === 0 ? 7 : currentJsDay) === selectedDay;

  return (
    <div className="space-y-6">
      {/* Day Selector Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DAYS_CONFIG.map((day) => {
          const isSelected = selectedDay === day.id;
          const count = courses.filter((c) => c.dayOfWeek === day.id).length;

          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              <span>{day.name}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-indigo-500/50 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Courses Timeline List */}
      {dayCourses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-10 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Tidak ada jadwal kuliah di hari ini
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Hari ini kosong! Anda bisa menikmati waktu istirahat atau menambahkan kelas baru.
            </p>
          </div>
          <button
            onClick={() => onAddCourse(selectedDay)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kelas di Hari Ini</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {dayCourses.map((course) => {
            const startMin = timeToMinutes(course.startTime);
            const endMin = timeToMinutes(course.endTime);

            let statusBadge = null;
            if (isToday) {
              if (currentMinutes >= startMin && currentMinutes <= endMin) {
                statusBadge = (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white animate-pulse">
                    Sedang Berlangsung
                  </span>
                );
              } else if (currentMinutes < startMin) {
                statusBadge = (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Akan Datang
                  </span>
                );
              } else {
                statusBadge = (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-400">
                    Selesai
                  </span>
                );
              }
            }

            return (
              <div
                key={course.id}
                onClick={() => onCourseClick(course)}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 bottom-0 w-2"
                  style={{ backgroundColor: course.color }}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.startTime} - {course.endTime}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {course.credits} SKS
                      </span>
                      {statusBadge}
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                      {course.name}{' '}
                      {course.code && (
                        <span className="text-xs font-normal text-slate-500">
                          ({course.code})
                        </span>
                      )}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {course.room || 'Ruang belum diset'} {course.building && `(${course.building})`}
                      </span>
                      {course.lecturer && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {course.lecturer}
                        </span>
                      )}
                    </div>

                    {course.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1 italic">
                        <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                        {course.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800 gap-2">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg capitalize"
                      style={{
                        backgroundColor: `${course.color}15`,
                        color: course.color,
                      }}
                    >
                      {course.classType}
                    </span>
                    <span className="text-[11px] text-indigo-500 font-semibold hover:underline">
                      Edit detail →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

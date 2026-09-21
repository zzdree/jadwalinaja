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
    <div className="space-y-5">
      {/* Day Selector Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {DAYS_CONFIG.map((day) => {
          const isSelected = selectedDay === day.id;
          const count = courses.filter((c) => c.dayOfWeek === day.id).length;

          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <span>{day.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-neutral-700 text-white' : 'bg-neutral-100 text-neutral-500'
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
        <div className="bg-white border border-dashed border-neutral-200 rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-neutral-100 text-neutral-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900">
              Tidak ada jadwal kelas di hari ini
            </h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-0.5">
              Hari ini kosong! Anda bisa menikmati waktu luang atau menambahkan kelas baru.
            </p>
          </div>
          <button
            onClick={() => onAddCourse(selectedDay)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-neutral-800 bg-neutral-100 border border-neutral-200 rounded-xl hover:bg-neutral-200 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Kelas di Hari Ini</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {dayCourses.map((course) => {
            const startMin = timeToMinutes(course.startTime);
            const endMin = timeToMinutes(course.endTime);

            let statusBadge = null;
            if (isToday) {
              if (currentMinutes >= startMin && currentMinutes <= endMin) {
                statusBadge = (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                    Sedang Berlangsung
                  </span>
                );
              } else if (currentMinutes < startMin) {
                statusBadge = (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                    Akan Datang
                  </span>
                );
              } else {
                statusBadge = (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 text-neutral-400">
                    Selesai
                  </span>
                );
              }
            }

            return (
              <div
                key={course.id}
                onClick={() => onCourseClick(course)}
                className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-neutral-300 transition-all cursor-pointer relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 bottom-0 w-1.5"
                  style={{ backgroundColor: course.color }}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        {course.startTime} - {course.endTime}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                        {course.credits} SKS
                      </span>
                      {statusBadge}
                    </div>

                    <h4 className="text-base font-extrabold text-neutral-900">
                      {course.name}{' '}
                      {course.code && (
                        <span className="text-xs font-normal text-neutral-400">
                          ({course.code})
                        </span>
                      )}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {course.room || 'Ruang belum diset'} {course.building && `(${course.building})`}
                      </span>
                      {course.lecturer && (
                        <span className="flex items-center gap-1 text-neutral-500">
                          <User className="w-3.5 h-3.5 text-neutral-400" />
                          {course.lecturer}
                        </span>
                      )}
                    </div>

                    {course.notes && (
                      <p className="text-xs text-neutral-500 flex items-center gap-1 pt-1 italic">
                        <FileText className="w-3 h-3 text-neutral-400 shrink-0" />
                        {course.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100 gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded capitalize"
                      style={{
                        backgroundColor: `${course.color}15`,
                        color: course.color,
                      }}
                    >
                      {course.classType}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-medium hover:text-neutral-900">
                      Kelola matkul →
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

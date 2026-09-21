import React, { useEffect, useState } from 'react';
import { Course } from '../types';
import { getNextClassInfo } from '../lib/utils';
import { Clock, MapPin, User, Sparkles, CheckCircle2 } from 'lucide-react';

interface NextClassBannerProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
}

export const NextClassBanner: React.FC<NextClassBannerProps> = ({ courses, onCourseClick }) => {
  const [, setTick] = useState(0);

  // Update banner every 30 seconds to keep countdown accurate
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const info = getNextClassInfo(courses);

  if (info.status === 'none') {
    return (
      <div className="bg-gradient-to-r from-slate-100/90 to-slate-50 dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Santai dulu! {info.message}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gunakan waktu luang untuk review materi atau selesaikan tugas di tab Tugas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { course, status, message } = info;
  if (!course) return null;

  const isOngoing = status === 'ongoing';

  return (
    <div
      onClick={() => onCourseClick(course)}
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 cursor-pointer transition-all hover:scale-[1.005] active:scale-[0.995] shadow-sm ${
        isOngoing
          ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 dark:border-emerald-500/30'
          : 'bg-gradient-to-r from-indigo-500/10 via-sky-500/5 to-transparent border border-indigo-500/30 dark:border-indigo-500/30'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Badge & Info */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ backgroundColor: course.color }}
          >
            <Clock className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isOngoing
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                {isOngoing ? 'KELAS SEDANG BERLANGSUNG' : 'KELAS BERIKUTNYA'}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {course.startTime} - {course.endTime}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{course.name}</span>
              {course.code && (
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  ({course.code})
                </span>
              )}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {course.room || 'Ruang belum diset'} {course.building ? `(${course.building})` : ''}
              </span>
              {course.lecturer && (
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {course.lecturer}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Status message & Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800">
          <div className="text-left sm:text-right">
            <span
              className={`text-xs font-bold ${
                isOngoing
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-indigo-600 dark:text-indigo-400'
              }`}
            >
              {message}
            </span>
            <p className="text-[11px] text-slate-400">Klik untuk lihat detail / edit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

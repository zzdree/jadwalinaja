import React, { useEffect, useState } from 'react';
import { Course } from '../types';
import { getNextClassInfo } from '../lib/utils';
import { Clock, MapPin, User, CheckCircle2, Video, MessageCircle } from 'lucide-react';

interface NextClassBannerProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
}

export const NextClassBanner: React.FC<NextClassBannerProps> = ({ courses, onCourseClick }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const info = getNextClassInfo(courses);

  if (info.status === 'none') {
    return (
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-800">
              {info.message}
            </h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tidak ada kelas lagi untuk hari ini. Waktu santai atau cek tenggat tugas!
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
      className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 cursor-pointer transition-all hover:border-neutral-300 hover:shadow-2xs active:scale-[0.995]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 font-black text-sm shadow-2xs"
            style={{ backgroundColor: course.color }}
          >
            {course.credits} SKS
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  isOngoing
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOngoing ? 'bg-emerald-500 animate-ping' : 'bg-neutral-500'
                  }`}
                />
                {isOngoing ? 'Sedang Berlangsung' : 'Kelas Berikutnya'}
              </span>
              <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" />
                {course.startTime} - {course.endTime}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
              <span>{course.name}</span>
              {course.code && (
                <span className="text-xs font-normal text-neutral-400">
                  ({course.code})
                </span>
              )}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-neutral-600">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-neutral-400" />
                {course.room || 'Ruang belum diset'} {course.building ? `(${course.building})` : ''}
              </span>
              {course.lecturer && (
                <span className="flex items-center gap-1 text-neutral-500">
                  <User className="w-3 h-3 text-neutral-400" />
                  {course.lecturer}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons & Status */}
        <div className="flex flex-wrap sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
          <div>
            <span
              className={`text-xs font-bold ${
                isOngoing ? 'text-emerald-600' : 'text-neutral-900'
              }`}
            >
              {message}
            </span>
            <p className="text-[11px] text-neutral-400 hidden sm:block">Klik untuk kelola matkul →</p>
          </div>

          {/* Quick External Links (Zoom / WhatsApp) */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {course.meetUrl && (
              <a
                href={course.meetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold flex items-center gap-1"
              >
                <Video className="w-3 h-3" />
                <span>Buka Kelas</span>
              </a>
            )}
            {course.whatsappUrl && (
              <a
                href={course.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Grup WA</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Course, AttendanceRecord } from '../types';
import { calculateAttendance, getDayName } from '../lib/utils';
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface AttendanceTrackerProps {
  courses: Course[];
  onUpdateAttendance: (courseId: string, updated: AttendanceRecord) => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  courses,
  onUpdateAttendance,
}) => {
  const handleAddSession = (
    course: Course,
    type: 'attended' | 'permission' | 'absence'
  ) => {
    const current: AttendanceRecord = course.attendance || {
      attended: 0,
      totalSessions: 14,
      maxAbsenceAllowed: 3,
      permission: 0,
      absence: 0,
    };

    const updated: AttendanceRecord = {
      ...current,
      attended: type === 'attended' ? current.attended + 1 : current.attended,
      permission: type === 'permission' ? current.permission + 1 : current.permission,
      absence: type === 'absence' ? current.absence + 1 : current.absence,
    };

    onUpdateAttendance(course.id, updated);
  };

  const handleResetAttendance = (course: Course) => {
    if (confirm(`Reset hitungan kehadiran untuk ${course.name}?`)) {
      onUpdateAttendance(course.id, {
        attended: 0,
        totalSessions: course.attendance?.totalSessions || 14,
        maxAbsenceAllowed: course.attendance?.maxAbsenceAllowed || 3,
        permission: 0,
        absence: 0,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Info Banner */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
              <span>Tracker Presensi & Sisa Jatah Bolos</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Pantau batas kehadiran 75% per mata kuliah agar tetap memenuhi syarat mengikuti Ujian Akhir Semester (UAS).
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 px-3 py-1.5 bg-neutral-100 rounded-xl border border-neutral-200 w-fit">
            <span>Standar Kampus: Min. 75% Kehadiran</span>
          </div>
        </div>
      </div>

      {/* Courses Attendance Grid */}
      {courses.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-200 rounded-2xl p-10 text-center text-xs text-neutral-400">
          Belum ada mata kuliah yang ditambahkan. Tambah matkul terlebih dahulu di jadwal.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => {
            const stats = calculateAttendance(course.attendance);
            const totalRecorded = stats.attended + (course.attendance?.permission || 0) + (course.attendance?.absence || 0);

            let statusBadge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Aman (Sisa jatah: {stats.absenceLeft}x)
              </span>
            );

            if (stats.isDanger) {
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Bahaya! Jatah Absen Habis
                </span>
              );
            } else if (stats.isWarning) {
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Waspada! Sisa 1x Bolos
                </span>
              );
            }

            return (
              <div
                key={course.id}
                className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-2xs space-y-4 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 bottom-0 w-1.5"
                  style={{ backgroundColor: course.color }}
                />

                {/* Top Info */}
                <div className="pl-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-neutral-500">
                      {getDayName(course.dayOfWeek)} • {course.startTime} - {course.endTime}
                    </span>
                    {statusBadge}
                  </div>

                  <h4 className="text-base font-extrabold text-neutral-900">
                    {course.name}
                  </h4>

                  <div className="text-xs text-neutral-500 flex items-center gap-2">
                    <span>{course.credits} SKS</span>
                    <span>•</span>
                    <span>{course.room || 'Ruang belum diset'}</span>
                    {course.lecturer && <span>• {course.lecturer}</span>}
                  </div>
                </div>

                {/* Progress Bar & Stats */}
                <div className="pl-1 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-700">
                      Kehadiran: {stats.attended} dari {stats.total} Pertemuan ({stats.percentage}%)
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      Tercatat: {totalRecorded} pertemuan
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        stats.percentage >= 75
                          ? 'bg-emerald-500'
                          : stats.percentage >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, stats.percentage)}%` }}
                    />
                  </div>

                  {/* Details pill indicators */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200">
                      <div className="text-[10px] text-neutral-500 font-semibold">Hadir</div>
                      <div className="text-sm font-black text-neutral-900">{stats.attended}x</div>
                    </div>
                    <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200">
                      <div className="text-[10px] text-neutral-500 font-semibold">Izin/Sakit</div>
                      <div className="text-sm font-black text-neutral-900">
                        {course.attendance?.permission || 0}x
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200">
                      <div className="text-[10px] text-neutral-500 font-semibold">Alpa / Bolos</div>
                      <div className={`text-sm font-black ${stats.isDanger ? 'text-rose-600' : 'text-neutral-900'}`}>
                        {course.attendance?.absence || 0} / {course.attendance?.maxAbsenceAllowed || 3}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Increment Controls */}
                <div className="pl-1 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1">
                    <button
                      onClick={() => handleAddSession(course, 'attended')}
                      className="flex-1 py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>+ Hadir</span>
                    </button>
                    <button
                      onClick={() => handleAddSession(course, 'permission')}
                      className="py-1.5 px-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      + Izin
                    </button>
                    <button
                      onClick={() => handleAddSession(course, 'absence')}
                      className="py-1.5 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      + Alpa
                    </button>
                  </div>

                  <button
                    onClick={() => handleResetAttendance(course)}
                    title="Reset data presensi matkul ini"
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

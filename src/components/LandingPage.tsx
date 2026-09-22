import React, { useState } from 'react';
import { Course, DAYS_CONFIG } from '../types';
import { timeToMinutes } from '../lib/utils';
import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  sampleCourses: Course[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginClick,
  sampleCourses,
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'weekly' | 'agenda'>('weekly');
  const [selectedPreviewCourse, setSelectedPreviewCourse] = useState<Course | null>(sampleCourses[0] || null);

  // Group courses by day for preview grid
  const START_HOUR = 7;
  const END_HOUR = 18;
  const TOTAL_HOURS = END_HOUR - START_HOUR;
  const ROW_HEIGHT = 56;
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-200 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="JadwalinAja" className="w-8 h-8 rounded-lg shadow-2xs" />
            <span className="text-lg font-black tracking-tight text-neutral-900">
              JadwalinAja
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold text-neutral-500">
              Pengatur Jadwal Kuliah Mahasiswa
            </span>
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              {/* Google G Icon */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Masuk dengan Google</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        <section className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-bold text-neutral-700">
            <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
            <span>Versi Baru • Clean White Minimalist & Cloudflare D1 Edge</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
            Jadwal kuliah tertata rapi, <br className="hidden sm:inline" />
            tanpa drama bentrok.
          </h1>

          <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Atur mata kuliah, nomor ruangan, nama dosen, dan deadline tugas dalam satu visualisasi mingguan yang jernih, estetik, dan mudah digunakan.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onLoginClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Masuk dengan Google untuk Mulai</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-neutral-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-600" /> Gratis & Tanpa Iklan
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-600" /> Sinkronisasi HP & Laptop
            </span>
          </div>
        </section>

        {/* Live Interactive Preview Showcase */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                Live Interactive Preview
              </h2>
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-lg border border-neutral-200">
              <button
                onClick={() => setActivePreviewTab('weekly')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  activePreviewTab === 'weekly'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Tampilan Mingguan
              </button>
              <button
                onClick={() => setActivePreviewTab('agenda')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  activePreviewTab === 'agenda'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Tampilan Agenda
              </button>
            </div>
          </div>

          {/* Interactive Preview Container */}
          <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden relative">
            {/* Top Prompt Banner */}
            <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900">Pratinjau Jadwal Kuliah:</span>
                <span className="text-neutral-500">Klik kartu kelas di bawah untuk melihat detail.</span>
              </div>
              <button
                onClick={onLoginClick}
                className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1"
              >
                <span>Mulai Atur Jadwal Anda Sendiri</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Preview Timetable Grid */}
            {activePreviewTab === 'weekly' ? (
              <div className="overflow-x-auto p-4">
                <div className="min-w-[700px]">
                  {/* Days Header */}
                  <div className="grid grid-cols-[55px_repeat(5,1fr)] border-b border-neutral-200 pb-2 mb-2 text-center text-xs font-bold text-neutral-800">
                    <span className="text-neutral-400">Jam</span>
                    <span>Senin</span>
                    <span>Selasa</span>
                    <span>Rabu</span>
                    <span>Kamis</span>
                    <span>Jumat</span>
                  </div>

                  {/* Grid Preview */}
                  <div className="grid grid-cols-[55px_repeat(5,1fr)] relative">
                    {/* Time Column */}
                    <div className="border-r border-neutral-100 text-[11px] font-semibold text-neutral-400 space-y-10 pt-1">
                      {hours.filter((_, idx) => idx % 2 === 0).map((h) => (
                        <div key={h}>{`${h.toString().padStart(2, '0')}:00`}</div>
                      ))}
                    </div>

                    {/* 5 Days Columns */}
                    {[1, 2, 3, 4, 5].map((dayId) => {
                      const dayCourses = sampleCourses.filter((c) => c.dayOfWeek === dayId);

                      return (
                        <div
                          key={dayId}
                          className="relative border-r border-neutral-100 last:border-r-0 px-1"
                          style={{ height: `${TOTAL_HOURS * ROW_HEIGHT}px` }}
                        >
                          {/* Hour lines */}
                          {hours.map((h) => (
                            <div
                              key={h}
                              style={{ height: `${ROW_HEIGHT}px` }}
                              className="border-b border-neutral-100/70"
                            />
                          ))}

                          {/* Render sample course blocks */}
                          {dayCourses.map((c) => {
                            const startMin = timeToMinutes(c.startTime);
                            const endMin = timeToMinutes(c.endTime);
                            const baseMin = START_HOUR * 60;
                            const topPx = ((startMin - baseMin) / 60) * ROW_HEIGHT;
                            const heightPx = ((endMin - startMin) / 60) * ROW_HEIGHT;

                            const isSelected = selectedPreviewCourse?.id === c.id;

                            return (
                              <div
                                key={c.id}
                                onClick={() => setSelectedPreviewCourse(c)}
                                style={{
                                  top: `${Math.max(0, topPx)}px`,
                                  height: `${heightPx - 4}px`,
                                  borderLeftColor: c.color,
                                }}
                                className={`absolute left-1 right-1 rounded-xl p-2 cursor-pointer border-l-4 transition-all shadow-2xs ${
                                  isSelected
                                    ? 'bg-neutral-100 ring-2 ring-neutral-900 z-10'
                                    : 'bg-white border border-neutral-200/90 hover:border-neutral-300'
                                }`}
                              >
                                <h5 className="font-extrabold text-[11px] text-neutral-900 leading-snug line-clamp-1">
                                  {c.name}
                                </h5>
                                <div className="text-[10px] text-neutral-500 font-medium">
                                  {c.startTime} - {c.endTime}
                                </div>
                                <div className="text-[9px] text-neutral-400 truncate mt-1">
                                  {c.room || '-'}
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
            ) : (
              /* Preview Agenda View */
              <div className="p-6 space-y-3">
                {sampleCourses.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedPreviewCourse(c)}
                    className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl flex items-center justify-between cursor-pointer hover:border-neutral-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-10 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-neutral-900">{c.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-700 font-bold">
                            {c.credits} SKS
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                          <span>{c.startTime} - {c.endTime}</span>
                          <span>•</span>
                          <span>{c.room}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-400">
                      {DAYS_CONFIG.find((d) => d.id === c.dayOfWeek)?.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Course Quick Drawer Preview */}
            {selectedPreviewCourse && (
              <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedPreviewCourse.color }}
                  />
                  <span className="font-extrabold text-neutral-900">
                    {selectedPreviewCourse.name}
                  </span>
                  <span className="text-neutral-500">
                    ({selectedPreviewCourse.credits} SKS • {selectedPreviewCourse.room || '-'} • Dosen: {selectedPreviewCourse.lecturer || '-'})
                  </span>
                </div>
                <button
                  onClick={onLoginClick}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Edit Jadwal Asli →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 3 Core Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white border border-neutral-200 p-6 rounded-3xl space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 border border-neutral-200">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900">
              Anti-Bentrok Otomatis
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Mendeteksi secara real-time saat Anda memilih jam matkul yang bertabrakan dengan jadwal lainnya. Tidak ada lagi kaget jadwal tumpang-tindih.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-6 rounded-3xl space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 border border-neutral-200">
              <Smartphone className="w-5 h-5 text-neutral-800" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900">
              Ekspor Wallpaper HP & Kalender
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Satu klik untuk mengunduh gambar poster jadwal beresolusi tinggi yang pas untuk lockscreen smartphone Anda, atau sinkronkan via file .ics ke Google Calendar.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-6 rounded-3xl space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 border border-neutral-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-extrabold text-neutral-900">
              Database Cloudflare D1
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Tersinkronisasi cepat dan aman di server edge Cloudflare APAC. Akses jadwal Anda dari laptop, tablet, atau smartphone kapan saja.
            </p>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Siap mengatur jadwal perkuliahan Anda?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Hanya butuh beberapa detik untuk memasukkan matkul semester ini. Masuk dengan akun Google Anda dan mulai sekarang.
          </p>
          <button
            onClick={onLoginClick}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-neutral-900 hover:bg-neutral-100 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {/* Google Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Masuk Sekarang dengan Google</span>
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12 text-center text-xs text-neutral-400">
        JadwalinAja • Aplikasi Pengatur Jadwal Kuliah Mahasiswa Indonesia • Cloudflare Pages & D1
      </footer>
    </div>
  );
};

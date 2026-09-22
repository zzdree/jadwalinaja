import React, { useState } from 'react';
import { Course, DAYS_CONFIG } from '../types';
import { timeToMinutes } from '../lib/utils';
import {
  AlertTriangle,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  Clock,
  ListTodo,
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

  const START_HOUR = 7;
  const END_HOUR = 18;
  const TOTAL_HOURS = END_HOUR - START_HOUR;
  const ROW_HEIGHT = 56;
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="JadwalinAja" className="w-8 h-8 rounded-lg" />
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black tracking-tight text-neutral-900">
                JadwalinAja
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium text-neutral-500">
                jadwal kuliah mahasiswa
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
        <section className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
            Jadwal kuliah mingguan yang jelas, cepat dibaca, dan anti-bentrok.
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Dibuat untuk mahasiswa yang butuh akses cepat ke ruangan kelas, jadwal harian, dan tenggat tugas tanpa harus bolak-balik login ke portal kampus yang lambat.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onLoginClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-3 active:scale-98 transition-all cursor-pointer"
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
              <span>Masuk dengan Google untuk Memulai</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-1 text-xs text-neutral-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700" /> Tersimpan di akun Anda
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700" /> Bisa diakses saat offline
            </span>
          </div>
        </section>

        {/* Live Interactive Preview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-neutral-900 uppercase tracking-wide">
                Simulasi Tampilan Jadwal
              </span>
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
                Mingguan
              </button>
              <button
                onClick={() => setActivePreviewTab('agenda')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  activePreviewTab === 'agenda'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Harian
              </button>
            </div>
          </div>

          {/* Interactive Container */}
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs">
            {/* Explanatory subbar */}
            <div className="p-3 bg-neutral-50/80 border-b border-neutral-200 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-2">
              <span>Klik kartu mata kuliah di bawah untuk melihat rincian ruang dan dosen.</span>
              <button
                onClick={onLoginClick}
                className="font-bold text-neutral-900 hover:underline flex items-center gap-1"
              >
                <span>Buka Jadwal Anda Sendiri</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Weekly Timetable Preview */}
            {activePreviewTab === 'weekly' ? (
              <div className="overflow-x-auto p-4">
                <div className="min-w-[700px]">
                  <div className="grid grid-cols-[55px_repeat(5,1fr)] border-b border-neutral-200 pb-2 mb-2 text-center text-xs font-bold text-neutral-800">
                    <span className="text-neutral-400">Jam</span>
                    <span>Senin</span>
                    <span>Selasa</span>
                    <span>Rabu</span>
                    <span>Kamis</span>
                    <span>Jumat</span>
                  </div>

                  <div className="grid grid-cols-[55px_repeat(5,1fr)] relative">
                    <div className="border-r border-neutral-100 text-[11px] font-semibold text-neutral-400 space-y-10 pt-1">
                      {hours.filter((_, idx) => idx % 2 === 0).map((h) => (
                        <div key={h}>{`${h.toString().padStart(2, '0')}:00`}</div>
                      ))}
                    </div>

                    {[1, 2, 3, 4, 5].map((dayId) => {
                      const dayCourses = sampleCourses.filter((c) => c.dayOfWeek === dayId);

                      return (
                        <div
                          key={dayId}
                          className="relative border-r border-neutral-100 last:border-r-0 px-1"
                          style={{ height: `${TOTAL_HOURS * ROW_HEIGHT}px` }}
                        >
                          {hours.map((h) => (
                            <div
                              key={h}
                              style={{ height: `${ROW_HEIGHT}px` }}
                              className="border-b border-neutral-100/70"
                            />
                          ))}

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
              <div className="p-6 space-y-3">
                {sampleCourses.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedPreviewCourse(c)}
                    className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-neutral-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-10 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900">{c.name}</span>
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
                    <span className="text-xs font-semibold text-neutral-500">
                      {DAYS_CONFIG.find((d) => d.id === c.dayOfWeek)?.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Course Detail Preview */}
            {selectedPreviewCourse && (
              <div className="p-4 bg-neutral-50/90 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
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
                  Edit di Akun Saya →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Content-Driven Workflow Section (Not Generic Copy-Paste Cards) */}
        <section className="space-y-6 pt-4">
          <div className="border-b border-neutral-200 pb-3">
            <h2 className="text-lg font-black text-neutral-900 tracking-tight">
              Tiga Hal yang Sering Dihadapi Saat Kuliah
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Bagaimana JadwalinAja menyelesaikannya secara praktis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Bentrok Jam */}
            <div className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-neutral-900">
                  Jadwal bentrok saat KRSan
                </h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Saat input jam mata kuliah, sistem langsung memvalidasi irisan waktu. Jika ada kelas yang jamnya bertabrakan di hari yang sama, peringatan merah akan muncul seketika.
              </p>
            </div>

            {/* Card 2: Lupa Ruangan saat Buru-Buru */}
            <div className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-700" />
                <h3 className="text-sm font-bold text-neutral-900">
                  Lupa ruangan kelas berikutnya
                </h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Widget kelas berikutnya otomatis mendeteksi jam dan hari saat ini. Begitu web dibuka di HP, langsung terbaca nama ruangan, gedung, dan sisa menit menuju kelas.
              </p>
            </div>

            {/* Card 3: Tugas Tercecer */}
            <div className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-neutral-700" />
                <h3 className="text-sm font-bold text-neutral-900">
                  Tugas kuliah tercampur
                </h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Catatan tugas, kuis, dan makalah langsung terhubung ke mata kuliah terkait lengkap dengan tanggal deadline, sehingga tidak ada tugas penting yang terlewat.
              </p>
            </div>
          </div>
        </section>

        {/* Practical Utility Highlights */}
        <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
              <Smartphone className="w-4 h-4 text-neutral-800" />
              <span>Simpan Jadwal ke Lockscreen HP</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-neutral-900">
              Unduh gambar poster jadwal atau kalender (.ics)
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Anda bisa mengubah jadwal mingguan menjadi gambar poster beresolusi tinggi untuk dijadikan wallpaper HP, atau download file .ics untuk sinkronisasi ke Google Calendar.
            </p>
          </div>

          <button
            onClick={onLoginClick}
            className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer"
          >
            Mulai JadwalinAja
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12 text-center text-xs text-neutral-400">
        JadwalinAja • Aplikasi Pengatur Jadwal Kuliah Mahasiswa
      </footer>
    </div>
  );
};

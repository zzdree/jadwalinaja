import React, { useRef, useState } from 'react';
import { Course, Task } from '../types';
import { generateICS, downloadFile, getDayName } from '../lib/utils';
import { toPng } from 'html-to-image';
import {
  X,
  Download,
  Calendar,
  Image as ImageIcon,
  FileJson,
  Upload,
  Sparkles,
  Check,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  tasks: Task[];
  onImportCourses: (courses: Course[], tasks: Task[]) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  courses,
  tasks,
  onImportCourses,
}) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageGeneratedSuccess, setImageGeneratedSuccess] = useState(false);

  if (!isOpen) return null;

  // 1. Export as High-Res Poster / Wallpaper Image
  const handleExportImage = async () => {
    if (!posterRef.current) return;
    try {
      setIsGeneratingImage(true);
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `Jadwal-Kuliah-JadwalinAja-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();

      setImageGeneratedSuccess(true);
      setTimeout(() => setImageGeneratedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Gagal membuat gambar poster jadwal. Silakan coba lagi.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // 2. Export as iCalendar (.ics) for Google Calendar / Apple Calendar
  const handleExportICS = () => {
    const icsContent = generateICS(courses);
    downloadFile(
      icsContent,
      `Jadwal-Kuliah-JadwalinAja.ics`,
      'text/calendar;charset=utf-8'
    );
  };

  // 3. Export JSON Backup
  const handleExportJSON = () => {
    const backupData = {
      app: 'JadwalinAja',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      courses,
      tasks,
    };
    downloadFile(
      JSON.stringify(backupData, null, 2),
      `jadwalinaja-backup-${new Date().toISOString().split('T')[0]}.json`,
      'application/json'
    );
  };

  // 4. Import JSON Backup
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.courses)) {
          onImportCourses(parsed.courses, Array.isArray(parsed.tasks) ? parsed.tasks : []);
          alert('Berhasil mengimpor jadwal!');
          onClose();
        } else {
          alert('Format file JSON tidak sesuai.');
        }
      } catch {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  const totalSks = courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Export & Bagikan Jadwal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Simpan jadwal dalam berbagai format untuk wallpaper HP, kalender, atau cadangan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="mt-6 space-y-4">
          {/* 1. Export as Wallpaper Image */}
          <div className="p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/50 to-sky-50/50 dark:from-indigo-950/20 dark:to-sky-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>Download Wallpaper / Gambar HD</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    Estetik
                  </span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Poster ringkasan jadwal beresolusi tinggi, pas untuk Lockscreen smartphone Anda.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportImage}
              disabled={isGeneratingImage}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingImage ? (
                <span>Memproses...</span>
              ) : imageGeneratedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Export to Google / Apple Calendar */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Sinkronisasi ke Google / Apple Calendar (.ics)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Export file kalender iCal agar jadwal otomatis berulang tiap minggu di kalender HP Anda.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportICS}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download .ics</span>
            </button>
          </div>

          {/* 3. Backup & Restore JSON */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Cadangan & Pindah Perangkat (JSON)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Simpan seluruh data matkul dan tugas ke file JSON atau pulihkan dari file lama.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Impor</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Cadangkan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hidden / Offscreen Poster element rendered for html-to-image capture */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div
            ref={posterRef}
            className="w-[800px] p-8 bg-slate-900 text-white rounded-3xl font-sans"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {/* Poster Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                  J
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-white">
                    JadwalinAja
                  </h2>
                  <p className="text-xs font-medium text-slate-400">
                    Jadwal Perkuliahan Mingguan • Total {totalSks} SKS ({courses.length} Matkul)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Semester Aktif 2026/2027
                </span>
              </div>
            </div>

            {/* Poster Course List grouped by day */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((dayId) => {
                const dayCourses = courses.filter((c) => c.dayOfWeek === dayId);
                if (dayCourses.length === 0) return null;

                return (
                  <div
                    key={dayId}
                    className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                      <span className="font-extrabold text-sm text-indigo-400">
                        {getDayName(dayId as any)}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {dayCourses.length} Kelas
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dayCourses.map((c) => (
                        <div
                          key={c.id}
                          className="p-2.5 rounded-xl bg-slate-900/60 border-l-4"
                          style={{ borderLeftColor: c.color }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-100">{c.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {c.credits} SKS
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold text-slate-400 mt-1 flex items-center justify-between">
                            <span>
                              {c.startTime} - {c.endTime}
                            </span>
                            <span className="text-slate-300">{c.room || '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Poster Footer */}
            <div className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dibuat dengan JadwalinAja • Atur jadwal kuliah gak pake ribet!</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

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

  const handleExportICS = () => {
    const icsContent = generateICS(courses);
    downloadFile(
      icsContent,
      `Jadwal-Kuliah-JadwalinAja.ics`,
      'text/calendar;charset=utf-8'
    );
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-xl border border-neutral-200 p-6 sm:p-7 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-lg font-extrabold text-neutral-900">
              Export & Bagikan Jadwal
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Simpan jadwal untuk wallpaper smartphone, kalender digital, atau cadangan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="mt-5 space-y-3">
          {/* 1. Wallpaper Image */}
          <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>Download Wallpaper / Gambar HD</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-800">
                    PNG
                  </span>
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Poster jadwal beresolusi tinggi, pas untuk Lockscreen smartphone.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportImage}
              disabled={isGeneratingImage}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingImage ? (
                <span>Memproses...</span>
              ) : imageGeneratedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </>
              )}
            </button>
          </div>

          {/* 2. iCalendar .ics */}
          <div className="p-4 rounded-2xl border border-neutral-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0 border border-neutral-200">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">
                  Google & Apple Calendar (.ics)
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Sinkronisasi sekali klik agar jadwal otomatis berulang tiap minggu di aplikasi kalender.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportICS}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .ics</span>
            </button>
          </div>

          {/* 3. JSON Backup */}
          <div className="p-4 rounded-2xl border border-neutral-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0 border border-neutral-200">
                <FileJson className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">
                  Cadangan & Pindah Perangkat (JSON)
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Ekspor atau impor data matkul dan tugas antar laptop & smartphone.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label className="flex items-center justify-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer">
                <Upload className="w-3 h-3" />
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
                className="flex items-center justify-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Cadangkan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Offscreen Poster for html-to-image capture: Clean Minimalist Poster */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div
            ref={posterRef}
            className="w-[800px] p-10 bg-white text-neutral-900 rounded-3xl font-sans border-8 border-neutral-100"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-5 mb-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-neutral-900">
                  JadwalinAja
                </h2>
                <p className="text-xs font-semibold text-neutral-500 mt-1">
                  Jadwal Kuliah Mingguan • {totalSks} SKS Total ({courses.length} Mata Kuliah)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                  Semester Aktif
                </span>
              </div>
            </div>

            {/* Courses list */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((dayId) => {
                const dayCourses = courses.filter((c) => c.dayOfWeek === dayId);
                if (dayCourses.length === 0) return null;

                return (
                  <div
                    key={dayId}
                    className="border border-neutral-200 rounded-2xl p-4 bg-neutral-50/50 space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                      <span className="font-black text-xs text-neutral-900">
                        {getDayName(dayId as any)}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-400">
                        {dayCourses.length} Kelas
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dayCourses.map((c) => (
                        <div
                          key={c.id}
                          className="p-2.5 rounded-xl bg-white border border-neutral-200/90 shadow-2xs border-l-4"
                          style={{ borderLeftColor: c.color }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-neutral-900">{c.name}</span>
                            <span className="text-[10px] text-neutral-500 font-bold">
                              {c.credits} SKS
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold text-neutral-500 mt-1 flex items-center justify-between">
                            <span>
                              {c.startTime} - {c.endTime}
                            </span>
                            <span className="text-neutral-700 font-medium">{c.room || '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-neutral-200 text-center text-[11px] text-neutral-400 font-medium">
              JadwalinAja • Atur jadwal kuliah gak pake ribet!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

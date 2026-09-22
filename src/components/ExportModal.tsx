import React, { useRef, useState } from 'react';
import { Course, Task } from '../types';
import { generateICS, downloadFile, getDayName } from '../lib/utils';
import { toPng } from 'html-to-image';
import {
  X,
  Download,
  Calendar,
  FileJson,
  Upload,
  Printer,
  Smartphone,
  Monitor,
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
  const phonePosterRef = useRef<HTMLDivElement>(null);
  const desktopPosterRef = useRef<HTMLDivElement>(null);

  const [isGeneratingPhone, setIsGeneratingPhone] = useState(false);
  const [isGeneratingDesktop, setIsGeneratingDesktop] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Export Phone Wallpaper (9:16)
  const handleExportPhone = async () => {
    if (!phonePosterRef.current) return;
    try {
      setIsGeneratingPhone(true);
      const dataUrl = await toPng(phonePosterRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2.5,
      });

      const link = document.createElement('a');
      link.download = `Jadwal-HP-JadwalinAja-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess('phone');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Gagal membuat wallpaper HP.');
    } finally {
      setIsGeneratingPhone(false);
    }
  };

  // 2. Export Desktop Wallpaper (16:9)
  const handleExportDesktop = async () => {
    if (!desktopPosterRef.current) return;
    try {
      setIsGeneratingDesktop(true);
      const dataUrl = await toPng(desktopPosterRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `Jadwal-Desktop-JadwalinAja-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess('desktop');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Gagal membuat wallpaper desktop.');
    } finally {
      setIsGeneratingDesktop(false);
    }
  };

  // 3. Print A4 Document
  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // 4. iCalendar (.ics)
  const handleExportICS = () => {
    const icsContent = generateICS(courses);
    downloadFile(
      icsContent,
      `Jadwal-Kuliah-JadwalinAja.ics`,
      'text/calendar;charset=utf-8'
    );
  };

  // 5. JSON Backup
  const handleExportJSON = () => {
    const backupData = {
      app: 'JadwalinAja',
      version: '2.0',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 p-6 sm:p-7 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-lg font-black text-neutral-900">
              Export & Cetak Jadwal
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Pilih format kebutuhan: wallpaper HP, wallpaper desktop, cetak A4, atau kalender digital.
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
          {/* 1. Phone Lockscreen Wallpaper */}
          <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>Wallpaper Lockscreen Smartphone</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-800">
                    9:16 Portret
                  </span>
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Format vertikal pas untuk layar kunci HP, cepat dilihat saat di lorong kampus.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportPhone}
              disabled={isGeneratingPhone}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPhone ? (
                <span>Memproses...</span>
              ) : downloadSuccess === 'phone' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PNG</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Desktop Wallpaper */}
          <div className="p-4 rounded-2xl border border-neutral-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-center shrink-0">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>Wallpaper Laptop / Desktop</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600">
                    16:9 Lanskap
                  </span>
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Format horizontal resolusi tinggi untuk layar laptop atau monitor belajar.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportDesktop}
              disabled={isGeneratingDesktop}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingDesktop ? (
                <span>Memproses...</span>
              ) : downloadSuccess === 'desktop' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PNG</span>
                </>
              )}
            </button>
          </div>

          {/* 3. Print A4 */}
          <div className="p-4 rounded-2xl border border-neutral-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-center shrink-0">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">
                  Cetak Dokumen Resmi (Format A4 / PDF)
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Format cetak bersih hitam-putih untuk ditempel di kamar kos atau arsip KRS.
                </p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </div>

          {/* 4. Calendar .ics */}
          <div className="p-4 rounded-2xl border border-neutral-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">
                  Google & Apple Calendar (.ics)
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Sinkronisasi berulang tiap pekan di aplikasi kalender Google/Apple/Outlook.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportICS}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh .ics</span>
            </button>
          </div>

          {/* 5. JSON Backup */}
          <div className="p-4 rounded-2xl border border-neutral-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-center shrink-0">
                <FileJson className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">
                  Cadangan & Pindah Perangkat (JSON)
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Simpan cadangan data jadwal atau pulihkan dari file lama.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label className="flex items-center justify-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-all cursor-pointer">
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
                className="flex items-center justify-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Cadangkan</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= OFFSCREEN ELEMENTS FOR RENDERING ================= */}

        {/* Offscreen Phone Poster (430px x 932px - 9:16 mobile ratio) */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div
            ref={phonePosterRef}
            className="w-[430px] p-6 bg-white text-neutral-900 font-sans"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            <div className="border-b-2 border-neutral-900 pb-3 mb-4">
              <h2 className="text-2xl font-black text-neutral-900">JadwalinAja</h2>
              <div className="text-[11px] font-bold text-neutral-500 mt-0.5">
                {totalSks} SKS Total ({courses.length} Matkul)
              </div>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((dayId) => {
                const dayCourses = courses.filter((c) => c.dayOfWeek === dayId);
                if (dayCourses.length === 0) return null;

                return (
                  <div key={dayId} className="border border-neutral-200 rounded-xl p-3 bg-neutral-50">
                    <div className="font-black text-xs text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                      {getDayName(dayId as any)}
                    </div>
                    <div className="space-y-1.5">
                      {dayCourses.map((c) => (
                        <div
                          key={c.id}
                          className="p-2 bg-white rounded-lg border-l-4 border border-neutral-200 shadow-2xs"
                          style={{ borderLeftColor: c.color }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[11px] text-neutral-900">{c.name}</span>
                            <span className="text-[9px] text-neutral-500 font-bold">{c.credits} SKS</span>
                          </div>
                          <div className="text-[10px] text-neutral-500 font-medium flex items-center justify-between mt-0.5">
                            <span>{c.startTime} - {c.endTime}</span>
                            <span>{c.room || '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-3 border-t border-neutral-200 text-center text-[10px] text-neutral-400 font-medium">
              jadwalinaja.pages.dev
            </div>
          </div>
        </div>

        {/* Offscreen Desktop Poster (1200px x 675px - 16:9 desktop ratio) */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div
            ref={desktopPosterRef}
            className="w-[1200px] p-10 bg-white text-neutral-900 font-sans border-4 border-neutral-200"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-4 mb-6">
              <div>
                <h2 className="text-3xl font-black text-neutral-900">JadwalinAja</h2>
                <p className="text-xs font-bold text-neutral-500 mt-1">
                  Jadwal Kuliah Mingguan • {totalSks} SKS Total ({courses.length} Mata Kuliah)
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-neutral-100 border border-neutral-300 rounded-lg">
                Semester Aktif
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((dayId) => {
                const dayCourses = courses.filter((c) => c.dayOfWeek === dayId);
                if (dayCourses.length === 0) return null;

                return (
                  <div key={dayId} className="border border-neutral-200 rounded-xl p-3.5 bg-neutral-50">
                    <div className="font-black text-sm text-neutral-900 border-b border-neutral-200 pb-1.5 mb-2">
                      {getDayName(dayId as any)}
                    </div>
                    <div className="space-y-2">
                      {dayCourses.map((c) => (
                        <div
                          key={c.id}
                          className="p-2.5 bg-white rounded-xl border border-neutral-200 border-l-4 shadow-2xs"
                          style={{ borderLeftColor: c.color }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-neutral-900">{c.name}</span>
                            <span className="text-[10px] text-neutral-500 font-bold">{c.credits} SKS</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 font-semibold flex items-center justify-between mt-1">
                            <span>{c.startTime} - {c.endTime}</span>
                            <span>{c.room || '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-200 text-center text-xs text-neutral-400">
              JadwalinAja • Atur jadwal kuliah gak pake ribet! • jadwalinaja.pages.dev
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

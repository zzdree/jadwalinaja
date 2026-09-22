import React, { useState } from 'react';
import { Course } from '../types';
import { parseSiakadText, getDayName } from '../lib/utils';
import { X, Wand2, Check, ArrowRight } from 'lucide-react';

interface SmartImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (parsedCourses: Course[]) => void;
}

const SAMPLE_TEXT = `Pemrograman Web Lanjut | Senin 08:00 - 10:30 | 3 SKS | Lab Komputer 3 | Dr. Hendra
Kecerdasan Buatan | Selasa 10:00 - 12:30 | 3 SKS | Ruang 402 | Budi Santoso
Etika Profesi & Hukum IT | Rabu 13:00 - 14:40 | 2 SKS | Ruang 201 | Bu Dina
Jaringan Komputer | Kamis 08:00 - 10:30 | 3 SKS | Lab Jaringan | Pak Rian`;

export const SmartImportModal: React.FC<SmartImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [inputText, setInputText] = useState('');
  const [parsedItems, setParsedItems] = useState<Partial<Course>[]>([]);

  if (!isOpen) return null;

  const handleParse = (text: string) => {
    setInputText(text);
    if (!text.trim()) {
      setParsedItems([]);
      return;
    }
    const result = parseSiakadText(text);
    setParsedItems(result);
  };

  const handleUseSample = () => {
    handleParse(SAMPLE_TEXT);
  };

  const handleConfirmImport = () => {
    if (parsedItems.length === 0) return;

    const completeCourses: Course[] = parsedItems.map((item, idx) => ({
      id: item.id || `course_imp_${Date.now()}_${idx}`,
      code: item.code || '',
      name: item.name || `Mata Kuliah ${idx + 1}`,
      credits: item.credits || 3,
      dayOfWeek: item.dayOfWeek || 1,
      startTime: item.startTime || '08:00',
      endTime: item.endTime || '09:40',
      room: item.room || '',
      building: item.building || '',
      lecturer: item.lecturer || '',
      classType: item.classType || 'teori',
      color: item.color || '#2563eb',
      notes: item.notes || '',
      attendance: {
        attended: 0,
        totalSessions: 14,
        maxAbsenceAllowed: 3,
        permission: 0,
        absence: 0,
      },
    }));

    onImport(completeCourses);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 p-6 sm:p-7 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center border border-neutral-200">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900">
                Impor Cepat Teks SIAKAD Kampus
              </h3>
              <p className="text-xs text-neutral-500">
                Tempel teks jadwal atau tabel dari portal kampus Anda, sistem akan mem-parse otomatis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-4">
          {/* Instructions */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-700">
              Tempel Teks Jadwal (Contoh: Matkul | Hari | Jam | Ruang):
            </span>
            <button
              type="button"
              onClick={handleUseSample}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
            >
              Gunakan Contoh Teks
            </button>
          </div>

          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => handleParse(e.target.value)}
            placeholder="Contoh:&#10;Pemrograman Web | Senin 08:00 - 10:30 | 3 SKS | Lab 3&#10;Basis Data | Selasa 13:00 - 15:30 | 3 SKS | R.304"
            className="w-full p-3 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 text-neutral-900"
          />

          {/* Parsed Result Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-neutral-900">
                Hasil Deteksi Otomatis ({parsedItems.length} Matkul)
              </span>
              {parsedItems.length > 0 && (
                <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Format berhasil dikenali
                </span>
              )}
            </div>

            {parsedItems.length === 0 ? (
              <div className="p-6 bg-neutral-50 border border-dashed border-neutral-200 rounded-xl text-center text-xs text-neutral-400">
                Ketik atau tempel teks jadwal Anda di atas untuk melihat pratinjau hasil impor di sini.
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {parsedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2 h-8 rounded-full"
                        style={{ backgroundColor: item.color || '#2563eb' }}
                      />
                      <div>
                        <div className="font-extrabold text-neutral-900">{item.name}</div>
                        <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                          <span>{getDayName((item.dayOfWeek || 1) as any)}</span>
                          <span>•</span>
                          <span>{item.startTime} - {item.endTime}</span>
                          <span>•</span>
                          <span>{item.credits} SKS</span>
                          {item.room && <span>• {item.room}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            onClick={handleConfirmImport}
            disabled={parsedItems.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <span>Tambahkan {parsedItems.length} Matkul ke Jadwal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

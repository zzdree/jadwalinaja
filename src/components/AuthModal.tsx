import React, { useState } from 'react';
import { User } from '../types';
import { X, Cloud, ShieldCheck, Key, LogIn } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [googleClientId, setGoogleClientId] = useState(
    localStorage.getItem('jadwalinaja_google_client_id') || ''
  );
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  if (!isOpen) return null;

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (googleClientId.trim()) {
      localStorage.setItem('jadwalinaja_google_client_id', googleClientId.trim());
      alert('Google Client ID berhasil disimpan!');
    }
  };

  // Quick Demo / Testing Sign In (Instant zero-friction test)
  const handleDemoSignIn = () => {
    const demoUser: User = {
      id: `usr_demo_${Date.now()}`,
      googleId: '109876543210',
      email: customEmail.trim() || 'mahasiswa@kampus.ac.id',
      name: customName.trim() || 'Andreas Mahasiswa',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-sky-500" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Cloudflare D1 & Google Sync
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sinkronkan jadwal antar laptop & smartphone Anda.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Benefit */}
        <div className="my-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Keuntungan Masuk dengan Google:</span>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
            <li>Jadwal tersimpan aman di database Cloudflare D1.</li>
            <li>Buka dari HP atau laptop mana saja, jadwal langsung sama.</li>
            <li>Tetap bisa diakses secara offline saat internet kampus lambat.</li>
          </ul>
        </div>

        {/* Quick Google Sign In Action */}
        <div className="space-y-3">
          <button
            onClick={handleDemoSignIn}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            {/* Google G Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>Masuk Cepat dengan Google Akun</span>
          </button>

          {/* Toggle advanced OAuth client ID setting */}
          <div className="pt-3">
            <button
              type="button"
              onClick={() => setIsDemoMode(!isDemoMode)}
              className="text-xs text-indigo-500 font-semibold hover:underline flex items-center gap-1 mx-auto"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{isDemoMode ? 'Sembunyikan Pengaturan Client ID' : 'Pengaturan Google OAuth Client ID'}</span>
            </button>
          </div>

          {isDemoMode && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
              <form onSubmit={handleSaveClientId} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Google Client ID (dari Google Cloud Console)
                </label>
                <input
                  type="text"
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  placeholder="xxxxx.apps.googleusercontent.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Simpan Client ID
                </button>
              </form>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Atau Uji Coba Profil Kustom
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="Email Mahasiswa"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Gunakan Akun Ini</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

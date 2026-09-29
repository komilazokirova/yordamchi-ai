'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, User, GraduationCap, Building2, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserAccount } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSaveUser: (updatedUser: Partial<UserAccount>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
}) => {
  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [university, setUniversity] = useState(currentUser.university || "O'zbekiston Milliy Universiteti");
  const [role, setRole] = useState<'student' | 'teacher'>(currentUser.role || 'student');

  useEffect(() => {
    if (isOpen) {
      setFullName(currentUser.fullName || '');
      setEmail(currentUser.email || '');
      setUniversity(currentUser.university || "O'zbekiston Milliy Universiteti");
      setRole(currentUser.role || 'student');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      fullName: fullName.trim() || 'Talaba',
      email: email.trim() || 'talaba@edu.uz',
      university: university.trim() || "O'zbekiston Milliy Universiteti",
      role,
      isSubscribed: true,
      freeGenerationsLeft: 999999,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/25">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {currentUser.fullName ? 'Foydalanuvchi Profili' : 'Tizimga kirish'}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Hujjat titul varaqlarida avtomatik chiqadigan ma'lumotlar
          </p>
        </div>

        {/* 100% Free Notification */}
        <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/40">
          <Sparkles className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <span className="font-bold">100% Mutlaqo Bepul:</span> Cheksiz slaydlar, referat va kurs ishlari yaratish siz uchun bepul!
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
              <User className="h-3.5 w-3.5 text-blue-500" />
              <span>Ism va familiyangiz (F.I.Sh):</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Azizov Bekzod"
              className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Mail className="h-3.5 w-3.5 text-blue-500" />
              <span>Login yoki Email:</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="talaba@edu.uz yoki bekzod"
              className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Building2 className="h-3.5 w-3.5 text-blue-500" />
              <span>Universitet / Institut (OTM):</span>
            </label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="O'zbekiston Milliy Universiteti"
              className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Maqomingiz:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex items-center justify-center gap-2 rounded-2xl py-2.5 px-3 text-xs font-bold border transition-all ${
                  role === 'student'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <span>🎓 Talaba</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex items-center justify-center gap-2 rounded-2xl py-2.5 px-3 text-xs font-bold border transition-all ${
                  role === 'teacher'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <span>👨‍🏫 O'qituvchi / Tadqiqotchi</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
          >
            <span>{currentUser.fullName ? 'Saqlash' : 'Kirish va Boshlash'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { X, Mail, User, GraduationCap, Building2, Crown, Receipt, RotateCcw, CheckCircle } from 'lucide-react';
import { UserAccount } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onSaveUser: (updatedUser: Partial<UserAccount>) => void;
  onResetTestLimit?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
  onResetTestLimit,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing'>('profile');
  const [email, setEmail] = useState(currentUser.email || '');
  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [university, setUniversity] = useState(currentUser.university || "O'zbekiston Milliy Universiteti");
  const [role, setRole] = useState<'student' | 'teacher'>(currentUser.role || 'student');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      email: email || 'talaba@edu.uz',
      fullName: fullName || 'Talaba',
      university,
      role,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-5">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            👤 Profil & Ma'lumotlar
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition-all ${
              activeTab === 'billing'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            💳 Obuna & To'lovlar
          </button>
        </div>

        {activeTab === 'profile' ? (
          <div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Foydalanuvchi Profili
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Titul varaqlarida avtomatik chiqadigan ma'lumotlar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Familiya, Ism, Sharif
                </label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                  <User className="h-4 w-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Karimov Anvar Ilhom o'g'li"
                    className="w-full bg-transparent text-sm text-slate-900 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Elektron pochta (Email)
                </label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                  <Mail className="h-4 w-4 text-slate-400 mr-2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="talaba@edu.uz"
                    className="w-full bg-transparent text-sm text-slate-900 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Oliy Ta'lim Muassasasi
                </label>
                <div className="mt-1 flex items-center rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                  <Building2 className="h-4 w-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="O'zbekiston Milliy Universiteti"
                    className="w-full bg-transparent text-sm text-slate-900 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`rounded-xl py-2 px-3 text-xs font-semibold border ${
                    role === 'student'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  🎓 Talaba
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`rounded-xl py-2 px-3 text-xs font-semibold border ${
                    role === 'teacher'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  👨‍🏫 O'qituvchi
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.99]"
              >
                Saqlash
              </button>
            </form>
          </div>
        ) : (
          /* BILLING & SUBSCRIPTION TAB */
          <div className="space-y-4">
            <div className="rounded-2xl border p-4 bg-slate-50 dark:bg-slate-800/40 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Obuna Holati:</span>
                {currentUser.isSubscribed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    <Crown className="h-3.5 w-3.5 fill-current" />
                    <span>PRO Faol</span>
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    Bepul Rejim
                  </span>
                )}
              </div>

              <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p>
                  <strong>Bepul limit:</strong> {currentUser.freeGenerationsLeft} ta hujjat qoldi
                </p>
                <p>
                  <strong>Jami generatsiya qilingan:</strong> {currentUser.totalGenerated} ta
                </p>
                {currentUser.subscriptionExpiresAt && (
                  <p className="text-emerald-600 font-semibold">
                    <strong>Amal qilish muddati:</strong> {new Date(currentUser.subscriptionExpiresAt).toLocaleDateString('uz-UZ')} gacha
                  </p>
                )}
              </div>
            </div>

            {/* Payment history */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                To'lov Cheklari Tarixi:
              </h4>
              {(!currentUser.paymentHistory || currentUser.paymentHistory.length === 0) ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                  Hozircha to'lov amalga oshirilmagan
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {currentUser.paymentHistory.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-slate-800">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white uppercase">{tx.receiptNumber} • {tx.provider}</p>
                        <p className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleString('uz-UZ')}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600">{tx.amount.toLocaleString()} UZS</span>
                        <div className="flex items-center gap-0.5 text-[10px] text-emerald-600">
                          <CheckCircle className="h-3 w-3" />
                          <span>To'langan</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Test Limit Reset Button */}
            {onResetTestLimit && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    onResetTestLimit();
                    alert("Test rejimi tiklandi: 1 ta bepul generatsiya imkoniyati qaytarildi!");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-200"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Test limitini qayta boshlash (1-bepul imkoniyatni qaytarish)</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

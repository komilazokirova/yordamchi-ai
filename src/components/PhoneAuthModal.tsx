'use client';

import React, { useState, useEffect } from 'react';
import { X, Smartphone, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw, Sparkles, User, AlertCircle } from 'lucide-react';
import { UserAccount } from '@/types';

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: Partial<UserAccount>) => void;
  currentPhone?: string;
}

export const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  currentPhone = '',
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phone, setPhone] = useState(currentPhone || '+998 ');
  const [fullName, setFullName] = useState('');
  const [code, setCode] = useState('');
  const [testCodeHint, setTestCodeHint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [verifiedUserData, setVerifiedUserData] = useState<any>(null);

  // Format phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 ' + val.replace(/\D/g, '');
    }
    setPhone(val);
    setErrorMessage(null);
  };

  // Timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  // 1. Send SMS Code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, fullName }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'SMS kod yuborishda xatolik yuz berdi');
      }

      setTestCodeHint(data.testCode || '123456');
      setStep('otp');
      setCountdown(60);
    } catch (err: any) {
      setErrorMessage(err.message || 'Xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify SMS Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, fullName }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Tasdiqlash kodi noto\'g\'ri');
      }

      setVerifiedUserData(data.user);
      setStep('success');
      onSuccessLogin(data.user);

      // 1.8 soniyadan keyin oynani avtomatik yopish
      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Tasdiqlashda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('phone');
    setCode('');
    setErrorMessage(null);
    setTestCodeHint(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ================= STEP 1: ENTER PHONE NUMBER ================= */}
        {step === 'phone' && (
          <div>
            <div className="text-center pt-2 mb-6">
              <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25">
                <Smartphone className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Telefon orqali kirish
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                1 ta bepul sinov va tayyor ishlar aynan sizning telefon raqamingizga biriktiriladi.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-blue-500" />
                  <span>Telefon raqamingiz (+998):</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+998 90 123 45 67"
                  className="w-full rounded-2xl border border-slate-300 bg-white p-3.5 text-base font-bold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono tracking-wider"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <User className="h-3.5 w-3.5 text-blue-500" />
                  <span>Ism va familiyangiz (ixtiyoriy):</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Azizov Bekzod"
                  className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="rounded-2xl bg-blue-50/70 p-3.5 text-xs text-blue-900 dark:bg-blue-950/30 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40">
                <span className="font-bold">🔒 Xavfsiz tizim:</span> Har bir talaba raqamiga serverda aniq 1 ta bepul yaratish imkoniyati beriladi.
              </div>

              <button
                type="submit"
                disabled={isLoading || phone.replace(/\D/g, '').length < 9}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>SMS kod yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <span>SMS kodni olish</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 2: ENTER SMS OTP ================= */}
        {step === 'otp' && (
          <div>
            <div className="text-center pt-2 mb-6">
              <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                SMS kodni kiriting
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">{phone}</span> raqamiga yuborilgan 6 xonali tasdiqlash kodini kiriting.
              </p>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="mt-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                Raqamni o'zgartirish
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {testCodeHint && (
              <div className="mb-4 flex items-center justify-between rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Test kodi: <strong className="font-mono text-sm tracking-widest">{testCodeHint}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setCode(testCodeHint)}
                  className="rounded-lg bg-amber-500 text-slate-950 px-2 py-0.5 font-black text-[11px] hover:bg-amber-400"
                >
                  Nusxalash
                </button>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center rounded-2xl border-2 border-blue-500/50 bg-slate-50 p-4 text-2xl font-black tracking-[0.5em] text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-blue-500/40 dark:bg-slate-800 dark:text-white font-mono"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                {countdown > 0 ? (
                  <span>Kodni qayta yuborish: <strong>{countdown} soniya</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="font-bold text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Kodni qayta yuborish</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || code.length < 6}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Tekshirilmoqda...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Tasdiqlash va Kirish</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 3: SUCCESS STATE ================= */}
        {step === 'success' && verifiedUserData && (
          <div className="text-center py-6 animate-in zoom-in-95 duration-200">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Xush kelibsiz!
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
              {verifiedUserData.fullName || 'Talaba'} ({verifiedUserData.phone})
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              {verifiedUserData.isSubscribed ? (
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  ⭐ PRO Obuna faol — Cheksiz generatsiya huquqiga egasiz!
                </div>
              ) : verifiedUserData.freeGenerationsLeft > 0 ? (
                <div className="text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Siz uchun 1 ta bepul taqdimot yoki referat tayyorlash faol!</span>
                </div>
              ) : (
                <div className="text-rose-600 dark:text-rose-400 font-bold text-xs">
                  🔒 1 ta bepul limitingiz yakunlangan. Cheksiz foydalanish uchun obuna bo'ling.
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className="mt-6 w-full rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700"
            >
              Platformaga o'tish
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

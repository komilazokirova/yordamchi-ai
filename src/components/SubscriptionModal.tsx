'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  Crown,
  CreditCard,
  ShieldCheck,
  Zap,
  Smartphone,
  QrCode,
  FileCheck,
  AlertCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentTransaction } from '@/types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubscribe: (transaction: PaymentTransaction) => void;
  isExpiredLimit?: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccessSubscribe,
  isExpiredLimit = false,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'click' | 'payme' | 'card'>('click');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [cardNumber, setCardNumber] = useState('8600 5304 1234 5678');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  
  // Simulation steps: 'input' -> 'sms_verify' -> 'success_receipt'
  const [paymentStep, setPaymentStep] = useState<'input' | 'sms_verify' | 'success_receipt'>('input');
  const [smsCode, setSmsCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<PaymentTransaction | null>(null);

  if (!isOpen) return null;

  // Step 1: Start Payment -> Request SMS
  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('sms_verify');
      setSmsCode('');
    }, 800);
  };

  // Step 2: Confirm SMS Code -> Success
  const handleConfirmSms = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const receipt: PaymentTransaction = {
        id: `tx-${Date.now()}`,
        amount: 15000,
        provider: selectedMethod,
        date: new Date().toISOString(),
        status: 'success',
        receiptNumber: `YAI-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setGeneratedReceipt(receipt);
      setPaymentStep('success_receipt');

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (err) {}

      onSuccessSubscribe(receipt);
    }, 1000);
  };

  const handleFinish = () => {
    setPaymentStep('input');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        
        {/* Close Button */}
        <button
          onClick={handleFinish}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ================= STEP 1: SELECT METHOD & ENTER DATA ================= */}
        {paymentStep === 'input' && (
          <div>
            <div className="text-center pt-2">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
                <Crown className="h-8 w-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 mb-1">
                <span>TEST / DEMO TO'LOV REJIMI</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Yordamchi AI PRO Obunasi
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {isExpiredLimit
                  ? "Sizning birinchi bepul limitingiz yakunlandi. Cheksiz foydalanish uchun oylik obunani faollashtiring."
                  : "Barcha OTM topshiriqlari va Canva prezentatsiyalar uchun 30 kunlik cheksiz kirish."}
              </p>
            </div>

            {/* Price Box */}
            <div className="my-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/30 p-4 border border-amber-200/80 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-900/50">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">15 000</span>
                  <span className="ml-1 text-base font-bold text-amber-600 dark:text-amber-400">so'm</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400"> / 1 oy</span>
                </div>
                <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  Talabalar uchun maxsus
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Cheksiz Prezentatsiyalar, Rejalar va Canva shablonlari</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Cheksiz Kurs ishlari, Referatlar va Mustaqil ishlar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>PowerPoint (.pptx) va Word (.docx) formatda to'liq yuklab olish</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                To'lov tizimini tanlang:
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('click')}
                  className={`flex flex-col items-center justify-center rounded-2xl p-3 border transition-all ${
                    selectedMethod === 'click'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50'
                  }`}
                >
                  <span className="text-lg font-black text-blue-600">CLICK</span>
                  <span className="text-[10px] text-slate-500">Click Up / Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('payme')}
                  className={`flex flex-col items-center justify-center rounded-2xl p-3 border transition-all ${
                    selectedMethod === 'payme'
                      ? 'border-teal-600 bg-teal-50 text-teal-700 dark:border-teal-500 dark:bg-teal-950/40 dark:text-teal-300 ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50'
                  }`}
                >
                  <span className="text-lg font-black text-teal-600">PAYME</span>
                  <span className="text-[10px] text-slate-500">Payme Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`flex flex-col items-center justify-center rounded-2xl p-3 border transition-all ${
                    selectedMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50'
                  }`}
                >
                  <span className="text-lg font-black text-indigo-600">UZCARD</span>
                  <span className="text-[10px] text-slate-500">Humo / Uzcard</span>
                </button>
              </div>
            </div>

            {/* Input Details */}
            <form onSubmit={handleStartPayment} className="mt-4 space-y-3">
              {selectedMethod === 'click' && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 mb-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Click orqali to'lov (Telefon raqam):</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <p className="mt-2 text-[11px] text-slate-500">
                    💡 Click ilovasiga to'lov so'rovi va SMS tasdiqlash kodi yuboriladi.
                  </p>
                </div>
              )}

              {selectedMethod === 'payme' && (
                <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 dark:border-teal-900/50 dark:bg-teal-950/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-300 mb-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Payme orqali to'lov:</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <p className="mt-2 text-[11px] text-slate-500">
                    💡 Payme Business billing orqali elektron chek shakllanadi.
                  </p>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Karta raqami (Uzcard / Humo)</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="8600 0000 0000 0000"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1/2">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Muddati (OO/YY)</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Telefon</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {isProcessing ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    <span>15 000 so'm to'lovni boshlash</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Test to'lov simulyatori • Xavfsiz rejim</span>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SIMULATED SMS CONFIRMATION ================= */}
        {paymentStep === 'sms_verify' && (
          <div className="pt-2 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Smartphone className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              SMS Tasdiqlash Kodi
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{phone}</span> raqamingizga test tasdiqlash kodi yuborildi.
            </p>

            <div className="my-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-left dark:bg-amber-950/30 dark:border-amber-900/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <AlertCircle className="h-4 w-4" />
                <span>Test kodi:</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Istalgan 4 xonali kod kiriting yoki quyidagi tugmani bosing:
              </p>
              <button
                type="button"
                onClick={() => setSmsCode('7777')}
                className="mt-2 inline-flex items-center gap-1 rounded-lg bg-amber-200/80 px-2.5 py-1 text-xs font-bold text-amber-900 hover:bg-amber-300 dark:bg-amber-900 dark:text-amber-100"
              >
                Kodni kiritish: 7777
              </button>
            </div>

            <form onSubmit={handleConfirmSms} className="space-y-4">
              <input
                type="text"
                autoFocus
                required
                maxLength={6}
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                placeholder="Kod (masalan: 7777)"
                className="w-full text-center tracking-widest text-2xl font-bold rounded-xl border border-slate-300 p-3 text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentStep('input')}
                  className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                >
                  Ortga
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !smsCode}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <span>Tasdiqlash va Obunani yoqish</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 3: OFFICIAL ELECTRONIC FISCAL RECEIPT ================= */}
        {paymentStep === 'success_receipt' && generatedReceipt && (
          <div className="pt-2 text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FileCheck className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              To'lov muvaffaqiyatli qabul qilindi!
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Sizda 30 kunlik "Yordamchi AI PRO" obunasi to'liq faollashtirildi.
            </p>

            {/* Uzbek Fiscal Receipt Card */}
            <div className="my-5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/80 p-5 text-left font-mono text-xs dark:border-slate-700 dark:bg-slate-800/40">
              <div className="text-center border-b border-dashed border-slate-300 pb-3 dark:border-slate-700">
                <p className="font-bold text-sm text-slate-900 dark:text-white">"YORDAMCHI AI" MCHJ</p>
                <p className="text-[11px] text-slate-500">Elektron Fiskal Chek</p>
                <p className="text-[10px] text-slate-400">Toshkent sh., Oliy Ta'lim Hub</p>
              </div>

              <div className="py-3 space-y-1.5 border-b border-dashed border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Chek raqami:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{generatedReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>To'lov tizimi:</span>
                  <span className="font-bold uppercase text-blue-600">{generatedReceipt.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span>Xizmat:</span>
                  <span>1 oylik PRO obuna</span>
                </div>
                <div className="flex justify-between">
                  <span>Amal qilish muddati:</span>
                  <span className="text-emerald-600 font-bold">30 kun (cheksiz)</span>
                </div>
                <div className="flex justify-between">
                  <span>Sana va vaqt:</span>
                  <span>{new Date(generatedReceipt.date).toLocaleString('uz-UZ')}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-between items-baseline font-bold text-sm text-slate-900 dark:text-white">
                <span>JAMI TO'LANDI:</span>
                <span className="text-emerald-600 text-base">15 000 UZS</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99]"
            >
              Ishni davom ettirish (Tayyor)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

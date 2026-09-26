'use client';

import React, { useState, useEffect } from 'react';
import { DocType, Language } from '@/types';
import {
  Presentation,
  BookOpen,
  FileCheck2,
  FileText,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Crown,
  CheckCircle2,
  Sliders,
  Layers,
  Lock
} from 'lucide-react';

interface CreateWizardProps {
  onGenerateOutlines: (params: {
    topic: string;
    docType: DocType;
    language: Language;
    university: string;
    faculty: string;
    authorName: string;
    supervisorName: string;
    targetCount: number;
  }) => void;
  isLoading: boolean;
  defaultUniversity?: string;
  defaultAuthor?: string;
  isSubscribed: boolean;
  freeGenerationsLeft: number;
  onOpenSubscribe: () => void;
}

export const CreateWizard: React.FC<CreateWizardProps> = ({
  onGenerateOutlines,
  isLoading,
  defaultUniversity = "O'zbekiston Milliy Universiteti",
  defaultAuthor = "Talaba",
  isSubscribed,
  freeGenerationsLeft,
  onOpenSubscribe,
}) => {
  const [topic, setTopic] = useState('');
  const [docType, setDocType] = useState<DocType>('presentation');
  const [targetCount, setTargetCount] = useState<number>(10);
  const [language, setLanguage] = useState<Language>('uz');
  const [university, setUniversity] = useState(defaultUniversity);
  const [faculty, setFaculty] = useState('Axborot texnologiyalari');
  const [authorName, setAuthorName] = useState(defaultAuthor);
  const [supervisorName, setSupervisorName] = useState('Dotsent A. Rahimov');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update default targetCount when docType changes
  useEffect(() => {
    if (docType === 'presentation') {
      setTargetCount(10);
    } else if (docType === 'coursework') {
      setTargetCount(20);
    } else if (docType === 'referat') {
      setTargetCount(10);
    } else {
      setTargetCount(10);
    }
  }, [docType]);

  const sampleTopics = [
    "O'zbekistonda raqamli iqtisodiyotni rivojlantirish istiqbollari",
    "Sun'iy intellekt texnologiyalarining ta'lim jarayoniga tatbiqi",
    "Zamonaviy bank tizimida moliyaviy xavflarni boshqarish",
    "Yashil energetika va qayta tiklanuvchi energiya manbalari",
    "Kiberxavfsizlik asoslari va axborot himoyasi tamoyillari"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (!isSubscribed && freeGenerationsLeft <= 0) {
      onOpenSubscribe();
      return;
    }

    onGenerateOutlines({
      topic: topic.trim(),
      docType,
      language,
      university,
      faculty,
      authorName,
      supervisorName,
      targetCount,
    });
  };

  const docTypesConfig = [
    {
      id: 'presentation' as DocType,
      title: 'Taqdimot (Prezentatsiya)',
      desc: 'Canva uslubida fonlar, rasmlar va PowerPoint (.pptx) yuklab olish',
      icon: Presentation,
      badge: 'Canva & PPTX',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300',
    },
    {
      id: 'coursework' as DocType,
      title: 'Kurs Ishi',
      desc: 'Titul, mundarija, 2-3 bob, xulosa, adabiyotlar va Word (.docx)',
      icon: BookOpen,
      badge: 'OTM Standarti',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      id: 'independent' as DocType,
      title: 'Mustaqil Ish',
      desc: 'Rejalar asosida chuqur ilmiy tahliliy matn va Word (.docx)',
      icon: FileCheck2,
      badge: 'A4 Word',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    {
      id: 'referat' as DocType,
      title: 'Referat',
      desc: 'Kirish, asosiy qismlar, xulosalar, manbalar va Word (.docx)',
      icon: FileText,
      badge: 'Tezkor',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
    },
  ];

  const presentationCountPresets = [5, 8, 10, 12, 15, 20];
  const courseworkCountPresets = [15, 20, 25, 30, 35];
  const textDocCountPresets = [5, 8, 10, 15, 20];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      
      {/* Banner: Free Trial, Paid Mode Alert, or Active Pro */}
      {isSubscribed ? (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-4 text-white shadow-lg shadow-emerald-500/20 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Crown className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Sizda Yordamchi AI PRO faol — Cheksiz generatsiya!
              </h3>
              <p className="text-xs text-white/80">
                Barcha turdagi ilmiy ishlar va Canva prezentatsiyalari ochiq.
              </p>
            </div>
          </div>
        </div>
      ) : freeGenerationsLeft <= 0 ? (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 p-4 text-white shadow-lg shadow-orange-500/20 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-rose-400/30">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Lock className="h-6 w-6 text-amber-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-200 mb-1">
                <span>🔒 Pullik Rejim Faollashdi</span>
              </div>
              <h3 className="text-base font-bold">
                1 ta bepul limitingiz tugadi (1/1 ishlatildi)!
              </h3>
              <p className="text-xs text-white/90">
                Keyingi barcha prezentatsiyalar, kurs ishlari va referatlarni yaratish uchun oylik obunani (15 000 so'm) faollashtiring.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSubscribe}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md hover:bg-amber-300 active:scale-95 transition-all"
          >
            <Crown className="h-4 w-4" />
            <span>Obuna: 15 000 so'm/oy</span>
          </button>
        </div>
      ) : (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-4 text-white shadow-lg shadow-indigo-500/20 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Sparkles className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                1-hujjat (10 bet yoki 10 slayd) siz uchun mutlaqo BEPUL!
              </h3>
              <p className="text-xs text-white/80">
                Dastlabki 1 ta prezentatsiya yoki referatingizni bepul sinab ko'ring.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSubscribe}
            className="shrink-0 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-300 active:scale-95"
          >
            Obuna: 15 000 so'm/oy
          </button>
        </div>
      )}

      {/* Main Creation Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: Document Type Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              1. Hujjat turini tanlang:
            </label>
            <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
              {docTypesConfig.map((item) => {
                const Icon = item.icon;
                const isSelected = docType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDocType(item.id)}
                    className={`group relative flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 dark:border-blue-500 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${isSelected ? 'text-blue-900 dark:text-blue-200' : 'text-slate-900 dark:text-white'}`}>
                          {item.title}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Choose Count (Slaydlar yoki Betlar soni) - FOYDALANUVCHI TALABI */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 p-4 dark:border-slate-800 dark:from-slate-800/60 dark:to-slate-900/60">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                <Sliders className="h-4 w-4 text-blue-600" />
                <span>
                  {docType === 'presentation'
                    ? "2. Slaydlar sonini tanlang:"
                    : "2. Hujjat hajmini (betlar sonini) tanlang:"}
                </span>
              </label>
              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white shadow-sm">
                {targetCount} {docType === 'presentation' ? 'ta slayd' : 'bet'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              {docType === 'presentation'
                ? "Taqdimotingiz aynan tanlangan miqdordagi slaydlar va rejalardan iborat qilib yaratiladi:"
                : "Kurs ishi yoki referatingiz belgilangan sahifa hajmiga mos chuqurlikda yoziladi:"}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {(docType === 'presentation'
                ? presentationCountPresets
                : docType === 'coursework'
                ? courseworkCountPresets
                : textDocCountPresets
              ).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setTargetCount(count)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    targetCount === count
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                  }`}
                >
                  {count} {docType === 'presentation' ? 'slayd' : 'bet'}
                </button>
              ))}

              {/* Custom Number Input */}
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-[11px] text-slate-500 font-medium">Boshqa hajm:</span>
                <input
                  type="number"
                  min={3}
                  max={60}
                  value={targetCount}
                  onChange={(e) => setTargetCount(Math.max(3, parseInt(e.target.value) || 3))}
                  className="w-16 rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-center text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Topic Input */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                3. Mavzuni kiriting:
              </label>
              <span className="text-[11px] text-slate-400">
                Aniq va to'liq yozing
              </span>
            </div>
            
            <div className="mt-2 relative">
              <textarea
                required
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Masalan: O'zbekistonda raqamli iqtisodiyotni rivojlantirish istiqbollari..."
                className="w-full rounded-2xl border border-slate-300 p-4 text-base font-medium text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
              />
            </div>

            {/* Quick sample topics */}
            <div className="mt-2.5">
              <span className="text-[11px] font-medium text-slate-400">Namunaviy mavzular:</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {sampleTopics.map((sTopic, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTopic(sTopic)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400"
                  >
                    {sTopic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced / Academic Details Toggle */}
          <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              <span>{showAdvanced ? "▲ Qo'shimcha parametrlarni yashirish" : "▼ Titul varag'i va OTM ma'lumotlarini sozlash"}</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Universitet / Institut</label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Fakultet</label>
                  <input
                    type="text"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Talaba F.I.Sh.</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Ilmiy Rahbar</label>
                  <input
                    type="text"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            {!isSubscribed && freeGenerationsLeft <= 0 ? (
              <button
                type="button"
                onClick={onOpenSubscribe}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 py-4 text-base font-extrabold text-white shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.01] hover:shadow-orange-500/35 active:scale-[0.99]"
              >
                <Lock className="h-5 w-5 text-amber-200" />
                <span>
                  🔒 Pullik rejim: Davom etish uchun obuna bo'ling (15 000 so'm / oy)
                </span>
                <ArrowRight className="h-5 w-5 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.01] hover:shadow-indigo-500/35 active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>AI rejalarni tuzmoqda...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>
                      {targetCount} {docType === 'presentation' ? 'ta slaydli' : 'betlik'} rejalarni tuzish
                    </span>
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </>
                )}
              </button>
            )}
          </div>

        </form>

      </div>

    </div>
  );
};

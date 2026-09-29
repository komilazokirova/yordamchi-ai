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
  Lock,
  Building,
  User,
  Award,
  ChevronDown,
  ChevronUp,
  Hash
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
  userPhone?: string;
  isSubscribed?: boolean;
  freeGenerationsLeft?: number;
  onOpenSubscribe?: () => void;
  onOpenAuth?: () => void;
  onResetTestLimit?: () => void;
}

export const CreateWizard: React.FC<CreateWizardProps> = ({
  onGenerateOutlines,
  isLoading,
  defaultUniversity = "O'zbekiston Milliy Universiteti",
  defaultAuthor = "Talaba",
  userPhone,
  isSubscribed,
  freeGenerationsLeft,
  onOpenSubscribe,
  onOpenAuth,
  onResetTestLimit,
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
      desc: 'Canva uslubida rang-barang slaydlar, rasmlar va PowerPoint (.pptx) yuklab olish',
      icon: Presentation,
      badge: 'Canva & PPTX',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 ring-1 ring-orange-500/20',
      iconBg: 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-orange-500/25',
    },
    {
      id: 'coursework' as DocType,
      title: 'Kurs Ishi',
      desc: 'Titul, mundarija, 2-3 bob, xulosa, adabiyotlar va Word (.docx) format',
      icon: BookOpen,
      badge: 'OTM Standarti',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 ring-1 ring-blue-500/20',
      iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/25',
    },
    {
      id: 'independent' as DocType,
      title: 'Mustaqil Ish',
      desc: 'Rejalar asosida chuqur ilmiy tahliliy matn, xulosalar va Word (.docx)',
      icon: FileCheck2,
      badge: 'A4 Word',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-500/20',
      iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-emerald-500/25',
    },
    {
      id: 'referat' as DocType,
      title: 'Referat',
      desc: 'Kirish, asosiy qismlar, xulosalar, manbalar va tayyor Word (.docx)',
      icon: FileText,
      badge: 'Tezkor',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 ring-1 ring-purple-500/20',
      iconBg: 'bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-purple-500/25',
    },
  ];

  const presentationCountPresets = [5, 8, 10, 12, 15, 20];
  const courseworkCountPresets = [15, 20, 25, 30, 35];
  const textDocCountPresets = [5, 8, 10, 15, 20];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      
      {/* Visual Step Progress Indicator */}
      <div className="mb-8 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-slate-100/80 p-1.5 ring-1 ring-slate-200/80 dark:bg-slate-900/80 dark:ring-slate-800">
          <div className="flex items-center gap-2 rounded-full bg-blue-600 px-3.5 py-1 text-xs font-bold text-white shadow-sm">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-blue-600">
              1
            </span>
            <span>Mavzu va Parametrlar</span>
          </div>
          <div className="h-0.5 w-4 bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              2
            </span>
            <span>Rejalar</span>
          </div>
          <div className="h-0.5 w-4 bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              3
            </span>
            <span>Natija</span>
          </div>
        </div>
      </div>

      {/* Hero Welcome Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-950/60 dark:text-blue-300 mb-2.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
          <span>OTM Standartlari Asosida Sun'iy Intellekt</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Akademik Ishlar va Canva Slaydlari Generatori
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Mavzuni kiriting — sun'iy intellekt rejalari, tahlillari, rasmlari va Word/PowerPoint faylini tayyorlab beradi.
        </p>
      </div>

      {/* 100% Free Platform Banner */}
      <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-xl shadow-indigo-500/20 ring-1 ring-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
            <Sparkles className="h-6 w-6 text-amber-300" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/25 ring-1 ring-emerald-300/40 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-200 mb-1">
              <span>🎁 100% MUTLAQO BEPUL VA CHEKSIZ</span>
            </div>
            <h3 className="text-base font-bold">
              Cheksiz Taqdimotlar, Kurs Ishlari va Referatlar!
            </h3>
            <p className="text-xs text-white/90">
              O'zbekiston talabalari va o'qituvchilari uchun barcha imkoniyatlar mutlaqo bepul.
            </p>
          </div>
        </div>

        <div className="shrink-0 text-center sm:text-right">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/30 ring-1 ring-emerald-400/50 px-4 py-2 text-xs font-black text-emerald-100 shadow-inner">
            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
            <span>Cheksiz Bepul Rejim</span>
          </span>
        </div>
      </div>

      {/* Main Creation Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 sm:p-8">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: Document Type Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[11px] font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">1</span>
                <span>Hujjat turini tanlang:</span>
              </label>
            </div>
            
            <div className="grid gap-3.5 sm:grid-cols-2">
              {docTypesConfig.map((item) => {
                const Icon = item.icon;
                const isSelected = docType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDocType(item.id)}
                    className={`group relative flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/35 ring-2 ring-blue-500/25 shadow-md shadow-blue-500/10'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-md transition-transform group-hover:scale-105 ${item.iconBg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-sm font-bold truncate ${isSelected ? 'text-blue-950 dark:text-blue-100' : 'text-slate-900 dark:text-white'}`}>
                          {item.title}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {item.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Choose Count (Slaydlar yoki Betlar soni) */}
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50/50 p-4 sm:p-5 dark:border-slate-800 dark:from-slate-800/70 dark:via-slate-900/60 dark:to-slate-900/40">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-black text-white">2</span>
                <Sliders className="h-3.5 w-3.5 text-blue-600" />
                <span>
                  {docType === 'presentation'
                    ? "Slaydlar sonini tanlang:"
                    : "Hujjat hajmini (betlar sonini) tanlang:"}
                </span>
              </label>
              
              <span className="rounded-full bg-blue-600 px-3.5 py-1 text-xs font-black text-white shadow-sm">
                {targetCount} {docType === 'presentation' ? 'ta slayd' : 'bet'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3.5">
              {docType === 'presentation'
                ? "Taqdimotingiz aynan tanlangan hajmga mos rejalardan va to'liq slaydlardan iborat qilinadi:"
                : "Kurs ishi yoki referatingiz belgilangan sahifa hajmiga mos ilmiy chuqurlikda yoziladi:"}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {(docType === 'presentation'
                ? presentationCountPresets
                : docType === 'coursework'
                ? courseworkCountPresets
                : textDocCountPresets
              ).map((count) => {
                const isCurrent = targetCount === count;
                const isRecommended = (docType === 'presentation' && count === 10) || (docType === 'coursework' && count === 20) || (docType === 'referat' && count === 10);
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTargetCount(count)}
                    className={`relative rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-blue-400/40'
                        : 'bg-white text-slate-700 border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{count} {docType === 'presentation' ? 'slayd' : 'bet'}</span>
                    {isRecommended && !isCurrent && (
                      <span className="ml-1 text-[9px] font-black text-blue-600 dark:text-blue-400">★</span>
                    )}
                  </button>
                );
              })}

              {/* Custom Number Input */}
              <div className="flex items-center gap-1.5 ml-auto pl-2">
                <span className="text-[11px] text-slate-500 font-medium">Boshqa:</span>
                <input
                  type="number"
                  min={3}
                  max={60}
                  value={targetCount}
                  onChange={(e) => setTargetCount(Math.max(3, parseInt(e.target.value) || 3))}
                  className="w-16 rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-center text-xs font-bold text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Topic Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[11px] font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">3</span>
                <span>Mavzuni kiriting:</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                To'liq va aniq yozing
              </span>
            </div>
            
            <div className="relative">
              <textarea
                required
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Masalan: O'zbekistonda raqamli iqtisodiyotni rivojlantirish istiqbollari..."
                className="w-full rounded-2xl border border-slate-300 p-4 text-sm sm:text-base font-medium text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none placeholder:text-slate-400"
              />
              <div className="absolute right-3.5 bottom-3.5 text-slate-300 dark:text-slate-600 pointer-events-none">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            {/* Quick Sample Topics */}
            <div className="mt-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Namunaviy mavzular:
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {sampleTopics.map((sTopic, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTopic(sTopic)}
                    className="flex items-center gap-1 rounded-xl border border-slate-200/90 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-700 transition-all dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:text-blue-300"
                  >
                    <Hash className="h-3 w-3 text-slate-400" />
                    <span>{sTopic}</span>
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
              className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
            >
              {showAdvanced ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span>Qo'shimcha parametrlarni yashirish</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Titul varag'i va OTM ma'lumotlarini sozlash (Universitet, F.I.Sh...)</span>
                </>
              )}
            </button>

            {showAdvanced && (
              <div className="mt-4 grid gap-3.5 sm:grid-cols-2 rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Building className="h-3 w-3 text-blue-500" />
                    <span>Universitet / Institut</span>
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <GraduationCap className="h-3 w-3 text-blue-500" />
                    <span>Fakultet / Yo'nalish</span>
                  </label>
                  <input
                    type="text"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <User className="h-3 w-3 text-blue-500" />
                    <span>Talaba F.I.Sh.</span>
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Award className="h-3 w-3 text-blue-500" />
                    <span>Ilmiy Rahbar</span>
                  </label>
                  <input
                    type="text"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit / Proceed CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 py-4 text-base font-black text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.01] hover:shadow-indigo-500/35 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Sun'iy intellekt rejalarni tuzmoqda...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-amber-300" />
                  <span>
                    {targetCount} {docType === 'presentation' ? 'ta slaydli' : 'betlik'} rejalarni tuzish
                  </span>
                  <ArrowRight className="h-5 w-5 ml-1" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

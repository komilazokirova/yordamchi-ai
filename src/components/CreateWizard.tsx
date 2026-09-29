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
  const [density, setDensity] = useState<'compact' | 'balanced' | 'detailed'>('balanced');
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
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      
      {/* Gamma-Style Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80 p-6 sm:p-10 text-white border border-slate-800 shadow-2xl mb-8">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/20 px-3.5 py-1 text-xs font-bold text-blue-300 mb-4 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
            <span>G'oyalarni taqdim etishning yangi vositasi • 100% Bepul</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-none text-white">
            G'oyalaringizni bir zumda <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">taqdimotga</span> aylantiring
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Gamma uslubidagi sun'iy intellekt orqali taqdimot slaydlarini, kurs ishlari va referatlarni noldan bir necha soniyada tayyorlang.
          </p>
        </div>

        {/* Gamma Formats Segmented Selector */}
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2">
          {docTypesConfig.map((item) => {
            const Icon = item.icon;
            const isSelected = docType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setDocType(item.id)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/50 scale-105'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Gamma Universal Prompt Box */}
        <form onSubmit={handleSubmit} className="relative z-10 mt-6">
          <div className="rounded-3xl bg-slate-950/90 border border-slate-700/80 p-3 sm:p-4 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/25">
            <div className="relative">
              <textarea
                required
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Nima yaratmoqchisiz? Masalan: Sun'iy intellektning ta'lim tizimiga ta'siri va rivojlanish istiqbollari..."
                className="w-full bg-transparent p-2 text-sm sm:text-base font-medium text-white focus:outline-none resize-none placeholder:text-slate-500"
              />
            </div>

            {/* Quick Inspiration Topics */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 pb-3 border-b border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                Tavsiya:
              </span>
              {sampleTopics.slice(0, 4).map((sTopic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopic(sTopic)}
                  className="rounded-lg bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-800 hover:border-blue-400 hover:text-white transition-colors"
                >
                  {sTopic.slice(0, 32)}...
                </button>
              ))}
            </div>

            {/* Controls Bar: Count, Density, Submit */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Count selector */}
                <div className="flex items-center gap-1 rounded-xl bg-slate-900/90 border border-slate-800 p-1">
                  {(docType === 'presentation'
                    ? [5, 8, 10, 12, 15]
                    : [10, 15, 20, 25]
                  ).map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setTargetCount(count)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        targetCount === count
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {count} {docType === 'presentation' ? 'slayd' : 'bet'}
                    </button>
                  ))}
                </div>

                {/* Density selector for presentation */}
                {docType === 'presentation' && (
                  <div className="flex items-center gap-1 rounded-xl bg-slate-900/90 border border-slate-800 p-1">
                    {[
                      { id: 'compact', label: '⚡ Ixcham' },
                      { id: 'balanced', label: '⚖️ Standart' },
                      { id: 'detailed', label: '📚 Batafsil' },
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDensity(d.id as any)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          density === d.id
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>AI tuzmoqda...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Rejalarni tuzish</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Advanced Title / University Settings Dropdown */}
        <div className="relative z-10 mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-300 transition-colors"
          >
            <span>OTM va Titul ma'lumotlari (F.I.Sh, Universitet)</span>
            {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 text-left rounded-2xl bg-slate-950/80 p-4 border border-slate-800">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Universitet / Institut</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Fakultet / Yo'nalish</label>
                <input
                  type="text"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Talaba F.I.Sh.</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Ilmiy Rahbar</label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

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
  Home,
  Upload,
  Layers,
  Check,
  ChevronDown,
  ChevronUp,
  FileUp,
  Link as LinkIcon,
  X,
  HelpCircle,
  Compass,
  ArrowLeft
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

type WizardMode = 'hub' | 'generate' | 'paste' | 'templates' | 'import';

export const CreateWizard: React.FC<CreateWizardProps> = ({
  onGenerateOutlines,
  isLoading,
  defaultUniversity = "O'zbekiston Milliy Universiteti",
  defaultAuthor = "Talaba",
}) => {
  const [activeMode, setActiveMode] = useState<WizardMode>('hub');
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
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Paste text state
  const [pastedText, setPastedText] = useState('');

  // Import state
  const [importUrl, setImportUrl] = useState('');
  const [importedFileName, setImportedFileName] = useState('');

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
    "Kiberxavfsizlik asoslari va axborot himoyasi tamoyillari",
    "Tibbiyotda zamonaviy innovatsion diagnostika usullari"
  ];

  const readyTemplates = [
    {
      title: "Sun'iy Intellekt va Kiberxavfsizlik",
      category: "IT & Texnologiya",
      docType: 'presentation' as DocType,
      count: 10,
      desc: "Neyrotarmoqlar, ma'lumotlar xavfsizligi va kiberhimoya tamoyillari",
      icon: "🤖"
    },
    {
      title: "Biznes Reja va Startap Pitch Deck",
      category: "Menejment & Biznes",
      docType: 'presentation' as DocType,
      count: 10,
      desc: "Bozor tahlili, maqsadli auditoriya, daromad modeli va investitsiya",
      icon: "💼"
    },
    {
      title: "O'zbekistonda Raqamli Iqtisodiyot va Moliya",
      category: "Iqtisodiyot & Bank",
      docType: 'coursework' as DocType,
      count: 20,
      desc: "Fintech, elektron to'lovlar tizimi va bank tizimini transformatsiya qilish",
      icon: "📈"
    },
    {
      title: "Tibbiyotda Zamonaviy Diagnostika Texnologiyalari",
      category: "Tibbiyot & Salomatlik",
      docType: 'presentation' as DocType,
      count: 10,
      desc: "MRT, KT, genetik tahlillar va innovatsion davolash usullari",
      icon: "🩺"
    },
    {
      title: "Pedagogikada Interaktiv Ta'lim Usullari",
      category: "Pedagogika & Ta'lim",
      docType: 'referat' as DocType,
      count: 10,
      desc: "Zamonaviy dars ishlanmalari, keys-stadi va talaba faolligini oshirish",
      icon: "🎓"
    },
    {
      title: "Yashil Energetika va Ekologik Barqarorlik",
      category: "Ekologiya & Energetika",
      docType: 'presentation' as DocType,
      count: 12,
      desc: "Quyosh va shamol energiyasi, uglerod neytralligi va istiqbollar",
      icon: "🌿"
    }
  ];

  const handleSelectTemplate = (tmpl: typeof readyTemplates[0]) => {
    setTopic(tmpl.title);
    setDocType(tmpl.docType);
    setTargetCount(tmpl.count);
    onGenerateOutlines({
      topic: tmpl.title,
      docType: tmpl.docType,
      language,
      university,
      faculty,
      authorName,
      supervisorName,
      targetCount: tmpl.count,
    });
  };

  const handleGenerateSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    // First line or first sentence as topic
    const firstLine = pastedText.split('\n')[0].slice(0, 80).trim();
    const finalTopic = firstLine || "Matn asosida tayyorlangan ilmiy ish";

    setTopic(finalTopic);
    onGenerateOutlines({
      topic: finalTopic,
      docType,
      language,
      university,
      faculty,
      authorName,
      supervisorName,
      targetCount,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportedFileName(file.name);
    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setTopic(cleanName);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setPastedText(text.slice(0, 5000));
      }
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = topic.trim() || importedFileName.replace(/\.[^/.]+$/, "") || importUrl.trim() || "Import qilingan mavzu";
    
    onGenerateOutlines({
      topic: finalTopic,
      docType,
      language,
      university,
      faculty,
      authorName,
      supervisorName,
      targetCount,
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-[#e0e7ff]/35 via-[#f8fafc] to-[#f1f5f9] px-4 py-6 sm:px-8 relative text-slate-800 transition-colors">
      
      {/* Top Left Navigation Pill: [ 🏠 Uy ] */}
      <div className="mx-auto max-w-6xl flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setActiveMode('hub')}
          className="flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/95 px-4 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all hover:scale-105 active:scale-95"
        >
          <Home className="h-3.5 w-3.5 text-slate-600" />
          <span>Uy</span>
        </button>

        {activeMode !== 'hub' && (
          <button
            type="button"
            onClick={() => setActiveMode('hub')}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Usullarga qaytish</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. GAMMA HUB SCREEN (EXACTLY MATCHING THE USER'S SCREENSHOT) */}
      {/* ========================================================= */}
      {activeMode === 'hub' && (
        <div className="mx-auto max-w-6xl pt-2 pb-16">
          
          {/* Centered Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-5xl font-black text-[#1e293b] tracking-tight">
              AI bilan yarating
            </h1>
            <p className="mt-2 text-base sm:text-lg text-slate-600 font-medium">
              Qanday boshlashni xohlaysiz?
            </p>
          </div>

          {/* 4 Cards Grid with Peeking Cat Mascot */}
          <div className="relative">
            
            {/* Mascot: Black Cat waving paw with glowing eyes & speech bubble */}
            <div className="absolute -top-16 left-4 sm:left-6 z-20 flex flex-col items-start pointer-events-none select-none">
              {/* Speech Bubble */}
              <div className="relative rounded-2xl bg-white px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-xl border border-slate-200/90 mb-1">
                <span>Ishonchi komil emas? Bu yerdan boshlang!</span>
                {/* Triangular speech bubble tail */}
                <div className="absolute -bottom-2 left-6 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
              </div>

              {/* Peeking Black Cat SVG */}
              <div className="relative -mb-2 ml-4">
                <svg viewBox="0 0 100 85" className="w-20 h-20 fill-slate-900 drop-shadow-lg">
                  {/* Body */}
                  <ellipse cx="50" cy="80" rx="32" ry="24" fill="#09090b" />
                  {/* Head */}
                  <ellipse cx="50" cy="46" rx="26" ry="22" fill="#09090b" />
                  {/* Left Ear */}
                  <polygon points="26,38 20,10 40,28" fill="#09090b" />
                  <polygon points="28,34 24,16 38,28" fill="#27272a" />
                  {/* Right Ear */}
                  <polygon points="74,38 80,10 60,28" fill="#09090b" />
                  <polygon points="72,34 76,16 62,28" fill="#27272a" />
                  {/* Glowing Yellow-Green Eyes */}
                  <ellipse cx="40" cy="44" rx="6" ry="7" fill="#84cc16" />
                  <ellipse cx="60" cy="44" rx="6" ry="7" fill="#84cc16" />
                  {/* Pupils */}
                  <ellipse cx="41" cy="44" rx="2.8" ry="5.5" fill="#09090b" />
                  <ellipse cx="59" cy="44" rx="2.8" ry="5.5" fill="#09090b" />
                  {/* Eye Highlights */}
                  <circle cx="43" cy="41" r="1.5" fill="#ffffff" />
                  <circle cx="61" cy="41" r="1.5" fill="#ffffff" />
                  {/* Cute Nose */}
                  <polygon points="48,52 52,52 50,54" fill="#fda4af" />
                  {/* Waving Paw on the right */}
                  <ellipse cx="80" cy="24" rx="7" ry="11" fill="#09090b" transform="rotate(25 80 24)" />
                  <circle cx="81" cy="18" r="3.5" fill="#27272a" />
                </svg>
              </div>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* CARD 1: YARATISH (RECOMMENDED) */}
              <div
                onClick={() => setActiveMode('generate')}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left"
              >
                <div>
                  {/* Miniature window top bar */}
                  <div className="rounded-t-lg bg-slate-300 h-1.5 w-16 mx-auto mb-1.5 opacity-80" />
                  
                  {/* Illustration 1: Desert dunes, stars, glowing moon */}
                  <div className="h-28 w-full rounded-2xl overflow-hidden shadow-inner border border-black/5 relative group-hover:scale-[1.02] transition-transform duration-300">
                    <svg viewBox="0 0 240 140" className="w-full h-full object-cover">
                      <defs>
                        <linearGradient id="c1-sky" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="60%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#f472b6" />
                        </linearGradient>
                        <linearGradient id="c1-dune1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#fb7185" />
                          <stop offset="100%" stopColor="#fda4af" />
                        </linearGradient>
                        <linearGradient id="c1-dune2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      <rect width="240" height="140" fill="url(#c1-sky)" />
                      {/* Glowing Moon / Orb */}
                      <circle cx="198" cy="35" r="16" fill="#a3e635" opacity="0.95" />
                      {/* White Sparkles */}
                      <path d="M120 40 L122 50 L132 52 L122 54 L120 64 L118 54 L108 52 L118 50 Z" fill="#ffffff" />
                      <circle cx="102" cy="62" r="2.5" fill="#ffffff" />
                      <circle cx="140" cy="44" r="2" fill="#ffffff" />
                      {/* Dunes */}
                      <path d="M0 88 Q 60 68 120 92 T 240 82 L 240 140 L 0 140 Z" fill="url(#c1-dune1)" />
                      <path d="M0 102 Q 80 82 160 108 T 240 98 L 240 140 L 0 140 Z" fill="url(#c1-dune2)" />
                    </svg>
                  </div>

                  <h3 className="mt-4 text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    Yaratish
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-medium">
                    Bir necha soniya ichida bir qatorli taklifdan yarating
                  </p>
                </div>

                <div className="mt-4">
                  <span className="inline-flex items-center gap-1 rounded-md bg-fuchsia-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-fuchsia-700 border border-fuchsia-200/80">
                    ★ TAVSIYA ETILGAN
                  </span>
                </div>
              </div>

              {/* CARD 2: MATNGA JOYLASHTIRISH */}
              <div
                onClick={() => setActiveMode('paste')}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left"
              >
                <div>
                  <div className="rounded-t-lg bg-slate-300 h-1.5 w-16 mx-auto mb-1.5 opacity-80" />
                  
                  {/* Illustration 2: Night starry sky, mountains, bold "Aa" */}
                  <div className="h-28 w-full rounded-2xl overflow-hidden shadow-inner border border-black/5 relative group-hover:scale-[1.02] transition-transform duration-300">
                    <svg viewBox="0 0 240 140" className="w-full h-full object-cover">
                      <defs>
                        <linearGradient id="c2-sky" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#090d16" />
                          <stop offset="100%" stopColor="#1e1b4b" />
                        </linearGradient>
                        <linearGradient id="c2-mount1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#312e81" />
                          <stop offset="100%" stopColor="#4338ca" />
                        </linearGradient>
                        <linearGradient id="c2-mount2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>
                      </defs>
                      <rect width="240" height="140" fill="url(#c2-sky)" />
                      {/* Stars */}
                      <circle cx="30" cy="25" r="1.2" fill="#fff" opacity="0.8" />
                      <circle cx="70" cy="15" r="1.8" fill="#fff" opacity="0.9" />
                      <circle cx="170" cy="30" r="1.2" fill="#fff" opacity="0.7" />
                      <circle cx="210" cy="20" r="1.8" fill="#fff" opacity="0.9" />
                      <circle cx="120" cy="18" r="1.2" fill="#fff" opacity="0.6" />
                      {/* Mountains */}
                      <polygon points="0,140 40,75 110,140" fill="url(#c2-mount1)" />
                      <polygon points="130,140 190,65 240,140" fill="url(#c2-mount2)" />
                      <polygon points="70,140 140,85 200,140" fill="#4f46e5" opacity="0.8" />
                      {/* Big Bold White Typography "Aa" */}
                      <text x="120" y="85" textAnchor="middle" fill="#ffffff" fontSize="48" fontWeight="800" fontFamily="sans-serif">
                        Aa
                      </text>
                    </svg>
                  </div>

                  <h3 className="mt-4 text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    Matnga joylashtirish
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-medium">
                    Eslatmalar, kontur yoki mavjud kontentdan yarating
                  </p>
                </div>
              </div>

              {/* CARD 3: SHABLONDAN YARATING */}
              <div
                onClick={() => setActiveMode('templates')}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left"
              >
                <div>
                  <div className="rounded-t-lg bg-slate-300 h-1.5 w-16 mx-auto mb-1.5 opacity-80" />
                  
                  {/* Illustration 3: Wavy layered hills, 3D stacked planes */}
                  <div className="h-28 w-full rounded-2xl overflow-hidden shadow-inner border border-black/5 relative group-hover:scale-[1.02] transition-transform duration-300">
                    <svg viewBox="0 0 240 140" className="w-full h-full object-cover">
                      <defs>
                        <linearGradient id="c3-sky" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#93c5fd" />
                        </linearGradient>
                      </defs>
                      <rect width="240" height="140" fill="url(#c3-sky)" />
                      {/* Wavy landscape layers */}
                      <path d="M0 65 Q 60 45 120 70 T 240 60 L 240 140 L 0 140 Z" fill="#22c55e" />
                      <path d="M0 80 Q 80 60 160 85 T 240 75 L 240 140 L 0 140 Z" fill="#ec4899" />
                      <path d="M0 95 Q 70 80 150 100 T 240 90 L 240 140 L 0 140 Z" fill="#fb923c" />
                      {/* 3D Stacked Layers Icon in Center */}
                      <g transform="translate(100, 36)">
                        <polygon points="20,0 40,10 20,20 0,10" fill="#ffffff" />
                        <polygon points="20,8 40,18 20,28 0,18" fill="#f8fafc" opacity="0.9" />
                        <polygon points="20,16 40,26 20,36 0,26" fill="#f1f5f9" opacity="0.8" />
                      </g>
                    </svg>
                  </div>

                  <h3 className="mt-4 text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    Shablondan yarating
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-medium">
                    Shablondan tuzilma yoki maketlardan foydalanib yarating
                  </p>
                </div>
              </div>

              {/* CARD 4: FAYL YOKI URLNI IMPORT QILING */}
              <div
                onClick={() => setActiveMode('import')}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left"
              >
                <div>
                  <div className="rounded-t-lg bg-slate-300 h-1.5 w-16 mx-auto mb-1.5 opacity-80" />
                  
                  {/* Illustration 4: Clouds, meadow, folder with arrow */}
                  <div className="h-28 w-full rounded-2xl overflow-hidden shadow-inner border border-black/5 relative group-hover:scale-[1.02] transition-transform duration-300">
                    <svg viewBox="0 0 240 140" className="w-full h-full object-cover">
                      <defs>
                        <linearGradient id="c4-sky" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="70%" stopColor="#bae6fd" />
                          <stop offset="100%" stopColor="#fbcfe8" />
                        </linearGradient>
                      </defs>
                      <rect width="240" height="140" fill="url(#c4-sky)" />
                      {/* Clouds */}
                      <circle cx="40" cy="45" r="22" fill="#ffffff" opacity="0.85" />
                      <circle cx="65" cy="40" r="28" fill="#ffffff" opacity="0.85" />
                      <circle cx="90" cy="48" r="20" fill="#ffffff" opacity="0.85" />
                      <circle cx="190" cy="40" r="24" fill="#ffffff" opacity="0.85" />
                      <circle cx="215" cy="46" r="20" fill="#ffffff" opacity="0.85" />
                      {/* Green Meadow */}
                      <path d="M0 100 Q 120 75 240 100 L 240 140 L 0 140 Z" fill="#22c55e" />
                      {/* Folder with Arrow Icon */}
                      <g transform="translate(100, 36)">
                        <rect x="0" y="4" width="40" height="30" rx="6" fill="#ffffff" />
                        <circle cx="20" cy="19" r="9" fill="#2563eb" />
                        <path d="M20 14 L16 18 M20 14 L24 18 M20 14 L20 23" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    </svg>
                  </div>

                  <h3 className="mt-4 text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    Fayl yoki URLni import qiling
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-medium">
                    Mavjud hujjatlar, taqdimotlar yoki veb-sahifalarni yaxshilang
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MODE: GENERATE (PROMPT BAR VIEW) */}
      {/* ========================================================= */}
      {activeMode === 'generate' && (
        <div className="mx-auto max-w-4xl pt-4 pb-16 animate-in fade-in duration-300">
          
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-xl border border-slate-200">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-2 border border-blue-200">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Bir necha soniyada yarating</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Nima yaratmoqchisiz?
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Mavzuingizni kiriting va sun'iy intellekt to'liq taqdimot yoki hujjatni shakllantirib beradi.
              </p>
            </div>

            {/* Format Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {[
                { id: 'presentation' as DocType, label: 'Prezentatsiya (Slaydlar)', icon: Presentation },
                { id: 'coursework' as DocType, label: 'Kurs Ishi (Word)', icon: BookOpen },
                { id: 'referat' as DocType, label: 'Referat (A4)', icon: FileText },
                { id: 'independent' as DocType, label: 'Mustaqil Ish', icon: FileCheck2 },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = docType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDocType(item.id)}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Prompt Form */}
            <form onSubmit={handleGenerateSubmit} className="space-y-4">
              <div className="rounded-2xl border-2 border-slate-200 p-3 sm:p-4 focus-within:border-blue-500 transition-colors bg-slate-50/50">
                <textarea
                  required
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Masalan: Sun'iy intellektning tibbiyotdagi o'rni va kelajak istiqbollari..."
                  className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-800 focus:outline-none resize-none placeholder:text-slate-400"
                />

                {/* Inspiration Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/80 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                    G'oyalar:
                  </span>
                  {sampleTopics.map((sTopic, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTopic(sTopic)}
                      className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      {sTopic.slice(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls: Target Count & Density */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Slayd / Bet soni */}
                  <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
                    {(docType === 'presentation'
                      ? [5, 8, 10, 12, 15]
                      : [10, 15, 20, 25]
                    ).map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setTargetCount(cnt)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          targetCount === cnt
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {cnt} {docType === 'presentation' ? 'slayd' : 'bet'}
                      </button>
                    ))}
                  </div>

                  {/* Density (Zichlik) */}
                  {docType === 'presentation' && (
                    <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
                      {[
                        { id: 'compact', label: '⚡ Ixcham' },
                        { id: 'balanced', label: '⚖️ Standart' },
                        { id: 'detailed', label: '📚 Batafsil' },
                      ].map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setDensity(d.id as any)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            density === d.id
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
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
                  className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
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

              {/* Title / Student Info Dropdown */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <span>OTM va Titul ma'lumotlari (F.I.Sh, Universitet)</span>
                  {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {showAdvanced && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 text-left rounded-2xl bg-slate-50 p-4 border border-slate-200">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500">Universitet / Institut</label>
                      <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500">Fakultet / Yo'nalish</label>
                      <input
                        type="text"
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500">Talaba F.I.Sh.</label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500">Ilmiy Rahbar</label>
                      <input
                        type="text"
                        value={supervisorName}
                        onChange={(e) => setSupervisorName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

            </form>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MODE: PASTE TEXT */}
      {/* ========================================================= */}
      {activeMode === 'paste' && (
        <div className="mx-auto max-w-4xl pt-4 pb-16 animate-in fade-in duration-300">
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-xl border border-slate-200">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 mb-2 border border-purple-200">
                <span>Matndan yaratish</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Matn yoki konturni joylashtiring
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Ma'ruza matni, maqola yoki mavjud eslatmalaringizni kiriting. AI uni tahlil qilib slaydlar tuzib beradi.
              </p>
            </div>

            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div className="rounded-2xl border-2 border-slate-200 p-4 focus-within:border-blue-500 transition-colors bg-slate-50/50">
                <textarea
                  required
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Ma'ruza matni, darslikdan parcha yoki tezislarni bu yerga joylashtiring (Ctrl+V)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500 font-medium">
                  {pastedText.length} ta belgi kiritildi
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !pastedText.trim()}
                  className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Matn asosida yaratish</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODE: TEMPLATES GALLERY */}
      {/* ========================================================= */}
      {activeMode === 'templates' && (
        <div className="mx-auto max-w-6xl pt-4 pb-16 animate-in fade-in duration-300">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Tayyor Shablondan boshlang
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              O'zingizga ma'qul soha va mavzuni tanlang — AI darhol to'liq taqdimotni shakllantiradi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {readyTemplates.map((tmpl, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectTemplate(tmpl)}
                className="group rounded-2xl bg-white p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-100 group-hover:scale-110 transition-transform">
                      {tmpl.icon}
                    </span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                      {tmpl.count} {tmpl.docType === 'presentation' ? 'slayd' : 'bet'}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    {tmpl.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>{tmpl.category}</span>
                  <span className="group-hover:translate-x-1 transition-transform">Tanlash →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODE: IMPORT FILE OR URL */}
      {/* ========================================================= */}
      {activeMode === 'import' && (
        <div className="mx-auto max-w-4xl pt-4 pb-16 animate-in fade-in duration-300">
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-xl border border-slate-200">
            <div className="text-center max-w-xl mx-auto mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Fayl yoki Veb-havolani import qiling
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Word (.docx), Matn (.txt) yoki veb-sahifa havolasidan foydalanib yangi taqdimot yarating.
              </p>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-6">
              {/* File upload drag-and-drop box */}
              <div className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 p-8 text-center bg-slate-50/50 transition-colors">
                <FileUp className="h-10 w-10 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">
                  Faylni shu yerga tashlang yoki tanlang
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Formatlar: .txt, .docx, .md
                </p>
                <label className="mt-4 inline-block cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-colors">
                  <span>Faylni tanlash</span>
                  <input
                    type="file"
                    accept=".txt,.md,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {importedFileName && (
                  <p className="mt-3 text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    <span>Yuklandi: {importedFileName}</span>
                  </p>
                )}
              </div>

              {/* URL Input */}
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-2">
                  <LinkIcon className="h-3.5 w-3.5 text-blue-500" />
                  <span>Yoki Veb-sahifa / Maqola havolasi (URL):</span>
                </label>
                <input
                  type="text"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://uz.wikipedia.org/wiki/... yoki maqola havolasi"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || (!importedFileName && !importUrl && !topic.trim())}
                  className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Import qilib yaratish</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Help Circle '?' in Bottom Right */}
      <button
        type="button"
        onClick={() => setShowHelpModal(true)}
        title="Yordam va Yo'riqnoma"
        className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-xl border border-slate-200 text-sm font-black hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all"
      >
        ?
      </button>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <span>Yordamchi AI Qo'llanma</span>
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>1. Yaratish:</strong> Birgina mavzu yoki g'oyani kiritasiz va sun'iy intellekt to'liq slaydlar yoki boblar matnini generatsiya qiladi.
              </p>
              <p>
                <strong>2. Matndan yaratish:</strong> Darslik, referat yoki konspektingizni kiritasiz, tizim uni professional prezentatsiyaga aylantiradi.
              </p>
              <p>
                <strong>3. PowerPoint (.pptx) va Word:</strong> Tayyor bo'lgan har qanday ishni 1 ta bosishda yuklab olishingiz mumkin.
              </p>
              <p>
                <strong>4. Mutlaqo Bepul:</strong> Sayt talabalar va o'qituvchilar uchun hech qanday to'lovsiz, erkin xizmat qiladi.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
              >
                Tushunarli
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { SlideData, SlideTheme, SlideLayoutType, StatItem, ColumnCardItem, TimelineStepItem } from '@/types';
import { SLIDE_THEMES, getTheme } from '@/lib/slide-themes';
import { exportPresentationToPptx } from '@/lib/export-pptx';
import { getPhotosForTopic, ACADEMIC_CATEGORIES } from '@/lib/topic-images';
import {
  Download,
  Play,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Palette,
  Layout,
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  Minimize2,
  Check,
  Edit3,
  Scissors,
  ArrowRight,
  MoveRight,
  BarChart3,
  Columns3,
  Clock,
  Quote,
  Split,
  ListOrdered,
  Layers
} from 'lucide-react';

interface PresentationStudioProps {
  topic: string;
  slides: SlideData[];
  selectedThemeId: string;
  onUpdateSlides: (slides: SlideData[]) => void;
  onSelectTheme: (themeId: string) => void;
  onBackToOutlines: () => void;
  onNewDocument?: () => void;
  authorName?: string;
  institution?: string;
}

export const PresentationStudio: React.FC<PresentationStudioProps> = ({
  topic,
  slides,
  selectedThemeId,
  onUpdateSlides,
  onSelectTheme,
  onBackToOutlines,
  onNewDocument,
  authorName,
  institution,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'themes' | 'layout' | 'image'>('themes');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('auto');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];
  const currentTheme = getTheme(selectedThemeId);

  // Fullscreen keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
          handleNextSlide();
        } else if (e.key === 'ArrowLeft') {
          handlePrevSlide();
        } else if (e.key === 'Escape') {
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentSlideIndex, slides.length]);

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  // Update slide property
  const updateCurrentSlide = (field: keyof SlideData, value: any) => {
    const updated = slides.map((s, idx) =>
      idx === currentSlideIndex ? { ...s, [field]: value } : s
    );
    onUpdateSlides(updated);
  };

  // Add bullet or auto-overflow to next slide if current slide is full
  const handleAddBullet = () => {
    const maxBullets = currentSlide.imageUrl ? 4 : 5;
    const currentBullets = currentSlide.bullets || [];

    // Agar slayd allaqachon to'lgan bo'lsa, ortiqcha ma'lumotni yangi davomiy betga ochish
    if (currentBullets.length >= maxBullets) {
      const baseTitle = currentSlide.title.replace(/\s*\((?:Davomi|\d+-qism)[^)]*\)/gi, '').trim();
      const nextTitle = `${baseTitle} (Davomi)`;

      const newContinuationSlide: SlideData = {
        id: `slide-${Date.now()}`,
        slideNumber: currentSlideIndex + 2,
        title: nextTitle,
        subtitle: currentSlide.subtitle ? `${currentSlide.subtitle} (davomi)` : "Mavzu yuzasidan qo'shimcha tahlil va xulosalar",
        bullets: ['Yangi qo\'shimcha fikr yoki ma\'lumot'],
        layout: currentSlide.layout,
        themeId: currentSlide.themeId,
        imageUrl: currentSlide.imageUrl,
        imageCaption: currentSlide.imageCaption,
        notes: currentSlide.notes ? `Ushbu slayd: ${nextTitle}` : undefined,
      };

      const updatedSlides = [
        ...slides.slice(0, currentSlideIndex + 1),
        newContinuationSlide,
        ...slides.slice(currentSlideIndex + 1),
      ].map((s, idx) => ({ ...s, slideNumber: idx + 1 }));

      onUpdateSlides(updatedSlides);
      setCurrentSlideIndex(currentSlideIndex + 1);
      showToast("Slayd to'ldi! Yangi ma'lumot keyingi slaydga (Davomi) o'tkazildi.");
    } else {
      const updatedBullets = [...currentBullets, 'Yangi asosiy fikr yoki ma\'lumot'];
      updateCurrentSlide('bullets', updatedBullets);
    }
  };

  // Update bullet with auto-split on multi-line text paste
  const handleUpdateBullet = (bIndex: number, text: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim().replace(/^[•\-\*0-9.]\s*/, '')).filter(Boolean);
    if (lines.length > 1) {
      const currentBullets = [...currentSlide.bullets];
      currentBullets.splice(bIndex, 1, ...lines);

      const maxBullets = currentSlide.imageUrl ? 4 : 5;
      if (currentBullets.length > maxBullets) {
        const keptBullets = currentBullets.slice(0, maxBullets);
        const overflowBullets = currentBullets.slice(maxBullets);

        const baseTitle = currentSlide.title.replace(/\s*\((?:Davomi|\d+-qism)[^)]*\)/gi, '').trim();
        const nextTitle = `${baseTitle} (Davomi)`;

        const newContinuationSlide: SlideData = {
          id: `slide-${Date.now()}`,
          slideNumber: currentSlideIndex + 2,
          title: nextTitle,
          subtitle: currentSlide.subtitle ? `${currentSlide.subtitle} (davomi)` : "Mavzu bo'yicha davomiy fikrlar",
          bullets: overflowBullets,
          layout: currentSlide.layout,
          themeId: currentSlide.themeId,
          imageUrl: currentSlide.imageUrl,
          imageCaption: currentSlide.imageCaption,
        };

        const updatedCurrent = { ...currentSlide, bullets: keptBullets };
        const updatedSlides = [
          ...slides.slice(0, currentSlideIndex),
          updatedCurrent,
          newContinuationSlide,
          ...slides.slice(currentSlideIndex + 1),
        ].map((s, idx) => ({ ...s, slideNumber: idx + 1 }));

        onUpdateSlides(updatedSlides);
        showToast("Ko'p ma'lumot kiritildi: ortiqchalari keyingi betga (Davomi) o'tkazildi!");
        return;
      } else {
        updateCurrentSlide('bullets', currentBullets);
        return;
      }
    }

    const updatedBullets = [...currentSlide.bullets];
    updatedBullets[bIndex] = text;
    updateCurrentSlide('bullets', updatedBullets);
  };

  // Slayddagi ma'lumotlarni 2 ta betga bo'lish
  const handleSplitSlide = (fromIndex?: number) => {
    const currentBullets = currentSlide.bullets || [];
    if (currentBullets.length <= 1) return;

    const splitIndex = fromIndex !== undefined ? fromIndex : Math.max(2, Math.floor(currentBullets.length / 2));
    const keptBullets = currentBullets.slice(0, splitIndex);
    const movedBullets = currentBullets.slice(splitIndex);

    if (movedBullets.length === 0) return;

    const baseTitle = currentSlide.title.replace(/\s*\((?:Davomi|\d+-qism)[^)]*\)/gi, '').trim();
    const nextTitle = `${baseTitle} (Davomi)`;

    const newContinuationSlide: SlideData = {
      id: `slide-${Date.now()}`,
      slideNumber: currentSlideIndex + 2,
      title: nextTitle,
      subtitle: currentSlide.subtitle ? `${currentSlide.subtitle} (davomi)` : "Mavzu bo'yicha davomiy tahlillar",
      bullets: movedBullets,
      layout: currentSlide.layout,
      themeId: currentSlide.themeId,
      imageUrl: currentSlide.imageUrl,
      imageCaption: currentSlide.imageCaption,
    };

    const updatedCurrentSlide = {
      ...currentSlide,
      bullets: keptBullets,
    };

    const updatedSlides = [
      ...slides.slice(0, currentSlideIndex),
      updatedCurrentSlide,
      newContinuationSlide,
      ...slides.slice(currentSlideIndex + 1),
    ].map((s, idx) => ({ ...s, slideNumber: idx + 1 }));

    onUpdateSlides(updatedSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
    showToast("Ma'lumotlar keyingi yangi slaydga muvaffaqiyatli bo'lindi!");
  };

  // Muayyan bitta fikrni keyingi slaydga o'tkazish
  const handleMoveBulletToNextSlide = (bIndex: number) => {
    const currentBullets = currentSlide.bullets || [];
    if (currentBullets.length <= 1) return;

    const bulletToMove = currentBullets[bIndex];
    const keptBullets = currentBullets.filter((_, i) => i !== bIndex);

    const nextSlide = slides[currentSlideIndex + 1];
    const isNextContinuation = nextSlide && (
      nextSlide.title.toLowerCase().includes(currentSlide.title.toLowerCase().slice(0, 15)) ||
      nextSlide.title.toLowerCase().includes('davomi')
    );

    if (isNextContinuation && nextSlide.bullets.length < 4) {
      const updatedNext = {
        ...nextSlide,
        bullets: [...nextSlide.bullets, bulletToMove],
      };
      const updatedCurrent = {
        ...currentSlide,
        bullets: keptBullets,
      };
      const updatedSlides = slides.map((s, idx) => {
        if (idx === currentSlideIndex) return updatedCurrent;
        if (idx === currentSlideIndex + 1) return updatedNext;
        return s;
      });
      onUpdateSlides(updatedSlides);
      showToast("Fikr keyingi slaydga o'tkazildi!");
    } else {
      const baseTitle = currentSlide.title.replace(/\s*\((?:Davomi|\d+-qism)[^)]*\)/gi, '').trim();
      const newContinuationSlide: SlideData = {
        id: `slide-${Date.now()}`,
        slideNumber: currentSlideIndex + 2,
        title: `${baseTitle} (Davomi)`,
        subtitle: currentSlide.subtitle || "Mavzuning keyingi qismi",
        bullets: [bulletToMove],
        layout: currentSlide.layout,
        themeId: currentSlide.themeId,
        imageUrl: currentSlide.imageUrl,
        imageCaption: currentSlide.imageCaption,
      };
      const updatedCurrent = { ...currentSlide, bullets: keptBullets };
      const updatedSlides = [
        ...slides.slice(0, currentSlideIndex),
        updatedCurrent,
        newContinuationSlide,
        ...slides.slice(currentSlideIndex + 1),
      ].map((s, idx) => ({ ...s, slideNumber: idx + 1 }));

      onUpdateSlides(updatedSlides);
      setCurrentSlideIndex(currentSlideIndex + 1);
      showToast("Fikr yangi keyingi slaydga o'tkazildi!");
    }
  };

  // Delete bullet
  const handleDeleteBullet = (bIndex: number) => {
    const updatedBullets = currentSlide.bullets.filter((_, i) => i !== bIndex);
    updateCurrentSlide('bullets', updatedBullets);
  };

  // Add new slide
  const handleAddNewSlide = () => {
    const newSlide: SlideData = {
      id: `slide-${Date.now()}`,
      slideNumber: slides.length + 1,
      title: 'Yangi Slayd Sarlavhasi',
      subtitle: 'Qisqacha ta\'rif yoki qo\'shimcha ma\'lumot',
      bullets: [
        'Ushbu slayd uchun birinchi asosiy fikr',
        'Tadqiqotning amaliy ahamiyati va tahlillar',
        'Xulosa va erishilgan natijalar'
      ],
      layout: 'split',
      themeId: selectedThemeId,
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    };
    const updated = [...slides, newSlide];
    onUpdateSlides(updated);
    setCurrentSlideIndex(updated.length - 1);
  };

  // Delete slide
  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    const updated = slides.filter((_, i) => i !== idx);
    onUpdateSlides(updated);
    if (currentSlideIndex >= updated.length) {
      setCurrentSlideIndex(updated.length - 1);
    }
  };

  // Export to PowerPoint
  const handleDownloadPptx = async () => {
    setIsExporting(true);
    try {
      await exportPresentationToPptx(
        topic,
        slides,
        currentTheme,
        authorName || "Talaba",
        institution || "O'zbekiston Milliy Universiteti"
      );
    } catch (err) {
      console.error("PPTX export error:", err);
      alert("PowerPoint eksportida xatolik yuz berdi. Iltimos qayta urining.");
    } finally {
      setIsExporting(false);
    }
  };

  // Apply custom image
  const handleSaveCustomImage = () => {
    if (customImageUrl.trim()) {
      updateCurrentSlide('imageUrl', customImageUrl.trim());
      setShowImageModal(false);
      setCustomImageUrl('');
    }
  };

  const modalPhotos = selectedCategoryKey === 'auto'
    ? getPhotosForTopic(topic + ' ' + (currentSlide?.title || ''))
    : (ACADEMIC_CATEGORIES[selectedCategoryKey]?.photos || []);

  // Gamma 1-Click Layout Switcher
  const handleSwitchLayout = (newLayout: SlideLayoutType) => {
    let updatedSlide: SlideData = { ...currentSlide, layout: newLayout };

    if (newLayout === 'stats' && (!updatedSlide.statsData || updatedSlide.statsData.length === 0)) {
      updatedSlide.statsData = [
        { value: '+38%', label: currentSlide.bullets[0]?.slice(0, 32) || "Samaradorlik o'sishi", change: "Prognoz" },
        { value: '2.5x', label: currentSlide.bullets[1]?.slice(0, 32) || "Jarayonlar tezlashuvi", change: "Raqamlashtirish" },
        { value: '92%', label: currentSlide.bullets[2]?.slice(0, 32) || "Qamrov va natijadorlik", change: "O'zbekistonda" }
      ];
    } else if (newLayout === 'columns' && (!updatedSlide.columnsData || updatedSlide.columnsData.length === 0)) {
      updatedSlide.columnsData = [
        {
          title: currentSlide.bullets[0]?.split('—')[0]?.slice(0, 22) || "Nazariy Asoslar",
          desc: currentSlide.bullets[0] || "Fundamental ilmiy tushunchalar va tamoyillar majmuasi",
          tag: "1-Yo'nalish"
        },
        {
          title: currentSlide.bullets[1]?.split('—')[0]?.slice(0, 22) || "Amaliy Vositalar",
          desc: currentSlide.bullets[1] || "Zamonaviy texnologiyalarni amaliyotga tatbiq etish mexanizmlari",
          tag: "2-Yo'nalish"
        },
        {
          title: currentSlide.bullets[2]?.split('—')[0]?.slice(0, 22) || "Monitoring & Natija",
          desc: currentSlide.bullets[2] || "Kutilgan natijalarga erishish va doimiy monitoring choralari",
          tag: "3-Yo'nalish"
        }
      ];
    } else if (newLayout === 'timeline' && (!updatedSlide.timelineSteps || updatedSlide.timelineSteps.length === 0)) {
      updatedSlide.timelineSteps = [
        {
          step: 1,
          title: currentSlide.bullets[0]?.split('—')[0]?.slice(0, 25) || "1-Bosqich: Diagnostika",
          desc: currentSlide.bullets[0] || "Mavjud holat va birlamchi ko'rsatkichlarni chuqur o'rganish",
          dateOrPhase: "Boshlang'ich faza"
        },
        {
          step: 2,
          title: currentSlide.bullets[1]?.split('—')[0]?.slice(0, 25) || "2-Bosqich: Implementatsiya",
          desc: currentSlide.bullets[1] || "Asosiy mexanizmlar va raqamli vositalarni joriy etish",
          dateOrPhase: "Amaliy faza"
        },
        {
          step: 3,
          title: currentSlide.bullets[2]?.split('—')[0]?.slice(0, 25) || "3-Bosqich: Baholash",
          desc: currentSlide.bullets[2] || "Erishilgan samaradorlikni tahlil qilish va optimallashtirish",
          dateOrPhase: "Yakuniy faza"
        }
      ];
    } else if (newLayout === 'split' && !updatedSlide.imageUrl) {
      updatedSlide.imageUrl = modalPhotos[0]?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
      updatedSlide.imageCaption = "Mavzuga oid illyustratsiya";
    } else if (newLayout === 'quote' && !updatedSlide.quoteAuthor) {
      updatedSlide.quoteAuthor = authorName || "Soha Mutaxassisi";
    }

    const updated = slides.map((s, idx) => (idx === currentSlideIndex ? updatedSlide : s));
    onUpdateSlides(updated);
    showToast(`Maket o'zgartirildi: ${newLayout.toUpperCase()}`);
  };

  const handleUpdateStat = (sIndex: number, field: keyof StatItem, val: string) => {
    const currentStats = currentSlide.statsData ? [...currentSlide.statsData] : [
      { value: '+38%', label: "Samaradorlik", change: "Prognoz" },
      { value: '2.5x', label: "Tezlashuv", change: "Raqamli" },
      { value: '92%', label: "Qamrov", change: "O'zbekistonda" }
    ];
    if (currentStats[sIndex]) {
      currentStats[sIndex] = { ...currentStats[sIndex], [field]: val };
      updateCurrentSlide('statsData', currentStats);
    }
  };

  const handleUpdateColumn = (cIndex: number, field: keyof ColumnCardItem, val: string) => {
    const currentCols = currentSlide.columnsData ? [...currentSlide.columnsData] : [
      { title: "Nazariya", desc: "Ta'rif", tag: "1-Yo'nalish" },
      { title: "Amaliyot", desc: "Ta'rif", tag: "2-Yo'nalish" },
      { title: "Natija", desc: "Ta'rif", tag: "3-Yo'nalish" }
    ];
    if (currentCols[cIndex]) {
      currentCols[cIndex] = { ...currentCols[cIndex], [field]: val };
      updateCurrentSlide('columnsData', currentCols);
    }
  };

  const handleUpdateTimelineStep = (tIndex: number, field: keyof TimelineStepItem, val: any) => {
    const currentSteps = currentSlide.timelineSteps ? [...currentSlide.timelineSteps] : [
      { step: 1, title: "1-Bosqich", desc: "Ta'rif", dateOrPhase: "1-Faza" },
      { step: 2, title: "2-Bosqich", desc: "Ta'rif", dateOrPhase: "2-Faza" },
      { step: 3, title: "3-Bosqich", desc: "Ta'rif", dateOrPhase: "3-Faza" }
    ];
    if (currentSteps[tIndex]) {
      currentSteps[tIndex] = { ...currentSteps[tIndex], [field]: val };
      updateCurrentSlide('timelineSteps', currentSteps);
    }
  };

  return (
    <div className={`relative flex flex-col bg-slate-900 text-white ${isFullscreen ? 'fixed inset-0 z-50 overflow-hidden' : 'min-h-[calc(100vh-64px)]'}`}>
      
      {/* Studio Header Bar */}
      {!isFullscreen && (
        <div className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToOutlines}
              className="text-xs text-slate-400 hover:text-white"
            >
              ← Rejalarga qaytish
            </button>
            <div className="h-4 w-px bg-slate-800" />
            <span className="max-w-xs sm:max-w-md truncate text-sm font-semibold text-slate-200">
              {topic}
            </span>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              {slides.length} ta slayd
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onNewDocument && (
              <button
                onClick={onNewDocument}
                className="flex items-center gap-1.5 rounded-2xl border border-blue-500/40 bg-blue-600/20 px-3.5 py-2 text-xs font-bold text-blue-300 hover:bg-blue-600/30 hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5 text-blue-400" />
                <span className="hidden sm:inline">+ Yangi yaratish</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-700 bg-slate-800/90 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current text-blue-400" />
              <span className="hidden sm:inline">Namoyish (Slayd-shou)</span>
            </button>

            <button
              onClick={handleDownloadPptx}
              disabled={isExporting}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-2 text-xs sm:text-sm font-black text-white shadow-lg shadow-orange-500/30 ring-1 ring-amber-300/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>PPTX tayyorlanmoqda...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>PowerPoint (.pptx) yuklab olish</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Body */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT: SLIDE THUMBNAILS (Canva style) */}
        {!isFullscreen && (
          <aside className="w-56 border-r border-slate-800 bg-slate-950/80 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Slaydlar ({slides.length})
              </span>
              <button
                onClick={handleAddNewSlide}
                className="flex items-center gap-1 rounded-lg bg-blue-600/80 px-2 py-1 text-[11px] font-semibold text-white hover:bg-blue-600"
              >
                <Plus className="h-3 w-3" />
                <span>Qo'shish</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`group relative cursor-pointer rounded-xl border p-2 transition-all ${
                    idx === currentSlideIndex
                      ? 'border-blue-500 bg-blue-950/30 ring-2 ring-blue-500/30 shadow-lg'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                    <span>{idx + 1}-slayd</span>
                    {slides.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(idx);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  {/* Miniature Thumbnail */}
                  <div className={`aspect-video w-full rounded-lg ${currentTheme.bgGradient} p-2 overflow-hidden flex flex-col justify-between shadow-inner`}>
                    <p className={`text-[8px] font-bold line-clamp-1 ${currentTheme.textColor}`}>
                      {slide.title || 'Sarlavha'}
                    </p>
                    <div className="space-y-0.5">
                      <div className="h-1 w-3/4 rounded bg-white/30" />
                      <div className="h-1 w-1/2 rounded bg-white/20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* CENTER: PRESENTATION CANVAS */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-900/90 overflow-auto">
          
          {/* Gamma 1-Click Layout Switcher Toolbar (Above slide) */}
          {!isFullscreen && (
            <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl bg-slate-950/90 p-1.5 border border-slate-800 shadow-2xl max-w-4xl w-full overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 px-2 shrink-0 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>Gamma Maket:</span>
                </span>
                {[
                  { id: 'split' as SlideLayoutType, label: 'Rasm + Matn', icon: Split },
                  { id: 'stats' as SlideLayoutType, label: 'Statistika (KPI)', icon: BarChart3 },
                  { id: 'columns' as SlideLayoutType, label: '3 Ustun', icon: Columns3 },
                  { id: 'timeline' as SlideLayoutType, label: 'Bosqichlar', icon: Clock },
                  { id: 'bullets' as SlideLayoutType, label: 'Tezislar', icon: ListOrdered },
                  { id: 'quote' as SlideLayoutType, label: 'Iqtibos', icon: Quote },
                  { id: 'title' as SlideLayoutType, label: 'Titul', icon: Layers },
                ].map((l) => {
                  const Icon = l.icon;
                  const isActive = currentSlide.layout === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => handleSwitchLayout(l.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all shrink-0 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      <span>{l.label}</span>
                    </button>
                  );
                })}
              </div>

              {currentSlide.layout === 'split' && (
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="flex items-center gap-1 rounded-xl bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white shrink-0 ml-2"
                >
                  <ImageIcon className="h-3 w-3 text-blue-400" />
                  <span>Rasmni almashtirish</span>
                </button>
              )}
            </div>
          )}

          {/* Slide Stage Container - Qat'iy bir xil 16:9 o'lcham */}
          <div className={`relative w-full flex items-center justify-center ${
            isFullscreen ? 'h-full p-4' : 'max-w-4xl h-[490px] aspect-[16/9]'
          }`}>
            {/* Floating Toast Notification */}
            {toastMessage && (
              <div className="absolute top-2 z-50 bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce">
                <Sparkles className="h-4 w-4 shrink-0 text-slate-950" />
                <span>{toastMessage}</span>
              </div>
            )}
            
            {/* 16:9 Canvas Slide (Hech qachon o'lchami o'zgarmaydi) */}
            <div
              className={`relative w-full h-full rounded-2xl ${currentTheme.bgGradient} shadow-2xl p-5 sm:p-8 flex flex-col justify-between overflow-hidden border border-white/10`}
            >
              
              {/* Slide Header: Institution / Category */}
              <div className="flex items-center justify-between text-xs font-semibold tracking-wider uppercase opacity-80 shrink-0">
                <span className={currentTheme.accentColor}>
                  {currentSlide.layout === 'title' ? (institution || "O'ZBEKISTON MILLIY UNIVERSITETI") : "YORDAMCHI AI TAQDIMOT"}
                </span>
                <span className={currentTheme.subtitleColor}>
                  {currentSlideIndex + 1} / {slides.length}
                </span>
              </div>

              {/* Slide Content Area */}
              <div className="my-auto flex-1 flex flex-col justify-center overflow-hidden py-1">
                {currentSlide.layout === 'title' ? (
                  // TITLE SLIDE LAYOUT
                  <div className="space-y-3 text-center my-auto">
                    <input
                      type="text"
                      value={currentSlide.title}
                      onChange={(e) => updateCurrentSlide('title', e.target.value)}
                      className={`w-full bg-transparent text-center text-2xl sm:text-3xl font-extrabold tracking-tight focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-2 ${currentTheme.textColor}`}
                      placeholder="Taqdimot Sarlavhasi"
                    />
                    <input
                      type="text"
                      value={currentSlide.subtitle || ''}
                      onChange={(e) => updateCurrentSlide('subtitle', e.target.value)}
                      className={`w-full bg-transparent text-center text-xs sm:text-base focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-2 ${currentTheme.subtitleColor}`}
                      placeholder="Kichik sarlavha yoki ma'ruzachi"
                    />

                    <div className="mt-6 inline-block rounded-2xl bg-black/20 backdrop-blur-md px-6 py-2.5 border border-white/10 text-xs">
                      <p className={currentTheme.accentColor}>Tayyorladi: {authorName || "Talaba"}</p>
                      <p className="opacity-70 mt-0.5">Toshkent – 2026</p>
                    </div>
                  </div>
                ) : currentSlide.layout === 'stats' ? (
                  // GAMMA STATS / KPI CARDS LAYOUT
                  <div className="h-full flex flex-col justify-between py-1">
                    <div className="shrink-0 mb-1">
                      <input
                        type="text"
                        value={currentSlide.title}
                        onChange={(e) => updateCurrentSlide('title', e.target.value)}
                        className={`w-full bg-transparent text-lg sm:text-2xl font-extrabold tracking-tight focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1 ${currentTheme.textColor}`}
                        placeholder="Slayd sarlavhasi"
                      />
                      <input
                        type="text"
                        value={currentSlide.subtitle || ''}
                        onChange={(e) => updateCurrentSlide('subtitle', e.target.value)}
                        className={`w-full bg-transparent text-xs mt-0.5 focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1 ${currentTheme.subtitleColor}`}
                        placeholder="Statistik tahlil va asosiy raqamlar"
                      />
                    </div>

                    {/* Key takeaway note */}
                    <div className="mb-2 rounded-xl bg-white/10 backdrop-blur-md px-3 py-1.5 border border-white/15 flex items-center gap-2">
                      <span className="text-amber-300 text-xs shrink-0 font-bold">💡 Asosiy xulosa:</span>
                      <input
                        type="text"
                        value={currentSlide.bullets[0] || "Sohada erishilgan asosiy ko'rsatkichlar va tahliliy natijalar"}
                        onChange={(e) => handleUpdateBullet(0, e.target.value)}
                        className={`flex-1 bg-transparent text-xs font-semibold focus:outline-none ${currentTheme.textColor}`}
                        placeholder="Asosiy fikr yoki xulosani yozing..."
                      />
                    </div>

                    {/* 3 KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 items-stretch max-h-[220px]">
                      {(currentSlide.statsData && currentSlide.statsData.length > 0
                        ? currentSlide.statsData
                        : [
                            { value: '+38%', label: "Samaradorlik o'sishi", change: "Prognoz" },
                            { value: '2.5x', label: "Jarayonlar tezlashuvi", change: "Raqamli" },
                            { value: '92%', label: "Qamrov va natijadorlik", change: "O'zbekistonda" }
                          ]
                      ).slice(0, 3).map((st, sIdx) => (
                        <div
                          key={sIdx}
                          className={`group relative rounded-2xl p-3 sm:p-4 flex flex-col justify-between items-center text-center transition-all hover:scale-[1.02] shadow-xl ${currentTheme.cardBg} border border-white/20`}
                        >
                          {st.change && (
                            <input
                              type="text"
                              value={st.change}
                              onChange={(e) => handleUpdateStat(sIdx, 'change', e.target.value)}
                              className="mb-1 text-[10px] font-black uppercase tracking-wider text-center bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 focus:outline-none text-white/90"
                            />
                          )}
                          <input
                            type="text"
                            value={st.value}
                            onChange={(e) => handleUpdateStat(sIdx, 'value', e.target.value)}
                            className={`w-full text-center text-2xl sm:text-4xl font-black bg-transparent tracking-tight focus:outline-none ${currentTheme.accentColor}`}
                          />
                          <div className="w-8 h-0.5 bg-white/20 my-1 rounded-full" />
                          <textarea
                            rows={2}
                            value={st.label}
                            onChange={(e) => handleUpdateStat(sIdx, 'label', e.target.value)}
                            className={`w-full text-center text-xs font-semibold bg-transparent resize-none focus:outline-none leading-snug ${currentTheme.textColor}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : currentSlide.layout === 'columns' ? (
                  // GAMMA 3-USTUNLI (COLUMNS) LAYOUT
                  <div className="h-full flex flex-col justify-between py-1">
                    <div className="shrink-0 mb-1">
                      <input
                        type="text"
                        value={currentSlide.title}
                        onChange={(e) => updateCurrentSlide('title', e.target.value)}
                        className={`w-full bg-transparent text-lg sm:text-2xl font-extrabold tracking-tight focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1 ${currentTheme.textColor}`}
                        placeholder="Slayd sarlavhasi"
                      />
                      <input
                        type="text"
                        value={currentSlide.subtitle || ''}
                        onChange={(e) => updateCurrentSlide('subtitle', e.target.value)}
                        className={`w-full bg-transparent text-xs mt-0.5 focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1 ${currentTheme.subtitleColor}`}
                        placeholder="Tizimli tasnif va asosiy yo'nalishlar"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 items-stretch max-h-[250px]">
                      {(currentSlide.columnsData && currentSlide.columnsData.length > 0
                        ? currentSlide.columnsData
                        : [
                            { title: "Nazariy Asoslar", desc: "Fundamental tamoyillar va ilmiy qarashlar tahlili", tag: "1-Yo'nalish" },
                            { title: "Amaliy Tatbiq", desc: "Sohaga raqamli texnologiyalarni tatbiq etish mexanizmlari", tag: "2-Yo'nalish" },
                            { title: "Kutilgan Natija", desc: "Samaradorlikni oshirish va barqaror rivojlanish", tag: "3-Yo'nalish" }
                          ]
                      ).slice(0, 3).map((col, cIdx) => (
                        <div
                          key={cIdx}
                          className={`group relative rounded-2xl p-3.5 flex flex-col justify-between transition-all hover:scale-[1.02] shadow-xl ${currentTheme.cardBg} border border-white/20`}
                        >
                          <div>
                            <input
                              type="text"
                              value={col.tag || `${cIdx + 1}-Yo'nalish`}
                              onChange={(e) => handleUpdateColumn(cIdx, 'tag', e.target.value)}
                              className={`text-[10px] font-black uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-lg border border-white/15 focus:outline-none ${currentTheme.accentColor}`}
                            />
                            <input
                              type="text"
                              value={col.title}
                              onChange={(e) => handleUpdateColumn(cIdx, 'title', e.target.value)}
                              className={`w-full mt-1.5 text-xs sm:text-sm font-extrabold bg-transparent focus:outline-none leading-tight ${currentTheme.textColor}`}
                            />
                            <div className="w-6 h-0.5 bg-white/20 my-1.5 rounded-full" />
                          </div>
                          <textarea
                            rows={3}
                            value={col.desc}
                            onChange={(e) => handleUpdateColumn(cIdx, 'desc', e.target.value)}
                            className={`w-full text-xs bg-transparent resize-none focus:outline-none leading-relaxed opacity-90 ${currentTheme.textColor}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : currentSlide.layout === 'timeline' ? (
                  // GAMMA TIMELINE / STEPS LAYOUT
                  <div className="h-full flex flex-col justify-between py-1">
                    <div className="shrink-0 mb-1">
                      <input
                        type="text"
                        value={currentSlide.title}
                        onChange={(e) => updateCurrentSlide('title', e.target.value)}
                        className={`w-full bg-transparent text-lg sm:text-2xl font-extrabold tracking-tight focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1 ${currentTheme.textColor}`}
                        placeholder="Slayd sarlavhasi"
                      />
                      <input
                        type="text"
                        value={currentSlide.subtitle || ''}
                        onChange={(e) => updateCurrentSlide('subtitle', e.target.value)}
                        className={`w-full bg-transparent text-xs mt-0.5 focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1 ${currentTheme.subtitleColor}`}
                        placeholder="Bosqichma-bosqich jarayon va rejalar"
                      />
                    </div>

                    <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 items-stretch max-h-[250px]">
                      {(currentSlide.timelineSteps && currentSlide.timelineSteps.length > 0
                        ? currentSlide.timelineSteps
                        : [
                            { step: 1, title: "1-Bosqich: Diagnostika", desc: "Mavjud ko'rsatkichlar va muammolarni chuqur o'rganish", dateOrPhase: "1-Faza" },
                            { step: 2, title: "2-Bosqich: Implementatsiya", desc: "Amaliy vositalar va raqamli mexanizmlarni joriy etish", dateOrPhase: "2-Faza" },
                            { step: 3, title: "3-Bosqich: Baholash", desc: "Erishilgan natijalar va samaradorlikni tahlil qilish", dateOrPhase: "3-Faza" }
                          ]
                      ).slice(0, 3).map((st, tIdx) => (
                        <div
                          key={tIdx}
                          className={`group relative rounded-2xl p-3.5 flex flex-col justify-between transition-all hover:scale-[1.02] shadow-xl ${currentTheme.cardBg} border border-white/20`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-black ring-1 ring-white/30 bg-white/10 ${currentTheme.accentColor}`}>
                                {st.step || tIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={st.dateOrPhase || `${tIdx + 1}-Faza`}
                                onChange={(e) => handleUpdateTimelineStep(tIdx, 'dateOrPhase', e.target.value)}
                                className="text-[10px] font-bold uppercase tracking-wider text-right bg-transparent focus:outline-none opacity-80"
                              />
                            </div>
                            <input
                              type="text"
                              value={st.title}
                              onChange={(e) => handleUpdateTimelineStep(tIdx, 'title', e.target.value)}
                              className={`w-full text-xs sm:text-sm font-extrabold bg-transparent focus:outline-none leading-tight ${currentTheme.textColor}`}
                            />
                            <div className="w-6 h-0.5 bg-white/20 my-1.5 rounded-full" />
                          </div>
                          <textarea
                            rows={3}
                            value={st.desc}
                            onChange={(e) => handleUpdateTimelineStep(tIdx, 'desc', e.target.value)}
                            className={`w-full text-xs bg-transparent resize-none focus:outline-none leading-relaxed opacity-90 ${currentTheme.textColor}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : currentSlide.layout === 'quote' ? (
                  // GAMMA QUOTE / SPOTLIGHT LAYOUT
                  <div className="h-full flex flex-col justify-between py-1">
                    <div className="shrink-0 mb-1">
                      <input
                        type="text"
                        value={currentSlide.title}
                        onChange={(e) => updateCurrentSlide('title', e.target.value)}
                        className={`w-full bg-transparent text-lg sm:text-2xl font-extrabold tracking-tight focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1 ${currentTheme.textColor}`}
                        placeholder="Slayd sarlavhasi"
                      />
                      <input
                        type="text"
                        value={currentSlide.subtitle || ''}
                        onChange={(e) => updateCurrentSlide('subtitle', e.target.value)}
                        className={`w-full bg-transparent text-xs mt-0.5 focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1 ${currentTheme.subtitleColor}`}
                        placeholder="Mavzuga oid muhim iqtibos yoki konseptual g'oya"
                      />
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl relative max-w-2xl mx-auto w-full">
                      <span className={`text-4xl sm:text-5xl font-serif font-black leading-none opacity-80 mb-1 ${currentTheme.accentColor}`}>“</span>
                      <textarea
                        rows={3}
                        value={currentSlide.bullets[0] || currentSlide.subtitle || currentSlide.title}
                        onChange={(e) => handleUpdateBullet(0, e.target.value)}
                        className={`w-full text-center text-base sm:text-lg font-serif italic bg-transparent resize-none focus:outline-none leading-relaxed ${currentTheme.textColor}`}
                        placeholder="Iqtibos matnini kiriting..."
                      />
                      <div className="w-12 h-0.5 bg-white/20 my-2 rounded-full" />
                      <input
                        type="text"
                        value={currentSlide.quoteAuthor || authorName || "Soha Mutaxassisi"}
                        onChange={(e) => updateCurrentSlide('quoteAuthor', e.target.value)}
                        className={`text-center text-xs font-bold bg-transparent focus:outline-none ${currentTheme.accentColor}`}
                        placeholder="Muallif yoki manba"
                      />
                    </div>
                  </div>
                ) : (
                  // BODY SLIDE LAYOUT (Split or Full)
                  <div className="h-full flex flex-col justify-between">
                    <div className="shrink-0 mb-2">
                      <input
                        type="text"
                        value={currentSlide.title}
                        onChange={(e) => updateCurrentSlide('title', e.target.value)}
                        className={`w-full bg-transparent text-lg sm:text-2xl font-extrabold tracking-tight focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1 ${currentTheme.textColor}`}
                        placeholder="Slayd sarlavhasi"
                      />
                      <input
                        type="text"
                        value={currentSlide.subtitle || ''}
                        onChange={(e) => updateCurrentSlide('subtitle', e.target.value)}
                        className={`w-full bg-transparent text-xs mt-0.5 focus:outline-none focus:ring-1 focus:ring-white/30 rounded px-1 ${currentTheme.subtitleColor}`}
                        placeholder="Qisqacha tavsif"
                      />
                    </div>

                    <div className={`grid gap-4 flex-1 items-center overflow-hidden ${currentSlide.imageUrl ? 'grid-cols-1 md:grid-cols-12' : 'grid-cols-1'}`}>
                      {/* Bullets List - 16:9 formatga mos, ortiqcha ma'lumotlar keyingi slaydga o'tadi */}
                      <div className={`overflow-hidden max-h-[330px] pr-1 ${currentSlide.imageUrl ? 'md:col-span-7 space-y-1.5' : ''}`}>
                        {/* Ko'p ma'lumot bo'lsa tezkor 2 ta slaydga bo'lish paneli */}
                        {currentSlide.bullets.length > (currentSlide.imageUrl ? 4 : 5) && !isFullscreen && (
                          <div className="mb-2 flex items-center justify-between rounded-xl bg-amber-500/25 border border-amber-400/50 px-3 py-1.5 text-xs text-amber-200 shrink-0">
                            <span className="flex items-center gap-1.5 font-bold text-[11px] sm:text-xs">
                              <Sparkles className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                              Fikrlar ko'p ({currentSlide.bullets.length} ta). Sig'may qolmasligi uchun:
                            </span>
                            <button
                              onClick={() => handleSplitSlide()}
                              className="flex items-center gap-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 px-2 py-0.5 text-[11px] font-black transition-all shadow-md active:scale-95"
                            >
                              <Scissors className="h-3 w-3" />
                              <span>2 ta slaydga bo'lish</span>
                            </button>
                          </div>
                        )}

                        <div className={
                          !currentSlide.imageUrl && (currentSlide.bullets.length > 3 || currentSlide.title.toLowerCase().includes('reja'))
                            ? 'grid grid-cols-1 sm:grid-cols-2 gap-2'
                            : (currentSlide.bullets.length > 4 ? 'space-y-1.5' : 'space-y-2')
                        }>
                          {currentSlide.bullets.map((bullet, bIdx) => {
                            const isRejaSlide = currentSlideIndex === 1 || currentSlide.title.toLowerCase().includes('reja') || currentSlide.title.toLowerCase().includes('mundarija');
                            const isCrowded = currentSlide.bullets.length > 4;
                            return (
                              <div
                                key={bIdx}
                                className={`group flex items-start gap-2 rounded-xl transition-all ${currentTheme.cardBg} ${isCrowded ? 'p-1.5' : 'p-2'}`}
                              >
                                <span className={`mt-0.5 flex shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                  isCrowded ? 'h-4 w-4 text-[10px]' : 'h-5 w-5'
                                } ${
                                  isRejaSlide
                                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                    : `${currentTheme.accentColor} bg-white/10`
                                }`}>
                                  {isRejaSlide ? `${bIdx + 1}` : '•'}
                                </span>
                                <textarea
                                  rows={isCrowded ? 1 : 2}
                                  value={bullet}
                                  onChange={(e) => handleUpdateBullet(bIdx, e.target.value)}
                                  className={`flex-1 resize-none bg-transparent leading-snug focus:outline-none ${currentTheme.textColor} ${
                                    isCrowded ? 'text-xs' : 'text-xs sm:text-[13px]'
                                  }`}
                                />
                                {!isFullscreen && (
                                  <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                                    {currentSlide.bullets.length > 1 && (
                                      <button
                                        onClick={() => handleMoveBulletToNextSlide(bIdx)}
                                        className="text-white/50 hover:text-amber-300 p-0.5 rounded"
                                        title="Ushbu fikrni keyingi slaydga ko'chirish"
                                      >
                                        <ArrowRight className="h-3 w-3" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteBullet(bIdx)}
                                      className="text-white/50 hover:text-red-400 p-0.5 rounded"
                                      title="O'chirish"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {!isFullscreen && (
                          <div className="mt-2.5 flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
                            <button
                              onClick={handleAddBullet}
                              className="flex items-center gap-1.5 text-[11px] font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-all"
                              title={currentSlide.bullets.length >= (currentSlide.imageUrl ? 4 : 5) ? "Ushbu slayd to'lgan, yangi fikr keyingi slaydga (Davomi) o'tadi" : "Fikr qo'shish"}
                            >
                              <Plus className="h-3 w-3" />
                              <span>
                                {currentSlide.bullets.length >= (currentSlide.imageUrl ? 4 : 5)
                                  ? "Keyingi betga yangi fikr qo'shish (Davomi)"
                                  : "Fikr (tezis) qo'shish"}
                              </span>
                            </button>

                            {currentSlide.bullets.length >= 3 && (
                              <button
                                onClick={() => handleSplitSlide()}
                                className="flex items-center gap-1.5 text-[11px] font-medium text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-2.5 py-1 rounded-lg transition-all"
                                title="Ushbu slayddagi ortiqcha ma'lumotlarni yangi slaydga bo'lish"
                              >
                                <Scissors className="h-3 w-3" />
                                <span>Keyingi betga bo'lish (Davomi)</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Visual Image Card (Canva style) */}
                      {currentSlide.imageUrl && (
                        <div className="md:col-span-5 relative h-full max-h-[260px] min-h-[160px] rounded-xl overflow-hidden border border-white/20 shadow-xl group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={currentSlide.imageUrl}
                            alt={currentSlide.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                            <span className="text-[10px] text-white/80 line-clamp-1">
                              {currentSlide.imageCaption || "Mavzuga oid illyustratsiya"}
                            </span>
                          </div>
                          {!isFullscreen && (
                            <button
                              onClick={() => setShowImageModal(true)}
                              className="absolute top-2 right-2 rounded-lg bg-black/60 backdrop-blur-sm p-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:bg-black/80"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>O'zgartirish</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Slide Footer */}
              <div className="flex items-center justify-between text-[11px] opacity-60 pt-2 border-t border-white/10">
                <span>Yordamchi AI Taqdimot Platformasi</span>
                <span>{topic}</span>
              </div>

            </div>

            {/* Navigation buttons overlay in Fullscreen */}
            {isFullscreen && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-2xl z-50">
                <button
                  disabled={currentSlideIndex === 0}
                  onClick={handlePrevSlide}
                  className="p-1 text-white hover:text-blue-400 disabled:opacity-30"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <span className="text-xs font-semibold text-white">
                  {currentSlideIndex + 1} / {slides.length}
                </span>
                <button
                  disabled={currentSlideIndex === slides.length - 1}
                  onClick={handleNextSlide}
                  className="p-1 text-white hover:text-blue-400 disabled:opacity-30"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="h-4 w-px bg-white/20 mx-1" />
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-1 text-white hover:text-amber-400"
                  title="Chiqish (Esc)"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
              </div>
            )}

          </div>

          {/* Slide Navigation in Normal Mode */}
          {!isFullscreen && (
            <div className="mt-4 flex items-center gap-4">
              <button
                disabled={currentSlideIndex === 0}
                onClick={handlePrevSlide}
                className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Oldingi</span>
              </button>
              <span className="text-xs text-slate-400 font-medium">
                {currentSlideIndex + 1} / {slides.length}
              </span>
              <button
                disabled={currentSlideIndex === slides.length - 1}
                onClick={handleNextSlide}
                className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-30"
              >
                <span>Keyingi</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Speaker Notes Drawer (Optional) */}
          {!isFullscreen && (
            <div className="mt-4 w-full max-w-4xl rounded-2xl bg-slate-950/70 border border-slate-800 p-3">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                🎙️ Ma'ruzachi uchun izoh (Spiker nutqi - slayd ekranda ko'ringanda nima gapirish kerak):
              </label>
              <textarea
                rows={2}
                value={currentSlide.notes || ''}
                onChange={(e) => updateCurrentSlide('notes', e.target.value)}
                placeholder="Spiker ushbu slaydda diqqatni quyidagi omillarga qaratishi lozim..."
                className="mt-1 w-full bg-transparent text-xs text-slate-300 focus:outline-none resize-none"
              />
            </div>
          )}

        </main>

        {/* RIGHT: THEMES & DESIGN TOOLS (Canva Style) */}
        {!isFullscreen && (
          <aside className="w-72 border-l border-slate-800 bg-slate-950/90 flex flex-col">
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveTab('themes')}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
                  activeTab === 'themes'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                🎨 Fon & Mavzular
              </button>
              <button
                onClick={() => setActiveTab('layout')}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all ${
                  activeTab === 'layout'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                📐 Joylashuv
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === 'themes' && (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-400">
                    Bir bosishda barcha slaydlarning fon dizaynini o'zgartiring:
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SLIDE_THEMES.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => onSelectTheme(th.id)}
                        className={`group relative overflow-hidden rounded-xl border p-2.5 text-left transition-all ${
                          th.id === selectedThemeId
                            ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-lg'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className={`h-12 w-full rounded-lg ${th.bgGradient} flex items-center justify-center p-1.5 shadow-inner`}>
                          <span className={`text-[10px] font-bold ${th.textColor} truncate`}>
                            {th.name}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-300">
                            {th.name}
                          </span>
                          {th.id === selectedThemeId && (
                            <Check className="h-3.5 w-3.5 text-blue-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'layout' && (
                <div className="space-y-2.5">
                  <p className="text-[11px] text-slate-400">
                    Joriy slayd uchun Gamma uslubidagi maketni tanlang:
                  </p>

                  <button
                    type="button"
                    onClick={() => handleSwitchLayout('split')}
                    className={`w-full rounded-xl border p-2.5 text-left transition-all ${
                      currentSlide.layout === 'split' ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500' : 'border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Split className="h-4 w-4 text-blue-400 shrink-0" />
                      <p className="text-xs font-bold text-white">1. Bo'lingan (Rasm + Matn)</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 pl-6">Chapda asosiy tezislar, o'ngda mavzuga oid rasm</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchLayout('stats')}
                    className={`w-full rounded-xl border p-2.5 text-left transition-all ${
                      currentSlide.layout === 'stats' ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500' : 'border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <p className="text-xs font-bold text-white">2. Statistika & KPI (3 Raqam)</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 pl-6">Katta raqamlar, o'sish ko'rsatkichlari va tahlil</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchLayout('columns')}
                    className={`w-full rounded-xl border p-2.5 text-left transition-all ${
                      currentSlide.layout === 'columns' ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500' : 'border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Columns3 className="h-4 w-4 text-cyan-400 shrink-0" />
                      <p className="text-xs font-bold text-white">3. 3 Ustunli Kartalar</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 pl-6">Tushunchalar, turlar yoki tamoyillarni yonma-yon solishtirish</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchLayout('timeline')}
                    className={`w-full rounded-xl border p-2.5 text-left transition-all ${
                      currentSlide.layout === 'timeline' ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500' : 'border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                      <p className="text-xs font-bold text-white">4. Bosqichlar (Timeline)</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 pl-6">1-2-3 tartibli rivojlanish bosqichlari va fazalari</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchLayout('quote')}
                    className={`w-full rounded-xl border p-2.5 text-left transition-all ${
                      currentSlide.layout === 'quote' ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500' : 'border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Quote className="h-4 w-4 text-purple-400 shrink-0" />
                      <p className="text-xs font-bold text-white">5. Dolzarb Iqtibos</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 pl-6">Markaziy katta iqtibos va uning muallifi</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchLayout('bullets')}
                    className={`w-full rounded-xl border p-2.5 text-left transition-all ${
                      currentSlide.layout === 'bullets' ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500' : 'border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ListOrdered className="h-4 w-4 text-slate-300 shrink-0" />
                      <p className="text-xs font-bold text-white">6. Kengaytirilgan Tezislar</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 pl-6">To'liq kenglikdagi tartibli fikrlar va tahlillar</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchLayout('title')}
                    className={`w-full rounded-xl border p-2.5 text-left transition-all ${
                      currentSlide.layout === 'title' ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500' : 'border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-rose-400 shrink-0" />
                      <p className="text-xs font-bold text-white">7. Titul Slayd</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 pl-6">Katta bosh sarlavha, ma'ruzachi va universitet</p>
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}

      </div>

      {/* Image Change Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 p-6 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🖼️ Mavzuga mos rasmni tanlang</span>
              </h3>
              <span className="text-xs text-blue-400 font-semibold bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-800/40">
                {topic.slice(0, 30)}
              </span>
            </div>
            
            <p className="text-xs text-slate-400 mb-3">
              Ushbu slayd uchun mavzuga oid yuqori aniqlikdagi rasmlardan birini tanlang:
            </p>

            {/* Academic Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategoryKey('auto')}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedCategoryKey === 'auto'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ✨ Mavzuga mos
              </button>
              {Object.entries(ACADEMIC_CATEGORIES).map(([catKey]) => (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setSelectedCategoryKey(catKey)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    selectedCategoryKey === catKey
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {catKey === 'it_programming' ? '💻 IT & Java' :
                   catKey === 'it_ai_cyber' ? '🤖 AI & Kiber' :
                   catKey === 'economics_finance' ? '📈 Moliya & Bank' :
                   catKey === 'business_management' ? '💼 Biznes' :
                   catKey === 'medicine_health' ? '🩺 Tibbiyot' :
                   catKey === 'law_jurisprudence' ? '⚖️ Huquq' :
                   catKey === 'history_uzbekistan' ? '🏛️ Tarix' :
                   catKey === 'pedagogy_education' ? '🎓 Ta\'lim' :
                   catKey === 'psychology' ? '🧠 Psixologiya' :
                   catKey === 'physics_astronomy' ? '🔭 Fizika' :
                   catKey === 'chemistry' ? '🧪 Kimyo' :
                   catKey === 'biology_ecology' ? '🌿 Biologiya' :
                   catKey === 'agriculture' ? '🌾 Qishloq xo\'jaligi' :
                   catKey === 'engineering_construction' ? '🏗️ Muhandislik' :
                   catKey === 'literature_language' ? '📚 Til & Adabiyot' :
                   catKey === 'sports' ? '⚽ Sport' : catKey}
                </button>
              ))}
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 max-h-[310px] overflow-y-auto pr-1">
              {modalPhotos.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    updateCurrentSlide('imageUrl', img.url);
                    updateCurrentSlide('imageCaption', img.caption);
                    setShowImageModal(false);
                    showToast("Slayd rasmi muvaffaqiyatli yangilandi!");
                  }}
                  className="group relative h-28 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 text-left transition-all hover:scale-[1.02] shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.caption} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-2 flex items-end">
                    <span className="text-[10px] font-semibold text-white leading-tight line-clamp-2">{img.caption}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom URL Input */}
            <div className="border-t border-slate-800 pt-3">
              <label className="text-xs text-slate-300 font-medium">Yoki o'zingizning rasm URL havolangiz:</label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... yoki rasm havolasi"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSaveCustomImage}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                >
                  Qo'llash
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs text-slate-300 hover:text-white transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

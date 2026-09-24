'use client';

import React, { useState } from 'react';
import { AcademicDocument, AcademicSection } from '@/types';
import { exportAcademicDocx } from '@/lib/export-docx';
import { expandSectionContent } from '@/lib/ai-service';
import {
  Download,
  Printer,
  Sparkles,
  BookOpen,
  FileText,
  Check,
  ChevronRight,
  User,
  Building,
  Calendar,
  Layers
} from 'lucide-react';

interface AcademicEditorProps {
  document: AcademicDocument;
  onUpdateDocument: (doc: AcademicDocument) => void;
  onBackToOutlines: () => void;
  userApiKey?: string;
  provider?: 'gemini' | 'openai';
}

export const AcademicEditor: React.FC<AcademicEditorProps> = ({
  document: doc,
  onUpdateDocument,
  onBackToOutlines,
  userApiKey,
  provider,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('intro');
  const [isExporting, setIsExporting] = useState(false);
  const [expandingSectionId, setExpandingSectionId] = useState<string | null>(null);

  const docTypeName = 
    doc.docType === 'coursework' ? 'Kurs Ishi' :
    doc.docType === 'referat' ? 'Referat' : 'Mustaqil Ish';

  const handleUpdateSectionContent = (id: string, newContent: string) => {
    const updatedSections = (doc.sections || []).map((sec) =>
      sec.id === id ? { ...sec, content: newContent } : sec
    );
    onUpdateDocument({ ...doc, sections: updatedSections });
  };

  const handleExpandSection = async (section: AcademicSection) => {
    setExpandingSectionId(section.id);
    try {
      const expanded = await expandSectionContent(
        doc.title,
        section.title,
        section.content,
        { apiKey: userApiKey, provider }
      );
      handleUpdateSectionContent(section.id, expanded);
    } catch (err) {
      console.error("Expand error:", err);
    } finally {
      setExpandingSectionId(null);
    }
  };

  const handleDownloadDocx = async () => {
    setIsExporting(true);
    try {
      await exportAcademicDocx(doc);
    } catch (err) {
      console.error("Word export error:", err);
      alert("Word faylini yaratishda xatolik yuz berdi.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100 dark:bg-slate-950 flex flex-col">
      
      {/* Top Toolbar */}
      <div className="sticky top-16 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToOutlines}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            ← Rejalarga qaytish
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
          <span className="max-w-xs truncate text-sm font-bold text-slate-800 dark:text-slate-100 sm:max-w-md">
            {doc.title}
          </span>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            {docTypeName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Chop etish / PDF</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] sm:text-sm"
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Word tayyorlanmoqda...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Word (.docx) yuklab olish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 p-4 sm:p-6 lg:p-8">
        
        {/* Navigation Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-36 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Mundarija bo'yicha o'tish
            </h3>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setActiveSectionId('title-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-left transition-all ${
                  activeSectionId === 'title-page' ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/40 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Titul varag'i</span>
              </button>

              <button
                onClick={() => {
                  setActiveSectionId('intro');
                  document.getElementById('sec-intro')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-left transition-all ${
                  activeSectionId === 'intro' ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/40 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>KIRISH</span>
              </button>

              {(doc.sections || []).map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    document.getElementById(`sec-${sec.id}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-left transition-all ${
                    activeSectionId === sec.id ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/40 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'
                  }`}
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] dark:bg-slate-800">
                    {idx + 1}
                  </span>
                  <span className="truncate">{sec.title}</span>
                </button>
              ))}

              <button
                onClick={() => {
                  setActiveSectionId('conclusion');
                  document.getElementById('sec-conclusion')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-left transition-all ${
                  activeSectionId === 'conclusion' ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/40 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                <span>XULOSA</span>
              </button>

              <button
                onClick={() => {
                  setActiveSectionId('references');
                  document.getElementById('sec-references')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-left transition-all ${
                  activeSectionId === 'references' ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/40 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Adabiyotlar ro'yxati</span>
              </button>
            </nav>

            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">OTM Standarti:</span>
              <p className="mt-1 text-[11px] text-slate-500">
                Times New Roman 14pt, 1.5 qator oralig'i, hoshiyalar: chap 3cm, o'ng 1.5cm, yuqori/past 2cm.
              </p>
            </div>
          </div>
        </aside>

        {/* Center: A4 Document Paper Simulation */}
        <div className="flex-1 flex flex-col items-center">
          
          {/* A4 Page Container */}
          <div className="w-full max-w-3xl space-y-8 print:p-0">

            {/* 1. TITUL VARAG'I (PAGE 1) */}
            <div className="rounded-2xl bg-white p-8 sm:p-14 shadow-xl border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800 font-serif min-h-[900px] flex flex-col justify-between">
              <div className="text-center space-y-2">
                <p className="text-xs sm:text-sm font-bold tracking-wide uppercase text-slate-800 dark:text-slate-200">
                  O'ZBEKISTON RESPUBLIKASI OLIY TA'LIM, FAN VA INNOVATSIYALAR VAZIRLIGI
                </p>
                <input
                  type="text"
                  value={doc.institution}
                  onChange={(e) => onUpdateDocument({ ...doc, institution: e.target.value })}
                  className="w-full text-center text-sm sm:text-base font-bold uppercase bg-transparent text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
                  placeholder="UNIVERSITET NOMI"
                />
                <input
                  type="text"
                  value={doc.faculty || ''}
                  onChange={(e) => onUpdateDocument({ ...doc, faculty: e.target.value })}
                  className="w-full text-center text-xs sm:text-sm text-slate-600 uppercase bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-slate-300"
                  placeholder="FAKULTET VA KAFEDRA NOMI"
                />
              </div>

              {/* Title & Subject */}
              <div className="text-center my-12 space-y-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                  {docTypeName.toUpperCase()}
                </h1>
                <div className="pt-2">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Mavzu:</span>
                  <h2 className="mt-1 text-lg sm:text-xl font-bold italic text-slate-900 dark:text-white px-4">
                    «{doc.title}»
                  </h2>
                </div>
              </div>

              {/* Credentials */}
              <div className="flex justify-end">
                <div className="w-72 space-y-2 text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Bajardi: </span>
                    <input
                      type="text"
                      value={doc.authorName}
                      onChange={(e) => onUpdateDocument({ ...doc, authorName: e.target.value })}
                      className="bg-transparent font-medium text-slate-900 dark:text-white border-b border-dashed border-slate-300 dark:border-slate-700 focus:outline-none"
                      placeholder="Talaba F.I.Sh."
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Qabul qildi: </span>
                    <input
                      type="text"
                      value={doc.supervisorName || ''}
                      onChange={(e) => onUpdateDocument({ ...doc, supervisorName: e.target.value })}
                      className="bg-transparent font-medium text-slate-900 dark:text-white border-b border-dashed border-slate-300 dark:border-slate-700 focus:outline-none"
                      placeholder="Ilmiy rahbar F.I.Sh."
                    />
                  </div>
                </div>
              </div>

              {/* City and Year */}
              <div className="text-center pt-8 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                Toshkent – {doc.year || 2026}
              </div>
            </div>

            {/* 2. MUNDARIJA (PAGE 2) */}
            <div className="rounded-2xl bg-white p-8 sm:p-14 shadow-xl border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800 font-serif">
              <h2 className="text-center text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-6">
                Mundarija
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-loose">
                <div className="flex justify-between border-b border-dotted border-slate-300 dark:border-slate-700 pb-1">
                  <span className="font-bold">KIRISH</span>
                  <span>3</span>
                </div>
                {(doc.sections || []).map((sec, idx) => (
                  <div key={sec.id} className="flex justify-between border-b border-dotted border-slate-300 dark:border-slate-700 pb-1">
                    <span>{sec.title}</span>
                    <span>{idx + 4}</span>
                  </div>
                ))}
                <div className="flex justify-between border-b border-dotted border-slate-300 dark:border-slate-700 pb-1">
                  <span className="font-bold">XULOSA</span>
                  <span>{(doc.sections?.length || 0) + 4}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-slate-300 dark:border-slate-700 pb-1">
                  <span className="font-bold">FOYDALANILGAN ADABIYOTLAR RO'YXATI</span>
                  <span>{(doc.sections?.length || 0) + 5}</span>
                </div>
              </div>
            </div>

            {/* 3. KIRISH (PAGE 3) */}
            <div id="sec-intro" className="rounded-2xl bg-white p-8 sm:p-14 shadow-xl border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800 font-serif">
              <h2 className="text-center text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-6">
                KIRISH
              </h2>
              <textarea
                rows={12}
                value={doc.introduction || ''}
                onChange={(e) => onUpdateDocument({ ...doc, introduction: e.target.value })}
                className="w-full bg-transparent text-sm sm:text-base leading-relaxed text-justify text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-1 resize-y"
              />
            </div>

            {/* 4. ASOSIY QISM (SECTIONS) */}
            {(doc.sections || []).map((sec, idx) => (
              <div
                key={sec.id}
                id={`sec-${sec.id}`}
                className="rounded-2xl bg-white p-8 sm:p-14 shadow-xl border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800 font-serif"
              >
                <div className="flex items-center justify-between mb-4 border-b pb-2 border-slate-100 dark:border-slate-800 font-sans">
                  <span className="text-xs font-bold text-blue-600 uppercase">
                    {idx + 1}-Reja / Bob
                  </span>
                  
                  {/* Expand with AI button */}
                  <button
                    onClick={() => handleExpandSection(sec)}
                    disabled={expandingSectionId === sec.id}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50 dark:bg-blue-950/50 dark:text-blue-300"
                  >
                    {expandingSectionId === sec.id ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        <span>Boyitilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>AI bilan boyitish (Matnni kengaytirish)</span>
                      </>
                    )}
                  </button>
                </div>

                <h2 className="text-center text-base sm:text-lg font-bold uppercase tracking-wide text-slate-900 dark:text-white mb-6">
                  {sec.title}
                </h2>

                <textarea
                  rows={14}
                  value={sec.content}
                  onChange={(e) => handleUpdateSectionContent(sec.id, e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base leading-relaxed text-justify text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-1 resize-y"
                />
              </div>
            ))}

            {/* 5. XULOSA */}
            <div id="sec-conclusion" className="rounded-2xl bg-white p-8 sm:p-14 shadow-xl border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800 font-serif">
              <h2 className="text-center text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-6">
                XULOSA
              </h2>
              <textarea
                rows={10}
                value={doc.conclusion || ''}
                onChange={(e) => onUpdateDocument({ ...doc, conclusion: e.target.value })}
                className="w-full bg-transparent text-sm sm:text-base leading-relaxed text-justify text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-1 resize-y"
              />
            </div>

            {/* 6. FOYDALANILGAN ADABIYOTLAR */}
            <div id="sec-references" className="rounded-2xl bg-white p-8 sm:p-14 shadow-xl border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800 font-serif">
              <h2 className="text-center text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-6">
                FOYDALANILGAN ADABIYOTLAR RO'YXATI
              </h2>
              <div className="space-y-3">
                {(doc.references || []).map((ref, rIdx) => (
                  <div key={rIdx} className="flex gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    <input
                      type="text"
                      value={ref}
                      onChange={(e) => {
                        const updated = [...(doc.references || [])];
                        updated[rIdx] = e.target.value;
                        onUpdateDocument({ ...doc, references: updated });
                      }}
                      className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

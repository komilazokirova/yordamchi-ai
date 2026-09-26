'use client';

import React from 'react';
import { AcademicDocument } from '@/types';
import { FileText, Presentation, Trash2, ExternalLink, Calendar, BookOpen, Plus, Sparkles, FolderOpen } from 'lucide-react';

interface MyDocumentsProps {
  documents: AcademicDocument[];
  onOpenDoc: (doc: AcademicDocument) => void;
  onDeleteDoc: (id: string) => void;
  onNewDoc: () => void;
}

export const MyDocuments: React.FC<MyDocumentsProps> = ({
  documents,
  onOpenDoc,
  onDeleteDoc,
  onNewDoc,
}) => {
  if (documents.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 ring-1 ring-blue-500/20 dark:bg-slate-900 dark:text-blue-400 shadow-xl shadow-blue-500/10">
          <FolderOpen className="h-10 w-10 text-blue-500" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Hozircha saqlangan ishlar yo'q
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Yangi prezentatsiya, kurs ishi yoki referat yarating. Barcha yaratilgan hujjatlaringiz avtomatik tarzda bu yerda saqlanadi va ularni istalgan vaqtda qayta ochishingiz mumkin.
        </p>
        <button
          onClick={onNewDoc}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Yangi ish yaratish</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-950/60 dark:text-blue-300 mb-1">
            <Sparkles className="h-3 w-3" />
            <span>Mening Hujjatlarim</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Saqlangan Ishlar Tarixi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Jami {documents.length} ta tayyor hujjat saqlangan
          </p>
        </div>

        <button
          onClick={onNewDoc}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>+ Yangi yaratish</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => {
          const isPres = doc.docType === 'presentation';
          const typeLabel = 
            doc.docType === 'presentation' ? 'Prezentatsiya' :
            doc.docType === 'coursework' ? 'Kurs Ishi' :
            doc.docType === 'referat' ? 'Referat' : 'Mustaqil Ish';

          const badgeColor = 
            doc.docType === 'presentation' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300' :
            doc.docType === 'coursework' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
            doc.docType === 'referat' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' :
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';

          const iconGradient = 
            doc.docType === 'presentation' ? 'from-orange-500 to-amber-500 text-white' :
            doc.docType === 'coursework' ? 'from-blue-600 to-indigo-600 text-white' :
            doc.docType === 'referat' ? 'from-purple-600 to-fuchsia-600 text-white' :
            'from-emerald-600 to-teal-600 text-white';

          return (
            <div
              key={doc.id}
              onClick={() => onOpenDoc(doc)}
              className="group relative cursor-pointer rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr shadow-md ${iconGradient}`}>
                  {isPres ? <Presentation className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Ushbu hujjatni o'chirishni xohlaysizmi?")) {
                      onDeleteDoc(doc.id);
                    }
                  }}
                  className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 transition-colors"
                  title="O'chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${badgeColor}`}>
                  {typeLabel}
                </span>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-slate-900 line-clamp-2 dark:text-white group-hover:text-blue-600 transition-colors">
                  {doc.title}
                </h3>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(doc.createdAt).toLocaleDateString('uz-UZ')}</span>
                </div>
                
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-transform">
                  <span>Ochish</span>
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { AcademicDocument } from '@/types';
import { FileText, Presentation, Trash2, ExternalLink, Calendar, BookOpen } from 'lucide-react';

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
      <div className="mx-auto max-w-xl text-center py-16 px-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
          <BookOpen className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Hozircha saqlangan ishlar yo'q
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Yangi prezentatsiya, kurs ishi yoki referat yarating va u avtomatik ravishda bu yerda saqlanadi.
        </p>
        <button
          onClick={onNewDoc}
          className="mt-6 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
        >
          Yangi ish yaratish
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Mening Ishlarim
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Jami {documents.length} ta hujjat
          </p>
        </div>
        <button
          onClick={onNewDoc}
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-blue-700"
        >
          + Yangi yaratish
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => {
          const isPres = doc.docType === 'presentation';
          const typeLabel = 
            doc.docType === 'presentation' ? 'Prezentatsiya' :
            doc.docType === 'coursework' ? 'Kurs Ishi' :
            doc.docType === 'referat' ? 'Referat' : 'Mustaqil Ish';

          return (
            <div
              key={doc.id}
              onClick={() => onOpenDoc(doc)}
              className="group relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isPres ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/40' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                }`}>
                  {isPres ? <Presentation className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDoc(doc.id);
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                  title="O'chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {typeLabel}
                </span>
                <h3 className="mt-2 text-base font-bold text-slate-900 line-clamp-2 dark:text-white group-hover:text-blue-600">
                  {doc.title}
                </h3>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(doc.createdAt).toLocaleDateString('uz-UZ')}</span>
                </div>
                <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                  Ochish <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { OutlineItem, DocType } from '@/types';
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, CheckCircle2, FileEdit, ArrowRight, ArrowLeft } from 'lucide-react';

interface OutlineStepProps {
  topic: string;
  docType: DocType;
  outlines: OutlineItem[];
  onChangeOutlines: (newOutlines: OutlineItem[]) => void;
  onProceed: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const OutlineStep: React.FC<OutlineStepProps> = ({
  topic,
  docType,
  outlines,
  onChangeOutlines,
  onProceed,
  onBack,
  isLoading,
}) => {
  const [newRejaTitle, setNewRejaTitle] = useState('');

  const docTypeName = 
    docType === 'presentation' ? 'Prezentatsiya slaydlari' :
    docType === 'coursework' ? 'Kurs ishi boblari va rejalari' :
    docType === 'referat' ? 'Referat rejalari' : 'Mustaqil ish rejalari';

  const handleUpdateTitle = (id: string, newTitle: string) => {
    onChangeOutlines(
      outlines.map((o) => (o.id === id ? { ...o, title: newTitle } : o))
    );
  };

  const handleDelete = (id: string) => {
    onChangeOutlines(outlines.filter((o) => o.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= outlines.length) return;
    const updated = [...outlines];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChangeOutlines(updated);
  };

  const handleAddReja = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRejaTitle.trim()) return;
    const newItem: OutlineItem = {
      id: `custom-${Date.now()}`,
      title: `${outlines.length + 1}. ${newRejaTitle.trim()}`,
      order: outlines.length + 1,
    };
    onChangeOutlines([...outlines, newItem]);
    setNewRejaTitle('');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-0">
      
      {/* Visual Step Progress Indicator */}
      <div className="mb-6 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-slate-100/80 p-1.5 ring-1 ring-slate-200/80 dark:bg-slate-900/80 dark:ring-slate-800">
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Mavzu tanlandi</span>
          </div>
          <div className="h-0.5 w-4 bg-blue-600" />
          <div className="flex items-center gap-2 rounded-full bg-blue-600 px-3.5 py-1 text-xs font-bold text-white shadow-sm">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-blue-600">
              2
            </span>
            <span>Rejalar va Tuzilma</span>
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

      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
        {/* Header */}
        <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Sparkles className="h-4 w-4" />
            <span>2-Qadam: Rejalarni tasdiqlash va tahrirlash</span>
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
            «{topic}»
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            AI tomonidan {docTypeName} uchun quyidagi mantiqiy tuzilma tuzildi. Istalgan bandni bevosita tahrirlashingiz, yangisini qo'shishingiz yoki o'chirishingiz mumkin.
          </p>
        </div>

        {/* Outlines List */}
        <div className="mt-6 space-y-2.5">
          {outlines.map((item, idx) => (
            <div
              key={item.id}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 transition-all duration-200 hover:border-blue-400 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-blue-500 dark:hover:bg-slate-800/80"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-black text-white shadow-sm shadow-blue-500/20">
                {idx + 1}
              </div>

              <input
                type="text"
                value={item.title}
                onChange={(e) => handleUpdateTitle(item.id, e.target.value)}
                className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none dark:text-white"
              />

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-20 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
                  title="Yuqoriga surish"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === outlines.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-20 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
                  title="Pastga surish"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 transition-colors"
                  title="O'chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Reja Form */}
        <form onSubmit={handleAddReja} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Yangi reja bandini yozing..."
            value={newRejaTitle}
            onChange={(e) => setNewRejaTitle(e.target.value)}
            className="flex-1 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Qo'shish</span>
          </button>
        </form>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Ortga qaytish</span>
          </button>

          <button
            type="button"
            disabled={isLoading || outlines.length === 0}
            onClick={onProceed}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-7 py-3 text-xs sm:text-sm font-black text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/35 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Matn va slaydlar generatsiya qilinmoqda...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>
                  {docType === 'presentation'
                    ? 'Slaydlarni Canva studiyasida ochish'
                    : 'To\'liq akademik matnlarni yaratish'}
                </span>
                <ArrowRight className="h-4 w-4 ml-0.5" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { OutlineItem, DocType } from '@/types';
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, CheckCircle2, FileEdit } from 'lucide-react';

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
    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Sparkles className="h-4 w-4" />
          <span>2-Qadam: Rejalarni tasdiqlash va tahrirlash</span>
        </div>
        <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
          «{topic}»
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          AI tomonidan {docTypeName} uchun quyidagi tuzilma tavsiya etildi. Istalgan rejani o'zgartirishingiz, yangi reja qo'shishingiz yoki o'chirishingiz mumkin.
        </p>
      </div>

      {/* Outlines List */}
      <div className="mt-6 space-y-3">
        {outlines.map((item, idx) => (
          <div
            key={item.id}
            className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 transition-all hover:border-blue-400 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-blue-500"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              {idx + 1}
            </div>

            <input
              type="text"
              value={item.title}
              onChange={(e) => handleUpdateTitle(item.id, e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-slate-900 focus:outline-none dark:text-white"
            />

            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => handleMove(idx, 'up')}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 dark:hover:bg-slate-700"
                title="Yuqoriga surish"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={idx === outlines.length - 1}
                onClick={() => handleMove(idx, 'down')}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 dark:hover:bg-slate-700"
                title="Pastga surish"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
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
          placeholder="Yangi reja qo'shish..."
          value={newRejaTitle}
          onChange={(e) => setNewRejaTitle(e.target.value)}
          className="flex-1 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
          <span>Qo'shish</span>
        </button>
      </form>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          ← Ortga qaytish
        </button>

        <button
          type="button"
          disabled={isLoading || outlines.length === 0}
          onClick={onProceed}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/35 active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Ilmiy matnlar va slaydlar generatsiya qilinmoqda...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>
                {docType === 'presentation'
                  ? 'Slaydlarni Canva studiyasida ochish'
                  : 'To\'liq akademik matnlarni yaratish'}
              </span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

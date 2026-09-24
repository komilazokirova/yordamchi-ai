'use client';

import React, { useState } from 'react';
import { X, Key, Bot, Sparkles, ExternalLink, Check } from 'lucide-react';
import { AISettings } from '@/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSaveSettings: (settings: AISettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [provider, setProvider] = useState<'gemini' | 'openai'>(settings.provider);
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || '');
  const [openaiApiKey, setOpenaiApiKey] = useState(settings.openaiApiKey || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      provider,
      geminiApiKey,
      openaiApiKey,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Sozlamalari
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Google Gemini yoki OpenAI API orqali generatsiya qilish
            </p>
          </div>
        </div>

        {/* Provider Switcher */}
        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            AI Provayderini tanlang:
          </label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setProvider('gemini')}
              className={`flex flex-col p-3 rounded-2xl border text-left transition-all ${
                provider === 'gemini'
                  ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">Google Gemini</span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">Tavsiya</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                O'zbek tilida mukammal, tezkor va bepul kvotasi mavjud
              </p>
            </button>

            <button
              type="button"
              onClick={() => setProvider('openai')}
              className={`flex flex-col p-3 rounded-2xl border text-left transition-all ${
                provider === 'openai'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:border-indigo-500 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">OpenAI ChatGPT</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">GPT-4o-mini</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Keng ko'lamli bilimlar bazasi va aniq mantiqiy yondashuv
              </p>
            </button>
          </div>
        </div>

        {/* API Key inputs */}
        <div className="mt-4 space-y-3">
          {provider === 'gemini' ? (
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Google Gemini API Key (Ixtiyoriy)
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                >
                  <span>Bepul kalit olish</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="mt-1 flex items-center rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                <Key className="h-4 w-4 text-slate-400 mr-2" />
                <input
                  type="password"
                  placeholder="AIzaSy... (bo'sh qolsa demo generator ishlaydi)"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none dark:text-white"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                * Agar kalit kiritmasangiz ham, tizim o'rnatilgan aqlli ilmiy algoritmlar orqali to'liq ishlayveradi.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  OpenAI API Key
                </label>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] text-indigo-600 hover:underline"
                >
                  <span>OpenAI kaliti</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="mt-1 flex items-center rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                <Key className="h-4 w-4 text-slate-400 mr-2" />
                <input
                  type="password"
                  placeholder="sk-..."
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.99]"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4" />
                <span>Sozlamalar saqlandi!</span>
              </>
            ) : (
              <span>Saqlash</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

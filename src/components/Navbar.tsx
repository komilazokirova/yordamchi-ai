'use client';

import React from 'react';
import { Sparkles, Crown, GraduationCap, FileText, Settings, User, LogOut, Lock } from 'lucide-react';
import { UserAccount } from '@/types';

interface NavbarProps {
  user: UserAccount;
  onOpenAuth: () => void;
  onOpenSubscribe?: () => void;
  onOpenSettings: () => void;
  onLogout?: () => void;
  currentTab: 'create' | 'my-docs';
  onSelectTab: (tab: 'create' | 'my-docs') => void;
  onNewDoc: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenSettings,
  onLogout,
  currentTab,
  onSelectTab,
  onNewDoc,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Brand */}
        <div 
          onClick={onNewDoc}
          className="flex cursor-pointer items-center gap-3 select-none group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Yordamchi<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent"> AI</span>
              </span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-950/60 dark:text-blue-300">
                OTM 2026
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Prezentatsiya • Kurs ishi • Referat
            </p>
          </div>
        </div>

        {/* Center Tabs: Segmented Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-2xl bg-slate-100/90 p-1.5 ring-1 ring-slate-200/60 dark:bg-slate-900/90 dark:ring-slate-800">
          <button
            onClick={onNewDoc}
            className={`flex items-center gap-2 rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
              currentTab === 'create'
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>Yangi Yaratish</span>
          </button>
          <button
            onClick={() => onSelectTab('my-docs')}
            className={`flex items-center gap-2 rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
              currentTab === 'my-docs'
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>Mening Ishlarim</span>
            <span className="ml-0.5 rounded-full bg-slate-200/70 px-1.5 py-0.2 text-[10px] font-black text-slate-700 dark:bg-slate-700 dark:text-slate-300">
              {user.savedDocs.length}
            </span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 100% Free Badge */}
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>100% Mutlaqo Bepul</span>
          </div>

          {/* API Settings */}
          <button
            onClick={onOpenSettings}
            title="AI Model sozlamalari (Gemini / OpenAI)"
            className="rounded-xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* User Account / Profile */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-400/20 dark:text-blue-300">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="max-w-[110px] truncate hidden sm:inline">
              {user.fullName || user.email || 'Kirish'}
            </span>
          </button>

          {/* Log out (Chiqish) Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Hisobdan chiqish"
              className="flex items-center gap-1 rounded-xl border border-red-200/80 bg-red-50/70 p-2 text-xs font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 sm:px-2.5 sm:py-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Chiqish</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

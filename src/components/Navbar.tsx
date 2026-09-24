'use client';

import React from 'react';
import { Sparkles, Crown, GraduationCap, FileText, Settings, User, CreditCard, LogOut } from 'lucide-react';
import { UserAccount } from '@/types';

interface NavbarProps {
  user: UserAccount;
  onOpenAuth: () => void;
  onOpenSubscribe: () => void;
  onOpenSettings: () => void;
  onLogout?: () => void;
  currentTab: 'create' | 'my-docs';
  onSelectTab: (tab: 'create' | 'my-docs') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onOpenSubscribe,
  onOpenSettings,
  onLogout,
  currentTab,
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Yordamchi<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> AI</span>
              </span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                OTM 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Prezentatsiya • Kurs ishi • Referat
            </p>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-900">
          <button
            onClick={() => onSelectTab('create')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              currentTab === 'create'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Yangi Yaratish
          </button>
          <button
            onClick={() => onSelectTab('my-docs')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              currentTab === 'my-docs'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            Mening Ishlarim ({user.savedDocs.length})
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Subscription Status or Upgrade */}
          {user.isSubscribed ? (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 border border-amber-500/20 dark:text-amber-300">
              <Crown className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>PRO Obuna</span>
            </div>
          ) : (
            <button
              onClick={onOpenSubscribe}
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-orange-500/20 active:scale-[0.98]"
            >
              <Crown className="h-4 w-4" />
              <span>15 000 so'm / oy</span>
              <span className="hidden sm:inline-block rounded bg-white/20 px-1.5 py-0.2 text-[10px]">
                Obuna bo'lish
              </span>
            </button>
          )}

          {/* API Settings */}
          <button
            onClick={onOpenSettings}
            title="AI Model sozlamalari (Gemini / OpenAI)"
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* User Account / Profile */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="max-w-[120px] truncate">
              {user.fullName || user.email || 'Kirish'}
            </span>
          </button>

          {/* Log out (Chiqish) Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Hisobdan chiqish"
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

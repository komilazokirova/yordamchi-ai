'use client';

import React, { useState, useEffect } from 'react';
import {
  DocType,
  Language,
  OutlineItem,
  AcademicDocument,
  UserAccount,
  AISettings,
  SlideData,
  PaymentTransaction,
} from '@/types';
import { Navbar } from '@/components/Navbar';
import { CreateWizard } from '@/components/CreateWizard';
import { OutlineStep } from '@/components/OutlineStep';
import { PresentationStudio } from '@/components/PresentationStudio';
import { AcademicEditor } from '@/components/AcademicEditor';
import { MyDocuments } from '@/components/MyDocuments';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import { PhoneAuthModal } from '@/components/PhoneAuthModal';
import { AuthModal } from '@/components/AuthModal';
import { SettingsModal } from '@/components/SettingsModal';
import { DEFAULT_THEME_ID } from '@/lib/slide-themes';
import {
  generateOutlines,
  generateAcademicContent,
  generatePresentationSlides,
} from '@/lib/ai-service';

export default function HomePage() {
  // 1. User & Account State
  const [user, setUser] = useState<UserAccount>({
    id: 'user-default',
    email: 'talaba@edu.uz',
    fullName: 'Azizov Bekzod',
    role: 'student',
    university: "O'zbekiston Milliy Universiteti",
    isSubscribed: false,
    freeGenerationsLeft: 1, // 1st generation is FREE!
    totalGenerated: 0,
    savedDocs: [],
  });

  // 2. AI Settings State
  const [aiSettings, setAiSettings] = useState<AISettings>({
    provider: 'gemini',
    geminiApiKey: '',
    openaiApiKey: '',
    geminiModel: 'gemini-3.8-flash',
    openaiModel: 'gpt-4o-mini',
  });

  // 3. Navigation & Workflow State
  const [currentTab, setCurrentTab] = useState<'create' | 'my-docs'>('create');
  const [step, setStep] = useState<'wizard' | 'outlines' | 'studio' | 'academic-editor'>('wizard');
  const [isLoading, setIsLoading] = useState(false);

  // 4. Active Document State
  const [currentDoc, setCurrentDoc] = useState<AcademicDocument | null>(null);

  // 5. Modals State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load state from localStorage on client mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('yordamchi_ai_user') || localStorage.getItem('talaba_ai_user');

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);

        // Server bazasi bilan darhol sinxronizatsiya qilish (Inkoginto yoki boshqa oynalardan kelganda ham to'g'ri ko'rinadi)
        if (parsed.phone) {
          fetch(`/api/user/sync?phone=${encodeURIComponent(parsed.phone)}`)
            .then((r) => r.json())
            .then((data) => {
              if (data.success && data.user) {
                setUser((prev) => {
                  const synced = {
                    ...prev,
                    ...data.user,
                    savedDocs: prev.savedDocs || [],
                  };
                  localStorage.setItem('yordamchi_ai_user', JSON.stringify(synced));
                  return synced;
                });
              }
            })
            .catch((err) => console.warn('Server sync error:', err));
        }
      }

      const storedSettings = localStorage.getItem('yordamchi_ai_settings') || localStorage.getItem('talaba_ai_settings');
      if (storedSettings) {
        setAiSettings(JSON.parse(storedSettings));
      }
      localStorage.removeItem('talaba_ai_user');
      localStorage.removeItem('talaba_ai_settings');
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    }
  }, []);

  // Robust atomic user state update with localStorage sync
  const saveUserData = (updater: UserAccount | ((prev: UserAccount) => UserAccount)) => {
    setUser((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('yordamchi_ai_user', JSON.stringify(updated));
        localStorage.removeItem('talaba_ai_user');
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      return updated;
    });
  };

  const saveSettingsData = (updated: AISettings) => {
    setAiSettings(updated);
    try {
      localStorage.setItem('yordamchi_ai_settings', JSON.stringify(updated));
      localStorage.removeItem('talaba_ai_settings');
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  // Start creating a new document
  const handleStartNewDoc = () => {
    setCurrentDoc(null);
    setStep('wizard');
    setCurrentTab('create');
  };

  // STEP 1 -> STEP 2: Generate Outlines
  const handleGenerateOutlines = async (params: {
    topic: string;
    docType: DocType;
    language: Language;
    university: string;
    faculty: string;
    authorName: string;
    supervisorName: string;
    targetCount: number;
  }) => {
    // Agar foydalanuvchi hali telefon raqami bilan kirmagan bo'lsa, ro'yxatdan o'tishni so'rash
    if (!user.phone) {
      setIsAuthOpen(true);
      return;
    }

    // Check generation quota: Strict Paid Mode Gate
    if (!user.isSubscribed && user.freeGenerationsLeft <= 0) {
      setIsSubscribeOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const outlines = await generateOutlines(
        params.topic,
        params.docType,
        params.language,
        {
          apiKey: aiSettings.provider === 'gemini' ? aiSettings.geminiApiKey : aiSettings.openaiApiKey,
          provider: aiSettings.provider,
          model: aiSettings.provider === 'gemini' ? aiSettings.geminiModel : aiSettings.openaiModel,
        },
        params.targetCount
      );

      const newDoc: AcademicDocument = {
        id: `doc-${Date.now()}`,
        title: params.topic,
        docType: params.docType,
        language: params.language,
        authorName: params.authorName || user.fullName,
        institution: params.university || user.university || "O'zbekiston Milliy Universiteti",
        faculty: params.faculty,
        supervisorName: params.supervisorName,
        year: 2026,
        createdAt: new Date().toISOString(),
        outlines,
        selectedThemeId: DEFAULT_THEME_ID,
        targetCount: params.targetCount,
      };

      setCurrentDoc(newDoc);
      setStep('outlines');
    } catch (err) {
      console.error('Outlines generation error:', err);
      alert('Rejalarni tuzishda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2 -> STEP 3: Generate Full Content or Slides
  const handleProceedToContent = async () => {
    if (!currentDoc) return;

    // Agar telefon raqami tasdiqlanmagan bo'lsa
    if (!user.phone) {
      setIsAuthOpen(true);
      return;
    }

    // Strict quota check before generating slides/content
    if (!user.isSubscribed && user.freeGenerationsLeft <= 0) {
      setIsSubscribeOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const activeApiKey = aiSettings.provider === 'gemini' ? aiSettings.geminiApiKey : aiSettings.openaiApiKey;
      const genOptions = {
        apiKey: activeApiKey,
        provider: aiSettings.provider,
        model: aiSettings.provider === 'gemini' ? aiSettings.geminiModel : aiSettings.openaiModel,
      };

      if (currentDoc.docType === 'presentation') {
        const slides = await generatePresentationSlides(
          currentDoc.title,
          currentDoc.outlines,
          currentDoc.selectedThemeId || DEFAULT_THEME_ID,
          genOptions
        );

        const updatedDoc = { ...currentDoc, slides };
        setCurrentDoc(updatedDoc);
        setStep('studio');

        // Serverdagi markazlashgan bazadan limitni 1 taga kamaytirish
        let serverQuotaLeft = 0;
        if (user.phone) {
          try {
            const qRes = await fetch('/api/user/use-quota', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone: user.phone }),
            });
            const qData = await qRes.json();
            if (qData.success && qData.user) {
              serverQuotaLeft = qData.user.freeGenerationsLeft;
            }
          } catch (e) {
            console.warn('Server quota decrement error:', e);
          }
        }

        // Atomically save to history, decrement free generations to 0, and increment totalGenerated!
        saveUserData((prev) => {
          const existingIndex = prev.savedDocs.findIndex((d) => d.id === updatedDoc.id);
          const updatedDocs = existingIndex >= 0
            ? prev.savedDocs.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
            : [updatedDoc, ...prev.savedDocs];

          const newFreeLeft = !prev.isSubscribed ? serverQuotaLeft : prev.freeGenerationsLeft;

          return {
            ...prev,
            savedDocs: updatedDocs,
            freeGenerationsLeft: newFreeLeft,
            totalGenerated: prev.totalGenerated + 1,
          };
        });
      } else {
        // Coursework, Referat, Independent work
        const academicData = await generateAcademicContent(
          currentDoc.title,
          currentDoc.outlines,
          currentDoc.docType,
          currentDoc.language,
          genOptions
        );

        const updatedDoc = {
          ...currentDoc,
          introduction: academicData.introduction,
          sections: academicData.sections,
          conclusion: academicData.conclusion,
          references: academicData.references,
        };

        setCurrentDoc(updatedDoc);
        setStep('academic-editor');

        // Serverdagi markazlashgan bazadan limitni 1 taga kamaytirish
        let serverQuotaLeft = 0;
        if (user.phone) {
          try {
            const qRes = await fetch('/api/user/use-quota', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone: user.phone }),
            });
            const qData = await qRes.json();
            if (qData.success && qData.user) {
              serverQuotaLeft = qData.user.freeGenerationsLeft;
            }
          } catch (e) {
            console.warn('Server quota decrement error:', e);
          }
        }

        // Atomically save to history, decrement free generations to 0, and increment totalGenerated!
        saveUserData((prev) => {
          const existingIndex = prev.savedDocs.findIndex((d) => d.id === updatedDoc.id);
          const updatedDocs = existingIndex >= 0
            ? prev.savedDocs.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
            : [updatedDoc, ...prev.savedDocs];

          const newFreeLeft = !prev.isSubscribed ? serverQuotaLeft : prev.freeGenerationsLeft;

          return {
            ...prev,
            savedDocs: updatedDocs,
            freeGenerationsLeft: newFreeLeft,
            totalGenerated: prev.totalGenerated + 1,
          };
        });
      }
    } catch (err) {
      console.error('Content generation error:', err);
      alert('Matn/slaydlarni yaratishda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save doc to history without altering user quota
  const saveDocumentToHistory = (docToSave: AcademicDocument) => {
    saveUserData((prev) => {
      const existingIndex = prev.savedDocs.findIndex((d) => d.id === docToSave.id);
      let updatedDocs: AcademicDocument[] = [];
      if (existingIndex >= 0) {
        updatedDocs = prev.savedDocs.map((d) => (d.id === docToSave.id ? docToSave : d));
      } else {
        updatedDocs = [docToSave, ...prev.savedDocs];
      }
      return { ...prev, savedDocs: updatedDocs };
    });
  };

  // Delete doc from history
  const handleDeleteDoc = (id: string) => {
    saveUserData((prev) => {
      const updated = prev.savedDocs.filter((d) => d.id !== id);
      return { ...prev, savedDocs: updated };
    });
    if (currentDoc?.id === id) {
      setCurrentDoc(null);
      setStep('wizard');
    }
  };

  // Open doc from history
  const handleOpenDoc = (doc: AcademicDocument) => {
    setCurrentDoc(doc);
    if (doc.docType === 'presentation') {
      setStep('studio');
    } else {
      setStep('academic-editor');
    }
    setCurrentTab('create');
  };

  // Successful Subscription
  const handleSuccessSubscribe = async (transaction: PaymentTransaction) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Server bazasiga yozish
    if (user.phone) {
      try {
        await fetch('/api/user/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: user.phone, days: 30 }),
        });
      } catch (err) {
        console.warn('Subscription server sync warning:', err);
      }
    }

    saveUserData((prev) => ({
      ...prev,
      isSubscribed: true,
      subscriptionExpiresAt: expiresAt.toISOString(),
      paymentHistory: [transaction, ...(prev.paymentHistory || [])],
    }));
  };

  // Reset Test Limit (For testing/debugging only)
  const handleResetTestLimit = async () => {
    if (user.phone) {
      try {
        await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: user.phone })
        });
      } catch (e) {}
    }
    saveUserData((prev) => ({
      ...prev,
      isSubscribed: false,
      freeGenerationsLeft: 1,
    }));
  };

  // Log out (Chiqish)
  const handleLogout = () => {
    if (confirm("Haqiqatan ham hisobdan chiqmoqchimisiz?")) {
      saveUserData((prev) => {
        const guestUser: UserAccount = {
          id: `user-${Date.now()}`,
          email: '',
          phone: undefined,
          fullName: '',
          role: 'student',
          university: "O'zbekiston Milliy Universiteti",
          isSubscribed: false,
          freeGenerationsLeft: 1, // Will require entering phone number to claim real server quota!
          totalGenerated: 0,
          savedDocs: prev.savedDocs || [],
        };
        return guestUser;
      });
      setCurrentDoc(null);
      setStep('wizard');
      setCurrentTab('create');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Ambient decorative background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[950px] rounded-full bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl dark:from-blue-600/10 dark:via-indigo-600/5" />
        <div className="absolute top-[40%] -left-48 h-[450px] w-[500px] rounded-full bg-indigo-500/5 blur-3xl dark:bg-indigo-600/5" />
        <div className="absolute top-[50%] -right-48 h-[450px] w-[500px] rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-600/5" />
      </div>

      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => (user.phone ? setIsProfileOpen(true) : setIsAuthOpen(true))}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'create') {
            handleStartNewDoc();
          }
        }}
        onNewDoc={handleStartNewDoc}
      />

      {/* Main Area */}
      <main className="flex-1">
        {currentTab === 'my-docs' ? (
          <MyDocuments
            documents={user.savedDocs}
            onOpenDoc={handleOpenDoc}
            onDeleteDoc={handleDeleteDoc}
            onNewDoc={handleStartNewDoc}
          />
        ) : (
          <>
            {step === 'wizard' && (
              <CreateWizard
                onGenerateOutlines={handleGenerateOutlines}
                isLoading={isLoading}
                defaultUniversity={user.university}
                defaultAuthor={user.fullName}
                userPhone={user.phone}
                isSubscribed={user.isSubscribed}
                freeGenerationsLeft={user.freeGenerationsLeft}
                onOpenSubscribe={() => setIsSubscribeOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
                onResetTestLimit={handleResetTestLimit}
              />
            )}

            {step === 'outlines' && currentDoc && (
              <div className="py-8">
                <OutlineStep
                  topic={currentDoc.title}
                  docType={currentDoc.docType}
                  outlines={currentDoc.outlines}
                  onChangeOutlines={(newOutlines) =>
                    setCurrentDoc({ ...currentDoc, outlines: newOutlines })
                  }
                  onProceed={handleProceedToContent}
                  onBack={() => setStep('wizard')}
                  isLoading={isLoading}
                />
              </div>
            )}

            {step === 'studio' && currentDoc && currentDoc.slides && (
              <PresentationStudio
                topic={currentDoc.title}
                slides={currentDoc.slides}
                selectedThemeId={currentDoc.selectedThemeId || DEFAULT_THEME_ID}
                onUpdateSlides={(slides: SlideData[]) => {
                  const updated = { ...currentDoc, slides };
                  setCurrentDoc(updated);
                  saveDocumentToHistory(updated);
                }}
                onSelectTheme={(themeId) => {
                  const updated = { ...currentDoc, selectedThemeId: themeId };
                  setCurrentDoc(updated);
                  saveDocumentToHistory(updated);
                }}
                onBackToOutlines={() => setStep('outlines')}
                onNewDocument={handleStartNewDoc}
                authorName={currentDoc.authorName}
                institution={currentDoc.institution}
              />
            )}

            {step === 'academic-editor' && currentDoc && (
              <AcademicEditor
                document={currentDoc}
                onUpdateDocument={(doc) => {
                  setCurrentDoc(doc);
                  saveDocumentToHistory(doc);
                }}
                onBackToOutlines={() => setStep('outlines')}
                onNewDocument={handleStartNewDoc}
                userApiKey={
                  aiSettings.provider === 'gemini'
                    ? aiSettings.geminiApiKey
                    : aiSettings.openaiApiKey
                }
                provider={aiSettings.provider}
              />
            )}
          </>
        )}
      </main>

      {/* Minimal Footer */}
      {(step === 'wizard' || currentTab === 'my-docs') && (
        <footer className="border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-500 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 Yordamchi AI — O'zbekiston OTM talabalari va tadqiqotchilari uchun maxsus</span>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
              <span>Toshkent, O'zbekiston</span>
              <span>•</span>
              <span>OTM Davlat Standartlari</span>
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <SubscriptionModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        onSuccessSubscribe={handleSuccessSubscribe}
        isExpiredLimit={!user.isSubscribed && user.freeGenerationsLeft <= 0}
      />

      <PhoneAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessLogin={(verifiedUser) => {
          saveUserData((prev) => ({ ...prev, ...verifiedUser }));
          setIsAuthOpen(false);
        }}
        currentPhone={user.phone}
      />

      <AuthModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={user}
        onSaveUser={(updated) => saveUserData((prev) => ({ ...prev, ...updated }))}
        onResetTestLimit={handleResetTestLimit}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={aiSettings}
        onSaveSettings={saveSettingsData}
      />
    </div>
  );
}

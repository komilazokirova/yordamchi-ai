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
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load state from localStorage on client mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('yordamchi_ai_user') || localStorage.getItem('talaba_ai_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const storedSettings = localStorage.getItem('yordamchi_ai_settings') || localStorage.getItem('talaba_ai_settings');
      if (storedSettings) {
        setAiSettings(JSON.parse(storedSettings));
      }
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    }
  }, []);

  // Save user changes to localStorage
  const saveUserData = (updated: UserAccount) => {
    setUser(updated);
    try {
      localStorage.setItem('yordamchi_ai_user', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const saveSettingsData = (updated: AISettings) => {
    setAiSettings(updated);
    try {
      localStorage.setItem('yordamchi_ai_settings', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
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
    // Check generation quota
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

    // Check quota
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
        saveDocumentToHistory(updatedDoc);
        setStep('studio');
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
        saveDocumentToHistory(updatedDoc);
        setStep('academic-editor');
      }

      // Deduct free usage if not subscribed
      if (!user.isSubscribed && user.freeGenerationsLeft > 0) {
        saveUserData({
          ...user,
          freeGenerationsLeft: user.freeGenerationsLeft - 1,
          totalGenerated: user.totalGenerated + 1,
        });
      } else {
        saveUserData({
          ...user,
          totalGenerated: user.totalGenerated + 1,
        });
      }
    } catch (err) {
      console.error('Content generation error:', err);
      alert('Matn/slaydlarni yaratishda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save doc to history
  const saveDocumentToHistory = (docToSave: AcademicDocument) => {
    const existingIndex = user.savedDocs.findIndex((d) => d.id === docToSave.id);
    let updatedDocs: AcademicDocument[] = [];
    if (existingIndex >= 0) {
      updatedDocs = user.savedDocs.map((d) => (d.id === docToSave.id ? docToSave : d));
    } else {
      updatedDocs = [docToSave, ...user.savedDocs];
    }
    saveUserData({ ...user, savedDocs: updatedDocs });
  };

  // Delete doc from history
  const handleDeleteDoc = (id: string) => {
    const updated = user.savedDocs.filter((d) => d.id !== id);
    saveUserData({ ...user, savedDocs: updated });
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
  const handleSuccessSubscribe = (transaction: PaymentTransaction) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const existingHistory = user.paymentHistory || [];
    saveUserData({
      ...user,
      isSubscribed: true,
      subscriptionExpiresAt: expiresAt.toISOString(),
      paymentHistory: [transaction, ...existingHistory],
    });
  };

  // Reset Test Limit
  const handleResetTestLimit = () => {
    saveUserData({
      ...user,
      isSubscribed: false,
      freeGenerationsLeft: 1,
    });
  };

  // Log out (Chiqish)
  const handleLogout = () => {
    if (confirm("Haqiqatan ham hisobdan chiqmoqchimisiz?")) {
      const guestUser: UserAccount = {
        id: `user-${Date.now()}`,
        email: '',
        fullName: '',
        role: 'student',
        university: "O'zbekiston Milliy Universiteti",
        isSubscribed: false,
        freeGenerationsLeft: 1,
        totalGenerated: 0,
        savedDocs: user.savedDocs || [],
      };
      saveUserData(guestUser);
      setCurrentDoc(null);
      setStep('wizard');
      setCurrentTab('create');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'create' && !currentDoc) {
            setStep('wizard');
          }
        }}
      />

      {/* Main Area */}
      <main className="flex-1">
        {currentTab === 'my-docs' ? (
          <MyDocuments
            documents={user.savedDocs}
            onOpenDoc={handleOpenDoc}
            onDeleteDoc={handleDeleteDoc}
            onNewDoc={() => {
              setCurrentDoc(null);
              setStep('wizard');
              setCurrentTab('create');
            }}
          />
        ) : (
          <>
            {step === 'wizard' && (
              <CreateWizard
                onGenerateOutlines={handleGenerateOutlines}
                isLoading={isLoading}
                defaultUniversity={user.university}
                defaultAuthor={user.fullName}
                isSubscribed={user.isSubscribed}
                freeGenerationsLeft={user.freeGenerationsLeft}
                onOpenSubscribe={() => setIsSubscribeOpen(true)}
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

      {/* Modals */}
      <SubscriptionModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        onSuccessSubscribe={handleSuccessSubscribe}
        isExpiredLimit={!user.isSubscribed && user.freeGenerationsLeft <= 0}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onSaveUser={(updated) => saveUserData({ ...user, ...updated })}
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

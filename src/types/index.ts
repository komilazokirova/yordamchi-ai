export type DocType = 'presentation' | 'coursework' | 'independent' | 'referat';

export type Language = 'uz' | 'ru' | 'en';

export interface OutlineItem {
  id: string;
  title: string;
  order: number;
  content?: string;
  points?: string[];
  isGenerating?: boolean;
}

export interface SlideData {
  id: string;
  slideNumber: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  notes?: string;
  layout: 'title' | 'bullets' | 'split' | 'quote' | 'conclusion';
  imageUrl?: string;
  imageCaption?: string;
  themeId: string;
}

export interface AcademicSection {
  id: string;
  title: string;
  level: 1 | 2;
  content: string;
}

export interface AcademicDocument {
  id: string;
  title: string;
  docType: DocType;
  language: Language;
  authorName: string;
  institution: string;
  faculty?: string;
  supervisorName?: string;
  year: number;
  createdAt: string;
  outlines: OutlineItem[];
  // For academic papers:
  introduction?: string;
  sections?: AcademicSection[];
  conclusion?: string;
  references?: string[];
  // For presentations:
  slides?: SlideData[];
  selectedThemeId: string;
  targetCount?: number; // Slaydlar yoki betlar soni
}

export interface SlideTheme {
  id: string;
  name: string;
  category: 'Modern' | 'Academic' | 'Creative' | 'Minimal' | 'Dark';
  bgGradient: string;
  previewBg: string;
  textColor: string;
  subtitleColor: string;
  accentColor: string;
  cardBg: string;
  fontFamily: string;
  // Colors for pptxgenjs (hex without #)
  pptxBg: string;
  pptxTextColor: string;
  pptxAccentColor: string;
  pptxCardBg: string;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  provider: 'click' | 'payme' | 'card';
  date: string;
  status: 'success' | 'pending';
  receiptNumber: string;
}

export interface UserAccount {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: 'student' | 'teacher';
  university?: string;
  isSubscribed: boolean;
  subscriptionExpiresAt?: string;
  freeGenerationsLeft: number;
  totalGenerated: number;
  savedDocs: AcademicDocument[];
  paymentHistory?: PaymentTransaction[];
}

export interface AISettings {
  provider: 'gemini' | 'openai';
  geminiApiKey: string;
  openaiApiKey: string;
  geminiModel: string;
  openaiModel: string;
}

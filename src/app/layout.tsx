import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yordamchi AI — Prezentatsiya, Kurs Ishi, Referat va Mustaqil Ish Generatori",
  description: "O'zbekiston OTM talabalari va o'qituvchilari uchun sun'iy intellektga asoslangan 'Yordamchi AI' platformasi — Canva uslubidagi prezentatsiyalar, kurs ishlari, referatlar va mustaqil ishlar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}

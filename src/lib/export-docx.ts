import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertInchesToTwip,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';
import { AcademicDocument } from '@/types';

export async function exportAcademicDocx(docData: AcademicDocument) {
  const docTypeName = 
    docData.docType === 'coursework' ? 'KURS ISHI' :
    docData.docType === 'referat' ? 'REFERAT' : 'MUSTAQIL ISH';

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 28, // 14pt (in half-points)
            color: '000000',
          },
          paragraph: {
            spacing: {
              line: 360, // 1.5 line spacing (240 is 1.0, 360 is 1.5)
              after: 120, // 6pt after
            },
          },
        },
      },
    },
    sections: [
      // 1. TITLE PAGE SECTION (No page numbers on title page)
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(1.18), // 3 cm
              right: convertInchesToTwip(0.6), // 1.5 cm
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "O'ZBEKISTON RESPUBLIKASI OLIY TA'LIM, FAN VA INNOVATSIYALAR VAZIRLIGI",
                bold: true,
                size: 24, // 12pt
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: (docData.institution || "O'ZBEKISTON MILLIY UNIVERSITETI").toUpperCase(),
                bold: true,
                size: 26, // 13pt
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 720 },
            children: [
              new TextRun({
                text: docData.faculty ? `${docData.faculty.toUpperCase()} FAKULTETI` : "AXBOROT TEXNOLOGIYALARI FAKULTETI",
                size: 24,
              }),
            ],
          }),

          // Middle Document Type & Subject
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 1440, after: 360 },
            children: [
              new TextRun({
                text: docTypeName,
                bold: true,
                size: 40, // 20pt
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: "Mavzu: ",
                bold: true,
                size: 30, // 15pt
              }),
              new TextRun({
                text: `«${docData.title}»`,
                bold: true,
                size: 30,
                italics: true,
              }),
            ],
          }),

          // Student and Teacher credentials
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 2160, after: 120 },
            children: [
              new TextRun({
                text: "Bajardi: ",
                bold: true,
                size: 28,
              }),
              new TextRun({
                text: docData.authorName || "Talaba",
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 2160 },
            children: [
              new TextRun({
                text: "Qabul qildi: ",
                bold: true,
                size: 28,
              }),
              new TextRun({
                text: docData.supervisorName || "Ilmiy rahbar",
                size: 28,
              }),
            ],
          }),

          // City and Year
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 1440 },
            children: [
              new TextRun({
                text: `Toshkent – ${docData.year || 2026}`,
                bold: true,
                size: 26,
              }),
            ],
          }),
        ],
      },

      // 2. MAIN CONTENT SECTION (With page numbers, standard margins)
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8), // 2 cm
              bottom: convertInchesToTwip(0.8), // 2 cm
              left: convertInchesToTwip(1.18), // 3 cm
              right: convertInchesToTwip(0.6), // 1.5 cm
            },
            pageNumbers: {
              start: 2,
              formatType: NumberFormat.DECIMAL,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 22,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // MUNDARIJA (TABLE OF CONTENTS)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 480 },
            children: [
              new TextRun({
                text: "MUNDARIJA",
                bold: true,
                size: 32, // 16pt
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 180 },
            children: [
              new TextRun({ text: "KIRISH ................................................................................................................... 3", bold: true, size: 28 }),
            ],
          }),
          ...(docData.outlines || []).map((out, idx) => {
            return new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { after: 140 },
              children: [
                new TextRun({
                  text: `${out.title} ................................................................................. ${idx + 4}`,
                  size: 26,
                }),
              ],
            });
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 140, after: 180 },
            children: [
              new TextRun({ text: "XULOSA .................................................................................................................", bold: true, size: 28 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 360 },
            children: [
              new TextRun({ text: "FOYDALANILGAN ADABIYOTLAR RO'YXATI .........................................................", bold: true, size: 28 }),
            ],
          }),

          // PAGE BREAK TO INTRODUCTION
          new Paragraph({ children: [new PageBreak()] }),

          // KIRISH
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 360 },
            children: [
              new TextRun({
                text: "KIRISH",
                bold: true,
                size: 32,
              }),
            ],
          }),
          ...(docData.introduction || "Ushbu tadqiqotda mavzuning dolzarbligi va asosiy maqsadlari yoritiladi.")
            .split("\n\n")
            .map((p) => {
              return new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                indent: { firstLine: convertInchesToTwip(0.5) }, // 1.25 cm standard tab indent
                spacing: { line: 360, after: 180 },
                children: [new TextRun({ text: p, size: 28 })],
              });
            }),

          // PAGE BREAK TO BODY SECTIONS
          new Paragraph({ children: [new PageBreak()] }),

          // SECTIONS (REJALAR)
          ...(docData.sections || []).flatMap((section) => {
            return [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 480, after: 360 },
                children: [
                  new TextRun({
                    text: section.title.toUpperCase(),
                    bold: true,
                    size: 30,
                  }),
                ],
              }),
              ...section.content.split("\n\n").map((par) => {
                return new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  indent: { firstLine: convertInchesToTwip(0.5) },
                  spacing: { line: 360, after: 180 },
                  children: [new TextRun({ text: par, size: 28 })],
                });
              }),
            ];
          }),

          // PAGE BREAK TO CONCLUSION
          new Paragraph({ children: [new PageBreak()] }),

          // XULOSA
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 360 },
            children: [
              new TextRun({
                text: "XULOSA",
                bold: true,
                size: 32,
              }),
            ],
          }),
          ...(docData.conclusion || "Mavzu bo'yicha asosiy xulosalar ishlab chiqildi.")
            .split("\n\n")
            .map((p) => {
              return new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                indent: { firstLine: convertInchesToTwip(0.5) },
                spacing: { line: 360, after: 180 },
                children: [new TextRun({ text: p, size: 28 })],
              });
            }),

          // PAGE BREAK TO REFERENCES
          new Paragraph({ children: [new PageBreak()] }),

          // ADABIYOTLAR RO'YXATI
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 360 },
            children: [
              new TextRun({
                text: "FOYDALANILGAN ADABIYOTLAR RO'YXATI",
                bold: true,
                size: 32,
              }),
            ],
          }),
          ...(docData.references || []).map((ref) => {
            return new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { line: 360, after: 140 },
              indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.3) },
              children: [new TextRun({ text: ref, size: 26 })],
            });
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeTitle = docData.title.replace(/[^a-zA-Z0-9_\u0400-\u04FF]/g, '_').slice(0, 35) || 'Hujjat';
  saveAs(blob, `${safeTitle}_${docTypeName}_YordamchiAI.docx`);
}

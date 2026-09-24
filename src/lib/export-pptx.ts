import pptxgen from 'pptxgenjs';
import { SlideData, SlideTheme } from '@/types';

/**
 * Rasmni base64 formatiga o'tkazish yordamchisi (CORS xavfsiz va tez)
 */
async function urlToBase64(url: string, timeoutMs: number = 3500): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith('data:image')) return url;

  const fetchPromise = (async () => {
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') resolve(reader.result);
          else resolve(null as any);
        };
        reader.onerror = () => resolve(null as any);
        reader.readAsDataURL(blob);
      });
    } catch {
      // Canvas orqali fallback
      try {
        return await new Promise<string | null>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || 800;
              canvas.height = img.naturalHeight || 600;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
              } else {
                resolve(null);
              }
            } catch {
              resolve(null);
            }
          };
          img.onerror = () => resolve(null);
          img.src = url;
        });
      } catch {
        return null;
      }
    }
  })();

  const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs));
  return Promise.race([fetchPromise, timeoutPromise]);
}

export async function exportPresentationToPptx(
  topicTitle: string,
  slides: SlideData[],
  theme: SlideTheme,
  authorName: string = "Talaba / Tadqiqotchi",
  institution: string = "O'zbekiston OTM"
) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = topicTitle;
  pres.author = authorName;
  pres.company = institution;

  // Har bir slaydni tartib bilan eksport qilish (for loop orqali async rasm yuklanishini kutamiz)
  for (let idx = 0; idx < slides.length; idx++) {
    const slide = slides[idx];
    const pptxSlide = pres.addSlide();
    
    // Fon rangi
    pptxSlide.background = { color: theme.pptxBg };

    // Slayd raqami va footer brendingi (tituldan tashqari barcha slaydlarda)
    if (slide.layout !== 'title') {
      pptxSlide.addText(`${idx + 1} / ${slides.length}`, {
        x: '86%',
        y: '93%',
        w: '10%',
        h: '4%',
        fontSize: 9,
        color: theme.pptxTextColor,
        align: 'right',
      });

      pptxSlide.addText(`Yordamchi AI  •  ${topicTitle.slice(0, 45)}`, {
        x: '6%',
        y: '93%',
        w: '75%',
        h: '4%',
        fontSize: 9,
        color: theme.pptxTextColor,
      });
    }

    if (slide.layout === 'title') {
      // ==========================================
      // 1. TITUL SLAYDI
      // ==========================================
      pptxSlide.addShape(pres.ShapeType.rect, {
        x: '10%',
        y: '18%',
        w: '12%',
        h: '1.5%',
        fill: { color: theme.pptxAccentColor },
        line: { color: theme.pptxAccentColor },
      });

      pptxSlide.addText(institution.toUpperCase(), {
        x: '10%',
        y: '22%',
        w: '80%',
        h: '6%',
        fontSize: 12,
        bold: true,
        color: theme.pptxAccentColor,
      });

      pptxSlide.addText(slide.title, {
        x: '10%',
        y: '29%',
        w: '80%',
        h: '24%',
        fontSize: 30,
        bold: true,
        color: theme.pptxTextColor,
        valign: 'middle',
      });

      if (slide.subtitle) {
        pptxSlide.addText(slide.subtitle, {
          x: '10%',
          y: '54%',
          w: '80%',
          h: '8%',
          fontSize: 15,
          color: theme.pptxTextColor,
        });
      }

      pptxSlide.addShape(pres.ShapeType.roundRect, {
        x: '10%',
        y: '66%',
        w: '80%',
        h: '18%',
        fill: { color: theme.pptxCardBg },
        rectRadius: 0.1,
      });

      pptxSlide.addText([
        { text: `Tayyorladi: `, options: { bold: true, color: theme.pptxAccentColor, fontSize: 13 } },
        { text: `${authorName}\n`, options: { color: theme.pptxTextColor, fontSize: 13 } },
        { text: `Platforma: `, options: { bold: true, color: theme.pptxAccentColor, fontSize: 11 } },
        { text: `Yordamchi AI  •  2026-yil, Toshkent`, options: { color: theme.pptxTextColor, fontSize: 11 } },
      ], {
        x: '12%',
        y: '68%',
        w: '76%',
        h: '14%',
        valign: 'middle',
      });

    } else if (idx === 1 || slide.title.toLowerCase().includes('reja') || slide.title.toLowerCase().includes('mundarija')) {
      // ==========================================
      // 2. REJALAR (MUNDARIJA) SLAYDI
      // ==========================================
      pptxSlide.addText(`MUNDARIJA`, {
        x: '6%',
        y: '6%',
        w: '88%',
        h: '4%',
        fontSize: 10,
        bold: true,
        color: theme.pptxAccentColor,
      });

      pptxSlide.addText(slide.title, {
        x: '6%',
        y: '10%',
        w: '88%',
        h: '7%',
        fontSize: 24,
        bold: true,
        color: theme.pptxTextColor,
      });

      if (slide.subtitle) {
        pptxSlide.addText(slide.subtitle, {
          x: '6%',
          y: '17%',
          w: '88%',
          h: '4%',
          fontSize: 12,
          italic: true,
          color: theme.pptxTextColor,
        });
      }

      // Rejalar ro'yxati
      if (slide.bullets.length > 4) {
        // 2 USTUNLI REJALAR (5 tadan oshganda)
        const mid = Math.ceil(slide.bullets.length / 2);
        const col1 = slide.bullets.slice(0, mid);
        const col2 = slide.bullets.slice(mid);

        // 1-ustun kartochkasi
        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: '6%',
          y: '23%',
          w: '43%',
          h: '65%',
          fill: { color: theme.pptxCardBg },
          rectRadius: 0.08,
          line: { color: theme.pptxAccentColor, width: 1 },
        });

        // 2-ustun kartochkasi
        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: '51%',
          y: '23%',
          w: '43%',
          h: '65%',
          fill: { color: theme.pptxCardBg },
          rectRadius: 0.08,
          line: { color: theme.pptxAccentColor, width: 1 },
        });

        const col1Items: pptxgen.TextProps[] = col1.map((b) => ({
          text: `📌  ${b.trim()}`,
          options: {
            fontSize: slide.bullets.length > 8 ? 11.5 : 12.5,
            bold: true,
            color: theme.pptxTextColor,
            spaceAfter: 10,
          }
        }));

        const col2Items: pptxgen.TextProps[] = col2.map((b) => ({
          text: `📌  ${b.trim()}`,
          options: {
            fontSize: slide.bullets.length > 8 ? 11.5 : 12.5,
            bold: true,
            color: theme.pptxTextColor,
            spaceAfter: 10,
          }
        }));

        pptxSlide.addText(col1Items, {
          x: '8%',
          y: '26%',
          w: '39%',
          h: '59%',
          valign: 'top',
        });

        pptxSlide.addText(col2Items, {
          x: '53%',
          y: '26%',
          w: '39%',
          h: '59%',
          valign: 'top',
        });
      } else {
        // BIR USTUNLI REJALAR (4 ta yoki undan kam bo'lsa)
        const count = Math.max(1, slide.bullets.length);
        const cardH = Math.min(62, 16 + count * 11);
        const cardY = 23 + Math.max(0, Math.floor((62 - cardH) / 2));

        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: '8%',
          y: `${cardY}%`,
          w: '84%',
          h: `${cardH}%`,
          fill: { color: theme.pptxCardBg },
          rectRadius: 0.1,
          line: { color: theme.pptxAccentColor, width: 1 },
        });

        const rejaItems: pptxgen.TextProps[] = slide.bullets.map((b) => ({
          text: `📌  ${b.trim()}`,
          options: {
            fontSize: 14,
            bold: true,
            color: theme.pptxTextColor,
            spaceAfter: 12,
          }
        }));

        pptxSlide.addText(rejaItems, {
          x: '11%',
          y: `${cardY + 3}%`,
          w: '78%',
          h: `${cardH - 6}%`,
          valign: 'top',
        });
      }

    } else if (slide.layout === 'split' || slide.imageUrl) {
      // ==========================================
      // 3. REJA JAVOBLARI + HAQIQIY RASM SLAYDI (Canva uslubida)
      // ==========================================
      pptxSlide.addText(`REJA TAHLILI`, {
        x: '6%',
        y: '6%',
        w: '55%',
        h: '4%',
        fontSize: 10,
        bold: true,
        color: theme.pptxAccentColor,
      });

      pptxSlide.addText(slide.title, {
        x: '6%',
        y: '10%',
        w: '55%',
        h: '7%',
        fontSize: 22,
        bold: true,
        color: theme.pptxTextColor,
      });

      if (slide.subtitle) {
        pptxSlide.addText(slide.subtitle, {
          x: '6%',
          y: '17%',
          w: '55%',
          h: '4%',
          fontSize: 11,
          italic: true,
          color: theme.pptxTextColor,
        });
      }

      // Chap tomon: Matn kartochkasi (ortiqcha nuqtalar yo'q, toza UI)
      pptxSlide.addShape(pres.ShapeType.roundRect, {
        x: '6%',
        y: '23%',
        w: '54%',
        h: '65%',
        fill: { color: theme.pptxCardBg },
        rectRadius: 0.08,
      });

      const bulletItems: pptxgen.TextProps[] = slide.bullets.map((b) => ({
        text: b.trim(),
        options: {
          fontSize: slide.bullets.length > 3 ? 12 : 13.5,
          color: theme.pptxTextColor,
          bullet: true,
          spaceAfter: slide.bullets.length > 3 ? 8 : 12,
        }
      }));

      pptxSlide.addText(bulletItems, {
        x: '8%',
        y: '26%',
        w: '50%',
        h: '59%',
        valign: 'top',
      });

      // O'ng tomon: HAQIQIY RASM KARTASI
      // Rasm kartochkasi orqa foni va hoshiyasi
      pptxSlide.addShape(pres.ShapeType.roundRect, {
        x: '62%',
        y: '23%',
        w: '32%',
        h: '65%',
        fill: { color: theme.pptxCardBg },
        rectRadius: 0.1,
        line: { color: theme.pptxAccentColor, width: 1.5 },
      });

      if (slide.imageUrl) {
        try {
          const base64Data = await urlToBase64(slide.imageUrl);
          if (base64Data) {
            pptxSlide.addImage({
              data: base64Data,
              x: '63%',
              y: '24.5%',
              w: '30%',
              h: '54%',
              rounding: true,
              sizing: { type: 'cover', w: 3.0, h: 3.0 }
            });
          } else {
            pptxSlide.addImage({
              path: slide.imageUrl,
              x: '63%',
              y: '24.5%',
              w: '30%',
              h: '54%',
              rounding: true,
              sizing: { type: 'cover', w: 3.0, h: 3.0 }
            });
          }
        } catch (imgErr) {
          console.warn("PPTX image embedding failed:", imgErr);
        }
      }

      // Rasm ostidagi tavsif (Caption)
      pptxSlide.addText(slide.imageCaption || "Mavzuga oid illyustratsiya", {
        x: '63%',
        y: '80%',
        w: '30%',
        h: '6%',
        fontSize: 9.5,
        italic: true,
        color: theme.pptxTextColor,
        align: 'center',
      });

    } else {
      // ==========================================
      // 4. TO'LIQ KENGLIKDAGI JAVOB SLAYDI (Rasm bo'lmaganda)
      // ==========================================
      pptxSlide.addText(`REJA ASOSIDAGI TAHLIL`, {
        x: '6%',
        y: '6%',
        w: '88%',
        h: '4%',
        fontSize: 10,
        bold: true,
        color: theme.pptxAccentColor,
      });

      pptxSlide.addText(slide.title, {
        x: '6%',
        y: '10%',
        w: '88%',
        h: '7%',
        fontSize: 22,
        bold: true,
        color: theme.pptxTextColor,
      });

      if (slide.subtitle) {
        pptxSlide.addText(slide.subtitle, {
          x: '6%',
          y: '17%',
          w: '88%',
          h: '4%',
          fontSize: 12,
          italic: true,
          color: theme.pptxTextColor,
        });
      }

      if (slide.bullets.length > 4) {
        const mid = Math.ceil(slide.bullets.length / 2);
        const col1 = slide.bullets.slice(0, mid);
        const col2 = slide.bullets.slice(mid);

        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: '6%',
          y: '23%',
          w: '43%',
          h: '65%',
          fill: { color: theme.pptxCardBg },
          rectRadius: 0.08,
        });

        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: '51%',
          y: '23%',
          w: '43%',
          h: '65%',
          fill: { color: theme.pptxCardBg },
          rectRadius: 0.08,
        });

        const col1Items: pptxgen.TextProps[] = col1.map((b) => ({
          text: b.trim(),
          options: {
            fontSize: slide.bullets.length > 8 ? 11.5 : 12.5,
            color: theme.pptxTextColor,
            bullet: true,
            spaceAfter: 8,
          }
        }));

        const col2Items: pptxgen.TextProps[] = col2.map((b) => ({
          text: b.trim(),
          options: {
            fontSize: slide.bullets.length > 8 ? 11.5 : 12.5,
            color: theme.pptxTextColor,
            bullet: true,
            spaceAfter: 8,
          }
        }));

        pptxSlide.addText(col1Items, {
          x: '8%',
          y: '26%',
          w: '39%',
          h: '59%',
          valign: 'top',
        });

        pptxSlide.addText(col2Items, {
          x: '53%',
          y: '26%',
          w: '39%',
          h: '59%',
          valign: 'top',
        });
      } else {
        const count = Math.max(1, slide.bullets.length);
        const cardH = Math.min(64, 18 + count * 11);
        const cardY = 23 + Math.max(0, Math.floor((64 - cardH) / 2));

        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: '8%',
          y: `${cardY}%`,
          w: '84%',
          h: `${cardH}%`,
          fill: { color: theme.pptxCardBg },
          rectRadius: 0.1,
        });

        const bulletItems: pptxgen.TextProps[] = slide.bullets.map((b) => ({
          text: b.trim(),
          options: {
            fontSize: 13.5,
            color: theme.pptxTextColor,
            bullet: true,
            spaceAfter: 12,
          }
        }));

        pptxSlide.addText(bulletItems, {
          x: '11%',
          y: `${cardY + 3}%`,
          w: '78%',
          h: `${cardH - 6}%`,
          valign: 'top',
        });
      }
    }

    if (slide.notes) {
      pptxSlide.addNotes(slide.notes);
    }
  }

  const safeFileName = topicTitle.replace(/[^a-zA-Z0-9_\u0400-\u04FF]/g, '_').slice(0, 40) || 'Taqdimot';
  await pres.writeFile({ fileName: `${safeFileName}_YordamchiAI.pptx` });
}

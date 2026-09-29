import pptxgen from 'pptxgenjs';
import { SlideData, SlideTheme } from '@/types';

/**
 * Rasmni base64 formatiga o'tkazish yordamchisi (CORS xavfsiz va ishonchli)
 */
async function urlToBase64(url: string, timeoutMs: number = 5000): Promise<string | null> {
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
                resolve(canvas.toDataURL('image/jpeg', 0.88));
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

/**
 * Fon rangiga qarab oq yoki to'q matn rangini aniqlash (maksimal o'qiluvchanlik uchun)
 */
function getContrastColor(hexColor: string): string {
  const clean = hexColor.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 135 ? '0F172A' : 'FFFFFF';
}

/**
 * Reja yoki fikr qatoridan ortiqcha emojilar va raqamlarni tozalab, tartibli obyekt qaytarish
 */
function cleanBulletItem(text: string, defaultIndex: number): { num: string; text: string } {
  const trimmed = text.trim();
  const numMatch = trimmed.match(/^(?:📌\s*|•\s*|\-\s*)?(\d+)[\.\)]\s*(.*)$/);
  if (numMatch) {
    return {
      num: numMatch[1],
      text: numMatch[2].replace(/^[📌•\-\*]\s*/, '').trim()
    };
  }
  const clean = trimmed.replace(/^(?:📌|•|\-|\*)\s*/, '').trim();
  return {
    num: `${defaultIndex}`,
    text: clean
  };
}

export async function exportPresentationToPptx(
  topicTitle: string,
  slides: SlideData[],
  theme: SlideTheme,
  authorName: string = "Talaba / Tadqiqotchi",
  institution: string = "O'zbekiston Milliy Universiteti"
) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = topicTitle;
  pres.author = authorName;
  pres.company = institution;

  // Universallashgan zamonaviy shrift
  const mainFont = theme.fontFamily.includes('serif') ? 'Georgia' : 'Arial';
  const badgeTextColor = getContrastColor(theme.pptxAccentColor);

  for (let idx = 0; idx < slides.length; idx++) {
    const slide = slides[idx];
    const pptxSlide = pres.addSlide();

    // Fon rangi
    pptxSlide.background = { color: theme.pptxBg };

    const isFirstSlide = idx === 0 && slide.layout === 'title';
    const isClosingSlide = (idx === slides.length - 1 && slide.title.toLowerCase().includes('rahmat')) ||
                           (slide.layout === 'title' && idx > 0);
    const isRejaSlide = !isFirstSlide && !isClosingSlide &&
                        (idx === 1 || slide.title.toLowerCase().includes('reja') || slide.title.toLowerCase().includes('mundarija'));

    // Slayd raqami va footer brendingi (titul va closingdan tashqari barcha slaydlarda)
    if (!isFirstSlide && !isClosingSlide) {
      pptxSlide.addText(`${idx + 1} / ${slides.length}`, {
        x: '86%',
        y: '93%',
        w: '10%',
        h: '4%',
        fontSize: 9,
        color: theme.pptxTextColor,
        align: 'right',
        fontFace: mainFont,
      });

      pptxSlide.addText(`Yordamchi AI  •  ${topicTitle.slice(0, 45)}`, {
        x: '6%',
        y: '93%',
        w: '75%',
        h: '4%',
        fontSize: 9,
        color: theme.pptxTextColor,
        fontFace: mainFont,
      });
    }

    // ==========================================
    // 1. TITUL SLAYDI (BIRINCHI BET)
    // ==========================================
    if (isFirstSlide) {
      // Institut yoki ta'lim muassasasi sarlavhasi
      pptxSlide.addShape(pres.ShapeType.roundRect, {
        x: '10%',
        y: '14%',
        w: '40%',
        h: '5%',
        fill: { color: theme.pptxCardBg },
        line: { color: theme.pptxAccentColor, width: 1 },
        rectRadius: 0.12,
      });

      pptxSlide.addText(institution.toUpperCase(), {
        x: '11%',
        y: '14%',
        w: '38%',
        h: '5%',
        fontSize: 11,
        bold: true,
        color: theme.pptxAccentColor,
        valign: 'middle',
        fontFace: mainFont,
      });

      // Asosiy mavzu sarlavhasi (katta va chiroyli)
      const titleFontSize = slide.title.length > 55 ? 26 : (slide.title.length > 35 ? 30 : 34);
      pptxSlide.addText(slide.title, {
        x: '10%',
        y: '22%',
        w: '80%',
        h: '28%',
        fontSize: titleFontSize,
        bold: true,
        color: theme.pptxTextColor,
        valign: 'middle',
        fontFace: mainFont,
      });

      // Bezak chizig'i
      pptxSlide.addShape(pres.ShapeType.rect, {
        x: '10%',
        y: '51%',
        w: '14%',
        h: '0.8%',
        fill: { color: theme.pptxAccentColor },
        line: { color: theme.pptxAccentColor },
      });

      if (slide.subtitle) {
        pptxSlide.addText(slide.subtitle, {
          x: '10%',
          y: '54%',
          w: '80%',
          h: '8%',
          fontSize: 14,
          italic: true,
          color: theme.pptxTextColor,
          valign: 'top',
          fontFace: mainFont,
        });
      }

      // Muallif va platforma kartochkasi
      pptxSlide.addShape(pres.ShapeType.roundRect, {
        x: '10%',
        y: '67%',
        w: '80%',
        h: '18%',
        fill: { color: theme.pptxCardBg },
        line: { color: theme.pptxAccentColor, width: 1 },
        rectRadius: 0.1,
      });

      pptxSlide.addText([
        { text: `Tayyorladi: `, options: { bold: true, color: theme.pptxAccentColor, fontSize: 13 } },
        { text: `${authorName}\n`, options: { color: theme.pptxTextColor, fontSize: 13, breakLine: true } },
        { text: `Platforma: `, options: { bold: true, color: theme.pptxAccentColor, fontSize: 11 } },
        { text: `Yordamchi AI  •  2026-yil, Toshkent`, options: { color: theme.pptxTextColor, fontSize: 11 } },
      ], {
        x: '12%',
        y: '69%',
        w: '76%',
        h: '14%',
        valign: 'middle',
        fontFace: mainFont,
      });

    // ==========================================
    // 2. YAKUNIY / RAHMAT SLAYDI (OXIRGI BET)
    // ==========================================
    } else if (isClosingSlide) {
      // Markaziy bayramona yakunlovchi slayd
      pptxSlide.addText(`YAKUNIY TAHLIL VA XULOSA`, {
        x: '10%',
        y: '14%',
        w: '80%',
        h: '5%',
        fontSize: 11,
        bold: true,
        color: theme.pptxAccentColor,
        align: 'center',
        fontFace: mainFont,
      });

      pptxSlide.addText(slide.title, {
        x: '10%',
        y: '22%',
        w: '80%',
        h: '18%',
        fontSize: 34,
        bold: true,
        color: theme.pptxTextColor,
        align: 'center',
        valign: 'middle',
        fontFace: mainFont,
      });

      // Markaziy chiziq
      pptxSlide.addShape(pres.ShapeType.rect, {
        x: '43%',
        y: '42%',
        w: '14%',
        h: '0.8%',
        fill: { color: theme.pptxAccentColor },
        line: { color: theme.pptxAccentColor },
      });

      if (slide.subtitle) {
        pptxSlide.addText(slide.subtitle, {
          x: '10%',
          y: '46%',
          w: '80%',
          h: '7%',
          fontSize: 15,
          italic: true,
          color: theme.pptxTextColor,
          align: 'center',
          fontFace: mainFont,
        });
      }

      // 3 ta qulay xulosa kartochkalari yonma-yon
      const closingCards = [
        { title: "Savol va Mulohazalar", desc: "Taqdimot yuzasidan savollaringizni berishingiz mumkin" },
        { title: "Ilmiy Munozara", desc: "Taklif va tavsiyalar uchun ochiq muloqot" },
        { title: "Yordamchi AI", desc: "Akademik izlanishlar va taqdimotlar platformasi" }
      ];

      closingCards.forEach((c, cIdx) => {
        const cardX = 10 + cIdx * 28;
        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: `${cardX}%`,
          y: '58%',
          w: '24%',
          h: '22%',
          fill: { color: theme.pptxCardBg },
          line: { color: theme.pptxAccentColor, width: 1 },
          rectRadius: 0.1,
        });

        pptxSlide.addText([
          { text: `${c.title}\n`, options: { bold: true, color: theme.pptxAccentColor, fontSize: 13, breakLine: true } },
          { text: c.desc, options: { color: theme.pptxTextColor, fontSize: 10.5 } }
        ], {
          x: `${cardX + 1.5}%`,
          y: '60%',
          w: '21%',
          h: '18%',
          align: 'center',
          valign: 'middle',
          fontFace: mainFont,
        });
      });

    // ==========================================
    // 3. REJALAR (MUNDARIJA) SLAYDI
    // ==========================================
    } else if (isRejaSlide) {
      // Slayd sarlavhasi
      pptxSlide.addText(`MUNDARIJA`, {
        x: '6%',
        y: '6%',
        w: '88%',
        h: '4%',
        fontSize: 10.5,
        bold: true,
        color: theme.pptxAccentColor,
        fontFace: mainFont,
      });

      pptxSlide.addText(slide.title, {
        x: '6%',
        y: '10%',
        w: '88%',
        h: '7%',
        fontSize: 24,
        bold: true,
        color: theme.pptxTextColor,
        fontFace: mainFont,
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
          fontFace: mainFont,
        });
      }

      const items = slide.bullets.map((b, i) => cleanBulletItem(b, i + 1));
      const hasImage = Boolean(slide.imageUrl);

      // Agar rasm mavjud bo'lsa: chap tomonda alohida kartochkalar, o'ngda rasm
      if (hasImage) {
        const count = items.length;
        const totalHeight = 64;
        const cardH = Math.min(13.5, (totalHeight - (count - 1) * 2.2) / count);
        const gap = count > 1 ? (totalHeight - count * cardH) / (count - 1) : 0;

        items.forEach((item, i) => {
          const itemY = 23 + i * (cardH + gap);

          // Kartochka foni
          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '6%',
            y: `${itemY}%`,
            w: '52%',
            h: `${cardH}%`,
            fill: { color: theme.pptxCardBg },
            line: { color: theme.pptxAccentColor, width: 1 },
            rectRadius: 0.08,
          });

          // Chapdagi raqamli nishon (Badge)
          const badgeSize = Math.min(cardH * 0.72, 7.5);
          const badgeY = itemY + (cardH - badgeSize) / 2;
          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '7.8%',
            y: `${badgeY}%`,
            w: '5%',
            h: `${badgeSize}%`,
            fill: { color: theme.pptxAccentColor },
            rectRadius: 0.12,
          });

          pptxSlide.addText(item.num, {
            x: '7.8%',
            y: `${badgeY}%`,
            w: '5%',
            h: `${badgeSize}%`,
            fontSize: 13,
            bold: true,
            color: badgeTextColor,
            align: 'center',
            valign: 'middle',
            fontFace: mainFont,
          });

          // Reja matni
          pptxSlide.addText(item.text, {
            x: '14.5%',
            y: `${itemY}%`,
            w: '42%',
            h: `${cardH}%`,
            fontSize: count > 4 ? 12 : 13.5,
            bold: true,
            color: theme.pptxTextColor,
            valign: 'middle',
            fontFace: mainFont,
          });
        });

        // O'ng tomon: Rasm kartochkasi
        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: '62%',
          y: '23%',
          w: '32%',
          h: '64%',
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
                h: '53%',
                rounding: true,
                sizing: { type: 'cover', w: 3.0, h: 3.0 }
              });
            } else {
              pptxSlide.addImage({
                path: slide.imageUrl,
                x: '63%',
                y: '24.5%',
                w: '30%',
                h: '53%',
                rounding: true,
                sizing: { type: 'cover', w: 3.0, h: 3.0 }
              });
            }
          } catch (imgErr) {
            console.warn("PPTX image embedding failed:", imgErr);
          }
        }

        pptxSlide.addText(slide.imageCaption || "Mavzuga oid illyustratsiya", {
          x: '63%',
          y: '79%',
          w: '30%',
          h: '6%',
          fontSize: 9.5,
          italic: true,
          color: theme.pptxTextColor,
          align: 'center',
          fontFace: mainFont,
        });

      // Agar rasm bo'lmasa va 5 tagacha reja bo'lsa (HAR BIR REJA ALOHIDA GO'ZAL KARTOCHKA)
      } else if (items.length <= 5) {
        const count = items.length;
        const totalHeight = 64;
        const cardH = Math.min(13.5, (totalHeight - (count - 1) * 2.5) / count);
        const gap = count > 1 ? (totalHeight - count * cardH) / (count - 1) : 0;

        items.forEach((item, i) => {
          const itemY = 23 + i * (cardH + gap);

          // Alohida chiroyli kartochka (qatorlar bir-biriga aslo yopishmaydi)
          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '6%',
            y: `${itemY}%`,
            w: '88%',
            h: `${cardH}%`,
            fill: { color: theme.pptxCardBg },
            line: { color: theme.pptxAccentColor, width: 1 },
            rectRadius: 0.08,
          });

          // Chap tomondagi rangli raqam nishoni
          const badgeSize = Math.min(cardH * 0.72, 8.5);
          const badgeY = itemY + (cardH - badgeSize) / 2;
          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '7.8%',
            y: `${badgeY}%`,
            w: '4.5%',
            h: `${badgeSize}%`,
            fill: { color: theme.pptxAccentColor },
            rectRadius: 0.12,
          });

          pptxSlide.addText(item.num, {
            x: '7.8%',
            y: `${badgeY}%`,
            w: '4.5%',
            h: `${badgeSize}%`,
            fontSize: 14,
            bold: true,
            color: badgeTextColor,
            align: 'center',
            valign: 'middle',
            fontFace: mainFont,
          });

          // Reja sarlavhasi
          pptxSlide.addText(item.text, {
            x: '13.8%',
            y: `${itemY}%`,
            w: '79%',
            h: `${cardH}%`,
            fontSize: 14,
            bold: true,
            color: theme.pptxTextColor,
            valign: 'middle',
            fontFace: mainFont,
          });
        });

      // Agar rasm bo'lmasa va 5 tadan ko'p bo'lsa: 2 USTUNLI ALOHIDA KARTOCHKALAR
      } else {
        const mid = Math.ceil(items.length / 2);
        const col1 = items.slice(0, mid);
        const col2 = items.slice(mid);
        const rowsCount = mid;
        const totalHeight = 64;
        const cardH = Math.min(11.5, (totalHeight - (rowsCount - 1) * 2) / rowsCount);
        const gap = rowsCount > 1 ? (totalHeight - rowsCount * cardH) / (rowsCount - 1) : 0;

        // 1-ustun kartochkalari
        col1.forEach((item, i) => {
          const itemY = 23 + i * (cardH + gap);

          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '6%',
            y: `${itemY}%`,
            w: '43%',
            h: `${cardH}%`,
            fill: { color: theme.pptxCardBg },
            line: { color: theme.pptxAccentColor, width: 1 },
            rectRadius: 0.08,
          });

          const badgeSize = Math.min(cardH * 0.72, 7);
          const badgeY = itemY + (cardH - badgeSize) / 2;
          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '7.5%',
            y: `${badgeY}%`,
            w: '5%',
            h: `${badgeSize}%`,
            fill: { color: theme.pptxAccentColor },
            rectRadius: 0.12,
          });

          pptxSlide.addText(item.num, {
            x: '7.5%',
            y: `${badgeY}%`,
            w: '5%',
            h: `${badgeSize}%`,
            fontSize: 12,
            bold: true,
            color: badgeTextColor,
            align: 'center',
            valign: 'middle',
            fontFace: mainFont,
          });

          pptxSlide.addText(item.text, {
            x: '13.5%',
            y: `${itemY}%`,
            w: '34.5%',
            h: `${cardH}%`,
            fontSize: 12,
            bold: true,
            color: theme.pptxTextColor,
            valign: 'middle',
            fontFace: mainFont,
          });
        });

        // 2-ustun kartochkalari
        col2.forEach((item, i) => {
          const itemY = 23 + i * (cardH + gap);

          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '51%',
            y: `${itemY}%`,
            w: '43%',
            h: `${cardH}%`,
            fill: { color: theme.pptxCardBg },
            line: { color: theme.pptxAccentColor, width: 1 },
            rectRadius: 0.08,
          });

          const badgeSize = Math.min(cardH * 0.72, 7);
          const badgeY = itemY + (cardH - badgeSize) / 2;
          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '52.5%',
            y: `${badgeY}%`,
            w: '5%',
            h: `${badgeSize}%`,
            fill: { color: theme.pptxAccentColor },
            rectRadius: 0.12,
          });

          pptxSlide.addText(item.num, {
            x: '52.5%',
            y: `${badgeY}%`,
            w: '5%',
            h: `${badgeSize}%`,
            fontSize: 12,
            bold: true,
            color: badgeTextColor,
            align: 'center',
            valign: 'middle',
            fontFace: mainFont,
          });

          pptxSlide.addText(item.text, {
            x: '58.5%',
            y: `${itemY}%`,
            w: '34.5%',
            h: `${cardH}%`,
            fontSize: 12,
            bold: true,
            color: theme.pptxTextColor,
            valign: 'middle',
            fontFace: mainFont,
          });
        });
      }

    // ==========================================
    // 4. GAMMA STATS / KPI SLAYDI
    // ==========================================
    } else if (slide.layout === 'stats' || (slide.statsData && slide.statsData.length > 0)) {
      pptxSlide.addText(`STATISTIK TAHLIL VA KO'RSATKICHLAR`, {
        x: '6%',
        y: '6%',
        w: '88%',
        h: '4%',
        fontSize: 10.5,
        bold: true,
        color: theme.pptxAccentColor,
        fontFace: mainFont,
      });

      pptxSlide.addText(slide.title, {
        x: '6%',
        y: '10%',
        w: '88%',
        h: '7%',
        fontSize: 22,
        bold: true,
        color: theme.pptxTextColor,
        fontFace: mainFont,
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
          fontFace: mainFont,
        });
      }

      // Yuqoridagi xulosa / kirish fikri (slide.bullets[0])
      if (slide.bullets && slide.bullets.length > 0) {
        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: '6%',
          y: '22%',
          w: '88%',
          h: '10%',
          fill: { color: theme.pptxCardBg },
          line: { color: theme.pptxAccentColor, width: 0.8 },
          rectRadius: 0.08,
        });
        pptxSlide.addText(`💡 ${slide.bullets[0]}`, {
          x: '8%',
          y: '22%',
          w: '84%',
          h: '10%',
          fontSize: 11.5,
          color: theme.pptxTextColor,
          valign: 'middle',
          fontFace: mainFont,
        });
      }

      // 3 ta Katta KPI Kartochkalari
      const stats = (slide.statsData && slide.statsData.length > 0) ? slide.statsData.slice(0, 3) : [
        { value: '+35%', label: "Samaradorlik o'sishi", change: "Yillik prognoz" },
        { value: '2.5x', label: "Jarayonlar tezlashuvi", change: "Raqamlashtirish" },
        { value: '92%', label: "Muvaffaqiyatli qamrov", change: "O'zbekistonda" }
      ];

      const startY = (slide.bullets && slide.bullets.length > 0) ? 35 : 25;
      const cardHeight = (slide.bullets && slide.bullets.length > 0) ? 52 : 62;

      stats.forEach((st, sIdx) => {
        const cardX = 6 + sIdx * 30.5;

        // Katta kartochka
        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: `${cardX}%`,
          y: `${startY}%`,
          w: '27%',
          h: `${cardHeight}%`,
          fill: { color: theme.pptxCardBg },
          line: { color: theme.pptxAccentColor, width: 1.5 },
          rectRadius: 0.12,
        });

        // Yuqori badge
        if (st.change) {
          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: `${cardX + 2}%`,
            y: `${startY + 3}%`,
            w: '23%',
            h: '6%',
            fill: { color: theme.pptxAccentColor },
            rectRadius: 0.1,
          });
          pptxSlide.addText(st.change.toUpperCase(), {
            x: `${cardX + 2}%`,
            y: `${startY + 3}%`,
            w: '23%',
            h: '6%',
            fontSize: 9.5,
            bold: true,
            color: badgeTextColor,
            align: 'center',
            valign: 'middle',
            fontFace: mainFont,
          });
        }

        // Katta Raqam (Metric)
        pptxSlide.addText(st.value, {
          x: `${cardX + 1}%`,
          y: `${startY + 11}%`,
          w: '25%',
          h: '18%',
          fontSize: 34,
          bold: true,
          color: theme.pptxAccentColor,
          align: 'center',
          valign: 'middle',
          fontFace: mainFont,
        });

        // O'rta Chiziq
        pptxSlide.addShape(pres.ShapeType.rect, {
          x: `${cardX + 7}%`,
          y: `${startY + 31}%`,
          w: '13%',
          h: '0.4%',
          fill: { color: theme.pptxAccentColor },
          line: { color: theme.pptxAccentColor },
        });

        // Tavsif matni (Label)
        pptxSlide.addText(st.label, {
          x: `${cardX + 2}%`,
          y: `${startY + 33}%`,
          w: '23%',
          h: '16%',
          fontSize: 12,
          bold: true,
          color: theme.pptxTextColor,
          align: 'center',
          valign: 'top',
          fontFace: mainFont,
        });
      });

    // ==========================================
    // 5. GAMMA COLUMNS (3 USTUNLI KARTALAR)
    // ==========================================
    } else if (slide.layout === 'columns' || (slide.columnsData && slide.columnsData.length > 0)) {
      pptxSlide.addText(`TIZIMLI TASNIF VA YO'NALISHLAR`, {
        x: '6%',
        y: '6%',
        w: '88%',
        h: '4%',
        fontSize: 10.5,
        bold: true,
        color: theme.pptxAccentColor,
        fontFace: mainFont,
      });

      pptxSlide.addText(slide.title, {
        x: '6%',
        y: '10%',
        w: '88%',
        h: '7%',
        fontSize: 22,
        bold: true,
        color: theme.pptxTextColor,
        fontFace: mainFont,
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
          fontFace: mainFont,
        });
      }

      const columns = (slide.columnsData && slide.columnsData.length > 0) ? slide.columnsData.slice(0, 3) : [
        { title: "Nazariy Asoslar", desc: "Sohaning fundamental tushunchalari va ilmiy metodologiyasi", tag: "1-Yo'nalish" },
        { title: "Amaliy Tatbiq", desc: "Ishlab chiqarish va xizmat ko'rsatish jarayonlariga integratsiya", tag: "2-Yo'nalish" },
        { title: "Kutilayotgan Natija", desc: "Samaradorlikni oshirish va barqaror rivojlanishni ta'minlash", tag: "3-Yo'nalish" }
      ];

      columns.forEach((col, cIdx) => {
        const cardX = 6 + cIdx * 30.5;

        // Kartochka foni
        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: `${cardX}%`,
          y: '24%',
          w: '27%',
          h: '63%',
          fill: { color: theme.pptxCardBg },
          line: { color: theme.pptxAccentColor, width: 1.2 },
          rectRadius: 0.1,
        });

        // Tag nishoni
        const tagText = col.tag || `${cIdx + 1}-YO'NALISH`;
        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: `${cardX + 2}%`,
          y: '27%',
          w: '23%',
          h: '5.5%',
          fill: { color: theme.pptxAccentColor },
          rectRadius: 0.08,
        });
        pptxSlide.addText(tagText.toUpperCase(), {
          x: `${cardX + 2}%`,
          y: '27%',
          w: '23%',
          h: '5.5%',
          fontSize: 9.5,
          bold: true,
          color: badgeTextColor,
          align: 'center',
          valign: 'middle',
          fontFace: mainFont,
        });

        // Ustun sarlavhasi
        pptxSlide.addText(col.title, {
          x: `${cardX + 2}%`,
          y: '35%',
          w: '23%',
          h: '10%',
          fontSize: 14,
          bold: true,
          color: theme.pptxTextColor,
          align: 'center',
          valign: 'middle',
          fontFace: mainFont,
        });

        // Ajratuvchi chiziq
        pptxSlide.addShape(pres.ShapeType.rect, {
          x: `${cardX + 7}%`,
          y: '47%',
          w: '13%',
          h: '0.4%',
          fill: { color: theme.pptxAccentColor },
          line: { color: theme.pptxAccentColor },
        });

        // Ustun tavsifi (desc)
        pptxSlide.addText(col.desc, {
          x: `${cardX + 2.5}%`,
          y: '50%',
          w: '22%',
          h: '32%',
          fontSize: 11.5,
          color: theme.pptxTextColor,
          align: 'left',
          valign: 'top',
          fontFace: mainFont,
          lineSpacing: 18,
        });
      });

    // ==========================================
    // 6. GAMMA TIMELINE (BOSQICHMA-BOSQICH JARAYON)
    // ==========================================
    } else if (slide.layout === 'timeline' || (slide.timelineSteps && slide.timelineSteps.length > 0)) {
      pptxSlide.addText(`BOSQICHMA-BOSQICH JARAYON`, {
        x: '6%',
        y: '6%',
        w: '88%',
        h: '4%',
        fontSize: 10.5,
        bold: true,
        color: theme.pptxAccentColor,
        fontFace: mainFont,
      });

      pptxSlide.addText(slide.title, {
        x: '6%',
        y: '10%',
        w: '88%',
        h: '7%',
        fontSize: 22,
        bold: true,
        color: theme.pptxTextColor,
        fontFace: mainFont,
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
          fontFace: mainFont,
        });
      }

      // Gorizontal tutashtiruvchi chiziq (Connector)
      pptxSlide.addShape(pres.ShapeType.rect, {
        x: '15%',
        y: '27.5%',
        w: '70%',
        h: '0.6%',
        fill: { color: theme.pptxAccentColor },
        line: { color: theme.pptxAccentColor },
      });

      const steps = (slide.timelineSteps && slide.timelineSteps.length > 0) ? slide.timelineSteps.slice(0, 3) : [
        { step: 1, title: "1-Bosqich: Tahlil & Diagnostika", desc: "Mavjud ko'rsatkichlar va me'yoriy asoslarni o'rganish", dateOrPhase: "Dastlabki faza" },
        { step: 2, title: "2-Bosqich: Implementatsiya", desc: "Amaliy mexanizmlar va raqamli vositalarni joriy etish", dateOrPhase: "Asosiy faza" },
        { step: 3, title: "3-Bosqich: Baholash & Xulosa", desc: "Erishilgan natijalar va samaradorlikni tahlil qilish", dateOrPhase: "Yakuniy faza" }
      ];

      steps.forEach((st, sIdx) => {
        const cardX = 6 + sIdx * 30.5;

        // Step raqami ovals/circle
        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: `${cardX + 10}%`,
          y: '24%',
          w: '7%',
          h: '7%',
          fill: { color: theme.pptxAccentColor },
          rectRadius: 0.5,
          line: { color: theme.pptxBg, width: 2 },
        });

        pptxSlide.addText(`${st.step || sIdx + 1}`, {
          x: `${cardX + 10}%`,
          y: '24%',
          w: '7%',
          h: '7%',
          fontSize: 14,
          bold: true,
          color: badgeTextColor,
          align: 'center',
          valign: 'middle',
          fontFace: mainFont,
        });

        // Bosqich kartochkasi
        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: `${cardX}%`,
          y: '34%',
          w: '27%',
          h: '53%',
          fill: { color: theme.pptxCardBg },
          line: { color: theme.pptxAccentColor, width: 1.2 },
          rectRadius: 0.1,
        });

        // Faza / Sana nishoni
        if (st.dateOrPhase) {
          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: `${cardX + 2}%`,
            y: '36.5%',
            w: '23%',
            h: '5%',
            fill: { color: theme.pptxAccentColor },
            rectRadius: 0.08,
          });
          pptxSlide.addText(st.dateOrPhase.toUpperCase(), {
            x: `${cardX + 2}%`,
            y: '36.5%',
            w: '23%',
            h: '5%',
            fontSize: 9,
            bold: true,
            color: badgeTextColor,
            align: 'center',
            valign: 'middle',
            fontFace: mainFont,
          });
        }

        // Bosqich sarlavhasi
        pptxSlide.addText(st.title, {
          x: `${cardX + 2}%`,
          y: '43%',
          w: '23%',
          h: '10%',
          fontSize: 13,
          bold: true,
          color: theme.pptxTextColor,
          align: 'center',
          valign: 'middle',
          fontFace: mainFont,
        });

        // Ajratuvchi chiziq
        pptxSlide.addShape(pres.ShapeType.rect, {
          x: `${cardX + 7}%`,
          y: '55%',
          w: '13%',
          h: '0.4%',
          fill: { color: theme.pptxAccentColor },
          line: { color: theme.pptxAccentColor },
        });

        // Bosqich tavsifi (desc)
        pptxSlide.addText(st.desc, {
          x: `${cardX + 2.5}%`,
          y: '58%',
          w: '22%',
          h: '26%',
          fontSize: 11,
          color: theme.pptxTextColor,
          align: 'left',
          valign: 'top',
          fontFace: mainFont,
          lineSpacing: 17,
        });
      });

    // ==========================================
    // 7. GAMMA QUOTE (DOLZARB IQTIBOS)
    // ==========================================
    } else if (slide.layout === 'quote') {
      pptxSlide.addText(`DOLZARB IQTIBOS VA XULOSA`, {
        x: '6%',
        y: '6%',
        w: '88%',
        h: '4%',
        fontSize: 10.5,
        bold: true,
        color: theme.pptxAccentColor,
        fontFace: mainFont,
      });

      pptxSlide.addText(slide.title, {
        x: '6%',
        y: '10%',
        w: '88%',
        h: '7%',
        fontSize: 22,
        bold: true,
        color: theme.pptxTextColor,
        fontFace: mainFont,
      });

      // Markaziy Katta Iqtibos Kartasi
      pptxSlide.addShape(pres.ShapeType.roundRect, {
        x: '10%',
        y: '22%',
        w: '80%',
        h: '65%',
        fill: { color: theme.pptxCardBg },
        line: { color: theme.pptxAccentColor, width: 2 },
        rectRadius: 0.12,
      });

      // Katta Qo'shtirnoq belgisi
      pptxSlide.addText(`“`, {
        x: '14%',
        y: '25%',
        w: '12%',
        h: '12%',
        fontSize: 48,
        bold: true,
        color: theme.pptxAccentColor,
        fontFace: 'Georgia',
      });

      const quoteText = (slide.bullets && slide.bullets[0]) || slide.subtitle || slide.title;
      pptxSlide.addText(`«${quoteText}»`, {
        x: '14%',
        y: '38%',
        w: '72%',
        h: '30%',
        fontSize: 17,
        italic: true,
        color: theme.pptxTextColor,
        align: 'center',
        valign: 'middle',
        fontFace: 'Georgia',
        lineSpacing: 26,
      });

      // Muallif nishoni
      const authorText = slide.quoteAuthor || authorName || "Soha Mutaxassisi";
      pptxSlide.addShape(pres.ShapeType.roundRect, {
        x: '35%',
        y: '73%',
        w: '30%',
        h: '7%',
        fill: { color: theme.pptxAccentColor },
        rectRadius: 0.1,
      });

      pptxSlide.addText(`— ${authorText}`, {
        x: '35%',
        y: '73%',
        w: '30%',
        h: '7%',
        fontSize: 11.5,
        bold: true,
        color: badgeTextColor,
        align: 'center',
        valign: 'middle',
        fontFace: mainFont,
      });

    // ==========================================
    // 8. REJA JAVOBLARI + HAQIQIY RASM SLAYDI (Canva uslubida split)
    // ==========================================
    } else if (slide.layout === 'split' || slide.imageUrl) {
      pptxSlide.addText(`REJA TAHLILI`, {
        x: '6%',
        y: '6%',
        w: '54%',
        h: '4%',
        fontSize: 10.5,
        bold: true,
        color: theme.pptxAccentColor,
        fontFace: mainFont,
      });

      pptxSlide.addText(slide.title, {
        x: '6%',
        y: '10%',
        w: '54%',
        h: '7%',
        fontSize: 22,
        bold: true,
        color: theme.pptxTextColor,
        fontFace: mainFont,
      });

      if (slide.subtitle) {
        pptxSlide.addText(slide.subtitle, {
          x: '6%',
          y: '17%',
          w: '54%',
          h: '4%',
          fontSize: 11.5,
          italic: true,
          color: theme.pptxTextColor,
          fontFace: mainFont,
        });
      }

      // Chap tomon: Fikrlar (Bullets)
      // Agar fikrlar soni 4 tagacha bo'lsa: Har biri alohida zamonaviy kartochka!
      const bullets = slide.bullets.map(b => b.trim());
      const count = bullets.length;
      const isLongText = bullets.some(b => b.length > 170);

      if (count <= 4 && !isLongText) {
        const totalHeight = 64;
        const cardH = Math.min(14.5, (totalHeight - (count - 1) * 2.2) / count);
        const gap = count > 1 ? (totalHeight - count * cardH) / (count - 1) : 0;

        bullets.forEach((bulletText, bIdx) => {
          const itemY = 23 + bIdx * (cardH + gap);

          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '6%',
            y: `${itemY}%`,
            w: '54%',
            h: `${cardH}%`,
            fill: { color: theme.pptxCardBg },
            line: { color: theme.pptxAccentColor, width: 0.8 },
            rectRadius: 0.08,
          });

          // Chapdagi nuqta/belgi nishoni
          const dotSize = Math.min(cardH * 0.45, 4.8);
          const dotY = itemY + (cardH - dotSize) / 2;
          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '7.8%',
            y: `${dotY}%`,
            w: '3%',
            h: `${dotSize}%`,
            fill: { color: theme.pptxAccentColor },
            rectRadius: 0.2,
          });

          pptxSlide.addText(bulletText, {
            x: '12%',
            y: `${itemY}%`,
            w: '46.5%',
            h: `${cardH}%`,
            fontSize: count > 3 ? 12 : 13,
            color: theme.pptxTextColor,
            valign: 'middle',
            fontFace: mainFont,
          });
        });
      } else {
        // Matnlar ko'p yoki uzun bo'lsa: Katta yagona zamonaviy kartochka ichida tartibli ro'yxat
        pptxSlide.addShape(pres.ShapeType.roundRect, {
          x: '6%',
          y: '23%',
          w: '54%',
          h: '64%',
          fill: { color: theme.pptxCardBg },
          line: { color: theme.pptxAccentColor, width: 1 },
          rectRadius: 0.08,
        });

        const bulletItems: pptxgen.TextProps[] = bullets.map((b) => ({
          text: b,
          options: {
            fontSize: count > 4 ? 11 : 12.5,
            color: theme.pptxTextColor,
            bullet: true,
            breakLine: true,
            fontFace: mainFont,
          }
        }));

        pptxSlide.addText(bulletItems, {
          x: '8%',
          y: '25%',
          w: '50%',
          h: '60%',
          valign: 'top',
          lineSpacing: 20,
        });
      }

      // O'ng tomon: HAQIQIY RASM KARTASI
      pptxSlide.addShape(pres.ShapeType.roundRect, {
        x: '62%',
        y: '23%',
        w: '32%',
        h: '64%',
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
              h: '53%',
              rounding: true,
              sizing: { type: 'cover', w: 3.0, h: 3.0 }
            });
          } else {
            pptxSlide.addImage({
              path: slide.imageUrl,
              x: '63%',
              y: '24.5%',
              w: '30%',
              h: '53%',
              rounding: true,
              sizing: { type: 'cover', w: 3.0, h: 3.0 }
            });
          }
        } catch (imgErr) {
          console.warn("PPTX image embedding failed:", imgErr);
        }
      }

      pptxSlide.addText(slide.imageCaption || "Mavzuga oid illyustratsiya", {
        x: '63%',
        y: '79%',
        w: '30%',
        h: '6%',
        fontSize: 9.5,
        italic: true,
        color: theme.pptxTextColor,
        align: 'center',
        fontFace: mainFont,
      });

    // ==========================================
    // 5. TO'LIQ KENGLIKDAGI JAVOB SLAYDI (Rasm bo'lmaganda)
    // ==========================================
    } else {
      pptxSlide.addText(`REJA ASOSIDAGI TAHLIL`, {
        x: '6%',
        y: '6%',
        w: '88%',
        h: '4%',
        fontSize: 10.5,
        bold: true,
        color: theme.pptxAccentColor,
        fontFace: mainFont,
      });

      pptxSlide.addText(slide.title, {
        x: '6%',
        y: '10%',
        w: '88%',
        h: '7%',
        fontSize: 22,
        bold: true,
        color: theme.pptxTextColor,
        fontFace: mainFont,
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
          fontFace: mainFont,
        });
      }

      const bullets = slide.bullets.map(b => b.trim());
      const count = bullets.length;

      // 4 tagacha fikr bo'lsa: To'liq kenglikdagi alohida kartochkalar
      if (count <= 4) {
        const totalHeight = 64;
        const cardH = Math.min(13.5, (totalHeight - (count - 1) * 2.5) / count);
        const gap = count > 1 ? (totalHeight - count * cardH) / (count - 1) : 0;

        bullets.forEach((bulletText, bIdx) => {
          const itemY = 23 + bIdx * (cardH + gap);

          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '6%',
            y: `${itemY}%`,
            w: '88%',
            h: `${cardH}%`,
            fill: { color: theme.pptxCardBg },
            line: { color: theme.pptxAccentColor, width: 0.8 },
            rectRadius: 0.08,
          });

          // Chapdagi nuqta/belgi nishoni
          const dotSize = Math.min(cardH * 0.45, 5);
          const dotY = itemY + (cardH - dotSize) / 2;
          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '7.8%',
            y: `${dotY}%`,
            w: '2.5%',
            h: `${dotSize}%`,
            fill: { color: theme.pptxAccentColor },
            rectRadius: 0.2,
          });

          pptxSlide.addText(bulletText, {
            x: '11.5%',
            y: `${itemY}%`,
            w: '81%',
            h: `${cardH}%`,
            fontSize: 13.5,
            color: theme.pptxTextColor,
            valign: 'middle',
            fontFace: mainFont,
          });
        });

      // 4 tadan oshganda: 2 USTUNLI ALOHIDA KARTOCHKALAR
      } else {
        const mid = Math.ceil(count / 2);
        const col1 = bullets.slice(0, mid);
        const col2 = bullets.slice(mid);
        const rowsCount = mid;
        const totalHeight = 64;
        const cardH = Math.min(11.5, (totalHeight - (rowsCount - 1) * 2) / rowsCount);
        const gap = rowsCount > 1 ? (totalHeight - rowsCount * cardH) / (rowsCount - 1) : 0;

        col1.forEach((bulletText, i) => {
          const itemY = 23 + i * (cardH + gap);

          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '6%',
            y: `${itemY}%`,
            w: '43%',
            h: `${cardH}%`,
            fill: { color: theme.pptxCardBg },
            line: { color: theme.pptxAccentColor, width: 0.8 },
            rectRadius: 0.08,
          });

          const dotSize = Math.min(cardH * 0.45, 4.5);
          const dotY = itemY + (cardH - dotSize) / 2;
          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '7.5%',
            y: `${dotY}%`,
            w: '3%',
            h: `${dotSize}%`,
            fill: { color: theme.pptxAccentColor },
            rectRadius: 0.2,
          });

          pptxSlide.addText(bulletText, {
            x: '11.5%',
            y: `${itemY}%`,
            w: '36%',
            h: `${cardH}%`,
            fontSize: 12,
            color: theme.pptxTextColor,
            valign: 'middle',
            fontFace: mainFont,
          });
        });

        col2.forEach((bulletText, i) => {
          const itemY = 23 + i * (cardH + gap);

          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '51%',
            y: `${itemY}%`,
            w: '43%',
            h: `${cardH}%`,
            fill: { color: theme.pptxCardBg },
            line: { color: theme.pptxAccentColor, width: 0.8 },
            rectRadius: 0.08,
          });

          const dotSize = Math.min(cardH * 0.45, 4.5);
          const dotY = itemY + (cardH - dotSize) / 2;
          pptxSlide.addShape(pres.ShapeType.roundRect, {
            x: '52.5%',
            y: `${dotY}%`,
            w: '3%',
            h: `${dotSize}%`,
            fill: { color: theme.pptxAccentColor },
            rectRadius: 0.2,
          });

          pptxSlide.addText(bulletText, {
            x: '56.5%',
            y: `${itemY}%`,
            w: '36%',
            h: `${cardH}%`,
            fontSize: 12,
            color: theme.pptxTextColor,
            valign: 'middle',
            fontFace: mainFont,
          });
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

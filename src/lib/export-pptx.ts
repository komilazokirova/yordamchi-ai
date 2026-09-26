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
    // 4. REJA JAVOBLARI + HAQIQIY RASM SLAYDI (Canva uslubida split)
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

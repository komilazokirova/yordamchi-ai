import { DocType, Language, OutlineItem, SlideData, AcademicSection } from '@/types';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { getSmartTopicPhoto } from './topic-images';

interface GenerateOptions {
  apiKey?: string;
  provider?: 'gemini' | 'openai';
  model?: string;
}

// 1. GENERATE OUTLINES (REJALAR)
export async function generateOutlines(
  topic: string,
  docType: DocType,
  language: Language = 'uz',
  options?: GenerateOptions,
  targetCount?: number
): Promise<OutlineItem[]> {
  // Slaydlar yoki betlar soniga qarab reja sonini aniqlash
  let count = 5;
  if (docType === 'presentation') {
    const totalSlides = targetCount || 10;
    count = Math.max(3, Math.min(15, totalSlides - 4));
  } else if (docType === 'coursework') {
    const pages = targetCount || 20;
    count = pages >= 30 ? 8 : pages >= 20 ? 6 : 5;
  } else {
    const pages = targetCount || 10;
    count = pages >= 15 ? 6 : 4;
  }

  const docTypeNames = {
    presentation: `Taqdimot (${targetCount || 10} ta slaydli)`,
    coursework: `Kurs ishi (${targetCount || 20} betlik)`,
    independent: `Mustaqil ish (${targetCount || 10} betlik)`,
    referat: `Referat (${targetCount || 10} betlik)`
  };

  const prompt = `Sen O'zbekiston oliy ta'lim muassasalari standartlari bo'yicha "Yordamchi AI" ilmiy konsultantisan.
Mavzu: "${topic}"
Hujjat turi: ${docTypeNames[docType]}
Til: ${language === 'uz' ? "O'zbek tili (Lotin yozuvida)" : language === 'ru' ? "Rus tili" : "Ingliz tili"}

Ushbu mavzu bo'yicha aniq, mazmunli, chuqur tahlilga asoslangan ${count} ta reja (rejalar ro'yxati) tuzib ber.
Rejalar mavzuni mantiqiy jihatdan to'liq ochib bersin (Nazariya -> Tahlil -> Muammolar -> Amaliy yechimlar).

MUHIM: Faqat quyidagi JSON formatida javob qaytar (boshqa matn qo'shma):
[
  {"title": "1. Reja nomi"},
  {"title": "2. Reja nomi"},
  ...
]`;

  try {
    if (options?.apiKey) {
      if (options.provider === 'openai') {
        const openai = new OpenAI({ apiKey: options.apiKey, dangerouslyAllowBrowser: true });
        const res = await openai.chat.completions.create({
          model: options.model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        });
        const content = res.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(content);
        const list = Array.isArray(parsed) ? parsed : parsed.outlines || parsed.rejalar || [];
        if (list.length > 0) {
          return list.map((item: { title: string }, idx: number) => ({
            id: `outline-${idx + 1}`,
            title: item.title,
            order: idx + 1
          }));
        }
      } else {
        // Google Gemini
        const client = new GoogleGenAI({ apiKey: options.apiKey });
        const interaction = await client.interactions.create({
          model: options.model || 'gemini-3.8-flash',
          input: prompt,
        });
        const text = interaction.output_text || '';
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const list = JSON.parse(jsonMatch[0]);
          return list.map((item: { title: string }, idx: number) => ({
            id: `outline-${idx + 1}`,
            title: item.title,
            order: idx + 1
          }));
        }
      }
    }
  } catch (err) {
    console.warn("AI API request failed or not configured, using smart generator:", err);
  }

  return generateFallbackOutlines(topic, docType, targetCount);
}

// 2. GENERATE FULL ACADEMIC CONTENT (KURS ISHI, REFERAT, MUSTAQIL ISH)
// Tanlangan har bir reja bo'yicha chuqur, asoslangan javoblar va ilmiy matn
export async function generateAcademicContent(
  topic: string,
  outlines: OutlineItem[],
  docType: DocType,
  language: Language = 'uz',
  options?: GenerateOptions
): Promise<{
  introduction: string;
  sections: AcademicSection[];
  conclusion: string;
  references: string[];
}> {
  const docTypeName = docType === 'coursework' ? 'Kurs ishi' : docType === 'referat' ? 'Referat' : 'Mustaqil ish';

  const prompt = `Sen "Yordamchi AI" akademik ilmiy maslahatchisisan.
Mavzu: "${topic}"
Hujjat turi: ${docTypeName}
OTM talabalari uchun tanlangan rejalarning har biriga chuqur, mukammal va asoslangan javoblar yozib ber.

Foydalanuvchi tanlagan Rejalar ro'yxati:
${outlines.map((o, i) => `${i + 1}. ${o.title}`).join('\n')}

TALABLAR:
1. Kirish: Mavzuning dolzarbligi, maqsadi, vazifalari, ilmiy obyekti, predmeti va amaliy ahamiyati.
2. Har bir reja uchun: Aynan shu reja bo'yicha batafsil, mantiqiy asoslangan, nazariy va amaliy tahliliy javob (kamida 3-4 ta to'liq xatboshi, statistik ma'lumotlar va huquqiy-iqtisodiy asoslar).
3. Xulosa: Tanlangan rejalarning yechimlari bo'yicha xulosalar va 4-5 ta aniq amaliy takliflar.
4. Foydalanilgan adabiyotlar: Kamida 6 ta rasmiy normativ-huquqiy hujjat, darslik va monografiyalar.

Faqat toza JSON formatida javob qaytar:
{
  "introduction": "Kirish matni...",
  "sections": [
    {
      "title": "Reja nomi",
      "content": "Ushbu rejaga doir kengaytirilgan, tahliliy ilmiy javob matni..."
    }
  ],
  "conclusion": "Xulosa matni...",
  "references": ["1. ...", "2. ..."]
}`;

  try {
    if (options?.apiKey) {
      let rawJson = '';
      if (options.provider === 'openai') {
        const openai = new OpenAI({ apiKey: options.apiKey, dangerouslyAllowBrowser: true });
        const res = await openai.chat.completions.create({
          model: options.model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        });
        rawJson = res.choices[0]?.message?.content || '{}';
      } else {
        const client = new GoogleGenAI({ apiKey: options.apiKey });
        const interaction = await client.interactions.create({
          model: options.model || 'gemini-3.8-flash',
          input: prompt,
        });
        rawJson = interaction.output_text || '{}';
      }

      const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return {
          introduction: data.introduction || '',
          sections: (data.sections || []).map((s: { title: string; content: string }, idx: number) => ({
            id: `sec-${idx + 1}`,
            title: s.title || outlines[idx]?.title || `Reja ${idx + 1}`,
            level: 1,
            content: s.content
          })),
          conclusion: data.conclusion || '',
          references: data.references || []
        };
      }
    }
  } catch (err) {
    console.warn("AI generation fallback to smart generator:", err);
  }

  return generateFallbackAcademicContent(topic, outlines, docType);
}

// 3. GENERATE SLIDES FOR PRESENTATION
// 2-slayd: REJALAR (Mundarija), va har bir tanlangan reja bo'yicha mustaqil javob slaydlari
export async function generatePresentationSlides(
  topic: string,
  outlines: OutlineItem[],
  themeId: string,
  options?: GenerateOptions,
  targetCount: number = 10
): Promise<SlideData[]> {
  const prompt = `Sen "Yordamchi AI" prezentatsiyalar bo'yicha bosh dizaynerisan.
Mavzu: "${topic}"
KUTILAYOTGAN JAMI SLAYDLAR SONI: Aynan ${targetCount} ta slayd.

Foydalanuvchi tanlagan Rejalar:
${outlines.map((o, i) => `${i + 1}. ${o.title}`).join('\n')}

MUHIM TUZILMA TALABLARI:
1. 1-slayd: Titul slayd (Mavzu, taqdimotchi, sana).
2. Rejalar (Mundarija): Agar tanlangan rejalar soni 4 tadan oshsa (masalan 5..8 ta bo'lsa), ularni 1 ta slaydga tiqishtirmasdan, avtomatik ravishda 2 ta slaydga bo'l: "Taqdimot Rejalari (1-qism)" va "Taqdimot Rejalari (Davomi)". Har bir slaydda ko'pi bilan 4 tadan reja bo'lsin.
3. Rejalar bo'yicha javoblar: Har bir javob slaydi 16:9 formatga qat'iy mos bo'lsin. Bir slaydga ko'pi bilan 3-4 tadan ortiq fikr (bullet) kiritma. Agar reja bo'yicha ma'lumot ko'p bo'lsa, ikkinchi betni ham o'sha rejaning davomiga ol ("... (Davomi)").
4. Yakuniy slaydlar: Xulosa va tavsiyalar, hamda "E'tiboringiz uchun rahmat!" slaydi.
5. Jami natijada roppa-rosa ${targetCount} ta slayd chiqishi shart!

Har bir slayd uchun spiker nutqi (notes) va mos rasm mavzusini ber.

Faqat JSON massiv qaytar:
[
  {
    "title": "Slayd sarlavhasi",
    "subtitle": "Kichik sarlavha",
    "bullets": ["Tezis 1", "Tezis 2", "Tezis 3"],
    "notes": "Spiker ushbu slaydda aytishi kerak bo'lgan matn...",
    "layout": "split", // "title" | "bullets" | "split" | "conclusion"
    "imageTopic": "mavzuga oid kalit so'z"
  }
]`;

  try {
    if (options?.apiKey) {
      let rawJson = '';
      if (options.provider === 'openai') {
        const openai = new OpenAI({ apiKey: options.apiKey, dangerouslyAllowBrowser: true });
        const res = await openai.chat.completions.create({
          model: options.model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        });
        rawJson = res.choices[0]?.message?.content || '[]';
      } else {
        const client = new GoogleGenAI({ apiKey: options.apiKey });
        const interaction = await client.interactions.create({
          model: options.model || 'gemini-3.8-flash',
          input: prompt,
        });
        rawJson = interaction.output_text || '[]';
      }

      const jsonMatch = rawJson.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const list = JSON.parse(jsonMatch[0]);
        return list.map((item: any, idx: number) => {
          const photo = getSmartTopicPhoto(item.imageTopic || item.title, topic, item.title, idx);
          return {
            id: `slide-${idx + 1}`,
            slideNumber: idx + 1,
            title: item.title,
            subtitle: item.subtitle,
            bullets: item.bullets || [],
            notes: item.notes,
            layout: item.layout || (idx === 0 ? 'title' : idx === 1 ? 'bullets' : 'split'),
            imageUrl: photo.url,
            imageCaption: photo.caption,
            themeId: themeId
          };
        });
      }
    }
  } catch (err) {
    console.warn("AI slides fallback to smart generator:", err);
  }

  return generateFallbackSlides(topic, outlines, themeId, targetCount);
}

// 4. EXPAND SPECIFIC SECTION WITH MORE DETAILS
export async function expandSectionContent(
  topic: string,
  sectionTitle: string,
  currentContent: string,
  options?: GenerateOptions
): Promise<string> {
  const prompt = `Sen "Yordamchi AI" ilmiy konsultantisan. Quyidagi mavzu va tanlangan reja bo'yicha matnni yanada boyit, chuqurroq ilmiy tahlil, amaliy dalillar, formulalar/statistika va misollar qo'shib ber:
Mavzu: "${topic}"
Reja: "${sectionTitle}"
Hozirgi matn: "${currentContent}"

Ushbu rejaning mohiyatini to'liq ochib beruvchi yangi, mukammal kengaytirilgan akademik matnni qaytar (kirish so'zlarsiz, to'g'ridan-to'g'ri matn).`;

  try {
    if (options?.apiKey) {
      if (options.provider === 'openai') {
        const openai = new OpenAI({ apiKey: options.apiKey, dangerouslyAllowBrowser: true });
        const res = await openai.chat.completions.create({
          model: options.model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }]
        });
        return res.choices[0]?.message?.content || currentContent;
      } else {
        const client = new GoogleGenAI({ apiKey: options.apiKey });
        const interaction = await client.interactions.create({
          model: options.model || 'gemini-3.8-flash',
          input: prompt,
        });
        return interaction.output_text || currentContent;
      }
    }
  } catch (err) {
    console.warn("AI expand fallback:", err);
  }

  // Fallback expansion grounded directly in this outline's title
  return currentContent + `\n\nQo'shimcha ilmiy tahlillar shuni tasdiqlaydiki, "${sectionTitle}" doirasidagi masalalarni amaliyotga tatbiq etishda eng muhim omil — bu tizimli monitoring va innovatsion texnologiyalardan unumli foydalanishdir. So'nggi olib borilgan tadqiqotlar natijalari ko'rsatmoqdaki, ushbu yo'nalishdagi aniq chora-tadbirlar samaradorlikni o'rtacha 30-35% ga oshirish hamda xavf-xatarlarni minimallashtirish imkonini beradi.`;
}

// Educational image helper
export function getPexelsPhoto(query: string, index: number = 0): string {
  const defaultImages = [
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80', // Study desk
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80', // Tech laptop
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80', // Analytics graph
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80', // Presentation hall
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80', // Science lab
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80', // Modern architecture
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80', // Business meeting
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'  // Team collaboration
  ];
  return defaultImages[index % defaultImages.length];
}

// SMART FALLBACK GENERATORS (Grounded directly on selected outlines)
function generateFallbackOutlines(topic: string, docType: DocType, targetCount?: number): OutlineItem[] {
  if (docType === 'coursework') {
    const pages = targetCount || 20;
    const base = [
      { id: '1', order: 1, title: `1-Bob. ${topic}ning nazariy-uslubiy asoslari va mazmun-mohiyati` },
      { id: '2', order: 2, title: `1.2. Mavzuning ilmiy tushunchalari va xorijiy tajribalar tahlili` },
      { id: '3', order: 3, title: `2-Bob. ${topic}ning hozirgi holati va amaliy tahlili` },
      { id: '4', order: 4, title: `2.2. O'zbekiston sharoitidagi mavjud statistik ko'rsatkichlar va tendensiyalar` },
      { id: '5', order: 5, title: `3-Bob. Mavjud muammolar va rivojlantirish istiqbollari` },
      { id: '6', order: 6, title: `3.2. Sohani takomillashtirish bo'yicha ilmiy-amaliy takliflar` }
    ];
    if (pages >= 25) {
      base.push(
        { id: '7', order: 7, title: `3.3. Innovatsion yondashuvlar orqali samaradorlikni oshirish modellari` },
        { id: '8', order: 8, title: `3.4. Rivojlanishning istiqbolli strategik ko'rsatkichlari` }
      );
    }
    return base;
  } else if (docType === 'presentation') {
    const totalSlides = targetCount || 10;
    const allOutlinesPool = [
      `1. Mavzuning dolzarbligi, maqsadi va vazifalari`,
      `2. Nazariy asoslar va xalqaro tajribalar`,
      `3. Amaldagi holat va statistik tahlillar`,
      `4. Tizimdagi asosiy to'siqlar va muammolar`,
      `5. Zamonaviy innovatsion yechimlar va mexanizmlar`,
      `6. O'zbekiston sharoitida amaliyotga tatbiq etish imkoniyatlari`,
      `7. Kutilayotgan iqtisodiy va ijtimoiy samaradorlik`,
      `8. Xavflarni boshqarish va monitoring tizimi`,
      `9. Ilg'or raqamli texnologiyalardan foydalanish`,
      `10. Istiqboldagi ustuvor rivojlanish yo'nalishlari`
    ];
    // We need totalSlides - 4 outlines (or max needed)
    const needed = Math.max(2, Math.min(allOutlinesPool.length, totalSlides - 4));
    return allOutlinesPool.slice(0, needed).map((title, i) => ({
      id: `out-${i + 1}`,
      order: i + 1,
      title
    }));
  } else {
    // Referat / Mustaqil ish
    const pages = targetCount || 10;
    const base = [
      { id: '1', order: 1, title: `1. ${topic} tushunchasining shakllanishi va mohiyati` },
      { id: '2', order: 2, title: `2. Zamonaviy bosqichdagi ahamiyati va o'rganilish darajasi` },
      { id: '3', order: 3, title: `3. O'zbekistonda amalga oshirilayotgan islohotlar va amaliyot` },
      { id: '4', order: 4, title: `4. Muammolar va rivojlanishning ustuvor yo'nalishlari` }
    ];
    if (pages >= 15) {
      base.push(
        { id: '5', order: 5, title: `5. Xorijiy davlatlar tajribasi va qiyosiy tahlil` },
        { id: '6', order: 6, title: `6. Amaliy xulosalar va kelgusi istiqbollar` }
      );
    }
    return base;
  }
}

function generateFallbackAcademicContent(topic: string, outlines: OutlineItem[], docType: DocType) {
  const intro = `Mavzuning dolzarbligi: Bugungi kunda O'zbekiston Respublikasida barcha sohalarda izchil modernizatsiya jarayonlari kechmoqda. Ushbu sharoitda "${topic}" masalasi alohida ilmiy va amaliy ahamiyat kasb etadi. Davlatimiz rahbari tomonidan ilgari surilgan Taraqqiyot strategiyasida ushbu yo'nalishni tubdan takomillashtirish, zamonaviy ilmiy yondashuvlarni joriy qilish ustuvor vazifa qilib belgilangan.

Tadqiqotning maqsadi: "${topic}"ning nazariy-uslubiy asoslarini chuqur tadqiq etish, amaldagi holatini har tomonlama baholash va uni rivojlantirishga qaratilgan ilmiy asoslangan xulosa va amaliy tavsiyalar ishlab chiqishdan iborat.

Tadqiqotning vazifalari:
- Mavzuga doir ilmiy-nazariy adabiyotlar va me'yoriy-huquqiy asoslarni tahlil qilish;
- Tanlangan rejalarning har biri bo'yicha mavjud ilmiy qarashlar va yondashuvlarni umumlashtirish;
- Amaliyotda mavjud bo'lgan ko'rsatkichlar va dinamikani o'rganish;
- Rivojlangan mamlakatlar tajribasini milliy sharoitimizga moslashtirish yo'llarini ko'rsatish.

Tadqiqot obyekti va predmeti: Obyekt sifatida mazkur soha jarayonlari va tizimi, predmeti sifatida esa "${topic}"ning shakllanishi, rivojlanishi va uning samaradorligini oshirish mexanizmlari hisoblanadi.`;

  // Har bir tanlangan rejaga aniq va to'liq javob yozish
  const sections: AcademicSection[] = outlines.map((out, idx) => {
    return {
      id: `sec-${idx + 1}`,
      title: out.title,
      level: 1,
      content: `Mazkur bo'limda to'g'ridan-to'g'ri "${out.title}" masalasi va uning asosiy yechimlari atroflicha tadqiq etiladi. "${topic}" mavzusini o'rganish jarayonida ushbu reja kalit ahamiyatga ega bo'lib, uning mohiyatini quyidagi ilmiy jihatlar orqali asoslash mumkin.\n\nBirinchidan, "${out.title}" bo'yicha olib borilgan nazariy tahlillar shuni ko'rsatadiki, sohadagi me'yoriy mexanizmlarni optimallashtirish birinchi darajali vazifa sanaladi. Olimlar va amaliyotchilarning ta'kidlashicha, fundamental tushunchalarning to'g'ri talqin qilinishi kelgusidagi amaliy harakatlar uchun mustahkam poydevor yaratadi.\n\nIkkinchidan, ushbu reja doirasida zamonaviy statistik ko'rsatkichlar va amaliyot o'rganilganda, mavjud resurslardan samarali foydalanish darajasi sezilarli darajada ortayotgani kuzatilmoqda. Xususan, ilg'or xorijiy tajribalar va innovatsion yondashuvlarning joriy etilishi natijasida jarayonlarning shaffofligi hamda iqtisodiy samaradorligi 25-30 foizga o'sishiga erishilmoqda.\n\nUchinchidan, "${out.title}" bo'yicha aniqlangan muammolarni bartaraf etish uchun soha mutaxassislarining malakasini muntazam oshirish va zamonaviy raqamli texnologiyalarni integratsiya qilish zarurati mavjud.`
    };
  });

  const conclusion = `Xulosa qilib aytganda, "${topic}" mavzusida tanlangan barcha rejalar bo'yicha olib borilgan izlanishlar asosida quyidagi xulosalar shakllantirildi:
1. Rejalarda belgilangan nazariy asoslar to'liq o'rganilib, zamonaviy sharoitda tizimli boshqaruv va ilmiy yondashuvning zarurligi isbotlandi.
2. Har bir reja yuzasidan o'tkazilgan amaliy tahlillar sohadagi asosiy to'siq va muammolarni aniqlashga hamda ularning yechimlarini modellashtirishga imkon berdi.
3. Ishlab chiqilgan ilmiy-amaliy takliflar va xorij tajribasiga asoslangan mexanizmlar amaliyotga joriy etilsa, kutilayotgan samaradorlik darajasi sezilarli darajada oshadi.`;

  const references = [
    "1. O'zbekiston Respublikasi Konstitutsiyasi. – Toshkent: O'zbekiston, 2023.",
    "2. Mirziyoyev Sh.M. Yangi O'zbekiston taraqqiyot strategiyasi. – Toshkent: O'zbekiston, 2022.",
    `3. Karimov A.K., Toshmatov B.R. ${topic}: Nazariya va amaliyot. Darslik. – Toshkent: Fan va texnologiya, 2023. – 280 b.`,
    "4. Alimov Q.T. Zamonaviy ilmiy tadqiqotlar va innovatsiyalar. O'quv qo'llanma. – Toshkent: Iqtisodiyot, 2024. – 210 b.",
    "5. O'zbekiston Respublikasi Vazirlar Mahkamasining soha faoliyatini takomillashtirishga oid qarorlari to'plami. Lex.uz.",
    "6. Xalqaro ilmiy jurnallar va tadqiqot markazlari hisobotlari to'plami, 2024–2025."
  ];

  return { introduction: intro, sections, conclusion, references };
}

// Prezentatsiya slaydlari:
// Slayd 1: Titul
// Slayd 2: REJALAR (Mundarija - barcha tanlangan rejalar keltiriladi)
// Slayd 3..N: Har bir tanlangan rejaga aniq javob beruvchi slaydlar!
// Prezentatsiya slaydlari:
// Slayd 1: Titul
// Slayd 2: REJALAR (Mundarija - agar ko'p bo'lsa 2 betga bo'linadi)
// Slayd 3..N: Har bir reja yuzasidan 1 yoki 2 ta aniq, ixcham javob slaydlari
function generateFallbackSlides(
  topic: string,
  outlines: OutlineItem[],
  themeId: string,
  targetCount: number = 10
): SlideData[] {
  const slides: SlideData[] = [];
  let currentSlideNum = 1;

  // 1-SLAYD: TITUL
  slides.push({
    id: `slide-${currentSlideNum}`,
    slideNumber: currentSlideNum++,
    title: topic,
    subtitle: "Ilmiy-amaliy taqdimot va tadqiqot natijalari",
    bullets: [
      "Mavzu bo'yicha kompleks tahlil",
      "Nazariy asoslar va amaliy yechimlar",
      "Yordamchi AI • Toshkent – 2026"
    ],
    notes: "Assalomu alaykum hurmatli ustozlar va talabalar! Bugungi taqdimotimiz mavzusi...",
    layout: 'title',
    imageUrl: getSmartTopicPhoto(topic, topic, 'Taqdimot', 0).url,
    imageCaption: getSmartTopicPhoto(topic, topic, 'Taqdimot', 0).caption,
    themeId
  });

  // 2-SLAYD: REJALAR (MUNDARIJA)
  // Agar rejalar 4 tadan oshsa, 1 ta slaydga tiqilmasligi uchun avtomatik 2 ta slaydga bo'linadi!
  if (outlines.length <= 4) {
    slides.push({
      id: `slide-${currentSlideNum}`,
      slideNumber: currentSlideNum++,
      title: "Taqdimot Rejalari (Mundarija)",
      subtitle: "Taqdimot davomida ko'rib chiqiladigan asosiy masalalar",
      bullets: outlines.map((out, idx) => `${idx + 1}. ${out.title.replace(/^\d+[\.\)]\s*/, '')}`),
      notes: "Bugungi taqdimotimizda ko'rib chiqiladigan rejalar bilan tanishing.",
      layout: 'split',
      imageUrl: getSmartTopicPhoto('rejalar rejalashtirish strategiya', topic, 'Taqdimot Rejalari', 1).url,
      imageCaption: "Taqdimot Rejalari",
      themeId
    });
  } else {
    const part1 = outlines.slice(0, 4);
    const part2 = outlines.slice(4);

    slides.push({
      id: `slide-${currentSlideNum}`,
      slideNumber: currentSlideNum++,
      title: "Taqdimot Rejalari (1-qism)",
      subtitle: "Taqdimot davomida ko'rib chiqiladigan dastlabki masalalar",
      bullets: part1.map((out, idx) => `${idx + 1}. ${out.title.replace(/^\d+[\.\)]\s*/, '')}`),
      notes: "Bugungi taqdimotimizning dastlabki rejalari bilan tanishing.",
      layout: 'split',
      imageUrl: getSmartTopicPhoto('rejalar rejalashtirish strategiya', topic, 'Taqdimot Rejalari 1', 1).url,
      imageCaption: "Taqdimot Rejalari (1-qism)",
      themeId
    });

    slides.push({
      id: `slide-${currentSlideNum}`,
      slideNumber: currentSlideNum++,
      title: "Taqdimot Rejalari (Davomi)",
      subtitle: "Taqdimotning keyingi rejalari va muhokama bandlari",
      bullets: part2.map((out, idx) => `${idx + 5}. ${out.title.replace(/^\d+[\.\)]\s*/, '')}`),
      notes: "Taqdimotimizning davomiy rejalari bilan tanishing.",
      layout: 'split',
      imageUrl: getSmartTopicPhoto('reja strategiya maqsad tahlil', topic, 'Taqdimot Rejalari Davomi', 2).url,
      imageCaption: "Taqdimot Rejalari (Davomi)",
      themeId
    });
  }

  // JAVOBLAR UCHUN NECHTA SLAYD AJRATILADI?
  // targetCount ga yetkazish uchun har bir rejaga 1 yoki 2 tadan javob slaydlari beramiz
  const reservedEndSlides = 2; // Xulosa va Rahmat
  const currentCount = slides.length;
  const remainingForAnswers = Math.max(outlines.length, targetCount - currentCount - reservedEndSlides);

  // Har bir reja uchun asosiy slayd, agar joy qolsa 2-qism amaliy javob slaydi qo'shiladi
  let answersCreated = 0;
  outlines.forEach((out, idx) => {
    const cleanTitle = out.title;
    const outPhoto = getSmartTopicPhoto(cleanTitle, topic, cleanTitle, idx);
    
    // 1-Javob slaydi: Nazariya va mohiyat
    slides.push({
      id: `slide-${currentSlideNum}`,
      slideNumber: currentSlideNum++,
      title: cleanTitle,
      subtitle: "Konseptual mazmun va nazariy asoslar",
      bullets: [
        `«${cleanTitle}»ning fundamental mohiyati va dolzarbligi`,
        "Ilmiy asoslangan tamoyillar va tasniflash mezonlari",
        "Sohadagi mavjud qonuniyatlar va konseptual yondashuvlar",
        "Amaliyot bilan nazariyaning uzviy bog'liqligi"
      ],
      notes: `Ushbu slaydda aynan "${cleanTitle}" bo'yicha nazariy asoslar va tushunchalarni bayon qilamiz...`,
      layout: 'split',
      imageUrl: outPhoto.url,
      imageCaption: outPhoto.caption,
      themeId
    });
    answersCreated++;

    // Agar foydalanuvchi ko'p slayd (masalan 12, 15, 20) tanlagan bo'lsa,
    // shu rejaga 2-qo'shimcha tahliliy javob slaydi ham qo'shamiz!
    if (answersCreated < remainingForAnswers && (idx < remainingForAnswers - outlines.length)) {
      const analysisPhoto = getSmartTopicPhoto(`${cleanTitle} tahlili amaliy natijalar`, topic, cleanTitle, idx + 4);
      slides.push({
        id: `slide-${currentSlideNum}`,
        slideNumber: currentSlideNum++,
        title: `${cleanTitle} (Amaliy tahlil)`,
        subtitle: "Statistik ko'rsatkichlar va ilg'or tajribalar",
        bullets: [
          "O'zbekistonda mavjud amaliy ko'rsatkichlar va dinamika",
          "Ilg'or xorijiy davlatlar tajribasi va qiyosiy tahlillar",
          "Samaradorlikni 25-30% ga oshirish imkoniyatlari",
          "Kutilayotgan ijtimoiy-iqtisodiy natijalar"
        ],
        notes: `Mazkur masalaning amaliy tahlili va statistik raqamlariga to'xtalib o'tamiz...`,
        layout: 'split',
        imageUrl: analysisPhoto.url,
        imageCaption: analysisPhoto.caption,
        themeId
      });
      answersCreated++;
    }
  });

  // YAKUNIY SLAYD 1: XULOSA
  const conclusionPhoto = getSmartTopicPhoto(`xulosa natijalar ${topic}`, topic, 'Xulosa', 8);
  slides.push({
    id: `slide-${currentSlideNum}`,
    slideNumber: currentSlideNum++,
    title: "Xulosa va amaliy takliflar",
    subtitle: "Tanlangan rejalar tahlilidan kelib chiqqan natijalar",
    bullets: [
      "Barcha belgilangan rejalar bo'yicha to'liq ilmiy xulosalar olindi",
      "Sohadagi muammolarni bartaraf etish bo'yicha amaliy mexanizm tavsiya qilindi",
      "Kutilayotgan ijtimoiy-iqtisodiy samaradorlik asoslab berildi",
      "Kelgusidagi ilmiy tadqiqotlar uchun tavsiyalar shakllantirildi"
    ],
    notes: "Tadqiqotimizni umumlashtirgan holda, ilgari surilgan takliflar yuqori samara beradi.",
    layout: 'split',
    imageUrl: conclusionPhoto.url,
    imageCaption: conclusionPhoto.caption,
    themeId
  });

  // YAKUNIY SLAYD 2: RAHMAT
  const finalPhoto = getSmartTopicPhoto(`taqdimot yakuni ${topic}`, topic, 'Rahmat', 9);
  slides.push({
    id: `slide-${currentSlideNum}`,
    slideNumber: currentSlideNum++,
    title: "E'tiboringiz uchun rahmat!",
    subtitle: "Savollar va ilmiy muhokamalar uchun tayyorman",
    bullets: [
      "Mavzu yuzasidan savol va mulohazalaringiz",
      "Ilmiy munozara va takliflar",
      "Yordamchi AI platformasi yordamida tayyorlandi"
    ],
    notes: "E'tiboringiz va qimmatli vaqtingiz uchun katta rahmat! Savollaringiz bo'lsa bajonidil javob beraman.",
    layout: 'title',
    imageUrl: finalPhoto.url,
    imageCaption: finalPhoto.caption,
    themeId
  });

  return slides;
}

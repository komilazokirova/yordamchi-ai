import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, topic, docType, outlines, themeId, sectionTitle, currentContent, userApiKey, provider = 'gemini' } = body;

    const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (action === 'generate-outlines') {
      const count = docType === 'coursework' ? 6 : docType === 'presentation' ? 7 : 5;
      const prompt = `Sen O'zbekiston oliy ta'lim muassasalari standartlari bo'yicha ilmiy yordamchisan.
Mavzu: "${topic}"
Hujjat turi: ${docType}

Ushbu mavzu bo'yicha aniq, mazmunli va mantiqiy ketma-ketlikdagi ${count} ta reja tuzib ber.
Faqat quyidagi JSON formatida javob qaytar:
[
  {"title": "1. Reja nomi"},
  {"title": "2. Reja nomi"}
]`;

      if (apiKey && provider === 'gemini') {
        const client = new GoogleGenAI({ apiKey });
        const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: prompt,
        });
        const text = interaction.output_text || '[]';
        const match = text.match(/\[[\s\S]*\]/);
        if (match) {
          const items = JSON.parse(match[0]);
          return NextResponse.json({ success: true, data: items });
        }
      } else if (apiKey && provider === 'openai') {
        const openai = new OpenAI({ apiKey });
        const res = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        });
        const parsed = JSON.parse(res.choices[0]?.message?.content || '{}');
        const list = Array.isArray(parsed) ? parsed : parsed.outlines || parsed.rejalar || [];
        return NextResponse.json({ success: true, data: list });
      }
    }

    if (action === 'generate-academic') {
      const prompt = `O'zbekiston OTM talabalari uchun akademik hujjat yarat:
Mavzu: "${topic}"
Rejalar:
${(outlines || []).map((o: any) => `- ${o.title}`).join('\n')}

Format (faqat JSON):
{
  "introduction": "Kirish matni...",
  "sections": [{"title": "Reja nomi", "content": "Keng ilmiy matn..."}],
  "conclusion": "Xulosa matni...",
  "references": ["1. Manba...", "2. Manba..."]
}`;

      if (apiKey && provider === 'gemini') {
        const client = new GoogleGenAI({ apiKey });
        const interaction = await client.interactions.create({
          model: 'gemini-3.8-flash',
          input: prompt,
        });
        const match = (interaction.output_text || '').match(/\{[\s\S]*\}/);
        if (match) {
          return NextResponse.json({ success: true, data: JSON.parse(match[0]) });
        }
      }
    }

    // Default fallback acknowledgement
    return NextResponse.json({ success: true, mode: 'client-managed' });
  } catch (error: any) {
    console.error("AI API route error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

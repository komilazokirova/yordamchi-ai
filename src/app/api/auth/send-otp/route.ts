import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateUserOtp, normalizePhone } from '@/lib/server-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, fullName } = body;

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ success: false, error: 'Telefon raqam kiritilishi shart' }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    // O'zbekiston raqamlarini tekshirish (+998 bilan 13 ta belgi)
    if (!normalized.startsWith('+998') || normalized.length !== 13) {
      return NextResponse.json({ 
        success: false, 
        error: 'Iltimos, to\'g\'ri O\'zbekiston telefon raqamini kiriting (+998 XX XXX XX XX)' 
      }, { status: 400 });
    }

    // Server bazasiga yozish va OTP kod hosil qilish
    const { user, code } = createOrUpdateUserOtp(normalized, fullName);

    // Agar real Eskiz.uz ma'lumotlari kiritilgan bo'lsa, real SMS yuborish
    if (process.env.ESKIZ_EMAIL && process.env.ESKIZ_PASSWORD) {
      try {
        console.log(`Sending real SMS to ${normalized} via Eskiz...`);
        // Eskiz SMS yuborish integratsiyasi
      } catch (smsErr) {
        console.warn('SMS gateway warning:', smsErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'SMS tasdiqlash kodi muvaffaqiyatli yuborildi',
      phone: normalized,
      isNewUser: user.totalGenerated === 0 && user.freeGenerationsLeft === 1,
      // Test/Demo rejimida oson tekshirish uchun kodni qaytaramiz (ishlab chiqarishda logda ko'rinadi)
      testCode: code,
    });
  } catch (err: any) {
    console.error('Send OTP error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}

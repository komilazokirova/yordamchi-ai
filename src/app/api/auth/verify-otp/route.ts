import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp, normalizePhone } from '@/lib/server-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, code, fullName } = body;

    if (!phone || !code) {
      return NextResponse.json({ success: false, error: 'Telefon raqam va SMS kod kiritilishi shart' }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    const result = verifyOtp(normalized, code.trim());

    if (!result.success || !result.user) {
      return NextResponse.json({ success: false, error: result.error || 'Kod noto\'g\'ri' }, { status: 400 });
    }

    // Foydalanuvchi ma'lumotlarini qaytarish
    const user = result.user;
    if (fullName && fullName.trim() && user.fullName === 'Talaba') {
      user.fullName = fullName.trim();
    }

    return NextResponse.json({
      success: true,
      message: 'Muvaffaqiyatli tizimga kirildi',
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        university: user.university,
        isSubscribed: user.isSubscribed,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
        freeGenerationsLeft: user.freeGenerationsLeft,
        totalGenerated: user.totalGenerated,
      }
    });
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}

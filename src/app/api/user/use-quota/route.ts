import { NextRequest, NextResponse } from 'next/server';
import { decrementQuota, normalizePhone } from '@/lib/server-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Telefon raqam berilmagan' }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    const result = decrementQuota(normalized);

    if (!result.success || !result.user) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Bepul limitingiz yakunlangan. Iltimos obuna bo\'ling.',
        user: result.user
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      message: 'Limit muvaffaqiyatli ishlatildi',
      user: {
        id: result.user.id,
        phone: result.user.phone,
        fullName: result.user.fullName,
        isSubscribed: result.user.isSubscribed,
        freeGenerationsLeft: result.user.freeGenerationsLeft,
        totalGenerated: result.user.totalGenerated,
      }
    });
  } catch (err: any) {
    console.error('Use quota error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}

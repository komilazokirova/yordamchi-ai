import { NextRequest, NextResponse } from 'next/server';
import { getUserByPhone, normalizePhone } from '@/lib/server-db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Telefon raqam berilmagan' }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    const user = getUserByPhone(normalized);

    if (!user) {
      return NextResponse.json({ success: false, error: 'Foydalanuvchi topilmadi' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
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
    console.error('Sync user error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}

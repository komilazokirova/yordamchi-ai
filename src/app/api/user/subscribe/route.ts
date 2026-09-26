import { NextRequest, NextResponse } from 'next/server';
import { activateSubscription, normalizePhone } from '@/lib/server-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, days = 30 } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Telefon raqam berilmagan' }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    const updated = activateSubscription(normalized, days);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Foydalanuvchi topilmadi' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Obuna 30 kunga faollashtirildi',
      user: {
        id: updated.id,
        phone: updated.phone,
        fullName: updated.fullName,
        isSubscribed: updated.isSubscribed,
        subscriptionExpiresAt: updated.subscriptionExpiresAt,
        freeGenerationsLeft: updated.freeGenerationsLeft,
        totalGenerated: updated.totalGenerated,
      }
    });
  } catch (err: any) {
    console.error('Subscribe user error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server xatoligi' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { decrementQuota, normalizePhone } from '@/lib/server-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { phone } = body;

    let userPhone = phone ? normalizePhone(phone) : '+998901234567';
    const result = decrementQuota(userPhone);

    return NextResponse.json({
      success: true,
      allowed: true,
      message: '100% Bepul va cheksiz rejim',
      user: {
        id: result.user?.id || 'user-free',
        phone: result.user?.phone || userPhone,
        fullName: result.user?.fullName || 'Talaba',
        isSubscribed: true,
        freeGenerationsLeft: 999999,
        totalGenerated: result.user?.totalGenerated || 1,
      }
    });
  } catch (err: any) {
    console.error('Use quota error:', err);
    return NextResponse.json({
      success: true,
      allowed: true,
      user: { isSubscribed: true, freeGenerationsLeft: 999999 }
    });
  }
}

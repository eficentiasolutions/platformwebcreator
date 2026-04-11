import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const settings = await db.appSetting.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  });
  return NextResponse.json({ activePartnerId: settings.activePartnerId });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const settings = await db.appSetting.update({
    where: { id: 'singleton' },
    data: { activePartnerId: body.activePartnerId },
  });
  return NextResponse.json({ activePartnerId: settings.activePartnerId });
}

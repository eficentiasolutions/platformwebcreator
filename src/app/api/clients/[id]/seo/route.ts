import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const client = await db.client.findUnique({ where: { id } });
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const currentChecklist = (client.seoChecklist as Record<string, boolean>) ?? {};
  const merged = { ...currentChecklist, ...body.seoChecklist };

  const updated = await db.client.update({
    where: { id },
    data: { seoChecklist: merged },
    include: { partner: { select: { name: true } } },
  });
  return NextResponse.json({ ...updated, partnerName: updated.partner.name, partner: undefined });
}

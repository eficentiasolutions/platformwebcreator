import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await db.client.findUnique({
    where: { id },
    include: { partner: { select: { name: true } } },
  });
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ...client, partnerName: client.partner.name, partner: undefined });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { partnerName, partner, createdAt, id: _id, ...data } = body;
  const client = await db.client.update({
    where: { id },
    data,
    include: { partner: { select: { name: true } } },
  });
  return NextResponse.json({ ...client, partnerName: client.partner.name, partner: undefined });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.client.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

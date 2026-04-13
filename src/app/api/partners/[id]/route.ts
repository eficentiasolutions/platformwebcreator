import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partner = await db.partner.findUnique({
    where: { id },
    include: { _count: { select: { clients: true } } },
  });
  if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ...partner, clientCount: partner._count.clients, _count: undefined });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const partner = await db.partner.update({
    where: { id },
    data: { name: body.name, templateType: body.templateType, templateRepo: body.templateRepo, description: body.description, active: body.active },
  });
  return NextResponse.json(partner);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.partner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

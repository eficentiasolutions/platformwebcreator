import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const partners = await db.partner.findMany({
    include: { _count: { select: { clients: true } } },
    orderBy: { createdAt: 'desc' },
  });
  const result = partners.map((p) => ({
    ...p,
    clientCount: p._count.clients,
    _count: undefined,
  }));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const partner = await db.partner.create({
    data: { name: body.name, templateType: body.templateType ?? 'generic', templateRepo: body.templateRepo ?? '', description: body.description },
  });
  return NextResponse.json(partner, { status: 201 });
}

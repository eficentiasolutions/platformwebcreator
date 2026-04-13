import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const partnerId = req.nextUrl.searchParams.get('partnerId');
    const clients = await db.client.findMany({
      where: partnerId ? { partnerId } : undefined,
      include: { partner: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    const result = clients.map((c) => ({
      ...c,
      partnerName: c.partner.name,
      partner: undefined,
    }));
    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/clients error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await db.client.create({
      data: {
        partnerId: body.partnerId,
        businessName: body.businessName ?? '',
        contactName: body.contactName ?? '',
        email: body.email ?? '',
        phone: body.phone ?? '',
        location: body.location ?? '',
        province: body.province ?? '',
        domain: body.domain ?? '',
        status: body.status ?? 'new',
        brandPrimaryColor: body.brandPrimaryColor ?? '#0891B2',
        brandSecondaryColor: body.brandSecondaryColor ?? '#0E7490',
        brandAccentColor: body.brandAccentColor ?? '#F59E0B',
        logoUrl: body.logoUrl ?? '',
        heroImageUrl: body.heroImageUrl ?? '',
        businessType: body.businessType ?? '',
        services: body.services ?? [],
        zones: body.zones ?? [],
        socialLinks: body.socialLinks ?? {},
        seoTitle: body.seoTitle ?? '',
        seoDescription: body.seoDescription ?? '',
        seoKeywords: body.seoKeywords ?? [],
        googleSiteVerification: body.googleSiteVerification ?? '',
        gAnalyticsId: body.gAnalyticsId ?? '',
        gscVerified: body.gscVerified ?? false,
        seoChecklist: body.seoChecklist ?? {},
        onboardingStep: body.onboardingStep ?? 0,
        onboardingCompleted: body.onboardingCompleted ?? false,
        notes: body.notes ?? '',
      },
      include: { partner: { select: { name: true } } },
    });
    return NextResponse.json({ ...client, partnerName: client.partner.name, partner: undefined }, { status: 201 });
  } catch (error) {
    console.error('POST /api/clients error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

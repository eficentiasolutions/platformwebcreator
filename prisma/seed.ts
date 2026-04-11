import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Settings singleton
  await prisma.appSetting.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  });

  // Partner 1: Academia Web Pool
  const partner1 = await prisma.partner.upsert({
    where: { id: 'partner-1' },
    update: {},
    create: {
      id: 'partner-1',
      name: 'Academia Web Pool',
      templateType: 'drpools',
      description:
        'Plataforma de formacion en desarrollo web para estudiantes. Template DR Pools como base.',
      active: true,
    },
  });

  // Partner 2: Negocios Locales
  await prisma.partner.upsert({
    where: { id: 'partner-2' },
    update: {},
    create: {
      id: 'partner-2',
      name: 'Negocios Locales',
      templateType: 'local-business',
      description:
        'Socios para clientes de negocios locales que necesitan presencia web profesional.',
      active: false,
    },
  });

  // Set active partner
  await prisma.appSetting.update({
    where: { id: 'singleton' },
    data: { activePartnerId: partner1.id },
  });

  // Client 1: DR Pools (published, full data)
  await prisma.client.upsert({
    where: { id: 'client-1' },
    update: {},
    create: {
      id: 'client-1',
      partnerId: partner1.id,
      businessName: 'DR Pools',
      contactName: 'Roberto Sanchez',
      email: 'roberto@drpools.com',
      phone: '+34 612 345 678',
      location: 'Santa Cruz de Tenerife',
      province: 'Tenerife',
      domain: 'drpools-tenerife.com',
      status: 'published',
      brandPrimaryColor: '#0891B2',
      brandSecondaryColor: '#0E7490',
      brandAccentColor: '#F59E0B',
      businessType: 'Mantenimiento de Piscinas',
      services: [
        {
          name: 'Mantenimiento de Piscinas',
          slug: 'mantenimiento-piscinas-tenerife',
          description:
            'Servicio profesional de mantenimiento de piscinas en Tenerife. Limpieza semanal, control de quimica y revision de equipos.',
          keywords: [
            'mantenimiento piscinas tenerife',
            'limpieza piscinas',
            'piscina mantenimiento',
          ],
          bullets: [
            'Limpieza semanal completa',
            'Control de pH y cloro',
            'Revision de filtros y bombas',
            'Tratamiento anticorrosion',
          ],
        },
        {
          name: 'Limpieza de Piscinas',
          slug: 'limpieza-piscinas-tenerife',
          description:
            'Limpieza profunda de piscinas en Tenerife. Desinfeccion completa y preparacion para la temporada de verano.',
          keywords: [
            'limpieza piscinas tenerife',
            'desinfeccion piscinas',
            'limpieza fondo piscina',
          ],
          bullets: [
            'Limpieza de fondo y paredes',
            'Desinfeccion completa',
            'Equilibrio quimico',
            'Asesoria personalizada',
          ],
        },
      ],
      zones: [
        'Santa Cruz de Tenerife',
        'La Laguna',
        'Adeje',
        'Arona',
        'Puerto de la Cruz',
      ],
      socialLinks: {
        facebook: 'https://facebook.com/drpools',
        instagram: 'https://instagram.com/drpools',
        googleMaps: 'https://maps.google.com/?q=drpools+tenerife',
      },
      seoTitle:
        'DR Pools | Mantenimiento y Limpieza de Piscinas en Tenerife',
      seoDescription:
        'Servicio profesional de mantenimiento y limpieza de piscinas en Tenerife. Presupuestos sin compromiso. Mas de 10 anos de experiencia. Llama ahora.',
      seoKeywords: [
        'mantenimiento piscinas tenerife',
        'limpieza piscinas tenerife',
        'drpools',
        'piscinas tenerife',
      ],
      googleSiteVerification: 'abc123verification456',
      gAnalyticsId: 'G-DRPOOLS123',
      gscVerified: true,
      onboardingStep: 4,
      onboardingCompleted: true,
      seoChecklist: {
        metadataBase: true,
        titleTags: true,
        metaDescriptions: true,
        canonicalUrls: true,
        robotsTxt: true,
        sitemapXml: true,
        securityHeaders: true,
        httpsEnabled: true,
        localBusinessSchema: true,
        serviceSchema: true,
        breadcrumbSchema: true,
        organizationSchema: true,
        noProhibitedSchemas: true,
        lcpGood: true,
        clsGood: true,
        inpGood: true,
        imagesWebp: true,
        fontDisplaySwap: true,
        lazyLoadImages: true,
        heroFetchPriority: true,
        uniqueH1PerPage: true,
        h2Subtopics: true,
        imageAlts: true,
        internalLinking: true,
        noOrphanPages: true,
        minimumWordCount: true,
        gscVerified: true,
        ga4Configured: true,
        sitemapSubmitted: true,
        gbpCreated: true,
        avisoLegal: true,
        privacidad: true,
        cookies: true,
        cookieBanner: true,
      },
      notes:
        'Cliente estrella. Web publicada y funcionando correctamente. Todas las verificaciones SEO completadas. Primera posicion para "mantenimiento piscinas tenerife".',
    },
  });

  // Client 2: Limpieza Express (configuring, partial data)
  await prisma.client.upsert({
    where: { id: 'client-2' },
    update: {},
    create: {
      id: 'client-2',
      partnerId: partner1.id,
      businessName: 'Limpieza Express',
      contactName: 'Maria Garcia',
      email: 'maria@limpiezaexpress.es',
      phone: '+34 698 765 432',
      location: 'Madrid',
      province: 'Madrid',
      domain: 'limpiezaexpress-madrid.es',
      status: 'configuring',
      brandPrimaryColor: '#16A34A',
      brandSecondaryColor: '#15803D',
      brandAccentColor: '#3B82F6',
      businessType: 'Servicios de Limpieza',
      services: [
        {
          name: 'Limpieza de Hogares',
          slug: 'limpieza-hogares-madrid',
          description:
            'Servicio de limpieza domestica profesional en Madrid. Equipos especializados y productos ecologicos.',
          keywords: [
            'limpieza hogares madrid',
            'limpieza domestica',
            'limpieza casas madrid',
          ],
          bullets: [
            'Limpieza general del hogar',
            'Cocinas y banos especial',
            'Productos ecologicos',
            'Personal formado',
          ],
        },
      ],
      zones: [
        'Centro de Madrid',
        'Salamanca',
        'Chamberi',
        'Retiro',
        'Chamartin',
      ],
      socialLinks: {
        instagram: 'https://instagram.com/limpiezaexpress',
      },
      seoTitle:
        'Limpieza Express | Servicio de Limpieza Profesional en Madrid',
      seoDescription:
        'Servicio profesional de limpieza de hogares y oficinas en Madrid. Precios competitivos, productos ecologicos. Solicita presupuesto gratis.',
      seoKeywords: [
        'limpieza madrid',
        'limpieza profesional madrid',
        'limpieza hogares',
      ],
      onboardingStep: 1,
      onboardingCompleted: false,
      seoChecklist: {
        metadataBase: true,
        titleTags: true,
        metaDescriptions: true,
        robotsTxt: true,
        sitemapXml: true,
        httpsEnabled: true,
        localBusinessSchema: true,
        imagesWebp: true,
        lazyLoadImages: true,
        uniqueH1PerPage: true,
      },
      notes:
        'Nuevo cliente. Se ha completado la configuracion base pero falta branding y contenido. Pendiente de enviar logo y colores definitivos.',
    },
  });

  console.log('Seed data inserted successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

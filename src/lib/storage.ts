import {
  Client,
  Partner,
  SEOChecklist,
  EMPTY_SEO_CHECKLIST,
} from '@/types';

const CLIENTS_KEY = 'eficentia_clients';
const PARTNERS_KEY = 'eficentia_partners';
const ACTIVE_PARTNER_KEY = 'eficentia_active_partner';
const INITIALIZED_KEY = 'eficentia_initialized_v1';

// ─── Seed Data ──────────────────────────────────────────────────────

const SEED_PARTNERS: Partner[] = [
  {
    id: 'partner-1',
    name: 'Academia Web Pool',
    templateType: 'drpools',
    description: 'Plataforma de formacion en desarrollo web para estudiantes. Template DR Pools como base.',
    active: true,
    clientCount: 2,
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'partner-2',
    name: 'Negocios Locales',
    templateType: 'local-business',
    description: 'Socios para clientes de negocios locales que necesitan presencia web profesional.',
    active: false,
    clientCount: 0,
    createdAt: '2026-02-01T10:00:00.000Z',
  },
];

const SEED_CLIENTS: Client[] = [
  {
    id: 'client-1',
    partnerId: 'partner-1',
    partnerName: 'Academia Web Pool',
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
    logoUrl: '',
    heroImageUrl: '',
    businessType: 'Mantenimiento de Piscinas',
    services: [
      {
        name: 'Mantenimiento de Piscinas',
        slug: 'mantenimiento-piscinas-tenerife',
        description: 'Servicio profesional de mantenimiento de piscinas en Tenerife. Limpieza semanal, control de quimica y revision de equipos.',
        keywords: ['mantenimiento piscinas tenerife', 'limpieza piscinas', 'piscina mantenimiento'],
        bullets: ['Limpieza semanal completa', 'Control de pH y cloro', 'Revision de filtros y bombas', 'Tratamiento anticorrosion'],
      },
      {
        name: 'Limpieza de Piscinas',
        slug: 'limpieza-piscinas-tenerife',
        description: 'Limpieza profunda de piscinas en Tenerife. Desinfeccion completa y preparacion para la temporada de verano.',
        keywords: ['limpieza piscinas tenerife', 'desinfeccion piscinas', 'limpieza fondo piscina'],
        bullets: ['Limpieza de fondo y paredes', 'Desinfeccion completa', 'Equilibrio quimico', 'Asesoria personalizada'],
      },
    ],
    zones: ['Santa Cruz de Tenerife', 'La Laguna', 'Adeje', 'Arona', 'Puerto de la Cruz'],
    socialLinks: {
      facebook: 'https://facebook.com/drpools',
      instagram: 'https://instagram.com/drpools',
      googleMaps: 'https://maps.google.com/?q=drpools+tenerife',
    },
    seoTitle: 'DR Pools | Mantenimiento y Limpieza de Piscinas en Tenerife',
    seoDescription: 'Servicio profesional de mantenimiento y limpieza de piscinas en Tenerife. Presupuestos sin compromiso. Mas de 10 anos de experiencia. Llama ahora.',
    seoKeywords: ['mantenimiento piscinas tenerife', 'limpieza piscinas tenerife', 'drpools', 'piscinas tenerife'],
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
    createdAt: '2026-02-10T09:00:00.000Z',
    updatedAt: '2026-04-05T14:30:00.000Z',
    notes: 'Cliente estrella. Web publicada y funcionando correctamente. Todas las verificaciones SEO completadas. Primer posicion para "mantenimiento piscinas tenerife".',
  },
  {
    id: 'client-2',
    partnerId: 'partner-1',
    partnerName: 'Academia Web Pool',
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
    logoUrl: '',
    heroImageUrl: '',
    businessType: 'Servicios de Limpieza',
    services: [
      {
        name: 'Limpieza de Hogares',
        slug: 'limpieza-hogares-madrid',
        description: 'Servicio de limpieza domestica profesional en Madrid. Equipos especializados y productos ecológicos.',
        keywords: ['limpieza hogares madrid', 'limpieza domestica', 'limpieza casas madrid'],
        bullets: ['Limpieza general del hogar', 'Cocinas y banos especial', 'Productos ecológicos', 'Personal formado'],
      },
    ],
    zones: ['Centro de Madrid', 'Salamanca', 'Chamberi', 'Retiro', 'Chamartin'],
    socialLinks: {
      instagram: 'https://instagram.com/limpiezaexpress',
    },
    seoTitle: 'Limpieza Express | Servicio de Limpieza Profesional en Madrid',
    seoDescription: 'Servicio profesional de limpieza de hogares y oficinas en Madrid. Precios competitivos, productos ecológicos. Solicita presupuesto gratis.',
    seoKeywords: ['limpieza madrid', 'limpieza profesional madrid', 'limpieza hogares'],
    googleSiteVerification: '',
    gAnalyticsId: '',
    gscVerified: false,
    onboardingStep: 1,
    onboardingCompleted: false,
    seoChecklist: {
      ...EMPTY_SEO_CHECKLIST,
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
    createdAt: '2026-03-20T11:00:00.000Z',
    updatedAt: '2026-04-08T16:00:00.000Z',
    notes: 'Nuevo cliente. Se ha completado la configuracion base pero falta branding y contenido. Pendiente de enviar logo y colores definitivos.',
  },
];

// ─── Initialization ─────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function initializeStorage(): void {
  if (!isBrowser()) return;
  const initialized = localStorage.getItem(INITIALIZED_KEY);
  if (initialized) return;
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(SEED_CLIENTS));
  localStorage.setItem(PARTNERS_KEY, JSON.stringify(SEED_PARTNERS));
  localStorage.setItem(ACTIVE_PARTNER_KEY, 'partner-1');
  localStorage.setItem(INITIALIZED_KEY, 'true');
}

// ─── Clients ────────────────────────────────────────────────────────

export function getClients(): Client[] {
  if (!isBrowser()) return [];
  initializeStorage();
  const raw = localStorage.getItem(CLIENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getClient(id: string): Client | undefined {
  const clients = getClients();
  return clients.find((c) => c.id === id);
}

export function saveClient(client: Client): void {
  if (!isBrowser()) return;
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === client.id);
  if (index >= 0) {
    clients[index] = { ...client, updatedAt: new Date().toISOString() };
  } else {
    clients.push(client);
  }
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function deleteClient(id: string): void {
  if (!isBrowser()) return;
  const clients = getClients().filter((c) => c.id !== id);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function updateClientSEOChecklist(
  id: string,
  checklist: Partial<SEOChecklist>
): void {
  const client = getClient(id);
  if (!client) return;
  saveClient({
    ...client,
    seoChecklist: { ...client.seoChecklist, ...checklist },
  });
}

// ─── Partners ───────────────────────────────────────────────────────

export function getPartners(): Partner[] {
  if (!isBrowser()) return [];
  initializeStorage();
  const raw = localStorage.getItem(PARTNERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getActivePartner(): Partner | undefined {
  if (!isBrowser()) return undefined;
  const activeId = localStorage.getItem(ACTIVE_PARTNER_KEY);
  if (!activeId) return undefined;
  const partners = getPartners();
  return partners.find((p) => p.id === activeId);
}

export function setActivePartner(partnerId: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACTIVE_PARTNER_KEY, partnerId);
  // Update partner active states
  const partners = getPartners();
  const updated = partners.map((p) => ({
    ...p,
    active: p.id === partnerId,
  }));
  localStorage.setItem(PARTNERS_KEY, JSON.stringify(updated));
}

export function savePartner(partner: Partner): void {
  if (!isBrowser()) return;
  const partners = getPartners();
  const index = partners.findIndex((p) => p.id === partner.id);
  if (index >= 0) {
    partners[index] = partner;
  } else {
    partners.push(partner);
  }
  localStorage.setItem(PARTNERS_KEY, JSON.stringify(partners));
}

// ─── Helpers ────────────────────────────────────────────────────────

export function generateId(): string {
  return `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getSEOProgress(checklist: SEOChecklist): number {
  const total = Object.keys(checklist).length;
  const completed = Object.values(checklist).filter(Boolean).length;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

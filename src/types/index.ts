export interface ServiceItem {
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  bullets: string[];
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  googleMaps?: string;
  website?: string;
}

export interface SEOChecklist {
  // Technical SEO
  metadataBase: boolean;
  titleTags: boolean;
  metaDescriptions: boolean;
  canonicalUrls: boolean;
  robotsTxt: boolean;
  sitemapXml: boolean;
  securityHeaders: boolean;
  httpsEnabled: boolean;
  // Schema
  localBusinessSchema: boolean;
  serviceSchema: boolean;
  breadcrumbSchema: boolean;
  organizationSchema: boolean;
  noProhibitedSchemas: boolean;
  // Performance
  lcpGood: boolean;
  clsGood: boolean;
  inpGood: boolean;
  imagesWebp: boolean;
  fontDisplaySwap: boolean;
  lazyLoadImages: boolean;
  heroFetchPriority: boolean;
  // Content
  uniqueH1PerPage: boolean;
  h2Subtopics: boolean;
  imageAlts: boolean;
  internalLinking: boolean;
  noOrphanPages: boolean;
  minimumWordCount: boolean;
  // Analytics
  gscVerified: boolean;
  ga4Configured: boolean;
  sitemapSubmitted: boolean;
  gbpCreated: boolean;
  // Legal
  avisoLegal: boolean;
  privacidad: boolean;
  cookies: boolean;
  cookieBanner: boolean;
}

export type ClientStatus =
  | 'new'
  | 'configuring'
  | 'seo_setup'
  | 'branding'
  | 'content'
  | 'review'
  | 'published'
  | 'maintenance';

export interface Client {
  id: string;
  // Partner info
  partnerId: string;
  partnerName: string;
  // Student/Client info
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  province: string;
  domain: string;
  status: ClientStatus;
  // Branding
  brandPrimaryColor: string;
  brandSecondaryColor: string;
  brandAccentColor: string;
  logoUrl: string;
  heroImageUrl: string;
  // Business details
  businessType: string;
  services: ServiceItem[];
  zones: string[];
  socialLinks: SocialLinks;
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  googleSiteVerification: string;
  gAnalyticsId: string;
  gscVerified: boolean;
  // Onboarding tracking
  onboardingStep: number;
  onboardingCompleted: boolean;
  seoChecklist: SEOChecklist;
  // Metadata
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export interface Partner {
  id: string;
  name: string;
  templateType: string;
  templateRepo: string;
  description: string;
  active: boolean;
  clientCount?: number;
  createdAt: string;
}

export const STATUS_LABELS: Record<ClientStatus, string> = {
  new: 'Nuevo',
  configuring: 'Configurando',
  seo_setup: 'Config. SEO',
  branding: 'Branding',
  content: 'Contenido',
  review: 'Revision',
  published: 'Publicado',
  maintenance: 'Mantenimiento',
};

export const STATUS_COLORS: Record<ClientStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  configuring: 'bg-yellow-100 text-yellow-800',
  seo_setup: 'bg-purple-100 text-purple-800',
  branding: 'bg-orange-100 text-orange-800',
  content: 'bg-teal-100 text-teal-800',
  review: 'bg-amber-100 text-amber-800',
  published: 'bg-green-100 text-green-800',
  maintenance: 'bg-gray-100 text-gray-800',
};

export const EMPTY_SEO_CHECKLIST: SEOChecklist = {
  metadataBase: false,
  titleTags: false,
  metaDescriptions: false,
  canonicalUrls: false,
  robotsTxt: false,
  sitemapXml: false,
  securityHeaders: false,
  httpsEnabled: false,
  localBusinessSchema: false,
  serviceSchema: false,
  breadcrumbSchema: false,
  organizationSchema: false,
  noProhibitedSchemas: false,
  lcpGood: false,
  clsGood: false,
  inpGood: false,
  imagesWebp: false,
  fontDisplaySwap: false,
  lazyLoadImages: false,
  heroFetchPriority: false,
  uniqueH1PerPage: false,
  h2Subtopics: false,
  imageAlts: false,
  internalLinking: false,
  noOrphanPages: false,
  minimumWordCount: false,
  gscVerified: false,
  ga4Configured: false,
  sitemapSubmitted: false,
  gbpCreated: false,
  avisoLegal: false,
  privacidad: false,
  cookies: false,
  cookieBanner: false,
};

export const SEO_CHECKLIST_ITEMS = [
  {
    category: 'SEO Tecnico',
    icon: 'Settings',
    items: [
      { key: 'metadataBase' as keyof SEOChecklist, label: 'Metadata Base URL', help: 'Configurar metadataBase en layout.tsx con la URL del dominio del cliente' },
      { key: 'titleTags' as keyof SEOChecklist, label: 'Title Tags Unicos', help: 'Cada pagina debe tener un <title> unico y descriptivo (50-60 caracteres)' },
      { key: 'metaDescriptions' as keyof SEOChecklist, label: 'Meta Descripciones', help: 'Cada pagina con meta description unica (150-160 caracteres)' },
      { key: 'canonicalUrls' as keyof SEOChecklist, label: 'URLs Canonicas', help: 'Implementar canonical URLs en todas las paginas para evitar contenido duplicado' },
      { key: 'robotsTxt' as keyof SEOChecklist, label: 'robots.txt', help: 'Generar robots.txt dinamico en app/robots.ts' },
      { key: 'sitemapXml' as keyof SEOChecklist, label: 'sitemap.xml', help: 'Generar sitemap.xml dinamico en app/sitemap.ts' },
      { key: 'securityHeaders' as keyof SEOChecklist, label: 'Security Headers', help: 'Configurar headers de seguridad en next.config.ts (X-Frame-Options, CSP, etc.)' },
      { key: 'httpsEnabled' as keyof SEOChecklist, label: 'HTTPS Habilitado', help: 'Verificar que el sitio carga exclusivamente sobre HTTPS' },
    ],
  },
  {
    category: 'Schema Markup',
    icon: 'Code',
    items: [
      { key: 'localBusinessSchema' as keyof SEOChecklist, label: 'LocalBusiness Schema', help: 'Implementar JSON-LD schema tipo LocalBusiness en la pagina principal' },
      { key: 'serviceSchema' as keyof SEOChecklist, label: 'Service Schema', help: 'Implementar schema tipo Service en cada pagina de servicio' },
      { key: 'breadcrumbSchema' as keyof SEOChecklist, label: 'BreadcrumbList Schema', help: 'Incluir BreadcrumbList schema en todas las paginas internas' },
      { key: 'organizationSchema' as keyof SEOChecklist, label: 'Organization Schema', help: 'Agregar schema Organization en el layout con datos del negocio' },
      { key: 'noProhibitedSchemas' as keyof SEOChecklist, label: 'Sin Schema Prohibido', help: 'NO usar FAQPage ni HowTo - estan prohibidos por las directrices de Google' },
    ],
  },
  {
    category: 'Rendimiento (Core Web Vitals)',
    icon: 'Gauge',
    items: [
      { key: 'lcpGood' as keyof SEOChecklist, label: 'LCP < 2.5s', help: 'Largest Contentful Paint debe ser menor a 2.5 segundos' },
      { key: 'clsGood' as keyof SEOChecklist, label: 'CLS < 0.1', help: 'Cumulative Layout Shift debe ser menor a 0.1' },
      { key: 'inpGood' as keyof SEOChecklist, label: 'INP < 200ms', help: 'Interaction to Next Paint debe ser menor a 200ms' },
      { key: 'imagesWebp' as keyof SEOChecklist, label: 'Imagenes WebP', help: 'Todas las imagenes deben estar en formato WebP para optimizar carga' },
      { key: 'fontDisplaySwap' as keyof SEOChecklist, label: 'Font Display Swap', help: 'Usar display: swap en las fuentes para evitar FOIT' },
      { key: 'lazyLoadImages' as keyof SEOChecklist, label: 'Lazy Loading Imagenes', help: 'Implementar lazy loading en todas las imagenes below the fold' },
      { key: 'heroFetchPriority' as keyof SEOChecklist, label: 'Hero Fetch Priority', help: 'La imagen hero debe usar fetchPriority="high" y priority' },
    ],
  },
  {
    category: 'Contenido On-Page',
    icon: 'FileText',
    items: [
      { key: 'uniqueH1PerPage' as keyof SEOChecklist, label: 'H1 Unico por Pagina', help: 'Cada pagina debe tener exactamente un H1 con la keyword principal' },
      { key: 'h2Subtopics' as keyof SEOChecklist, label: 'H2 con Subtemas', help: 'Usar H2 para estructurar subtemas relevantes en el contenido' },
      { key: 'imageAlts' as keyof SEOChecklist, label: 'Alt Text en Imagenes', help: 'Todas las imagenes deben tener atributo alt descriptivo con keywords' },
      { key: 'internalLinking' as keyof SEOChecklist, label: 'Enlaces Internos', help: 'Cada pagina debe enlazar a otras paginas del sitio de forma natural' },
      { key: 'noOrphanPages' as keyof SEOChecklist, label: 'Sin Paginas Huerfanas', help: 'Todas las paginas deben ser accesibles desde al menos un enlace interno' },
      { key: 'minimumWordCount' as keyof SEOChecklist, label: 'Minimo 300 Palabras', help: 'Cada pagina debe tener al menos 300 palabras de contenido unico' },
    ],
  },
  {
    category: 'Analytics y Search Console',
    icon: 'BarChart3',
    items: [
      { key: 'gscVerified' as keyof SEOChecklist, label: 'Google Search Console', help: 'Verificar el dominio en Google Search Console' },
      { key: 'ga4Configured' as keyof SEOChecklist, label: 'Google Analytics 4', help: 'Configurar GA4 con el tracking ID del cliente' },
      { key: 'sitemapSubmitted' as keyof SEOChecklist, label: 'Sitemap Enviado', help: 'Enviar el sitemap.xml a Google Search Console' },
      { key: 'gbpCreated' as keyof SEOChecklist, label: 'Google Business Profile', help: 'Crear y verificar el perfil de Google Business del cliente' },
    ],
  },
  {
    category: 'Legal y Cumplimiento',
    icon: 'Shield',
    items: [
      { key: 'avisoLegal' as keyof SEOChecklist, label: 'Aviso Legal', help: 'Crear pagina /aviso-legal con la informacion legal requerida' },
      { key: 'privacidad' as keyof SEOChecklist, label: 'Politica de Privacidad', help: 'Crear pagina /privacidad con la politica de privacidad' },
      { key: 'cookies' as keyof SEOChecklist, label: 'Politica de Cookies', help: 'Crear pagina /cookies con la politica de cookies' },
      { key: 'cookieBanner' as keyof SEOChecklist, label: 'Banner de Cookies', help: 'Implementar banner de cookies consentimiento RGPD' },
    ],
  },
];

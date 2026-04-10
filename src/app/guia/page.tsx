'use client';

import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Code,
  Globe,
  Gauge,
  FileText,
  Shield,
  Zap,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AppShell from '@/components/app-shell';

const PRINCIPLES = [
  {
    icon: Zap,
    title: 'Rendimiento como Prioridad',
    description: 'LCP < 2.5s, CLS < 0.1, INP < 200ms. El rendimiento es un factor de ranking directo.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Code,
    title: 'Metadata Base Obligatoria',
    description: 'metadataBase en layout.tsx + title/description unicos por pagina. Sin excepciones.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
  {
    icon: Globe,
    title: 'URLs Semanticas',
    description: 'Estructura jerarquica: /servicio-ciudad. Todas las URLs deben ser amigables y descriptivas.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Shield,
    title: 'Schema Markup sin Prohibidos',
    description: 'Solo LocalBusiness, Service, BreadcrumbList, Organization. NUNCA FAQPage ni HowTo.',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    icon: FileText,
    title: 'Contenido Original y Suficiente',
    description: 'Minimo 300 palabras por pagina. H1 unico, H2 para subtemas, alt text en todas las imagenes.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
];

const URL_RULES = [
  { rule: 'Estructura', value: '/servicio-ciudad' },
  { rule: 'Ejemplo', value: '/limpieza-piscinas-tenerife' },
  { rule: 'No usar', value: '/pages/servicios?id=123' },
  { rule: 'Separador', value: 'Guiones (-), nunca guiones bajos (_)' },
  { rule: 'Longitud', value: '3-5 segmentos maximo' },
  { rule: 'Parametros', value: 'Nunca parametros en URLs' },
];

const SCHEMA_BY_PAGE = [
  { page: 'Inicio (/)', schemas: ['LocalBusiness', 'Organization'] },
  { page: 'Servicios (/servicios)', schemas: ['BreadcrumbList'] },
  { page: 'Pagina de Servicio', schemas: ['Service', 'BreadcrumbList'] },
  { page: 'Legal (/aviso-legal, /privacidad, /cookies)', schemas: [] },
];

const PERFORMANCE_TARGETS = [
  { metric: 'LCP (Largest Contentful Paint)', target: '< 2.5 segundos', priority: 'Critico' },
  { metric: 'CLS (Cumulative Layout Shift)', target: '< 0.1', priority: 'Critico' },
  { metric: 'INP (Interaction to Next Paint)', target: '< 200ms', priority: 'Critico' },
  { metric: 'Tamaño Total de Pagina', target: '< 1.6 MB', priority: 'Recomendado' },
  { metric: 'Imagenes', target: 'Formato WebP exclusivamente', priority: 'Obligatorio' },
  { metric: 'Fuentes', target: 'display: swap siempre', priority: 'Obligatorio' },
  { metric: 'Hero Image', target: 'fetchPriority="high" + priority', priority: 'Obligatorio' },
  { metric: 'Below-fold Images', target: 'Lazy loading activado', priority: 'Obligatorio' },
];

const MASTER_CHECKLIST = [
  { category: 'Pre-Desarrollo', items: [
    'Dominio adquirido y configurado',
    'Hosting preparado (Vercel recomendado)',
    'Google Analytics 4 creado',
    'Google Search Console preparado',
    'Google Business Profile creado',
  ]},
  { category: 'Desarrollo', items: [
    'metadataBase configurado',
    'Title tags unicos (< 60 chars)',
    'Meta descriptions unicas (< 160 chars)',
    'Canonical URLs en todas las paginas',
    'robots.ts generado',
    'sitemap.ts generado',
    'Security headers en next.config.ts',
    'Schemas JSON-LD implementados',
    'Imagenes en WebP',
    'Lazy loading below-fold',
    'Hero con fetchPriority',
    'Fonts con display swap',
    'H1 unico por pagina',
    'Alt text en imagenes',
    'Enlaces internos naturales',
  ]},
  { category: 'Contenido', items: [
    'Minimo 300 palabras por pagina',
    'Keywords principales incluidas',
    'Contenido unico (no duplicado)',
    'CTAs claros y visibles',
    'Datos de contacto visibles',
  ]},
  { category: 'Legal', items: [
    '/aviso-legal publicado',
    '/privacidad publicado',
    '/cookies publicado',
    'Banner de cookies (RGPD)',
  ]},
  { category: 'Post-Lanzamiento', items: [
    'Sitemap enviado a GSC',
    'GSC verificado',
    'GA4 funcionando',
    'Google Business Profile verificado',
    'Primer crawl de Google',
    'Core Web Vitals verificados',
  ]},
];

export default function GuiaPage() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Introduction */}
        <Card className="border-cyan-200 bg-cyan-50/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Guia de Referencia SEO</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Esta guia resume las reglas y mejores practicas SEO que deben seguirse para cada proyecto web.
                  Consulta esta pagina durante el desarrollo para asegurar el cumplimiento de todos los requisitos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5 Core Principles */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            5 Principios Fundamentales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRINCIPLES.map((p) => (
              <Card key={p.title}>
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-lg ${p.bg} flex items-center justify-center mb-3`}>
                    <p.icon className={`h-5 w-5 ${p.color}`} />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">{p.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* URL Architecture */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-600" />
              Arquitectura de URLs
            </CardTitle>
            <CardDescription>Reglas obligatorias para la estructura de URLs del sitio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 text-slate-500 font-medium">Regla</th>
                    <th className="text-left py-2 text-slate-500 font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {URL_RULES.map((row) => (
                    <tr key={row.rule} className="border-b border-slate-100">
                      <td className="py-2.5 pr-4 text-slate-600 font-medium">{row.rule}</td>
                      <td className="py-2.5">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                          {row.value}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Prohibited Schemas */}
        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-800">Schemas PROHIBIDOS</h4>
                <p className="text-sm text-red-700 mt-1">
                  <strong>NUNCA</strong> utilizar los siguientes tipos de schema markup. Estan expresamente prohibidos por las directrices de Google:
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline" className="border-red-300 text-red-700 bg-red-100">FAQPage</Badge>
                  <Badge variant="outline" className="border-red-300 text-red-700 bg-red-100">HowTo</Badge>
                </div>
                <p className="text-xs text-red-600 mt-2">
                  Razon: Google penaliza el uso de estos schemas cuando el contenido no cumple los criterios estrictos.
                  El riesgo de penalizacion supera cualquier beneficio potencial.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schema by Page */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-5 w-5 text-cyan-600" />
              Schema Markup por Pagina
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 text-slate-500 font-medium">Pagina</th>
                    <th className="text-left py-2 text-slate-500 font-medium">Schemas</th>
                  </tr>
                </thead>
                <tbody>
                  {SCHEMA_BY_PAGE.map((row) => (
                    <tr key={row.page} className="border-b border-slate-100">
                      <td className="py-2.5 pr-4 text-slate-700 font-medium">{row.page}</td>
                      <td className="py-2.5">
                        {row.schemas.length > 0 ? (
                          <div className="flex gap-1.5 flex-wrap">
                            {row.schemas.map((s) => (
                              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Ninguno</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Performance Targets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gauge className="h-5 w-5 text-cyan-600" />
              Objetivos de Rendimiento
            </CardTitle>
            <CardDescription>Core Web Vitals y targets de optimizacion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 text-slate-500 font-medium">Metrica</th>
                    <th className="text-left py-2 pr-4 text-slate-500 font-medium">Objetivo</th>
                    <th className="text-left py-2 text-slate-500 font-medium">Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {PERFORMANCE_TARGETS.map((row) => (
                    <tr key={row.metric} className="border-b border-slate-100">
                      <td className="py-2.5 pr-4 text-slate-700 font-medium">{row.metric}</td>
                      <td className="py-2.5 pr-4">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">{row.target}</code>
                      </td>
                      <td className="py-2.5">
                        <Badge
                          variant={row.priority === 'Critico' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {row.priority}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Master Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-cyan-600" />
              Checklist Maestro de Entrega
            </CardTitle>
            <CardDescription>Lista completa de verificacion antes de entregar un proyecto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MASTER_CHECKLIST.map((section) => (
                <div key={section.category}>
                  <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                    {section.category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {section.items.map((item) => (
                      <div key={item} className="flex items-start gap-2 p-2 rounded-md hover:bg-slate-50">
                        <CheckCircle2 className="h-4 w-4 text-slate-300 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{item}</span>
                      </div>
                    ))}
                  </div>
                  {section !== MASTER_CHECKLIST[MASTER_CHECKLIST.length - 1] && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Edit,
  CheckSquare,
  FileText,
  StickyNote,
  Facebook,
  Instagram,
  Save,
  Palette,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/status-badge';
import AppShell from '@/components/app-shell';
import { fetchClient, updateClient, updateClientSEO } from '@/lib/api';
import { getSEOProgress } from '@/lib/utils';
import { Client, SEOChecklist, SEO_CHECKLIST_ITEMS } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const { data: client, isLoading } = useQuery({
    queryKey: ['clients', id],
    queryFn: () => fetchClient(id),
  });
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  const saveNotesMutation = useMutation({
    mutationFn: (notesValue: string) => updateClient(id, { notes: notesValue }),
    onSuccess: () => {
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
      queryClient.invalidateQueries({ queryKey: ['clients', id] });
    },
  });

  const toggleCheckMutation = useMutation({
    mutationFn: (key: keyof SEOChecklist) => updateClientSEO(id, { [key]: !client!.seoChecklist[key] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', id] });
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-500">Cargando...</p>
        </div>
      </AppShell>
    );
  }

  if (!client) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-slate-500 text-lg mb-4">Cliente no encontrado</p>
          <Link href="/clientes">
            <Button variant="outline">Volver a Clientes</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const seoProgress = getSEOProgress(client.seoChecklist);
  const totalChecks = Object.keys(client.seoChecklist).length;
  const completedChecks = Object.values(client.seoChecklist).filter(Boolean).length;

  const handleSaveNotes = () => {
    saveNotesMutation.mutate(notes);
  };

  const handleToggleCheck = (key: keyof SEOChecklist) => {
    toggleCheckMutation.mutate(key);
  };

  const infoItems = [
    { icon: Globe, label: 'Dominio', value: client.domain || '—' },
    { icon: Mail, label: 'Email', value: client.email || '—' },
    { icon: Phone, label: 'Telefono', value: client.phone || '—' },
    { icon: MapPin, label: 'Ubicacion', value: `${client.location}, ${client.province}` },
    { icon: FileText, label: 'Tipo de Negocio', value: client.businessType || '—' },
    { icon: Globe, label: 'Socio', value: client.partnerName || '—' },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <Link href="/clientes">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Clientes
          </Button>
        </Link>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: client.brandPrimaryColor + '20' }}>
                  <Globe className="h-7 w-7" style={{ color: client.brandPrimaryColor }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{client.businessName}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <StatusBadge status={client.status} />
                    <span className="text-sm text-slate-500">{client.location}</span>
                    {client.domain && <span className="text-sm text-cyan-600 font-mono">{client.domain}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/clientes/${id}/seo`}>
                  <Button variant="outline" className="gap-2"><CheckSquare className="h-4 w-4" /> Checklist SEO</Button>
                </Link>
                <Link href={`/clientes/${id}/editar`}>
                  <Button className="bg-cyan-600 hover:bg-cyan-700 gap-2"><Edit className="h-4 w-4" /> Editar</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="informacion" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger value="informacion">Informacion</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="seo">SEO Checklist</TabsTrigger>
            <TabsTrigger value="notas">Notas</TabsTrigger>
          </TabsList>

          <TabsContent value="informacion">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-lg">Datos del Contacto</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {infoItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.label}</p>
                        <p className="text-sm font-medium text-slate-900">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle className="text-lg">Servicios ({client.services.length})</CardTitle></CardHeader>
                  <CardContent>
                    {client.services.length === 0 ? (
                      <p className="text-sm text-slate-400">No hay servicios configurados</p>
                    ) : (
                      <div className="space-y-3">
                        {client.services.map((service, i) => (
                          <div key={i} className="border border-slate-100 rounded-lg p-3">
                            <p className="font-medium text-sm">{service.name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-1">/{service.slug}</p>
                            {service.description && <p className="text-xs text-slate-500 mt-2">{service.description}</p>}
                            {service.bullets.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {service.bullets.map((b, j) => (
                                  <li key={j} className="text-xs text-slate-600 flex items-start gap-1.5">
                                    <span className="text-cyan-500 mt-0.5">•</span> {b}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-lg">Zonas de Cobertura ({client.zones.length})</CardTitle></CardHeader>
                  <CardContent>
                    {client.zones.length === 0 ? (
                      <p className="text-sm text-slate-400">No hay zonas configuradas</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {client.zones.map((zone, i) => (
                          <Badge key={i} variant="secondary" className="py-1.5 px-3"><MapPin className="h-3 w-3 mr-1" />{zone}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-lg">Redes Sociales</CardTitle></CardHeader>
                  <CardContent>
                    {(!Object.values(client.socialLinks).some(Boolean)) ? (
                      <p className="text-sm text-slate-400">No hay redes sociales configuradas</p>
                    ) : (
                      <div className="space-y-2">
                        {client.socialLinks.facebook && (
                          <a href={client.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700">
                            <Facebook className="h-4 w-4" /> Facebook <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {client.socialLinks.instagram && (
                          <a href={client.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700">
                            <Instagram className="h-4 w-4" /> Instagram <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {client.socialLinks.tiktok && (
                          <a href={client.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700">
                            <Globe className="h-4 w-4" /> TikTok <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {client.socialLinks.googleMaps && (
                          <a href={client.socialLinks.googleMaps} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700">
                            <MapPin className="h-4 w-4" /> Google Maps <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="branding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Palette className="h-5 w-5 text-cyan-600" /> Paleta de Colores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Primario', color: client.brandPrimaryColor },
                      { label: 'Secundario', color: client.brandSecondaryColor },
                      { label: 'Acento', color: client.brandAccentColor },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <div className="w-full h-20 rounded-lg border-2 border-slate-200 mb-2" style={{ backgroundColor: item.color }} />
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-slate-500 font-mono">{item.color}</p>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-3">Vista Previa</p>
                    <div className="rounded-lg overflow-hidden border border-slate-200">
                      <div className="h-28 flex items-center justify-center" style={{ backgroundColor: client.brandPrimaryColor }}>
                        <span className="text-white font-bold text-xl" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{client.businessName}</span>
                      </div>
                      <div className="p-4 bg-white">
                        <div className="h-3 w-32 rounded mb-2" style={{ backgroundColor: client.brandSecondaryColor }} />
                        <div className="h-2 w-48 rounded mb-4" style={{ backgroundColor: client.brandSecondaryColor + '60' }} />
                        <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: client.brandAccentColor }}>
                          Contactar Ahora
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">SEO y Contenido</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Title Tag</p>
                    <p className="text-sm font-medium">{client.seoTitle || '—'}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Meta Description</p>
                    <p className="text-sm">{client.seoDescription || '—'}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {client.seoKeywords.length === 0 ? <span className="text-sm text-slate-400">—</span> : (
                        client.seoKeywords.map((kw, i) => <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>)
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">GA4 ID</p>
                      <p className="text-sm font-mono">{client.gAnalyticsId || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">GSC Verificado</p>
                      <Badge variant={client.gscVerified ? 'default' : 'outline'}>{client.gscVerified ? 'Si' : 'No'}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Checklist SEO</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">{completedChecks} de {totalChecks} items completados</p>
                  </div>
                  <Link href={`/clientes/${id}/seo`}>
                    <Button variant="outline" className="gap-2">Ver Completo <ExternalLink className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={seoProgress} className="h-3 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SEO_CHECKLIST_ITEMS.map((category) => {
                    const catCompleted = category.items.filter((item) => client.seoChecklist[item.key]).length;
                    const catTotal = category.items.length;
                    return (
                      <div key={category.category} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold">{category.category}</h4>
                          <span className="text-xs text-slate-500">{catCompleted}/{catTotal}</span>
                        </div>
                        <div className="space-y-2">
                          {category.items.map((item) => (
                            <div key={item.key} className="flex items-start gap-2">
                              <Checkbox checked={client.seoChecklist[item.key]} onCheckedChange={() => handleToggleCheck(item.key)} className="mt-0.5" />
                              <Label className="text-xs text-slate-700 leading-relaxed cursor-pointer" onClick={() => handleToggleCheck(item.key)}>{item.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notas">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><StickyNote className="h-5 w-5 text-cyan-600" /> Notas Internas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea placeholder="Agrega notas sobre este cliente..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={10} className="resize-y" />
                <div className="flex items-center gap-3">
                  <Button onClick={handleSaveNotes} className="bg-cyan-600 hover:bg-cyan-700 gap-2"><Save className="h-4 w-4" /> Guardar Notas</Button>
                  {notesSaved && <span className="text-sm text-emerald-600 font-medium">Guardado correctamente</span>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

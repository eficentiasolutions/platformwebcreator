'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  UserPlus,
  Palette,
  FileText,
  Search,
  Globe,
  MapPin,
  Plus,
  X,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AppShell from '@/components/app-shell';
import { getClient, saveClient } from '@/lib/storage';
import { Client, ClientStatus, STATUS_LABELS, ServiceItem } from '@/types';

export default function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [client, setClient] = useState<Client | null>(() => {
    if (typeof window === 'undefined') return null;
    return getClient(id);
  });
  const [saved, setSaved] = useState(false);
  const [newZone, setNewZone] = useState('');
  const [serviceInputs, setServiceInputs] = useState<Record<number, string>>({});

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

  const updateField = (field: keyof Client, value: string) => {
    setClient((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateSocialLink = (platform: string, value: string) => {
    if (!client) return;
    setClient({
      ...client,
      socialLinks: { ...client.socialLinks, [platform]: value || undefined },
    });
  };

  const addService = () => {
    if (!client) return;
    const newService: ServiceItem = {
      name: '',
      slug: '',
      description: '',
      keywords: [],
      bullets: [],
    };
    setClient({ ...client, services: [...client.services, newService] });
  };

  const updateService = (index: number, field: keyof ServiceItem, value: string | string[]) => {
    if (!client) return;
    const services = [...client.services];
    services[index] = { ...services[index], [field]: value };
    setClient({ ...client, services });
  };

  const removeService = (index: number) => {
    if (!client) return;
    setClient({
      ...client,
      services: client.services.filter((_, i) => i !== index),
    });
  };

  const addBullet = (sIdx: number, value: string) => {
    if (!client || !value.trim()) return;
    const services = [...client.services];
    const service = { ...services[sIdx] };
    service.bullets = [...(service.bullets || []), value.trim()];
    services[sIdx] = service;
    setClient({ ...client, services });
  };

  const removeBullet = (sIdx: number, bIdx: number) => {
    if (!client) return;
    const services = [...client.services];
    const service = { ...services[sIdx] };
    service.bullets = (service.bullets || []).filter((_, i) => i !== bIdx);
    services[sIdx] = service;
    setClient({ ...client, services });
  };

  const addZone = () => {
    if (!client || !newZone.trim()) return;
    setClient({ ...client, zones: [...client.zones, newZone.trim()] });
    setNewZone('');
  };

  const removeZone = (index: number) => {
    if (!client) return;
    setClient({ ...client, zones: client.zones.filter((_, i) => i !== index) });
  };

  const handleSave = () => {
    if (!client) return;
    saveClient({ ...client, updatedAt: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href={`/clientes/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Detalle
          </Button>
        </Link>

        {/* General Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-cyan-600" />
              Datos del Negocio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre del Negocio</Label>
                <Input value={client.businessName} onChange={(e) => updateField('businessName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nombre del Contacto</Label>
                <Input value={client.contactName} onChange={(e) => updateField('contactName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={client.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Telefono</Label>
                <Input value={client.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Ciudad</Label>
                <Input value={client.location} onChange={(e) => updateField('location', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Provincia</Label>
                <Input value={client.province} onChange={(e) => updateField('province', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Dominio</Label>
                <Input value={client.domain} onChange={(e) => updateField('domain', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Negocio</Label>
                <Input value={client.businessType} onChange={(e) => updateField('businessType', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={client.status} onValueChange={(v) => updateField('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABELS) as ClientStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-cyan-600" />
              Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Color Primario</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={client.brandPrimaryColor}
                    onChange={(e) => updateField('brandPrimaryColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer p-1"
                  />
                  <Input value={client.brandPrimaryColor} onChange={(e) => updateField('brandPrimaryColor', e.target.value)} className="flex-1 font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Color Secundario</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={client.brandSecondaryColor}
                    onChange={(e) => updateField('brandSecondaryColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer p-1"
                  />
                  <Input value={client.brandSecondaryColor} onChange={(e) => updateField('brandSecondaryColor', e.target.value)} className="flex-1 font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Color de Acento</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={client.brandAccentColor}
                    onChange={(e) => updateField('brandAccentColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer p-1"
                  />
                  <Input value={client.brandAccentColor} onChange={(e) => updateField('brandAccentColor', e.target.value)} className="flex-1 font-mono" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>URL del Logo</Label>
                <Input value={client.logoUrl} onChange={(e) => updateField('logoUrl', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>URL de Imagen Hero</Label>
                <Input value={client.heroImageUrl} onChange={(e) => updateField('heroImageUrl', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-600" />
              Redes Sociales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input value={client.socialLinks.facebook || ''} onChange={(e) => updateSocialLink('facebook', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input value={client.socialLinks.instagram || ''} onChange={(e) => updateSocialLink('instagram', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>TikTok</Label>
                <Input value={client.socialLinks.tiktok || ''} onChange={(e) => updateSocialLink('tiktok', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Google Maps</Label>
                <Input value={client.socialLinks.googleMaps || ''} onChange={(e) => updateSocialLink('googleMaps', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-cyan-600" />
              Configuracion SEO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Titulo SEO</Label>
              <Input value={client.seoTitle} onChange={(e) => updateField('seoTitle', e.target.value)} />
              <p className="text-xs text-slate-500">{client.seoTitle.length}/60 caracteres</p>
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea value={client.seoDescription} onChange={(e) => updateField('seoDescription', e.target.value)} rows={3} />
              <p className="text-xs text-slate-500">{client.seoDescription.length}/160 caracteres</p>
            </div>
            <div className="space-y-2">
              <Label>Keywords (separadas por coma)</Label>
              <Textarea value={client.seoKeywords.join(', ')} onChange={(e) => updateField('seoKeywords', e.target.value)} rows={2} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Google Site Verification</Label>
                <Input value={client.googleSiteVerification} onChange={(e) => updateField('googleSiteVerification', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>GA4 ID</Label>
                <Input value={client.gAnalyticsId} onChange={(e) => updateField('gAnalyticsId', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-600" />
                Servicios
              </CardTitle>
              <Button size="sm" variant="outline" onClick={addService} className="gap-1">
                <Plus className="h-4 w-4" /> Agregar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.services.map((service, sIdx) => (
              <div key={sIdx} className="border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Servicio {sIdx + 1}</span>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeService(sIdx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Nombre</Label>
                    <Input value={service.name} onChange={(e) => updateService(sIdx, 'name', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Slug</Label>
                    <Input value={service.slug} onChange={(e) => updateService(sIdx, 'slug', e.target.value)} className="font-mono text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Descripcion</Label>
                  <Textarea value={service.description} onChange={(e) => updateService(sIdx, 'description', e.target.value)} rows={2} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Puntos Clave</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Agregar punto..."
                      value={serviceInputs[sIdx] || ''}
                      onChange={(e) => setServiceInputs({ ...serviceInputs, [sIdx]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addBullet(sIdx, serviceInputs[sIdx] || '');
                          setServiceInputs({ ...serviceInputs, [sIdx]: '' });
                        }
                      }}
                    />
                    <Button size="sm" variant="outline" onClick={() => {
                      addBullet(sIdx, serviceInputs[sIdx] || '');
                      setServiceInputs({ ...serviceInputs, [sIdx]: '' });
                    }}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {service.bullets.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {service.bullets.map((b, bIdx) => (
                        <Badge key={bIdx} variant="secondary" className="gap-1">
                          {b}
                          <button onClick={() => removeBullet(sIdx, bIdx)}><X className="h-3 w-3" /></button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Zones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cyan-600" />
              Zonas de Cobertura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-3">
              <Input placeholder="Agregar zona..." value={newZone} onChange={(e) => setNewZone(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addZone(); } }} />
              <Button size="sm" variant="outline" onClick={addZone}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {client.zones.map((zone, zIdx) => (
                <Badge key={zIdx} variant="secondary" className="py-1.5 px-3 gap-1">
                  {zone}
                  <button onClick={() => removeZone(zIdx)}><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex justify-end pb-8">
          <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 gap-2 px-8">
            <Save className="h-4 w-4" />
            Guardar Cambios
            {saved && <span className="ml-2 text-emerald-300">✓</span>}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

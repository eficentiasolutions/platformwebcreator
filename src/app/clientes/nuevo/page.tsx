'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  UserPlus,
  Palette,
  FileText,
  Search,
  CheckCircle2,
  ArrowRight,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import AppShell from '@/components/app-shell';
import { createClient, fetchSettings } from '@/lib/api';
import {
  Client,
  ServiceItem,
  EMPTY_SEO_CHECKLIST,
  SEO_CHECKLIST_ITEMS,
} from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const STEPS = [
  { title: 'Datos del Alumno', icon: UserPlus },
  { title: 'Branding', icon: Palette },
  { title: 'Servicios y Contenido', icon: FileText },
  { title: 'Configuracion SEO', icon: Search },
  { title: 'Revision y Publicacion', icon: CheckCircle2 },
];

interface FormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  province: string;
  domain: string;
  businessType: string;
  notes: string;
  brandPrimaryColor: string;
  brandSecondaryColor: string;
  brandAccentColor: string;
  logoUrl: string;
  heroImageUrl: string;
  services: ServiceItem[];
  zones: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  googleSiteVerification: string;
  gAnalyticsId: string;
  status: Client['status'];
}

const initialFormData: FormData = {
  businessName: '', contactName: '', email: '', phone: '', location: '',
  province: '', domain: '', businessType: '', notes: '',
  brandPrimaryColor: '#0891B2', brandSecondaryColor: '#0E7490', brandAccentColor: '#F59E0B',
  logoUrl: '', heroImageUrl: '', services: [], zones: [],
  seoTitle: '', seoDescription: '', seoKeywords: '',
  googleSiteVerification: '', gAnalyticsId: '', status: 'new',
};

function NuevoClienteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [newZone, setNewZone] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: fetchSettings });

  const partnerId = searchParams.get('partnerId') || '';
  const partnerInfo = settings?.activePartnerId ? { id: settings.activePartnerId, name: '' } : null;

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.push(`/clientes/${newClient.id}`);
    },
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    const newService: ServiceItem = { name: '', slug: '', description: '', keywords: [], bullets: [] };
    setFormData((prev) => ({ ...prev, services: [...prev.services, newService] }));
  };

  const updateService = (index: number, field: keyof ServiceItem, value: string | string[]) => {
    setFormData((prev) => {
      const services = [...prev.services];
      services[index] = { ...services[index], [field]: value };
      return { ...prev, services };
    });
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }));
  };

  const addZone = () => {
    if (newZone.trim()) {
      setFormData((prev) => ({ ...prev, zones: [...prev.zones, newZone.trim()] }));
      setNewZone('');
    }
  };

  const removeZone = (index: number) => {
    setFormData((prev) => ({ ...prev, zones: prev.zones.filter((_, i) => i !== index) }));
  };

  const addBulletToService = (serviceIndex: number) => {
    if (newKeyword.trim()) {
      setFormData((prev) => {
        const services = [...prev.services];
        const service = { ...services[serviceIndex] };
        service.bullets = [...(service.bullets || []), newKeyword.trim()];
        services[serviceIndex] = service;
        return { ...prev, services };
      });
      setNewKeyword('');
    }
  };

  const removeBulletFromService = (serviceIndex: number, bulletIndex: number) => {
    setFormData((prev) => {
      const services = [...prev.services];
      const service = { ...services[serviceIndex] };
      service.bullets = (service.bullets || []).filter((_, i) => i !== bulletIndex);
      services[serviceIndex] = service;
      return { ...prev, services };
    });
  };

  const handleSubmit = () => {
    const client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'partnerName'> = {
      partnerId: partnerInfo?.id || partnerId,
      businessName: formData.businessName,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      province: formData.province,
      domain: formData.domain,
      status: formData.status || 'new',
      brandPrimaryColor: formData.brandPrimaryColor,
      brandSecondaryColor: formData.brandSecondaryColor,
      brandAccentColor: formData.brandAccentColor,
      logoUrl: formData.logoUrl,
      heroImageUrl: formData.heroImageUrl,
      businessType: formData.businessType,
      services: formData.services,
      zones: formData.zones,
      socialLinks: {},
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      seoKeywords: formData.seoKeywords.split(',').map((k) => k.trim()).filter(Boolean),
      googleSiteVerification: formData.googleSiteVerification,
      gAnalyticsId: formData.gAnalyticsId,
      gscVerified: false,
      onboardingStep: 4,
      onboardingCompleted: true,
      seoChecklist: { ...EMPTY_SEO_CHECKLIST },
      notes: formData.notes,
    };
    createMutation.mutate(client);
  };

  const canProceed = () => {
    if (step === 0) return formData.businessName.trim() !== '' && formData.contactName.trim() !== '';
    return true;
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Progreso de Onboarding</h2>
              <span className="text-sm text-slate-500">Paso {step + 1} de {STEPS.length}</span>
            </div>
            <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
            <div className="flex justify-between mt-4">
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    i === step ? 'text-cyan-600' : i < step ? 'text-slate-600 hover:text-slate-800 cursor-pointer' : 'text-slate-400'
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{s.title}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-cyan-600" /> Datos del Alumno</CardTitle>
              <CardDescription>Informacion basica del alumno/cliente y su negocio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="businessName">Nombre del Negocio *</Label><Input id="businessName" placeholder="Ej: DR Pools" value={formData.businessName} onChange={(e) => updateField('businessName', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="contactName">Nombre del Contacto *</Label><Input id="contactName" placeholder="Ej: Roberto Sanchez" value={formData.contactName} onChange={(e) => updateField('contactName', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="email@ejemplo.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="phone">Telefono</Label><Input id="phone" placeholder="+34 612 345 678" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="location">Ciudad / Localidad</Label><Input id="location" placeholder="Ej: Santa Cruz de Tenerife" value={formData.location} onChange={(e) => updateField('location', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="province">Provincia / Region</Label><Input id="province" placeholder="Ej: Tenerife" value={formData.province} onChange={(e) => updateField('province', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="domain">Dominio (sin www)</Label><Input id="domain" placeholder="Ej: drpools-tenerife.com" value={formData.domain} onChange={(e) => updateField('domain', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="businessType">Tipo de Negocio</Label><Input id="businessType" placeholder="Ej: Mantenimiento de Piscinas" value={formData.businessType} onChange={(e) => updateField('businessType', e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="notes">Notas Internas</Label><Textarea id="notes" placeholder="Observaciones sobre el alumno..." value={formData.notes} onChange={(e) => updateField('notes', e.target.value)} rows={3} /></div>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-cyan-600" /> Branding</CardTitle>
              <CardDescription>Colores, logo e imagen hero del sitio web</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { key: 'brandPrimaryColor' as const, label: 'Color Primario' },
                  { key: 'brandSecondaryColor' as const, label: 'Color Secundario' },
                  { key: 'brandAccentColor' as const, label: 'Color de Acento' },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <Label>{label}</Label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={formData[key]} onChange={(e) => updateField(key, e.target.value)} className="w-12 h-12 rounded-lg border-2 border-slate-200 cursor-pointer p-1" />
                      <Input value={formData[key]} onChange={(e) => updateField(key, e.target.value)} className="flex-1 font-mono" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <div className="h-20 flex items-center justify-center" style={{ backgroundColor: formData.brandPrimaryColor }}>
                  <span className="text-white font-bold text-lg" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>{formData.businessName || 'Vista Previa'}</span>
                </div>
                <div className="flex">
                  <div className="h-10 flex-1" style={{ backgroundColor: formData.brandSecondaryColor }} />
                  <div className="h-10 flex-1" style={{ backgroundColor: formData.brandAccentColor }} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="logoUrl">URL del Logo</Label><Input id="logoUrl" placeholder="https://ejemplo.com/logo.png" value={formData.logoUrl} onChange={(e) => updateField('logoUrl', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="heroImageUrl">URL de Imagen Hero</Label><Input id="heroImageUrl" placeholder="https://ejemplo.com/hero.jpg" value={formData.heroImageUrl} onChange={(e) => updateField('heroImageUrl', e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-cyan-600" /> Servicios y Contenido</CardTitle>
              <CardDescription>Define los servicios del negocio y las zonas de cobertura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-semibold">Servicios</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addService} className="gap-1"><Plus className="h-4 w-4" /> Agregar Servicio</Button>
                </div>
                {formData.services.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                    <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No hay servicios agregados</p>
                  </div>
                )}
                {formData.services.map((service, sIdx) => (
                  <div key={sIdx} className="border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Servicio {sIdx + 1}</span>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeService(sIdx)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1"><Label className="text-xs">Nombre del Servicio</Label><Input placeholder="Ej: Mantenimiento de Piscinas" value={service.name} onChange={(e) => updateService(sIdx, 'name', e.target.value)} /></div>
                      <div className="space-y-1"><Label className="text-xs">Slug (URL)</Label><Input placeholder="Ej: mantenimiento-piscinas-tenerife" value={service.slug} onChange={(e) => updateService(sIdx, 'slug', e.target.value)} className="font-mono text-sm" /></div>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Descripcion</Label><Textarea placeholder="Descripcion del servicio..." value={service.description} onChange={(e) => updateService(sIdx, 'description', e.target.value)} rows={2} /></div>
                    <div className="space-y-1">
                      <Label className="text-xs">Puntos Clave (Bullets)</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Agregar punto clave..." value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBulletToService(sIdx); } }} />
                        <Button type="button" size="sm" variant="outline" onClick={() => addBulletToService(sIdx)}><Plus className="h-4 w-4" /></Button>
                      </div>
                      {service.bullets.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {service.bullets.map((bullet, bIdx) => (
                            <Badge key={bIdx} variant="secondary" className="gap-1">{bullet}<button type="button" onClick={() => removeBulletFromService(sIdx, bIdx)} className="hover:text-red-500"><X className="h-3 w-3" /></button></Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <Label className="text-base font-semibold mb-4 block">Zonas de Cobertura</Label>
                <div className="flex gap-2 mb-3">
                  <Input placeholder="Agregar zona..." value={newZone} onChange={(e) => setNewZone(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addZone(); } }} />
                  <Button type="button" size="sm" variant="outline" onClick={addZone}><Plus className="h-4 w-4" /></Button>
                </div>
                {formData.zones.length > 0 && (
                  <div className="flex flex-wrap gap-2">{formData.zones.map((zone, zIdx) => (<Badge key={zIdx} variant="secondary" className="gap-1 py-1.5 px-3">{zone}<button type="button" onClick={() => removeZone(zIdx)} className="hover:text-red-500 ml-1"><X className="h-3 w-3" /></button></Badge>))}</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5 text-cyan-600" /> Configuracion SEO</CardTitle>
              <CardDescription>Meta tags, palabras clave y configuracion de herramientas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Titulo SEO (Title Tag)</Label>
                <Input id="seoTitle" placeholder="Ej: DR Pools | Mantenimiento de Piscinas en Tenerife" value={formData.seoTitle} onChange={(e) => updateField('seoTitle', e.target.value)} />
                <p className="text-xs text-slate-500">{formData.seoTitle.length}/60 caracteres recomendados</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea id="seoDescription" placeholder="Descripcion del negocio..." value={formData.seoDescription} onChange={(e) => updateField('seoDescription', e.target.value)} rows={3} />
                <p className="text-xs text-slate-500">{formData.seoDescription.length}/160 caracteres recomendados</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoKeywords">Palabras Clave (separadas por coma)</Label>
                <Textarea id="seoKeywords" placeholder="mantenimiento piscinas tenerife, limpieza piscinas" value={formData.seoKeywords} onChange={(e) => updateField('seoKeywords', e.target.value)} rows={2} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="googleVerification">Google Site Verification</Label><Input id="googleVerification" placeholder="Ej: abc123verification456" value={formData.googleSiteVerification} onChange={(e) => updateField('googleSiteVerification', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="gAnalyticsId">Google Analytics 4 ID</Label><Input id="gAnalyticsId" placeholder="Ej: G-XXXXXXXXXX" value={formData.gAnalyticsId} onChange={(e) => updateField('gAnalyticsId', e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-cyan-600" /> Revision y Publicacion</CardTitle>
                <CardDescription>Revisa toda la informacion antes de guardar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Datos del Negocio</h3>
                    <div className="space-y-2">
                      {[['Nombre', formData.businessName], ['Contacto', formData.contactName], ['Email', formData.email], ['Telefono', formData.phone], ['Ubicacion', `${formData.location}, ${formData.province}`], ['Dominio', formData.domain], ['Tipo', formData.businessType]].map(([label, value]) => (
                        <div key={label} className="flex justify-between text-sm"><span className="text-slate-500">{label}</span><span className="font-medium text-slate-900">{value || '—'}</span></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Branding</h3>
                    <div className="flex gap-3 mb-4">
                      {[{ l: 'Primario', c: formData.brandPrimaryColor }, { l: 'Secundario', c: formData.brandSecondaryColor }, { l: 'Acento', c: formData.brandAccentColor }].map((item) => (
                        <div key={item.l} className="text-center"><div className="w-14 h-14 rounded-lg border-2 border-slate-200" style={{ backgroundColor: item.c }} /><span className="text-xs text-slate-500 mt-1 block">{item.l}</span></div>
                      ))}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-6">Servicios ({formData.services.length})</h3>
                    {formData.services.map((s, i) => (<div key={i} className="text-sm mb-2"><p className="font-medium">{s.name || 'Sin nombre'}</p><p className="text-xs text-slate-500">{s.slug || 'Sin slug'}</p></div>))}
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-6">Zonas ({formData.zones.length})</h3>
                    <div className="flex flex-wrap gap-1">{formData.zones.map((z, i) => (<Badge key={i} variant="secondary" className="text-xs">{z}</Badge>))}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">SEO</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-slate-500">Title:</span> <span className="font-medium">{formData.seoTitle || '—'}</span></div>
                    <div><span className="text-slate-500">Description:</span> <span className="font-medium">{formData.seoDescription || '—'}</span></div>
                    <div><span className="text-slate-500">Keywords:</span> <span className="font-medium">{formData.seoKeywords || '—'}</span></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Checklist SEO</h3>
                    <span className="text-sm text-slate-400">Se completara durante el desarrollo</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SEO_CHECKLIST_ITEMS.map((category) => (
                      <div key={category.category} className="border border-slate-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-slate-700 mb-1">{category.category}</p>
                        <p className="text-xs text-slate-400">{category.items.length} items pendientes</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleSubmit} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-6 text-lg font-semibold gap-2"><CheckCircle2 className="h-5 w-5" /> Guardar y Crear Cliente</Button>
          </div>
        )}

        {step < 4 && (
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="gap-2"><ArrowLeft className="h-4 w-4" /> Atras</Button>
            <Button onClick={() => setStep(Math.min(4, step + 1))} disabled={!canProceed()} className="bg-cyan-600 hover:bg-cyan-700 gap-2">Siguiente <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function NuevoClientePage() {
  return (
    <Suspense fallback={<AppShell><div className="flex items-center justify-center py-20"><p className="text-slate-500">Cargando...</p></div></AppShell>}>
      <NuevoClienteContent />
    </Suspense>
  );
}

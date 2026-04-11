'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Settings,
  Code,
  Gauge,
  FileText,
  BarChart3,
  Shield,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AppShell from '@/components/app-shell';
import { getClient, saveClient, getSEOProgress } from '@/lib/storage';
import { Client, SEO_CHECKLIST_ITEMS, SEOChecklist } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  Settings,
  Code,
  Gauge,
  FileText,
  BarChart3,
  Shield,
};

export default function SEOChecklistPage({
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

  const handleToggle = (key: keyof SEOChecklist) => {
    const updated = {
      ...client,
      seoChecklist: { ...client.seoChecklist, [key]: !client.seoChecklist[key] },
    };
    setClient(updated);
    saveClient(updated);
  };

  const handleSave = () => {
    saveClient(client);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell>
      <TooltipProvider delayDuration={200}>
        <div className="max-w-5xl mx-auto space-y-6">
          <Link href={`/clientes/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2 text-slate-500 -ml-2"><ArrowLeft className="h-4 w-4" /> Volver a {client.businessName}</Button>
          </Link>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Checklist SEO</h2>
                  <p className="text-sm text-slate-500 mt-1">{client.businessName} · {client.domain}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-600">{completedChecks}/{totalChecks}</p>
                    <p className="text-xs text-slate-500">completados</p>
                  </div>
                  {seoProgress === 100 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /><span className="text-sm font-medium">Completo</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <Progress value={seoProgress} className="h-3" />
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-slate-500">Progreso general</span>
                  <span className="text-xs font-semibold text-cyan-600">{seoProgress}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {SEO_CHECKLIST_ITEMS.map((category) => {
              const catCompleted = category.items.filter((item) => client.seoChecklist[item.key]).length;
              const catTotal = category.items.length;
              const catProgress = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;
              const CategoryIcon = ICON_MAP[category.icon] || Settings;

              return (
                <Card key={category.category}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                          <CategoryIcon className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{category.category}</CardTitle>
                          <p className="text-xs text-slate-500 mt-0.5">{catCompleted} de {catTotal} items</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={catProgress} className="w-24 h-2" />
                        <span className="text-sm font-semibold text-slate-600 w-10 text-right">{catProgress}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {category.items.map((item) => {
                        const isChecked = client.seoChecklist[item.key];
                        return (
                          <div key={item.key} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${isChecked ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                            <Checkbox checked={isChecked} onCheckedChange={() => handleToggle(item.key)} className="mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <Label className={`text-sm font-medium leading-relaxed cursor-pointer ${isChecked ? 'text-emerald-700' : 'text-slate-700'}`} onClick={() => handleToggle(item.key)}>{item.label}</Label>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="flex-shrink-0 mt-0.5"><Info className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs"><p className="text-xs">{item.help}</p></TooltipContent>
                            </Tooltip>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end pb-8">
            <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 gap-2 px-8">
              <Save className="h-4 w-4" /> Guardar Progreso
              {saved && <span className="ml-2 text-emerald-300">✓</span>}
            </Button>
          </div>
        </div>
      </TooltipProvider>
    </AppShell>
  );
}

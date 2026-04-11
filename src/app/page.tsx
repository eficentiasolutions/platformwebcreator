'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Globe,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import AppShell from '@/components/app-shell';
import { getClients, getActivePartner } from '@/lib/storage';
import { Client, ClientStatus } from '@/types';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [clients] = useState<Client[]>(() => {
    if (typeof window === 'undefined') return [];
    return getClients();
  });
  const [activePartnerName] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const p = getActivePartner();
    return p?.name ?? null;
  });

  const total = clients.length;
  const published = clients.filter((c) => c.status === 'published').length;
  const inProgress = clients.filter((c) => !['published', 'maintenance'].includes(c.status)).length;
  const publishedPercent = total > 0 ? Math.round((published / total) * 100) : 0;

  const recentClients = [...clients]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const statusCounts: Record<string, number> = {};
  clients.forEach((c) => { statusCounts[c.status] = (statusCounts[c.status] || 0) + 1; });
  const statusEntries = Object.entries(statusCounts).sort((a, b) => b[1] - a[1]);

  const stats = [
    { label: 'Total Clientes', value: total, icon: Users, color: 'text-slate-700', bg: 'bg-slate-100' },
    { label: 'Publicados', value: published, icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'En Progreso', value: inProgress, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: '% Publicados', value: `${publishedPercent}%`, icon: TrendingUp, color: 'text-cyan-700', bg: 'bg-cyan-50' },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.bg)}>
                    <stat.icon className={cn('h-6 w-6', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Clientes Recientes</CardTitle>
              <Link href="/clientes">
                <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700">
                  Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentClients.length === 0 ? (
                  <div className="px-6 py-8 text-center text-slate-400">
                    No hay clientes todavia. Crea tu primer cliente.
                  </div>
                ) : (
                  recentClients.map((client) => (
                    <Link key={client.id} href={`/clientes/${client.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: client.brandPrimaryColor + '20' }}>
                          <Globe className="h-5 w-5" style={{ color: client.brandPrimaryColor }} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">{client.businessName}</p>
                          <p className="text-sm text-slate-500 truncate">{client.location} · {client.businessType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <StatusBadge status={client.status} />
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-lg font-semibold">Acciones Rapidas</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Link href="/clientes/nuevo" className="block">
                  <Button className="w-full justify-start gap-2 bg-cyan-600 hover:bg-cyan-700"><Plus className="h-4 w-4" /> Nuevo Cliente</Button>
                </Link>
                <Link href="/socios" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2"><Users className="h-4 w-4" /> Gestionar Socios</Button>
                </Link>
                <Link href="/guia" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2"><TrendingUp className="h-4 w-4" /> Guia SEO</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-lg font-semibold">Distribucion de Estados</CardTitle></CardHeader>
              <CardContent>
                {statusEntries.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">Sin datos</p>
                ) : (
                  <div className="space-y-2.5">
                    {statusEntries.map(([status, count]) => {
                      const pct = total > 0 ? (count / total) * 100 : 0;
                      return (
                        <div key={status} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <StatusBadge status={status as ClientStatus} />
                            <span className="text-slate-500">{count}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

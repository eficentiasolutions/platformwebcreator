'use client';

import React, { useState, useCallback } from 'react';
import {
  Handshake,
  Globe,
  Users,
  Check,
  Star,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppShell from '@/components/app-shell';
import { getPartners, getActivePartner, setActivePartner, getClients } from '@/lib/storage';
import { Partner } from '@/types';

export default function SociosPage() {
  const [partners, setPartners] = useState<Partner[]>(() => {
    if (typeof window === 'undefined') return [];
    return getPartners();
  });
  const [activePartnerId, setActivePartnerId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const active = getActivePartner();
    return active?.id || null;
  });

  const loadPartners = useCallback(() => {
    const p = getPartners();
    const active = getActivePartner();
    setPartners(p);
    setActivePartnerId(active?.id || null);
  }, []);

  const handleSetActive = (partnerId: string) => {
    setActivePartner(partnerId);
    loadPartners();
  };

  const getClientCountForPartner = (partnerId: string): number => {
    const clients = getClients();
    return clients.filter((c) => c.partnerId === partnerId).length;
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <p className="text-slate-500 text-sm">
          Gestiona los socios comerciales y cambia el contexto activo. Los socios determinan el template y configuracion base para los nuevos clientes.
        </p>

        <div className="grid gap-6">
          {partners.map((partner) => {
            const isActive = partner.id === activePartnerId;
            const clientCount = getClientCountForPartner(partner.id);

            return (
              <Card key={partner.id} className={`transition-all ${isActive ? 'ring-2 ring-cyan-500 border-cyan-300' : 'border-slate-200'}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isActive ? 'bg-cyan-100' : 'bg-slate-100'}`}>
                        <Handshake className={`h-7 w-7 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{partner.name}</h3>
                          {isActive && <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 gap-1"><Star className="h-3 w-3" /> Activo</Badge>}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{partner.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Globe className="h-3 w-3" /> Template: <span className="font-mono font-medium">{partner.templateType}</span></span>
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Users className="h-3 w-3" /> {clientCount} cliente{clientCount !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    {!isActive && (
                      <Button onClick={() => handleSetActive(partner.id)} variant="outline" className="border-cyan-300 text-cyan-600 hover:bg-cyan-50 gap-2">
                        <Check className="h-4 w-4" /> Seleccionar como Activo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {partners.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Handshake className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No hay socios configurados</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

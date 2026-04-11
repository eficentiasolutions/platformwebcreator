'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Handshake,
  Globe,
  Users,
  Check,
  Star,
  Plus,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AppShell from '@/components/app-shell';
import { fetchPartners, fetchSettings, updateSettings, createPartner, fetchClients } from '@/lib/api';
import { Client } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function SociosPage() {
  const queryClient = useQueryClient();
  const { data: partners = [] } = useQuery({ queryKey: ['partners'], queryFn: fetchPartners });
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: fetchSettings });
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: fetchClients });

  const activePartnerId = settings?.activePartnerId || null;
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerTemplate, setNewPartnerTemplate] = useState('generic');
  const [newPartnerDesc, setNewPartnerDesc] = useState('');

  const handleSetActive = useMutation({
    mutationFn: (partnerId: string) => updateSettings({ activePartnerId: partnerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const handleCreatePartner = useMutation({
    mutationFn: () => createPartner({ name: newPartnerName, templateType: newPartnerTemplate, description: newPartnerDesc || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      setCreateDialogOpen(false);
      setNewPartnerName('');
      setNewPartnerTemplate('generic');
      setNewPartnerDesc('');
    },
  });

  const getClientsForPartner = (partnerId: string): Client[] => {
    return clients.filter((c) => c.partnerId === partnerId);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">
            Gestiona los clientes padre y sus alumnos. Al seleccionar un socio activo, los nuevos clientes se asociaran automaticamente.
          </p>
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 gap-2">
            <Plus className="h-4 w-4" /> Nuevo Socio
          </Button>
        </div>

        <div className="grid gap-6">
          {partners.map((partner) => {
            const isActive = partner.id === activePartnerId;
            const clientCount = partner.clientCount || 0;
            const partnerClients = getClientsForPartner(partner.id);
            const isExpanded = expandedPartner === partner.id;

            return (
              <Card key={partner.id} className={`transition-all ${isActive ? 'ring-2 ring-cyan-500 border-cyan-300' : 'border-slate-200'}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-cyan-100' : 'bg-slate-100'}`}>
                        <Handshake className={`h-7 w-7 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{partner.name}</h3>
                          {isActive && <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 gap-1"><Star className="h-3 w-3" /> Activo</Badge>}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5 truncate">{partner.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Globe className="h-3 w-3" /> Template: <span className="font-mono font-medium">{partner.templateType}</span></span>
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Users className="h-3 w-3" /> {clientCount} alumno{clientCount !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link href={`/clientes/nuevo?partnerId=${partner.id}`}>
                        <Button variant="outline" size="sm" className="gap-1.5 border-cyan-200 text-cyan-600 hover:bg-cyan-50">
                          <Plus className="h-3.5 w-3.5" /> Nuevo Alumno
                        </Button>
                      </Link>
                      {clientCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setExpandedPartner(isExpanded ? null : partner.id)} className="gap-1">
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          {clientCount}
                        </Button>
                      )}
                      {!isActive && (
                        <Button onClick={() => handleSetActive.mutate(partner.id)} variant="outline" size="sm" className="border-cyan-300 text-cyan-600 hover:bg-cyan-50 gap-1.5">
                          <Check className="h-4 w-4" /> Activar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expanded: student list */}
                  {isExpanded && partnerClients.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Alumnos</p>
                      <div className="space-y-2">
                        {partnerClients.map((student) => (
                          <Link key={student.id} href={`/clientes/${student.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: student.brandPrimaryColor + '15' }}>
                                <Globe className="h-4 w-4" style={{ color: student.brandPrimaryColor }} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{student.businessName}</p>
                                <p className="text-xs text-slate-500 truncate">{student.location} · {student.status}</p>
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-cyan-500 transition-colors flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {partners.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Handshake className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No hay socios configurados</p>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Crear Primer Socio</Button>
            </CardContent>
          </Card>
        )}

        {/* Create Partner Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Socio</DialogTitle>
              <DialogDescription>Crea un nuevo cliente padre que derivara alumnos para el desarrollo de sus webs.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="partnerName">Nombre *</Label>
                <Input id="partnerName" placeholder="Ej: Academia de Formacion" value={newPartnerName} onChange={(e) => setNewPartnerName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerTemplate">Tipo de Template</Label>
                <Input id="partnerTemplate" placeholder="Ej: drpools, local-business" value={newPartnerTemplate} onChange={(e) => setNewPartnerTemplate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerDesc">Descripcion</Label>
                <Input id="partnerDesc" placeholder="Descripcion del socio..." value={newPartnerDesc} onChange={(e) => setNewPartnerDesc(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => handleCreatePartner.mutate()} disabled={!newPartnerName.trim()} className="bg-cyan-600 hover:bg-cyan-700">
                Crear Socio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

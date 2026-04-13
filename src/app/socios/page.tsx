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
  Pencil,
  Trash2,
  Github,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AppShell from '@/components/app-shell';
import { fetchPartners, fetchSettings, updateSettings, createPartner, updatePartner, deletePartnerAPI, fetchClients } from '@/lib/api';
import { Client, Partner } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function parseGitHubRepo(url: string) {
  const match = url.match(/github\.com\/([^/]+\/[^/]+?)(?:\/)?$/);
  return match ? match[1] : null;
}

export default function SociosPage() {
  const queryClient = useQueryClient();
  const { data: partners = [], isLoading } = useQuery({ queryKey: ['partners'], queryFn: fetchPartners });
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: fetchSettings });
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: fetchClients });

  const activePartnerId = settings?.activePartnerId || null;
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null);

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createRepo, setCreateRepo] = useState('');
  const [createTemplate, setCreateTemplate] = useState('generic');

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editPartner, setEditPartner] = useState<Partner | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editRepo, setEditRepo] = useState('');
  const [editTemplate, setEditTemplate] = useState('');

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePartner, setDeletePartner] = useState<Partner | null>(null);

  const openEditDialog = (partner: Partner) => {
    setEditPartner(partner);
    setEditName(partner.name);
    setEditDesc(partner.description || '');
    setEditRepo(partner.templateRepo || '');
    setEditTemplate(partner.templateType);
    setEditOpen(true);
  };

  const openDeleteDialog = (partner: Partner) => {
    setDeletePartner(partner);
    setDeleteOpen(true);
  };

  const handleSetActive = useMutation({
    mutationFn: (partnerId: string) => updateSettings({ activePartnerId: partnerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const handleCreate = useMutation({
    mutationFn: () => createPartner({ name: createName, templateType: createTemplate, templateRepo: createRepo, description: createDesc || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      setCreateOpen(false);
      setCreateName(''); setCreateDesc(''); setCreateRepo(''); setCreateTemplate('generic');
    },
  });

  const handleEdit = useMutation({
    mutationFn: () => {
      if (!editPartner) return Promise.reject();
      return updatePartner(editPartner.id, { name: editName, templateType: editTemplate, templateRepo: editRepo, description: editDesc });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setEditOpen(false);
    },
  });

  const handleDelete = useMutation({
    mutationFn: () => {
      if (!deletePartner) return Promise.reject();
      return deletePartnerAPI(deletePartner.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDeleteOpen(false);
      setDeletePartner(null);
      // If the deleted partner was active, clear the setting
      if (deletePartner?.id === activePartnerId) {
        updateSettings({ activePartnerId: '' }).catch(() => {});
        queryClient.invalidateQueries({ queryKey: ['settings'] });
      }
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
            Gestiona los clientes padre, sus repositorios de plantilla y alumnos asociados.
          </p>
          <Button onClick={() => setCreateOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 gap-2">
            <Plus className="h-4 w-4" /> Nuevo Socio
          </Button>
        </div>

        {isLoading ? (
          <Card><CardContent className="py-12 text-center text-slate-400">Cargando...</CardContent></Card>
        ) : (
          <div className="grid gap-6">
            {partners.map((partner) => {
              const isActive = partner.id === activePartnerId;
              const clientCount = partner.clientCount || 0;
              const partnerClients = getClientsForPartner(partner.id);
              const isExpanded = expandedPartner === partner.id;
              const repoSlug = parseGitHubRepo(partner.templateRepo);

              return (
                <Card key={partner.id} className={`transition-all ${isActive ? 'ring-2 ring-cyan-500 border-cyan-300' : 'border-slate-200'}`}>
                  <CardContent className="p-6">
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-cyan-100' : 'bg-slate-100'}`}>
                          <Handshake className={`h-7 w-7 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900">{partner.name}</h3>
                            {isActive && <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 gap-1"><Star className="h-3 w-3" /> Activo</Badge>}
                          </div>
                          {partner.description && <p className="text-sm text-slate-500 mt-0.5 truncate">{partner.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href={`/clientes/nuevo?partnerId=${partner.id}`}>
                          <Button variant="outline" size="sm" className="gap-1.5 border-cyan-200 text-cyan-600 hover:bg-cyan-50">
                            <Plus className="h-3.5 w-3.5" /> Nuevo Alumno
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(partner)} className="gap-1 text-slate-400 hover:text-slate-600">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        {clientCount > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => setExpandedPartner(isExpanded ? null : partner.id)} className="gap-1 text-slate-400">
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            <span className="text-xs font-medium">{clientCount}</span>
                          </Button>
                        )}
                        {!isActive && (
                          <Button onClick={() => handleSetActive.mutate(partner.id)} variant="outline" size="sm" className="border-cyan-300 text-cyan-600 hover:bg-cyan-50 gap-1.5">
                            <Check className="h-4 w-4" /> Activar
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Template repo */}
                    {partner.templateRepo ? (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg flex items-center gap-3">
                        <Github className="h-4 w-4 text-slate-600 flex-shrink-0" />
                        <a href={partner.templateRepo} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium truncate flex-1 min-w-0 hover:underline">
                          {repoSlug || partner.templateRepo}
                        </a>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      </div>
                    ) : (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                        <Github className="h-4 w-4 text-amber-600 flex-shrink-0" />
                        <span className="text-xs text-amber-700">Sin repositorio de plantilla configurado</span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Users className="h-3 w-3" /> {clientCount} alumno{clientCount !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-slate-400">Creado: {new Date(partner.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* Expanded: student list */}
                    {isExpanded && partnerClients.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Alumnos ({partnerClients.length})</p>
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
        )}

        {partners.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Handshake className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No hay socios configurados</p>
              <Button onClick={() => setCreateOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Crear Primer Socio</Button>
            </CardContent>
          </Card>
        )}

        {/* Create Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Socio</DialogTitle>
              <DialogDescription>Cliente padre que deriva alumnos para el desarrollo de sus webs.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="c-name">Nombre *</Label>
                <Input id="c-name" placeholder="Ej: Academia de Formacion" value={createName} onChange={(e) => setCreateName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-repo">Repositorio de Plantilla (GitHub)</Label>
                <Input id="c-repo" placeholder="https://github.com/usuario/repo-plantilla" value={createRepo} onChange={(e) => setCreateRepo(e.target.value)} />
                <p className="text-xs text-slate-400">Repo base del que partiran las webs de los alumnos</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-template">Tipo de Template</Label>
                <Input id="c-template" placeholder="Ej: nextjs, react, generic" value={createTemplate} onChange={(e) => setCreateTemplate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-desc">Descripcion</Label>
                <Textarea id="c-desc" placeholder="Descripcion del socio..." value={createDesc} onChange={(e) => setCreateDesc(e.target.value)} rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button onClick={() => handleCreate.mutate()} disabled={!createName.trim()} className="bg-cyan-600 hover:bg-cyan-700">
                Crear Socio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Socio</DialogTitle>
              <DialogDescription>Modifica los datos del socio {editPartner?.name}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="e-name">Nombre</Label>
                <Input id="e-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-repo">Repositorio de Plantilla (GitHub)</Label>
                <Input id="e-repo" placeholder="https://github.com/usuario/repo-plantilla" value={editRepo} onChange={(e) => setEditRepo(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-template">Tipo de Template</Label>
                <Input id="e-template" value={editTemplate} onChange={(e) => setEditTemplate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-desc">Descripcion</Label>
                <Textarea id="e-desc" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
              <Button onClick={() => handleEdit.mutate()} disabled={!editName.trim()} className="bg-cyan-600 hover:bg-cyan-700">
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Socio</DialogTitle>
              <DialogDescription>
                Estas seguro de que deseas eliminar <strong>{deletePartner?.name}</strong>?
                Esto eliminara tambien todos sus alumnos asociados ({deletePartner?.clientCount || 0}).
                Esta accion no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={() => handleDelete.mutate()} className="gap-2">
                <Trash2 className="h-4 w-4" /> Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

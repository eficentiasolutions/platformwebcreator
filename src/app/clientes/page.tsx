'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Globe,
  MoreHorizontal,
  Eye,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/status-badge';
import AppShell from '@/components/app-shell';
import { getClients, deleteClient, getActivePartner } from '@/lib/storage';
import { Client, ClientStatus, STATUS_LABELS } from '@/types';

const ALL_STATUSES: ClientStatus[] = [
  'new', 'configuring', 'seo_setup', 'branding', 'content', 'review', 'published', 'maintenance',
];

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>(() => {
    if (typeof window === 'undefined') return [];
    return getClients();
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [activePartnerName] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const p = getActivePartner();
    return p?.name ?? null;
  });

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.businessName.toLowerCase().includes(search.toLowerCase()) ||
      client.contactName.toLowerCase().includes(search.toLowerCase()) ||
      client.location.toLowerCase().includes(search.toLowerCase()) ||
      client.domain.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = () => {
    if (!clientToDelete) return;
    deleteClient(clientToDelete.id);
    setClients(getClients());
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            {activePartnerName && (
              <p className="text-sm text-slate-500">
                Mostrando clientes de <span className="font-medium text-slate-700">{activePartnerName}</span>
              </p>
            )}
          </div>
          <Link href="/clientes/nuevo">
            <Button className="bg-cyan-600 hover:bg-cyan-700 gap-2"><Plus className="h-4 w-4" /> Nuevo Cliente</Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Buscar por nombre, contacto, ubicacion o dominio..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant={statusFilter === 'all' ? 'default' : 'outline'} className="cursor-pointer hover:bg-slate-100" onClick={() => setStatusFilter('all')}>
                  Todos ({clients.length})
                </Badge>
                {ALL_STATUSES.map((status) => {
                  const count = clients.filter((c) => c.status === status).length;
                  if (count === 0) return null;
                  return (
                    <Badge key={status} variant={statusFilter === status ? 'default' : 'outline'} className="cursor-pointer hover:bg-slate-100" onClick={() => setStatusFilter(status)}>
                      {STATUS_LABELS[status]} ({count})
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Negocio</TableHead>
                    <TableHead className="font-semibold">Contacto</TableHead>
                    <TableHead className="font-semibold">Ubicacion</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Dominio</TableHead>
                    <TableHead className="font-semibold">Creado</TableHead>
                    <TableHead className="font-semibold w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                        {search || statusFilter !== 'all' ? 'No se encontraron clientes con los filtros aplicados.' : 'No hay clientes. Crea tu primer cliente para comenzar.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: client.brandPrimaryColor + '15' }}>
                              <Globe className="h-4 w-4" style={{ color: client.brandPrimaryColor }} />
                            </div>
                            <div>
                              <Link href={`/clientes/${client.id}`} className="font-medium text-slate-900 hover:text-cyan-600 transition-colors">{client.businessName}</Link>
                              <p className="text-xs text-slate-500">{client.businessType}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{client.contactName}</p>
                            <p className="text-xs text-slate-500">{client.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{client.location}</p>
                          <p className="text-xs text-slate-500">{client.province}</p>
                        </TableCell>
                        <TableCell><StatusBadge status={client.status} /></TableCell>
                        <TableCell>
                          {client.domain ? <span className="text-sm text-cyan-600 font-mono">{client.domain}</span> : <span className="text-sm text-slate-400">—</span>}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-500">{new Date(client.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/clientes/${client.id}`}><Eye className="mr-2 h-4 w-4" /> Ver detalle</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/clientes/${client.id}/seo`}><ExternalLink className="mr-2 h-4 w-4" /> Checklist SEO</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => { setClientToDelete(client); setDeleteDialogOpen(true); }}>
                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Cliente</DialogTitle>
            <DialogDescription>Estas seguro de que deseas eliminar <strong>{clientToDelete?.businessName}</strong>? Esta accion no se puede deshacer.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

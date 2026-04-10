'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Handshake,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getActivePartner } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/socios', label: 'Socios', icon: Handshake },
  { href: '/guia', label: 'Guia SEO', icon: BookOpen },
];

function SidebarContent({ activePartner, pathname }: { activePartner: string | null; pathname: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Eficentia</h1>
            <p className="text-slate-400 text-xs">Solutions</p>
          </div>
        </div>
      </div>
      <Separator className="bg-slate-700/50" />
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50')}>
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <Separator className="bg-slate-700/50" />
      <div className="px-4 py-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Socio Activo</p>
        {activePartner ? (
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-sm text-slate-300">{activePartner}</span></div>
        ) : (
          <span className="text-sm text-slate-500">No seleccionado</span>
        )}
      </div>
    </div>
  );
}

function CollapsedNav({ pathname }: { pathname: string }) {
  return (
    <nav className="flex-1 space-y-2 mt-4">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} className={cn('flex items-center justify-center w-10 h-10 rounded-lg transition-colors', isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50')} title={item.label}>
            <item.icon className="h-5 w-5" />
          </Link>
        );
      })}
    </nav>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [activePartnerName] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const partner = getActivePartner();
    return partner?.name ?? null;
  });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white shadow-md border-slate-200"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 bg-slate-900 border-slate-800">
            <SheetTitle className="sr-only">Menu de navegacion</SheetTitle>
            <SidebarContent activePartner={activePartnerName} pathname={pathname} />
          </SheetContent>
        </Sheet>
      </div>

      <aside className={cn('hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 z-40', collapsed ? 'w-[72px]' : 'w-[280px]')}>
        {collapsed ? (
          <div className="flex flex-col h-full items-center py-6">
            <div className="w-9 h-9 rounded-lg bg-cyan-500 flex items-center justify-center mb-6"><span className="text-white font-bold text-lg">E</span></div>
            <CollapsedNav pathname={pathname} />
            <Button variant="ghost" size="icon" onClick={() => setCollapsed(false)} className="text-slate-400 hover:text-white hover:bg-slate-800 mt-auto mb-4"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        ) : (
          <>
            <SidebarContent activePartner={activePartnerName} pathname={pathname} />
            <div className="px-4 pb-4">
              <Button variant="ghost" size="sm" onClick={() => setCollapsed(true)} className="text-slate-400 hover:text-white hover:bg-slate-800 w-full justify-start"><ChevronLeft className="h-4 w-4 mr-2" /> Colapsar</Button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

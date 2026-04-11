'use client';

import React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { PageHeader } from '@/components/page-header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <div className="lg:pl-[280px] min-h-screen flex flex-col transition-all duration-300">
        <PageHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

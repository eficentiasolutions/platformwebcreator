'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/clientes': 'Clientes',
  '/clientes/nuevo': 'Nuevo Cliente',
  '/socios': 'Socios',
  '/guia': 'Guia SEO',
};

export function PageHeader() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [{ label: 'Dashboard', href: '/' }];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = ROUTE_LABELS[currentPath] || decodeURIComponent(segment);
    if (segment.startsWith('[id]')) {
      // Dynamic route - we just show the segment name
      breadcrumbs.push({ label: 'Detalle', href: currentPath });
    } else {
      breadcrumbs.push({ label, href: currentPath });
    }
  }

  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-1">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-slate-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-slate-700 transition-colors"
                  >
                    {index === 0 && <Home className="h-3.5 w-3.5 inline mr-0.5" />}
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
          <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
        </div>
      </div>
    </header>
  );
}

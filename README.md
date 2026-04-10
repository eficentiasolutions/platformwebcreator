# Eficentia Platform — Web Creator

Plataforma de gestion centralizada para la creacion y despliegue de sitios web para clientes. Permite gestionar el onboarding completo de alumnos/clientes, desde la recepcion de datos hasta la configuracion SEO, branding y publicacion.

## Funcionalidades del MVP

- **Dashboard** — Vista general con KPIs, clientes recientes y acciones rapidas
- **Gestion de Clientes (CRM basico)** — Listado, busqueda, filtros por estado, detalle completo
- **Onboarding en 5 pasos** — Datos del alumno > Branding > Servicios > Configuracion SEO > Revision
- **Edicion de Clientes** — Modificacion de todos los campos, estados, branding, servicios y SEO
- **Checklist SEO (32 items)** — 6 categorias con tooltips y barra de progreso
- **Multi-Socio** — Cambiar entre socios/comerciales con templates diferentes
- **Guia SEO de Referencia** — Normas y mejores practicas SEO integradas en la plataforma
- **UI Responsiva** — Sidebar colapsable y adaptacion movil completa

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui** (Radix UI)
- **Lucide Icons**
- **LocalStorage** (MVP — migracion a base de datos en siguiente fase)

## Estructura del Proyecto

```
src/
  app/
    page.tsx              # Dashboard principal
    layout.tsx            # Layout raiz
    clientes/
      page.tsx            # Listado de clientes
      nuevo/page.tsx      # Onboarding (5 pasos)
      [id]/
        page.tsx          # Detalle del cliente
        editar/page.tsx   # Edicion completa
        seo/page.tsx      # Checklist SEO
    socios/page.tsx       # Gestion de socios
    guia/page.tsx         # Guia SEO de referencia
  components/
    app-shell.tsx         # Layout con sidebar + header
    app-sidebar.tsx       # Navegacion lateral
    page-header.tsx       # Breadcrumb + titulo
    status-badge.tsx      # Badge de estado de cliente
    ui/                   # Componentes shadcn/ui
  hooks/                  # Custom hooks
  lib/
    storage.ts            # Capa de datos (localStorage)
    utils.ts              # Utilidades generales
  types/
    index.ts              # Tipos TypeScript y constantes
```

## Instalacion y Uso Local

```bash
# Clonar el repositorio
git clone https://github.com/eficentiasolutions/platformwebcreator.git
cd platformwebcreator

# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run dev
```

La aplicacion estara disponible en `http://localhost:3000`

## Despliegue en Vercel

1. Conectar el repositorio a [Vercel](https://vercel.com)
2. Framework Preset: **Next.js**
3. Build Command: `bun run build`
4. Install Command: `bun install`
5. La aplicacion se desplegara automaticamente

## Roadmap

- [ ] Autenticacion con NextAuth
- [ ] Base de datos (Prisma + SQLite/PostgreSQL)
- [ ] Generacion automatica de sitios desde template
- [ ] Despliegue automatico a Vercel por cliente
- [ ] Gestion de dominios personalizados
- [ ] Panel de preview del sitio generado
- [ ] Exportacion de datos (CSV/Excel)

## Licencia

Privado — Eficentia Solutions

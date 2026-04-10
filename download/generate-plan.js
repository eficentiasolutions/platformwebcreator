const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  SectionType, TableOfContents, LevelFormat, TableLayoutType,
} = require("docx");
const fs = require("fs");

// ─── Palette: GO-1 Graphite Orange (proposal/plan) ───
const P = {
  bg: "1A2330", primary: "FFFFFF", accent: "D4875A",
  cover: { titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078" },
  table: { headerBg: "D4875A", headerText: "FFFFFF", accentLine: "D4875A", innerLine: "DDD0C8", surface: "F8F0EB" },
};
const c = (hex) => hex.replace("#", "");
const bodyColor = "1A1A1A";
const secondaryColor = "555555";

// ─── Borders ───
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ─── Helper functions ───
function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 160, line: 312 },
    children: [new TextRun({ text, bold: true, color: c("1A2330"), font: { ascii: "Calibri", eastAsia: "SimHei" }, size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 28 : 24 })],
  });
}

function body(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 312 },
    children: [new TextRun({ text, size: 24, color: bodyColor, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

function bodyBold(label, text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 312 },
    children: [
      new TextRun({ text: label, bold: true, size: 24, color: bodyColor, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
      new TextRun({ text, size: 24, color: bodyColor, font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } }),
    ],
  });
}

function emptyPara() {
  return new Paragraph({ spacing: { after: 60 }, children: [] });
}

function makeTable(headers, rows) {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map(h => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 21, color: P.table.headerText })] })],
      shading: { type: ShadingType.CLEAR, fill: P.table.headerBg },
      borders: noBorders,
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
    })),
  });
  const dataRows = rows.map((row, i) => new TableRow({
    cantSplit: true,
    children: row.map(cell => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: cell, size: 21, color: bodyColor })] })],
      shading: i % 2 === 0 ? { type: ShadingType.CLEAR, fill: P.table.surface } : { type: ShadingType.CLEAR, fill: "FFFFFF" },
      borders: noBorders,
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
    })),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: P.table.accentLine },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: P.table.innerLine },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [headerRow, ...dataRows],
  });
}

// ─── calcTitleLayout & splitTitleLines ───
function calcTitleLayout(title, maxWidthTwips, preferredPt = 40, minPt = 24) {
  const charWidth = (pt) => pt * 20;
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt;
  let lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = splitTitleLines(title, cpl);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    const cpl = charsPerLine(minPt);
    lines = splitTitleLines(title, cpl);
    titlePt = minPt;
  }
  return { titlePt, titleLines: lines };
}

function splitTitleLines(title, charsPerLine) {
  if (title.length <= charsPerLine) return [title];
  const breakAfter = new Set([...' ,;.:!?', ...'-_/\t ']);
  const lines = [];
  let remaining = title;
  while (remaining.length > charsPerLine) {
    let breakAt = -1;
    for (let i = charsPerLine; i >= Math.floor(charsPerLine * 0.6); i--) {
      if (i < remaining.length && breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
    }
    if (breakAt === -1) {
      const limit = Math.min(remaining.length, Math.ceil(charsPerLine * 1.3));
      for (let i = charsPerLine + 1; i < limit; i++) {
        if (breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
      }
    }
    if (breakAt === -1) breakAt = charsPerLine;
    lines.push(remaining.slice(0, breakAt).trim());
    remaining = remaining.slice(breakAt).trim();
  }
  if (remaining) lines.push(remaining);
  if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
    const last = lines.pop();
    lines[lines.length - 1] += last;
  }
  return lines;
}

// ─── Cover R4 ───
function buildCoverR4(config) {
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 38, 24);
  const titleSize = titlePt * 2;
  const titleBlockHeight = titleLines.length * (titlePt * 23 + 200);
  const englishLabelH = config.englishLabel ? (9 * 23 + 500) : 0;
  const subtitleH = config.subtitle ? (12 * 23 + 200) : 0;
  const upperContentH = englishLabelH + titleBlockHeight + subtitleH;
  const UPPER_MIN = 7500;
  const UPPER_H = Math.max(UPPER_MIN, upperContentH + 1500 + 800);
  const DIVIDER_H = 60;
  const contentEstimate =
    (config.englishLabel ? (9 * 23 + 500) : 0) +
    titleLines.length * (titlePt * 23 + 200) +
    (config.subtitle ? (12 * 23 + 200) : 0);
  const spacerIntrinsic = 280;
  const topSpacing = Math.max(UPPER_H - contentEstimate - spacerIntrinsic - 800, 400);

  const upperBlock = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: UPPER_H, rule: "exact" },
      children: [new TableCell({
        shading: { fill: P.bg }, borders: noBorders,
        verticalAlign: "top",
        margins: { left: padL, right: padR },
        children: [
          new Paragraph({ spacing: { before: topSpacing } }),
          config.englishLabel ? new Paragraph({
            spacing: { after: 500 },
            children: [new TextRun({ text: config.englishLabel.split("").join(" "),
              size: 18, color: P.accent, font: { ascii: "Calibri" }, characterSpacing: 60 })],
          }) : null,
          ...titleLines.map((line, i) => new Paragraph({
            spacing: { after: i < titleLines.length - 1 ? 100 : 200 },
            children: [new TextRun({ text: line, size: titleSize, bold: true,
              color: P.cover.titleColor, font: { ascii: "Calibri" } })],
          })),
          config.subtitle ? new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: config.subtitle, size: 24, color: P.cover.subtitleColor,
              font: { ascii: "Calibri" } })],
          }) : null,
        ].filter(Boolean),
      })],
    })],
  });

  const divider = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: DIVIDER_H, rule: "exact" },
      children: [new TableCell({ borders: noBorders,
        shading: { fill: P.accent }, children: [emptyPara()] })],
    })],
  });

  const lowerContent = [
    new Paragraph({ spacing: { before: 800 } }),
    ...(config.metaLines || []).map(line => new Paragraph({
      indent: { left: padL }, spacing: { after: 100 },
      children: [new TextRun({ text: line, size: 28, color: P.cover.metaColor,
        font: { ascii: "Calibri" } })],
    })),
    new Paragraph({ spacing: { before: 2000 } }),
    new Paragraph({
      indent: { left: padL },
      children: [
        new TextRun({ text: config.footerLeft || "", size: 22, color: "909090" }),
        new TextRun({ text: "          " }),
        new TextRun({ text: config.footerRight || "", size: 22, color: "909090" }),
      ],
    }),
  ];

  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { fill: "FFFFFF" }, borders: noBorders,
        verticalAlign: "top",
        children: [upperBlock, divider, ...lowerContent],
      })],
    })],
  })];
}

// ─── Numbered list config ───
const numberingConfig = [
  { reference: "list-phases", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  { reference: "list-risks", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
  { reference: "list-benefits", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
];

function numberedItem(ref, text) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80, line: 312 },
    children: [new TextRun({ text, size: 24, color: bodyColor, font: { ascii: "Calibri" } })],
  });
}

// ─── DOCUMENT CONTENT ───

const coverConfig = {
  title: "Plan de Infraestructura: Plataforma de Gestion y Despliegue de Sitios Web para Clientes",
  englishLabel: "PROPOSAL & IMPLEMENTATION PLAN",
  subtitle: "Sistema integral de gestion de clientes, personalizacion de plantillas y despliegue automatizado en Vercel",
  metaLines: [
    "Preparado para: Eficentia Solutions",
    "Fecha: Abril 2026",
    "Version: 1.0",
    "Clasificacion: Confidencial",
  ],
  footerLeft: "Eficentia Solutions",
  footerRight: "Plataforma WebPool",
};

// Cover section
const coverSection = {
  properties: {
    page: { size: { width: 11906, height: 16838 }, margin: { top: 0, bottom: 0, left: 0, right: 0 } },
  },
  children: buildCoverR4(coverConfig),
};

// TOC section
const tocSection = {
  properties: {
    type: SectionType.NEXT_PAGE,
    page: {
      size: { width: 11906, height: 16838 },
      margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
      pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN },
    },
  },
  footers: {
    default: new Footer({
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "PAGE \\* ROMAN \\* MERGEFORMAT", size: 18, color: "808080", font: { ascii: "Calibri" } })],
      })],
    }),
  },
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 480, after: 360 },
      children: [new TextRun({ text: "Indice", bold: true, size: 32, color: c("1A2330"), font: { ascii: "Calibri" } })],
    }),
    new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
    new Paragraph({ children: [new PageBreak()] }),
  ],
};

// Body section
const bodyContent = [
  // ─── 1. RESUMEN EJECUTIVO ───
  heading("1. Resumen Ejecutivo"),
  body("El presente documento describe el plan de accion completo para la construccion de una plataforma integral que permita gestionar de manera eficiente la creacion, personalizacion y despliegue de sitios web para los clientes derivados por el socio comercial. La plataforma parte de una plantilla base existente, desarrollada en Next.js 14 con exportacion estatica, que actualmente se utiliza para el sitio web de mantenimiento de piscinas Agua Mas Segura. El objetivo es transformar esta plantilla monolitica en un sistema modular y configurable que permita generar sitios web personalizados para multiples clientes con un esfuerzo minimo de personalizacion."),
  body("La solucion propuesta comprende cuatro componentes fundamentales: primero, una refactorizacion completa de la plantilla base para externalizar toda la informacion de marca, textos, colores y activos en archivos de configuracion independientes; segundo, un motor de generacion que automatice el proceso de crear un sitio personalizado a partir de la plantilla y los datos del cliente; tercero, un panel de administracion visual (dashboard) que centralice la gestion de clientes (CRM basico), la configuracion de sitios y la vista previa en tiempo real; y cuarto, la integracion con Vercel para el despliegue automatizado con dominios personalizados por cliente."),
  body("La implementacion se estructura en cuatro fases progresivas de aproximadamente dos semanas cada una, lo que permite poner el sistema en produccion de forma incremental. La primera fase se centra en la modularizacion de la plantilla, la segunda en el motor de generacion, la tercera en el panel de administracion y la cuarta en la puesta en produccion con despliegue automatizado. Se estima una inversion total de entre 200 y 400 horas de desarrollo, dependiendo del alcance final de funcionalidades del CRM y el nivel de automatizacion deseado."),

  // ─── 2. SITUACION ACTUAL Y ANALISIS DEL PROBLEMA ───
  heading("2. Situacion Actual y Analisis del Problema"),

  heading("2.1 Analisis de la Plantilla Base", HeadingLevel.HEADING_2),
  body("Se ha realizado un analisis exhaustivo del repositorio GitHub eficientiasolutions/webpooltest, que constituye la plantilla base del proyecto. El repositorio contiene un sitio web de tipo landing page monolitica, desarrollado en Next.js 14 con TypeScript y el router de App. El proyecto utiliza exportacion estatica (output: 'export'), lo que permite su despliegue en cualquier plataforma de hosting estatico, incluida Vercel. La estructura actual es extremadamente simple: todo el contenido de la pagina reside en un unico archivo de componente (page.tsx) con aproximadamente 225 lineas de codigo TypeScript, complementado por un archivo CSS global (globals.css) con 461 lineas."),
  body("El sitio esta compuesto por siete secciones principales: un header con navegacion fija, una seccion hero con llamadas a la accion, una cuadricula de seis servicios, una seccion de zonas de cobertura con diez ubicaciones, una seccion de acerca de nosotros, un banner de llamada a la accion y un formulario de contacto con validacion en el lado del cliente. Adicionalmente, existe una version duplicada del sitio completo en public/index.html como alternativa estatica independiente, lo que introduce una duplicacion innecesaria de contenido."),

  heading("2.2 Problemas Identificados", HeadingLevel.HEADING_2),
  body("El analisis revela varios problemas criticos que impiden la reutilizacion eficiente de la plantilla para multiples clientes. En primer lugar, toda la informacion de marca (nombre del negocio, textos, colores, datos de contacto, servicios, zonas de cobertura) esta codificada de forma rigida (hardcoded) directamente en el codigo fuente, sin ningun sistema de configuracion o archivos externos que permitan su modificacion sin tocar el codigo. Esto significa que para cada nuevo cliente, un desarrollador debe localizar y modificar manualmente mas de 50 cadenas de texto distribuidas en dos archivos."),
  body("En segundo lugar, la estructura de componentes es completamente monolitica: no existe ninguna separacion en componentes reutilizables, ya que toda la pagina esta contenida en un solo archivo. Esto dificulta enormemente la modificacion selectiva de secciones, la adicion de nuevas secciones o la creacion de variantes de la plantilla. En tercer lugar, se han detectado inconsistencias de marca en los archivos de configuracion (el manifiesto PWA referencia DR Pools mientras que el contenido visible dice Agua Mas Segura), asi como aproximadamente 15 archivos de imagen que no estan siendo utilizados en el sitio final. Finalmente, no existe ningun backend ni sistema de gestion; el formulario de contacto solo gestiona estados locales sin enviar datos a ningun servidor."),

  heading("2.3 Necesidades del Negocio", HeadingLevel.HEADING_2),
  body("El modelo de negocio requiere un flujo de trabajo que permita recibir alumnos derivados por el cliente socio, generarles un sitio web profesional personalizado a partir de la plantilla base con modificaciones minimas, y ponerlo en produccion bajo un dominio personalizado de forma rapida y eficiente. La plataforma debe servir como herramienta interna de gestion que centralice toda la operacion, desde la captacion de datos del cliente hasta el despliegue final del sitio, eliminando la necesidad de intervencion manual directa sobre el codigo fuente para cada nuevo proyecto."),

  // ─── 3. OBJETIVOS Y RESULTADOS ESPERADOS ───
  heading("3. Objetivos y Resultados Esperados"),

  heading("3.1 Objetivo General", HeadingLevel.HEADING_2),
  body("Disenar, desarrollar y poner en produccion una plataforma integral de gestion web que permita, a partir de una plantilla Next.js preexistente, generar sitios web personalizados para cada cliente derivado, incluyendo un panel de administracion visual con funcionalidades de CRM basico, motor de personalizacion de plantillas, vista previa en tiempo real y despliegue automatizado en Vercel con dominios personalizados."),

  heading("3.2 Objetivos Especificos", HeadingLevel.HEADING_2),
  body("Refactorizar la plantilla existente para convertir su estructura monolitica en un sistema de componentes modulares donde toda la informacion de marca, textos, colores, servicios, zonas y datos de contacto se alimente desde archivos de configuracion externos (JSON o TypeScript), sin necesidad de modificar el codigo fuente del componente para cada nuevo cliente."),
  body("Desarrollar un panel de administracion web (dashboard) que permita gestionar de forma visual e intuitiva los datos de cada cliente (nombre, negocio, logo, colores, textos, dominio), generar una vista previa en tiempo real del sitio resultante y disparar el proceso de despliegue automatico con un solo clic, reduciendo el tiempo total de configuracion y publicacion de un nuevo sitio web de varias horas a menos de treinta minutos."),
  body("Implementar un CRM basico integrado que permita llevar un registro completo de los clientes derivados, su estado en el pipeline (nuevo, en configuracion, publicado, en mantenimiento), historial de cambios realizados en su sitio web, datos de facturacion y renovacion de dominios, y metricas basicas de seguimiento."),
  body("Automatizar completamente el proceso de despliegue mediante la integracion con la API de Vercel y GitHub, de manera que al confirmar la configuracion de un nuevo cliente, el sistema genere automaticamente un nuevo repositorio con el sitio personalizado, lo despliegue en Vercel y configure el dominio personalizado asignado, incluyendo certificado SSL."),

  // ─── 4. DISENO DE LA SOLUCION ───
  heading("4. Diseno de la Solucion"),

  heading("4.1 Arquitectura General del Sistema", HeadingLevel.HEADING_2),
  body("La plataforma se estructura siguiendo una arquitectura de tres capas claramente diferenciadas. La capa de presentacion corresponde al panel de administracion, desarrollado en Next.js con App Router y Tailwind CSS, que servira como interfaz unificada para todas las operaciones. La capa de logica de negocio comprende el motor de generacion de sitios y la API REST que gestiona las operaciones CRUD sobre clientes, configuraciones y despliegues. Finalmente, la capa de datos utiliza una base de datos PostgreSQL alojada en un servicio gestionado (como Supabase o Neon) para persistir la informacion de clientes, configuraciones de sitios y el historial de operaciones."),
  body("La comunicacion entre componentes se realiza mediante una API REST interna que expone endpoints para la gestion de clientes (alta, baja, modificacion, consulta), la configuracion de sitios (lectura y escritura de parametros de marca), la generacion de previews (compilacion en tiempo real con los datos del cliente) y el despliegue (integracion con las APIs de Vercel y GitHub). Cada proyecto de cliente se mantiene como un repositorio independiente en GitHub, lo que garantiza trazabilidad, control de versiones y la posibilidad de actualizaciones futuras de la plantilla base."),

  heading("4.2 Estructura del Proyecto", HeadingLevel.HEADING_2),

  makeTable(
    ["Componente", "Tecnologia", "Funcion"],
    [
      ["Panel Admin", "Next.js 15 + Tailwind CSS + shadcn/ui", "Dashboard de gestion visual"],
      ["API Backend", "Next.js API Routes + Prisma ORM", "Logica de negocio y endpoints REST"],
      ["Base de Datos", "PostgreSQL (Supabase/Neon)", "Persistencia de datos de clientes"],
      ["Motor de Generacion", "Node.js scripts + Git + GitHub API", "Generacion y despliegue de sitios"],
      ["Template Base", "Next.js 14 (static export)", "Plantilla web personalizable"],
      ["Hosting Clientes", "Vercel (API)", "Despliegue automatizado de sitios"],
      ["Almacenamiento", "GitHub + Cloud Storage (S3/R2)", "Repositorios y assets de cliente"],
      ["Dominios", "Vercel DNS / Cloudflare", "Dominios personalizados por cliente"],
    ]
  ),
  emptyPara(),

  heading("4.3 Sistema de Configuracion de la Plantilla", HeadingLevel.HEADING_2),
  body("El nucleo de la plataforma es el sistema de configuracion que permite parametrizar completamente cada sitio web sin tocar el codigo fuente. El sistema se basa en tres archivos de configuracion que alimentan toda la plantilla: un archivo de configuracion del sitio (site.config.ts) que contiene el nombre de la marca, tagline, datos de contacto, redes sociales, estadisticas destacadas y zonas de cobertura; un archivo de servicios (services.config.ts) que define el catalogo de servicios ofrecidos por el cliente con sus respectivos titulos, descripciones e iconos; y un archivo de tema (theme.config.ts) que establece la paleta de colores primaria y secundaria, la tipografia y las variables CSS del gradiente del hero."),
  body("El proceso de generacion lee estos tres archivos de configuracion, inyecta los valores en los componentes React de la plantilla mediante un sistema de props y context, compila el sitio con Next.js y genera los archivos estaticos finales que se despliegan en Vercel. Este enfoque garantiza que la plantilla base se mantenga como unica fuente de verdad, mientras que las variaciones por cliente se gestionan exclusivamente a traves de datos de configuracion almacenados en la base de datos de la plataforma."),

  heading("4.4 Panel de Administracion", HeadingLevel.HEADING_2),
  body("El panel de administracion se compone de cuatro modulos principales integrados en una interfaz unificada con navegador lateral y dashboard central. El modulo de Clientes (CRM) proporciona una vista de lista y detalle de todos los clientes derivados, con campos para nombre del negocio, nombre del contacto, email, telefono, estado del proyecto (nuevo, en configuracion, publicado, en mantenimiento), fecha de alta, historial de cambios y notas internas. Incluye busqueda, filtrado por estado y paginacion."),
  body("El modulo de Configuracion del Sitio ofrece un editor visual por pasos que guia al usuario a traves de la personalizacion: paso 1 (marca y contenido) para nombre del negocio, tagline, textos de secciones, servicios y zonas; paso 2 (apariencia) para colores primarios y secundarios, tipografia, imagen hero y logo; paso 3 (contacto) para telefono, email, direccion, horario y redes sociales; y paso 4 (dominio) para seleccion y configuracion del dominio personalizado. El modulo de Vista Previa genera una preview en tiempo real del sitio con los datos configurados, permitiendo navegar por todas las secciones antes de publicar. Finalmente, el modulo de Despliegue permite ejecutar el proceso de publicacion con un solo clic, mostrando el progreso y el resultado final con la URL del sitio publicado."),

  // ─── 5. HOJA DE RUTA Y MILESTONES ───
  heading("5. Hoja de Ruta de Implementacion"),

  heading("5.1 Fase 1: Modularizacion de la Plantilla (Semana 1-2)", HeadingLevel.HEADING_2),
  body("Esta fase constituye el cimiento de todo el proyecto y se centra en transformar la plantilla monolitica existente en un sistema modular y parametrizable. El trabajo comienza con la extraccion del componente page.tsx en componentes individuales reutilizables (Header, Hero, ServicesGrid, ZonesGrid, About, CTA, ContactForm, Footer), cada uno recibiendo sus datos a traves de props configurables. Simultaneamente, se crean los tres archivos de configuracion (site, services, theme) y se refactoriza la logica de estilos para que los colores y la tipografia se generen dinamicamente a partir de las variables CSS definidas en theme.config."),
  body("Adicionalmente, se realizara una limpieza completa de activos: eliminacion de las 15 imagenes huerfanas no utilizadas, correccion de las inconsistencias de marca en el manifiesto PWA, unificacion de la version duplicada en public/index.html y actualizacion de las dependencias del proyecto. El entregable de esta fase es una plantilla refactorizada que genera el mismo sitio visual que el original pero alimentada exclusivamente por archivos de configuracion, sin ningun dato de marca codificado en el codigo."),

  heading("5.2 Fase 2: Motor de Generacion y API (Semana 3-4)", HeadingLevel.HEADING_2),
  body("La segunda fase desarrolla el motor de generacion y la API REST que alimentara el panel de administracion. El motor de generacion es un conjunto de scripts Node.js que, dados los datos de configuracion de un cliente, clona la plantilla refactorizada, inyecta los archivos de configuracion personalizados, ejecuta el build de Next.js para generar los archivos estaticos y prepara el resultado para su despliegue. La integracion con GitHub API permite crear automaticamente un nuevo repositorio por cada cliente con el sitio generado, estableciendo la trazabilidad y control de versiones necesarios."),
  body("La API REST se construye con Next.js API Routes y Prisma ORM, conectada a una base de datos PostgreSQL. Los endpoints principales incluyen: gestion de clientes (CRUD completo), gestion de configuraciones de sitio (lectura y escritura), generacion de preview (compilacion parcial con datos del cliente) y disparo de despliegue (llamada al motor de generacion). Se implementa autenticacion basica mediante JWT para proteger el acceso al panel de administracion. El entregable es una API funcional que permite crear clientes, configurar sitios y generar previews de forma programatica."),

  heading("5.3 Fase 3: Panel de Administracion y CRM (Semana 5-8)", HeadingLevel.HEADING_2),
  body("La tercera fase es la mas extensa y se centra en el desarrollo del panel de administracion visual utilizando Next.js 15 con Tailwind CSS y la biblioteca de componentes shadcn/ui para garantizar una interfaz moderna, responsiva y accesible. El panel incluye un dashboard principal con metricas clave (total de clientes, sitios publicados, en proceso, etc.), el modulo de CRM con listado, detalle, busqueda y filtrado de clientes, y el editor visual de configuracion del sitio con el flujo de cuatro pasos descrito anteriormente."),
  body("La vista previa en tiempo real se implementa mediante un sistema de iframes que carga una instancia compilada de la plantilla con los datos del cliente, actualizandose automaticamente cada vez que se modifica un campo del editor. El modulo de despliegue muestra un asistente paso a paso que guía al usuario por el proceso de publicacion: validacion de datos, generacion del sitio, creacion del repositorio en GitHub, despliegue en Vercel y configuracion del dominio. Cada paso muestra su estado (pendiente, en progreso, completado, error) y mensajes descriptivos del progreso. El entregable es un panel de administracion completamente funcional conectado a la API."),

  heading("5.4 Fase 4: Produccion y Automatizacion (Semana 9-10)", HeadingLevel.HEADING_2),
  body("La fase final prepara el sistema para su uso en produccion real. Esto incluye la configuracion completa de Vercel para el panel de administracion (con dominio propio, SSL y CDN), la integracion final con Vercel API para despliegue automatizado de sitios de clientes (creacion de proyectos, alias de dominio, configuracion DNS), la configuracion de la base de datos PostgreSQL en produccion (Supabase o Neon), la implementacion de un sistema de backup automatico y la configuracion de monitoreo basico con alertas."),
  body("Se realizara un ciclo completo de pruebas end-to-end que simule el flujo real: creacion de un cliente de prueba, configuracion de su sitio, generacion de preview, despliegue automatizado y verificacion del dominio. Tambien se documentara toda la operativa en una guia de usuario que cubra los procedimientos rutinarios: dar de alta un nuevo cliente, personalizar su sitio, publicarlo, gestionar renovaciones de dominio y realizar actualizaciones de la plantilla base. El entregable es la plataforma en produccion, documentada y probada, lista para recibir clientes reales."),

  // ─── Tabla de milestones ───
  emptyPara(),
  makeTable(
    ["Fase", "Duracion", "Entregable Principal", "Prioridad"],
    [
      ["Fase 1: Modularizacion", "2 semanas", "Plantilla refactorizada y parametrizable", "Critica"],
      ["Fase 2: Motor + API", "2 semanas", "API REST + motor de generacion funcional", "Critica"],
      ["Fase 3: Panel Admin", "4 semanas", "Dashboard + CRM + editor visual + preview", "Alta"],
      ["Fase 4: Produccion", "2 semanas", "Plataforma en produccion con despliegue automatico", "Alta"],
    ]
  ),
  emptyPara(),

  // ─── 6. RECURSOS Y PRESUPUESTO ───
  heading("6. Recursos y Presupuesto Estimado"),

  heading("6.1 Recursos Necesarios", HeadingLevel.HEADING_2),
  body("Para la ejecucion del proyecto se requiere un desarrollador full-stack con experiencia en Next.js, React, TypeScript, Tailwind CSS, PostgreSQL y APIs de terceros (GitHub, Vercel). Se recomienda un perfil senior o mid-senior capaz de tomar decisiones arquitectonicas y trabajar de forma autonoma durante las fases de desarrollo. El proyecto no requiere personal adicional dedicado, aunque se recomienda la colaboracion de un disennador UI/UX para la fase del panel de administracion si se desea una interfaz especialmente pulida."),

  heading("6.2 Infraestructura y Costes Recurrentes", HeadingLevel.HEADING_2),
  makeTable(
    ["Servicio", "Plan Recomendado", "Coste Mensual Estimado", "Uso"],
    [
      ["Vercel (Panel Admin)", "Pro ($20/mes)", "$20/mes", "Hosting del dashboard"],
      ["Vercel (Sites Clientes)", "Hobby / Pro", "$0-$20/mes", "Despliegue de sitios de clientes"],
      ["Supabase / Neon", "Free / Pro", "$0-$25/mes", "Base de datos PostgreSQL"],
      ["GitHub (repos clientes)", "Team ($4/user/mes)", "$4/mes", "Repositorios por cliente"],
      ["Cloudflare (DNS)", "Free", "$0/mes", "Gestion de dominios"],
      ["Dominios clientes", "Variable", "Incluido en tarifa al cliente", "Dominio personalizado por cliente"],
      ["Cloud Storage (R2/S3)", "Free tier", "$0/mes", "Logos y assets de clientes"],
    ]
  ),
  emptyPara(),
  body("El coste mensual recurrente de la infraestructura se estima entre 24 y 69 dolares, dependiendo de los planes seleccionados. Este coste es asumible como gasto operativo del negocio y se puede recuperar facilmente con las tarifas cobradas a los clientes por la creacion y mantenimiento de sus sitios web."),

  heading("6.3 Inversion de Desarrollo", HeadingLevel.HEADING_2),
  makeTable(
    ["Concepto", "Horas Estimadas", "Rango Economico"],
    [
      ["Fase 1: Modularizacion de plantilla", "40-60 horas", "$800-$1.800"],
      ["Fase 2: Motor de generacion y API", "60-80 horas", "$1.200-$2.400"],
      ["Fase 3: Panel de administracion y CRM", "100-140 horas", "$2.000-$4.200"],
      ["Fase 4: Produccion y automatizacion", "30-40 horas", "$600-$1.200"],
      ["Testing, documentacion y buffer", "20-30 horas", "$400-$900"],
      ["Total estimado", "250-350 horas", "$5.000-$10.500"],
    ]
  ),
  emptyPara(),

  // ─── 7. ANALISIS DE RIESGOS ───
  heading("7. Analisis de Riesgos y Mitigacion"),
  makeTable(
    ["Riesgo", "Probabilidad", "Impacto", "Estrategia de Mitigacion"],
    [
      ["Cambios en la API de Vercel", "Media", "Alto", "Disenar capa de abstraccion para intercambiar proveedor de hosting si es necesario"],
      ["Plantilla base requiere cambios significativos", "Alta", "Medio", "Fase 1 dedicada exclusivamente a refactorizacion; validar resultado antes de continuar"],
      ["Clientes requieren funcionalidades no previstas", "Media", "Medio", "Arquitectura modular que permita agregar nuevas secciones o funcionalidades por cliente"],
      ["Problemas de rendimiento en previews", "Media", "Bajo", "Implementar sistema de cache; compilar solo secciones modificadas"],
      ["Perdida de datos de clientes", "Baja", "Critico", "Backups automaticos diarios en Supabase; exportacion periodica a JSON"],
      ["Dependencia de un solo desarrollador", "Alta", "Alto", "Documentacion exhaustiva; codigo limpio y bien estructurado; uso de estandares"],
    ]
  ),
  emptyPara(),

  // ─── 8. BENEFICIOS ESPERADOS ───
  heading("8. Beneficios Esperados y Evaluacion"),

  heading("8.1 Beneficios Operativos", HeadingLevel.HEADING_2),
  body("La plataforma transformara radicalmente la eficiencia operativa del negocio. Actualmente, la creacion de un sitio web para un nuevo cliente implica clonar el repositorio, modificar manualmente mas de 50 cadenas de texto en el codigo fuente, ajustar colores en CSS, reemplazar imagenes, actualizar metadatos SEO, crear el repositorio del cliente, desplegar en Vercel y configurar el dominio, un proceso que puede requerir entre dos y cuatro horas de trabajo directo por sitio. Con la plataforma implementada, este proceso se reduce a: dar de alta al cliente en el CRM (5 minutos), rellenar el formulario de configuracion (15 minutos), revisar la preview (5 minutos) y hacer clic en publicar (1 minuto), totalizando aproximadamente 25-30 minutos por cliente."),
  body("Esto representa una reduccion del tiempo por sitio de entre el 70% y el 85%, lo que permite al negocio escalar significativamente su capacidad de absorcion de clientes derivados sin necesidad de aumentar proporcionalmente los recursos dedicados. Adicionalmente, la estandarizacion del proceso reduce la posibilidad de errores humanos, garantiza la consistencia visual entre sitios y facilita la actualizacion de la plantilla base para todos los clientes simultaneamente."),

  heading("8.2 Beneficios de Negocio", HeadingLevel.HEADING_2),
  body("Desde la perspectiva comercial, la plataforma permite ofrecer un servicio mas profesional y rapido al cliente socio, lo que fortalece la relacion comercial y abre la puerta a acuerdos de mayor volumen. El CRM integrado proporciona visibilidad completa sobre el pipeline de clientes, facilitando la planificacion, la facturacion y la identificacion de oportunidades de upselling (por ejemplo, mantenimiento mensual, actualizaciones de contenido, adicion de nuevas funcionalidades). La capacidad de demostrar resultados rapidos con previews en tiempo real mejora la experiencia de venta y reduce el tiempo de cierre con cada nuevo cliente derivado."),

  heading("8.3 KPIs de Evaluacion", HeadingLevel.HEADING_2),
  makeTable(
    ["Indicador", "Metrica Actual", "Objetivo Post-Implementacion"],
    [
      ["Tiempo por nuevo sitio web", "2-4 horas", "25-30 minutos"],
      ["Tasa de errores por sitio", "Variable (manual)", "Cercana a 0% (automatizado)"],
      ["Capacidad mensual de sitios", "5-10 (limitado por tiempo)", "30-50+ (limitado por demanda)"],
      ["Tiempo de publicacion (cliente a live)", "1-2 dias", "Menos de 1 hora"],
      ["Gestion de clientes", "Archivos sueltos / Excel", "CRM centralizado con historial"],
      ["Coste operativo por sitio", "Alto (horas de dev)", "Bajo (minutos de config)"],
    ]
  ),
  emptyPara(),

  // ─── 9. PROXIMOS PASOS ───
  heading("9. Proximos Pasos Recomendados"),
  body("Para iniciar la ejecucion del plan de forma inmediata, se recomienda seguir el siguiente orden de acciones prioritarias. En primer lugar, validar y priorizar el alcance funcional del CRM basico con el equipo, definiendo exactamente que campos y funcionalidades son imprescindibles para la operacion inicial y cuales pueden diferirse a una segunda iteracion. En segundo lugar, preparar el entorno de desarrollo y la infraestructura base: crear la organizacion en Vercel, configurar el proyecto en GitHub, aprovisionar la base de datos en Supabase o Neon y establecer las credenciales de API necesarias."),
  body("En tercer lugar, iniciar la Fase 1 de modularizacion de la plantilla, ya que constituye el bloqueo critico para todas las fases posteriores. Es recomendable realizar esta fase con un enfoque iterativo, validando periodicamente que la plantilla refactorizada genera visualmente el mismo resultado que la original antes de proceder con las fases de motor y panel. Finalmente, establecer un calendario de revisiones quincenales para evaluar el progreso, ajustar prioridades si es necesario y tomar decisiones informadas sobre el alcance de cada fase antes de invertir recursos adicionales."),
];

const bodySection = {
  properties: {
    type: SectionType.NEXT_PAGE,
    page: {
      size: { width: 11906, height: 16838 },
      margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
      pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
    },
  },
  headers: {
    default: new Header({
      children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "Plan de Infraestructura - Plataforma WebPool", size: 18, color: "808080", font: { ascii: "Calibri" } })],
      })],
    }),
  },
  footers: {
    default: new Footer({
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "PAGE \\* arabic \\* MERGEFORMAT", size: 18, color: "808080", font: { ascii: "Calibri" } })],
      })],
    }),
  },
  children: bodyContent,
};

// ─── BUILD DOCUMENT ───
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 24, color: bodyColor },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 32, bold: true, color: c("1A2330") },
        paragraph: { spacing: { before: 360, after: 160, line: 312 } },
      },
      heading2: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 28, bold: true, color: c("1A2330") },
        paragraph: { spacing: { before: 240, after: 120, line: 312 } },
      },
      heading3: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 24, bold: true, color: c("1A2330") },
        paragraph: { spacing: { before: 200, after: 100, line: 312 } },
      },
    },
  },
  numbering: { config: numberingConfig },
  sections: [coverSection, tocSection, bodySection],
});

// ─── GENERATE ───
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/z/my-project/download/Plan_Infraestructura_Plataforma_WebPool.docx", buf);
  console.log("Document generated successfully!");
});

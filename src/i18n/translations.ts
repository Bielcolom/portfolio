export type Locale = "en" | "es";

export type SectionId =
  | "about"
  | "experience"
  | "projects"
  | "stack"
  | "education"
  | "contact";

interface SectionContent {
  title: string;
  body: string[];
}

export interface Translations {
  meta: {
    role: string;
    location: string;
    scroll: string;
  };
  overlay: {
    hintMenu: {
      nav: string;
      open: string;
      clear: string;
    };
    menu: {
      headerMobile: string;
      headerDesktop: string;
      result: string;
      results: string;
      noMatches: string;
      noSection: string;
    };
  };
  items: Record<SectionId, { desc: string }>;
  sections: Record<SectionId, SectionContent>;
}

export const en: Translations = {
  meta: {
    role: "Full-stack dev",
    location: "Palma de Mallorca",
    scroll: "Scroll ↓",
  },
  overlay: {
    hintMenu: {
      nav: "nav",
      open: "go",
      clear: "clear",
    },
    menu: {
      headerMobile: "Tap a section or use a keyboard.",
      headerDesktop: "Type to filter, then press enter.",
      result: "result",
      results: "results",
      noMatches: "No matches",
      noSection: 'No section matches "{query}".',
    },
  },
  items: {
    about:      { desc: "A short bio" },
    experience: { desc: "Where I work" },
    projects:   { desc: "Things I've built" },
    stack:      { desc: "Tools I use" },
    education:  { desc: "Where I studied" },
    contact:    { desc: "Get in touch" },
  },
  sections: {
    about: {
      title: "About me",
      body: [
        "Frontend developer with over two years building production interfaces in React, Next.js and TypeScript. I own the user experience of WOZZO's HR platform since its earliest stages — today the company's most important product, used by tens of thousands of people.",
        "I ship features end to end, from definition to deployment, including integrations where there is no room for error: Stripe payments, SSO authentication and Verifactu under a legal deadline. Currently completing a degree in Computer Engineering at UOC while working full time.",
      ],
    },
    experience: {
      title: "Experience",
      body: [
        "WOZZO — Full Stack Developer · 2024–present. Lead developer of the company's flagship product since its earliest stages: time tracking, leave management and staff administration.",
        "Built Stripe payment integrations and single sign-on, and integrated Verifactu — the verifiable invoicing system required by the Spanish tax agency — under a legal deadline. Deployed i18n for multi-market use and built an AI assistant that answers natural-language questions by querying the product database.",
        "Business logic, hooks, API clients, TypeScript types and design tokens are shared between the web product and the cross-platform mobile app (React Native + Expo), which I also build, test and ship.",
      ],
    },
    projects: {
      title: "Projects",
      body: [
        "Music Social Platform — full-stack social network for musicians, web and mobile: profiles, content sharing, artist interaction and audio streaming. 3rd Prize for Best Student Business Projects (PalmaActiva, 2024), now in active development as working software. Next.js, React Native, Expo, Prisma, Supabase, Cloudflare.",
        "Next.js 15 + React 19 starter template — public, production-ready full-stack template applying best practices from the first commit.",
        "Spotify Clone — functional clone of the platform's core interface and features, built with React, Node.js and MongoDB.",
      ],
    },
    stack: {
      title: "Stack",
      body: [
        "Frontend: React, Next.js, TypeScript, state with hooks and Context API, Tailwind CSS. Interfaces built with the user experience in focus, from design to implementation.",
        "Backend & APIs: Node.js, GraphQL, REST. Databases: MongoDB in production; PostgreSQL with Prisma in personal projects.",
        "Mobile: React Native and Expo. Automated testing with Vitest. Engineering practice: Git and GitHub, peer code review, i18n, continuous quality improvement.",
      ],
    },
    education: {
      title: "Education",
      body: [
        "Degree in Computer Engineering — Universitat Oberta de Catalunya · 2024–present. In progress, part-time alongside full-time work.",
        "Higher Technician in Network Systems Administration (ASIR) — Col·legi Sant Josep Obrer · 2022–2024. Systems, networks, Linux, databases and scripting.",
        "Scientific-Technical Baccalaureate — Colegio Santa Mònica · 2018–2020.",
      ],
    },
    contact: {
      title: "Contact",
      body: [
        "Want to talk? Write me or find me here:",
      ],
    },
  },
};

export const es: Translations = {
  meta: {
    role: "Desarrollador full-stack",
    location: "Palma de Mallorca",
    scroll: "Scroll ↓",
  },
  overlay: {
    hintMenu: {
      nav: "nav",
      open: "ir",
      clear: "limpiar",
    },
    menu: {
      headerMobile: "Toca una sección o usa el teclado.",
      headerDesktop: "Escribe para filtrar y pulsa enter.",
      result: "resultado",
      results: "resultados",
      noMatches: "Sin coincidencias",
      noSection: 'Ninguna sección coincide con "{query}".',
    },
  },
  items: {
    about:      { desc: "Una breve bio" },
    experience: { desc: "Dónde trabajo" },
    projects:   { desc: "Cosas que he construido" },
    stack:      { desc: "Herramientas que uso" },
    education:  { desc: "Dónde he estudiado" },
    contact:    { desc: "Ponte en contacto" },
  },
  sections: {
    about: {
      title: "Sobre mí",
      body: [
        "Desarrollador frontend con más de dos años construyendo interfaces de producción en React, Next.js y TypeScript. Dueño de la experiencia de usuario de la plataforma de RRHH de WOZZO desde sus primeras fases — hoy el producto más importante de la empresa, con decenas de miles de usuarios.",
        "Llevo funcionalidades de extremo a extremo, desde la definición hasta el despliegue, incluyendo integraciones donde no cabe el error: pagos con Stripe, autenticación SSO y Verifactu bajo plazo legal. Actualmente completo el Grado en Ingeniería Informática en la UOC mientras trabajo a tiempo completo.",
      ],
    },
    experience: {
      title: "Experiencia",
      body: [
        "WOZZO — Desarrollador Full Stack · 2024–actualidad. Desarrollador principal del producto insignia de la empresa desde sus primeras fases: fichaje, gestión de vacaciones y administración de personal.",
        "Construí integraciones de pago con Stripe y autenticación de inicio de sesión único (SSO), e integré Verifactu — el sistema de facturación verificable exigido por la AEAT — bajo un plazo legal. Desplegué i18n para uso multi-mercado y diseñé un asistente de IA que responde preguntas en lenguaje natural consultando la base de datos del producto.",
        "La lógica de negocio, hooks, clientes de API, tipos de TypeScript y tokens de diseño se comparten entre el producto web y la app móvil multiplataforma (React Native + Expo), que también construyo, testeo y despliego.",
      ],
    },
    projects: {
      title: "Proyectos",
      body: [
        "Music Social Platform — red social full stack para músicos, web y móvil: perfiles, compartición de contenido, interacción entre artistas y streaming de audio. 3er Premio a los Mejores Proyectos Empresariales de Estudiantes (PalmaActiva, 2024), hoy en desarrollo activo como software funcional. Next.js, React Native, Expo, Prisma, Supabase, Cloudflare.",
        "Plantilla inicial Next.js 15 + React 19 — plantilla full stack pública, lista para producción, que aplica buenas prácticas desde el primer commit.",
        "Spotify Clone — clon funcional de la interfaz y funcionalidades principales de la plataforma, construido con React, Node.js y MongoDB.",
      ],
    },
    stack: {
      title: "Stack",
      body: [
        "Frontend: React, Next.js, TypeScript, gestión de estado con hooks y Context API, Tailwind CSS. Interfaces construidas con foco en la experiencia de usuario, del diseño a la implementación.",
        "Backend y APIs: Node.js, GraphQL, REST. Bases de datos: MongoDB en producción; PostgreSQL con Prisma en proyectos personales.",
        "Móvil: React Native y Expo. Testing automatizado con Vitest. Práctica de ingeniería: Git y GitHub, revisión de código entre pares, i18n y mejora continua de la calidad.",
      ],
    },
    education: {
      title: "Formación",
      body: [
        "Grado en Ingeniería Informática — Universitat Oberta de Catalunya · 2024–actualidad. En curso, a tiempo parcial junto al empleo a tiempo completo.",
        "Técnico Superior en Administración de Sistemas Informáticos en Red (ASIR) — Col·legi Sant Josep Obrer · 2022–2024. Sistemas, redes, Linux, bases de datos y scripting.",
        "Bachillerato Científico-Técnico — Colegio Santa Mònica · 2018–2020.",
      ],
    },
    contact: {
      title: "Contacto",
      body: [
        "¿Hablamos? Escríbeme o encuéntrame en:",
      ],
    },
  },
};

export const translations: Record<Locale, Translations> = { en, es };

export type Locale = "en" | "es";

export type SectionId =
  | "about"
  | "experience"
  | "projects"
  | "stack"
  | "education"
  | "contact";

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  desc: string;
  tech: string[];
  award?: string;
}

export interface StackGroup {
  name: string;
  items: string[];
}

export interface EducationEntry {
  title: string;
  school: string;
  period: string;
  note?: string;
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
  sections: {
    about: { title: string; body: string[] };
    experience: { title: string; entries: ExperienceEntry[] };
    projects: { title: string; items: ProjectItem[] };
    stack: { title: string; groups: StackGroup[] };
    education: { title: string; entries: EducationEntry[] };
    contact: { title: string; body: string[] };
  };
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
    about: { desc: "A short bio" },
    experience: { desc: "Where I work" },
    projects: { desc: "Things I've built" },
    stack: { desc: "Tools I use" },
    education: { desc: "Where I studied" },
    contact: { desc: "Get in touch" },
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
      entries: [
        {
          role: "Full Stack Developer",
          company: "WOZZO",
          period: "2024 — Present",
          location: "Palma de Mallorca · hybrid",
          bullets: [
            "Lead developer of the company's flagship product since its earliest stages — time tracking, leave management and staff administration — used by tens of thousands of people.",
            "Critical integrations with no room for error: Stripe payments, single sign-on (SSO) and Verifactu, the verifiable invoicing system required by the Spanish tax agency, under a legal deadline.",
            "Designed and built an AI assistant embedded in the platform that answers natural-language questions by querying the product database.",
            "Deployed i18n for multi-market use; business logic, hooks, API clients, TypeScript types and design tokens shared between web and mobile.",
            "Builds, tests and ships the cross-platform mobile apps with React Native and Expo; automated testing with Vitest.",
          ],
        },
      ],
    },
    projects: {
      title: "Projects",
      items: [
        {
          name: "Music Social Platform",
          desc: "Full-stack social network for musicians, web and mobile: profiles, content sharing, artist interaction and audio streaming. In active development.",
          tech: ["Next.js", "React Native", "Expo", "TypeScript", "Node.js", "Prisma", "Supabase", "Cloudflare"],
          award: "3rd Prize · PalmaActiva 2024",
        },
        {
          name: "Next.js 15 + React 19 template",
          desc: "Public, production-ready full-stack starter template applying best practices from the first commit.",
          tech: ["Next.js 15", "React 19", "TypeScript"],
        },
        {
          name: "Spotify Clone",
          desc: "Functional clone of the platform's core interface and features.",
          tech: ["React", "Node.js", "MongoDB"],
        },
      ],
    },
    stack: {
      title: "Stack",
      groups: [
        { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "SCSS"] },
        { name: "Backend & APIs", items: ["Node.js", "GraphQL", "REST"] },
        { name: "Mobile", items: ["React Native", "Expo"] },
        { name: "Databases", items: ["MongoDB", "PostgreSQL", "Prisma"] },
        { name: "Testing", items: ["Vitest"] },
        { name: "Practice", items: ["Git & GitHub", "Code review", "i18n"] },
      ],
    },
    education: {
      title: "Education",
      entries: [
        {
          title: "Degree in Computer Engineering",
          school: "Universitat Oberta de Catalunya",
          period: "2024 — Present",
          note: "Part-time alongside full-time work.",
        },
        {
          title: "Higher Technician in Network Systems Administration (ASIR)",
          school: "Col·legi Sant Josep Obrer",
          period: "2022 — 2024",
          note: "Systems, networks, Linux, databases and scripting.",
        },
        {
          title: "Scientific-Technical Baccalaureate",
          school: "Colegio Santa Mònica",
          period: "2018 — 2020",
        },
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
    about: { desc: "Una breve bio" },
    experience: { desc: "Dónde trabajo" },
    projects: { desc: "Cosas que he construido" },
    stack: { desc: "Herramientas que uso" },
    education: { desc: "Dónde he estudiado" },
    contact: { desc: "Ponte en contacto" },
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
      entries: [
        {
          role: "Desarrollador Full Stack",
          company: "WOZZO",
          period: "2024 — Actualidad",
          location: "Palma de Mallorca · híbrido",
          bullets: [
            "Desarrollador principal del producto insignia de la empresa desde sus primeras fases — fichaje, gestión de vacaciones y administración de personal — con decenas de miles de usuarios.",
            "Integraciones críticas donde no cabe el error: pagos con Stripe, autenticación de inicio de sesión único (SSO) y Verifactu, el sistema de facturación verificable exigido por la AEAT, bajo un plazo legal.",
            "Diseñé y construí un asistente de IA integrado en la plataforma que responde preguntas en lenguaje natural consultando la base de datos del producto.",
            "Desplegué i18n para uso multi-mercado; lógica de negocio, hooks, clientes de API, tipos de TypeScript y tokens de diseño compartidos entre web y móvil.",
            "Construyo, testeo y despliego las apps móviles multiplataforma con React Native y Expo; testing automatizado con Vitest.",
          ],
        },
      ],
    },
    projects: {
      title: "Proyectos",
      items: [
        {
          name: "Music Social Platform",
          desc: "Red social full stack para músicos, web y móvil: perfiles, compartición de contenido, interacción entre artistas y streaming de audio. En desarrollo activo.",
          tech: ["Next.js", "React Native", "Expo", "TypeScript", "Node.js", "Prisma", "Supabase", "Cloudflare"],
          award: "3er Premio · PalmaActiva 2024",
        },
        {
          name: "Plantilla Next.js 15 + React 19",
          desc: "Plantilla full stack pública, lista para producción, que aplica buenas prácticas desde el primer commit.",
          tech: ["Next.js 15", "React 19", "TypeScript"],
        },
        {
          name: "Clon de Spotify",
          desc: "Clon funcional de la interfaz y funcionalidades principales de la plataforma.",
          tech: ["React", "Node.js", "MongoDB"],
        },
      ],
    },
    stack: {
      title: "Stack",
      groups: [
        { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "SCSS"] },
        { name: "Backend y APIs", items: ["Node.js", "GraphQL", "REST"] },
        { name: "Móvil", items: ["React Native", "Expo"] },
        { name: "Bases de datos", items: ["MongoDB", "PostgreSQL", "Prisma"] },
        { name: "Testing", items: ["Vitest"] },
        { name: "Práctica", items: ["Git y GitHub", "Code review", "i18n"] },
      ],
    },
    education: {
      title: "Formación",
      entries: [
        {
          title: "Grado en Ingeniería Informática",
          school: "Universitat Oberta de Catalunya",
          period: "2024 — Actualidad",
          note: "A tiempo parcial junto al empleo a tiempo completo.",
        },
        {
          title: "Técnico Superior en Administración de Sistemas Informáticos en Red (ASIR)",
          school: "Col·legi Sant Josep Obrer",
          period: "2022 — 2024",
          note: "Sistemas, redes, Linux, bases de datos y scripting.",
        },
        {
          title: "Bachillerato Científico-Técnico",
          school: "Colegio Santa Mònica",
          period: "2018 — 2020",
        },
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

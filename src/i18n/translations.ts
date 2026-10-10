export type Locale = "en" | "es";

export type SectionId =
  | "about"
  | "experience"
  | "projects"
  | "stack"
  | "education"
  | "contact";

export interface Fact {
  label: string;
  value: string;
}

/** One chapter of the "what I do" story. The order matches the particle shapes:
 *  a three-layer stack, a chat bubble, a phone beside a browser, a payment card. */
export interface Chapter {
  title: string;
  body: string;
  tags: string[];
}

export interface ProjectItem {
  name: string;
  meta: string;
  desc: string;
  tech: string[];
  award?: string;
  /** Public repository — only for projects whose code is actually public. */
  href?: string;
}

export interface StackGroup {
  name: string;
  items: string[];
}

export interface EducationEntry {
  period: string;
  title: string;
  school: string;
  note?: string;
}

export interface Translations {
  meta: {
    role: string;
    location: string;
  };
  nav: {
    menu: string;
    close: string;
    home: string;
    /** Shown beside the live clock */
    localTime: string;
  };
  hero: {
    pitch: string;
    cv: string;
    email: string;
    scroll: string;
  };
  availability: {
    /** The bar's version, next to the light: one word */
    short: string;
    status: string;
    where: string;
    /** Work eligibility and relocation */
    detail: string;
  };
  items: Record<SectionId, string>;
  /** Names the action, in the language it switches to. */
  langToggle: string;
  cv: {
    label: string;
    open: string;
    href: string;
    handle: string;
  };
  cursor: {
    drag: string;
    open: string;
  };
  about: {
    title: string;
    statement: string;
    facts: Fact[];
  };
  /** "What I do": capabilities, not a job history. The CV carries the history */
  experience: {
    title: string;
    lede: string;
    chapters: Chapter[];
    also: string;
    drag: string;
    /** "{n}" and "{total}" are replaced at render */
    step: string;
  };
  projects: {
    title: string;
    items: ProjectItem[];
    source: string;
  };
  stack: {
    title: string;
    groups: StackGroup[];
  };
  education: {
    title: string;
    entries: EducationEntry[];
    awardTitle: string;
    award: string;
    trainingTitle: string;
    training: string[];
  };
  contact: {
    titleLines: string[];
    body: string;
    copy: string;
    copied: string;
    built: string;
    top: string;
  };
}

export const en: Translations = {
  meta: {
    role: "Full-stack developer",
    location: "Palma de Mallorca",
  },
  nav: {
    menu: "Menu",
    close: "Close",
    home: "Back to top",
    localTime: "Palma",
  },
  hero: {
    pitch: "I design and build web and mobile products end to end, from the interface to the database, including AI features that take real action. I've been a core developer, from its earliest stages, of software that tens of thousands of people use.",
    cv: "View CV",
    email: "Email me",
    scroll: "Scroll",
  },
  availability: {
    short: "Available",
    status: "Open to new roles and freelance work",
    where: "Ireland, Spain or remote",
    detail: "EU citizen, happy to relocate",
  },
  items: {
    about: "About",
    experience: "What I do",
    projects: "Projects",
    stack: "Stack",
    education: "Education",
    contact: "Contact",
  },
  langToggle: "Cambiar a español",
  cv: {
    label: "CV",
    open: "CV, PDF in English",
    href: "/cv/Gabriel-Colom-Moll-CV-EN.pdf",
    handle: "English · PDF",
  },
  cursor: {
    drag: "Drag",
    open: "Open",
  },
  about: {
    title: "About me",
    statement: "I build products end to end: I define the solution, design the interface, write the code on both sides, review it and ship it. I work across React, Next.js, Node.js and React Native, and I build AI features that act on real data. Software I've worked on since its earliest stages is used by tens of thousands of people, and I'm completing a Computer Engineering degree at UOC in parallel.",
    facts: [
      { label: "Based in", value: "Palma de Mallorca, Spain" },
      { label: "Open to", value: "New roles in Ireland, Spain or remote, and freelance projects" },
      { label: "Work rights", value: "EU citizen, no visa needed" },
      { label: "Now", value: "Full-stack developer at WOZZO, since 2024" },
      { label: "Languages", value: "Spanish and Catalan (native), English (intermediate)" },
    ],
  },
  experience: {
    title: "What I do",
    lede: "What I bring to a team or a project.",
    chapters: [
      {
        title: "End to end",
        body: "From the database to the last pixel: I define the solution, design the interface, build the API and the front end, and ship it. I'm comfortable owning a feature from the first conversation to production, and keeping it healthy once it's live.",
        tags: ["TypeScript", "Next.js", "React", "Node.js", "MongoDB", "GraphQL"],
      },
      {
        title: "AI that acts",
        body: "AI features that do work, not just chat: assistants that answer plain-language questions straight from a product's database and carry out actions, such as assigning a schedule to a whole team from a single sentence. Requests like “every Sunday, send me who clocked in late” become scheduled reports, delivered by email and in-app.",
        tags: ["AI agents", "Natural language", "Automation"],
      },
      {
        title: "Web and mobile",
        body: "One product, two platforms: web apps in React and Next.js, and native apps in React Native and Expo, built, tested and shipped to production. Business logic, hooks, API clients, TypeScript types and design tokens are shared between them.",
        tags: ["React Native", "Expo", "Next.js", "Design tokens"],
      },
      {
        title: "Critical integrations",
        body: "The parts of a product where an error costs money or trust: card payments with Stripe, single sign-on, several languages and markets, and electronic invoicing that meets Spain's tax rules, delivered against a legal deadline.",
        tags: ["Stripe", "SSO", "i18n", "Verifactu"],
      },
    ],
    also: "Also part of the job: code review, CI/CD with GitHub Actions and onboarding new developers.",
    drag: "Drag to rotate",
    step: "{n} of {total}",
  },
  projects: {
    title: "Projects",
    items: [
      {
        name: "Music Social Platform",
        meta: "Web + mobile · in active development",
        desc: "A social network for musicians: profiles, content sharing, artist interaction and in-platform audio streaming. Its business plan won a prize at PalmaActiva; now I'm building it as working software.",
        tech: ["Next.js", "React Native", "Expo", "TypeScript", "Node.js", "Prisma", "Supabase", "Cloudflare"],
        award: "3rd Prize · PalmaActiva 2024",
      },
      {
        name: "Next.js 15 + React 19 template",
        meta: "Open source",
        desc: "A production-ready full-stack starter that applies best practices from the first commit.",
        tech: ["Next.js 15", "React 19", "TypeScript", "Node.js"],
        href: "https://github.com/Bielcolom/template-next15-react19",
      },
      {
        name: "Spotify Clone",
        meta: "Learning project",
        desc: "A working clone of Spotify's core interface and features, with the music player kept in global state.",
        tech: ["React", "Node.js", "MongoDB", "Redux"],
      },
      {
        name: "This portfolio",
        meta: "Live",
        desc: "Kinetic type, a portrait that turns into 3D particles, and two first-class languages.",
        tech: ["Next.js 16", "React 19", "three.js", "SCSS"],
      },
    ],
    source: "Code",
  },
  stack: {
    title: "Stack",
    groups: [
      { name: "In production", items: ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "MongoDB", "GraphQL", "React Native", "Expo", "i18n"] },
      { name: "In personal projects", items: ["PostgreSQL", "Prisma", "Supabase", "Tailwind CSS", "SCSS", "Cloudflare", "Redux", "three.js", "Angular"] },
      { name: "Practice", items: ["Git and GitHub", "Code review", "CI/CD with GitHub Actions", "Jira", "Claude Code"] },
    ],
  },
  education: {
    title: "Education",
    entries: [
      {
        period: "2024 – now",
        title: "BSc in Computer Engineering",
        school: "Universitat Oberta de Catalunya",
        note: "In progress, part-time alongside full-time work.",
      },
      {
        period: "2022 – 2024",
        title: "Higher National Diploma in Network Systems Administration (ASIR)",
        school: "Col·legi Sant Josep Obrer, Palma",
        note: "Systems administration, networking, Linux, databases and scripting.",
      },
      {
        period: "2018 – 2020",
        title: "Scientific-Technical Baccalaureate",
        school: "Colegio Santa Mònica, Palma",
        note: "Mathematics, physics and technical drawing.",
      },
    ],
    awardTitle: "Award",
    award: "3rd Prize, Best Student Business Projects · PalmaActiva 2024",
    trainingTitle: "Further training",
    training: [
      "Probability for Machine Learning and Big Data with R and Python · Udemy",
      "Complete Linear Algebra, Zero to Expert · Udemy",
      "Introduction to Python · Col·legi Sant Josep Obrer",
    ],
  },
  contact: {
    titleLines: ["New role", "or new project?"],
    body: "I'm open to full-stack roles in Ireland, Spain or remote, and to freelance projects: websites, web apps and mobile apps. Tell me what you need.",
    copy: "Copy email",
    copied: "Copied",
    built: "Built with Next.js and three.js",
    top: "Back to top",
  },
};

export const es: Translations = {
  meta: {
    role: "Desarrollador full stack",
    location: "Palma de Mallorca",
  },
  nav: {
    menu: "Menú",
    close: "Cerrar",
    home: "Volver arriba",
    localTime: "Palma",
  },
  hero: {
    pitch: "Diseño y construyo productos web y móviles de extremo a extremo, de la interfaz a la base de datos, incluidas funciones de IA que actúan de verdad. Soy desarrollador principal, desde sus primeras fases, de un software que usan decenas de miles de personas.",
    cv: "Ver CV",
    email: "Escríbeme",
    scroll: "Desplázate",
  },
  availability: {
    short: "Disponible",
    status: "Abierto a nuevos puestos y proyectos freelance",
    where: "Irlanda, España o remoto",
    detail: "Dispuesto a trasladarme",
  },
  items: {
    about: "Sobre mí",
    experience: "Qué hago",
    projects: "Proyectos",
    stack: "Stack",
    education: "Formación",
    contact: "Contacto",
  },
  langToggle: "Switch to English",
  cv: {
    label: "CV",
    open: "CV, PDF en español",
    href: "/cv/Gabriel-Colom-Moll-CV-ES.pdf",
    handle: "Español · PDF",
  },
  cursor: {
    drag: "Arrastra",
    open: "Abrir",
  },
  about: {
    title: "Sobre mí",
    statement: "Construyo productos de extremo a extremo: defino la solución, diseño la interfaz, escribo el código de los dos lados, lo reviso y lo despliego. Trabajo con React, Next.js, Node.js y React Native, y construyo funciones de IA que actúan sobre datos reales. El software en el que trabajo desde sus primeras fases lo usan decenas de miles de personas, y en paralelo completo el Grado en Ingeniería Informática en la UOC.",
    facts: [
      { label: "Vivo en", value: "Palma de Mallorca" },
      { label: "Abierto a", value: "Puestos en Irlanda, España o remoto, y proyectos freelance" },
      { label: "Ahora", value: "Desarrollador full stack en WOZZO, desde 2024" },
      { label: "Idiomas", value: "Español y catalán (nativos), inglés (intermedio)" },
    ],
  },
  experience: {
    title: "Qué hago",
    lede: "Lo que aporto a un equipo o a un proyecto.",
    chapters: [
      {
        title: "De principio a fin",
        body: "De la base de datos al último píxel: defino la solución, diseño la interfaz, construyo la API y el front y lo despliego. Me siento cómodo llevando una funcionalidad desde la primera conversación hasta producción, y manteniéndola sana cuando ya está en marcha.",
        tags: ["TypeScript", "Next.js", "React", "Node.js", "MongoDB", "GraphQL"],
      },
      {
        title: "IA que actúa",
        body: "Funciones de IA que hacen trabajo real, no solo conversación: asistentes que responden preguntas en lenguaje natural consultando directamente la base de datos de un producto y ejecutan acciones, como asignar una jornada a todo un equipo con una sola frase. Peticiones como «cada domingo, envíame quién fichó tarde» se convierten en informes programados que llegan por email y en la app.",
        tags: ["Agentes de IA", "Lenguaje natural", "Automatización"],
      },
      {
        title: "Web y móvil",
        body: "Un producto, dos plataformas: aplicaciones web con React y Next.js y apps nativas con React Native y Expo, construidas, testeadas y publicadas en producción. Comparten lógica de negocio, hooks, clientes de API, tipos de TypeScript y tokens de diseño.",
        tags: ["React Native", "Expo", "Next.js", "Tokens de diseño"],
      },
      {
        title: "Integraciones críticas",
        body: "Las partes de un producto donde un error cuesta dinero o confianza: pagos con tarjeta con Stripe, inicio de sesión único (SSO), varios idiomas y mercados, y facturación electrónica conforme a la normativa de la AEAT, entregada bajo un plazo legal.",
        tags: ["Stripe", "SSO", "i18n", "Verifactu"],
      },
    ],
    also: "También forma parte del trabajo: code review, CI/CD con GitHub Actions y la incorporación de nuevos desarrolladores.",
    drag: "Arrastra para girar",
    step: "{n} de {total}",
  },
  projects: {
    title: "Proyectos",
    items: [
      {
        name: "Red social para músicos",
        meta: "Web + móvil · en desarrollo activo",
        desc: "Perfiles, contenido compartido, interacción entre artistas y streaming de audio en la propia plataforma. Su plan de negocio ganó un premio de PalmaActiva; ahora lo construyo como software real.",
        tech: ["Next.js", "React Native", "Expo", "TypeScript", "Node.js", "Prisma", "Supabase", "Cloudflare"],
        award: "3er Premio · PalmaActiva 2024",
      },
      {
        name: "Plantilla Next.js 15 + React 19",
        meta: "Código abierto",
        desc: "Una plantilla full stack lista para producción que aplica buenas prácticas desde el primer commit.",
        tech: ["Next.js 15", "React 19", "TypeScript", "Node.js"],
        href: "https://github.com/Bielcolom/template-next15-react19",
      },
      {
        name: "Clon de Spotify",
        meta: "Proyecto de aprendizaje",
        desc: "Un clon funcional de la interfaz y las funcionalidades principales de Spotify, con el reproductor en estado global.",
        tech: ["React", "Node.js", "MongoDB", "Redux"],
      },
      {
        name: "Este portfolio",
        meta: "En línea",
        desc: "Tipografía cinética, un retrato que se convierte en partículas 3D y dos idiomas al mismo nivel.",
        tech: ["Next.js 16", "React 19", "three.js", "SCSS"],
      },
    ],
    source: "Código",
  },
  stack: {
    title: "Stack",
    groups: [
      { name: "En producción", items: ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "MongoDB", "GraphQL", "React Native", "Expo", "i18n"] },
      { name: "En proyectos personales", items: ["PostgreSQL", "Prisma", "Supabase", "Tailwind CSS", "SCSS", "Cloudflare", "Redux", "three.js", "Angular"] },
      { name: "Práctica", items: ["Git y GitHub", "Code review", "CI/CD con GitHub Actions", "Jira", "Claude Code"] },
    ],
  },
  education: {
    title: "Formación",
    entries: [
      {
        period: "2024 – actualidad",
        title: "Grado en Ingeniería Informática",
        school: "Universitat Oberta de Catalunya",
        note: "En curso, a tiempo parcial junto al empleo a tiempo completo.",
      },
      {
        period: "2022 – 2024",
        title: "Técnico Superior en Administración de Sistemas Informáticos en Red (ASIR)",
        school: "Col·legi Sant Josep Obrer, Palma",
        note: "Administración de sistemas, redes, Linux, bases de datos y scripting.",
      },
      {
        period: "2018 – 2020",
        title: "Bachillerato Científico-Técnico",
        school: "Colegio Santa Mònica, Palma",
        note: "Matemáticas, física y dibujo técnico.",
      },
    ],
    awardTitle: "Premio",
    award: "3er Premio, Mejores Proyectos Empresariales de Estudiantes · PalmaActiva 2024",
    trainingTitle: "Formación complementaria",
    training: [
      "Probabilidad para Machine Learning y Big Data con R y Python · Udemy",
      "Curso completo de Álgebra Lineal, de cero a experto · Udemy",
      "Introducción a Python · Col·legi Sant Josep Obrer",
    ],
  },
  contact: {
    titleLines: ["¿Nuevo puesto", "o nuevo proyecto?"],
    body: "Estoy abierto a puestos full stack en Irlanda, España o remoto, y a proyectos freelance: webs, aplicaciones web y apps móviles. Cuéntame qué necesitas.",
    copy: "Copiar email",
    copied: "Copiado",
    built: "Hecho con Next.js y three.js",
    top: "Volver arriba",
  },
};

export const translations: Record<Locale, Translations> = { en, es };

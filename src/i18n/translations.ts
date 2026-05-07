export type Locale = "en" | "es";

export interface Translations {
  meta: {
    role: string;
    portfolio: string;
  };
  overlay: {
    closed: {
      mobile: string;
      desktop: string;
    };
    back: string;
    hintMenu: {
      typeToFilter: string;
      nav: string;
      open: string;
      erase: string;
      close: string;
    };
    hintViewing: {
      back: string;
      next: string;
      typeToSearch: string;
      close: string;
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
  items: {
    who: { desc: string; code: string };
    stack: { desc: string; code: string };
    experience: { desc: string; code: string };
    projects: { desc: string; code: string };
    contact: { desc: string; code: string };
    socials: { desc: string; code: string };
  };
}

export const en: Translations = {
  meta: {
    role: "Full-stack dev",
    portfolio: "Portfolio / 01",
  },
  overlay: {
    closed: {
      mobile: "Tap to start",
      desktop: "Type to search...",
    },
    back: "back",
    hintMenu: {
      typeToFilter: "type to filter",
      nav: "nav",
      open: "open",
      erase: "erase",
      close: "close",
    },
    hintViewing: {
      back: "back",
      next: "next",
      typeToSearch: "type to search",
      close: "close",
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
    who: {
      desc: "A short bio",
      code: `const me = {
  name: "Biel Colom",
  role: "Full-stack developer",
  loc: "Palma de Mallorca",
  email: "gabrielcolomoll@gmail.com"
};`,
    },
    stack: {
      desc: "Skills & current setup",
      code: `const stack = {
  languages:  ["TypeScript", "JavaScript", "Python"],
  frameworks: ["React", "Next.js", "Node.js", "React Native"],
  databases:  ["MongoDB", "PostgreSQL"],
  tools:      ["Git", "GitHub", "Figma"]
};`,
    },
    experience: {
      desc: "Where I have worked",
      code: `const experience = [
  {
    role:    "Full Stack Developer",
    company: "WOZZO",
    since:   "March 2024",
    loc:     "Palma de Mallorca"
  }
];`,
    },
    projects: {
      desc: "Things I have built",
      code: `const projects = [
  { name: "portfolio",     tech: "Next.js 16 + React 19" },
  { name: "spotify-clone", tech: "React + Node.js"       },
  { name: "next-template", tech: "Next.js 15 + React 19" }
];`,
    },
    contact: {
      desc: "Get in touch",
      code: `const contact = {
  email:  "gabrielcolomoll@gmail.com",
  loc:    "Palma de Mallorca",
  github: "github.com/Bielcolom"
};`,
    },
    socials: { desc: "Find me online", code: "" },
  },
};

export const es: Translations = {
  meta: {
    role: "Desarrollador full-stack",
    portfolio: "Portfolio / 01",
  },
  overlay: {
    closed: {
      mobile: "Toca para empezar",
      desktop: "Escribe para buscar...",
    },
    back: "volver",
    hintMenu: {
      typeToFilter: "escribe para filtrar",
      nav: "nav",
      open: "abrir",
      erase: "borrar",
      close: "cerrar",
    },
    hintViewing: {
      back: "volver",
      next: "siguiente",
      typeToSearch: "escribe para buscar",
      close: "cerrar",
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
    who: {
      desc: "Una breve bio",
      code: `const me = {
  name: "Biel Colom",
  role: "Desarrollador full-stack",
  loc: "Palma de Mallorca",
  email: "gabrielcolomoll@gmail.com"
};`,
    },
    stack: {
      desc: "Skills y setup actual",
      code: `const stack = {
  languages:  ["TypeScript", "JavaScript", "Python"],
  frameworks: ["React", "Next.js", "Node.js", "React Native"],
  databases:  ["MongoDB", "PostgreSQL"],
  tools:      ["Git", "GitHub", "Figma"]
};`,
    },
    experience: {
      desc: "Dónde he trabajado",
      code: `const experience = [
  {
    role:    "Full Stack Developer",
    company: "WOZZO",
    since:   "Marzo 2024",
    loc:     "Palma de Mallorca"
  }
];`,
    },
    projects: {
      desc: "Cosas que he construido",
      code: `const projects = [
  { name: "portfolio",     tech: "Next.js 16 + React 19" },
  { name: "spotify-clone", tech: "React + Node.js"       },
  { name: "next-template", tech: "Next.js 15 + React 19" }
];`,
    },
    contact: {
      desc: "Ponte en contacto",
      code: `const contact = {
  email:  "gabrielcolomoll@gmail.com",
  loc:    "Palma de Mallorca",
  github: "github.com/Bielcolom"
};`,
    },
    socials: { desc: "Encuéntrame online", code: "" },
  },
};

export const translations: Record<Locale, Translations> = { en, es };

export type Locale = "en" | "es";

export interface Translations {
  navbar: {
    devMessage: string;
  };
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
    skills: { desc: string; code: string };
    stack: { desc: string; code: string };
    contact: { desc: string; code: string };
    hi: { desc: string; code: string };
  };
}

export const en: Translations = {
  navbar: {
    devMessage: "Website currently under development...",
  },
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
    skills: {
      desc: "Things I am good at",
      code: `const skills = [
  "TypeScript",
  "React / Next.js",
  "Node.js",
  "GraphQL",
];`,
    },
    stack: {
      desc: "My current setup",
      code: `// Current stack
import { Next15 }    from "next";
import { React19 }   from "react";
import { TS5 }       from "typescript";
import { Tailwind4 } from "tailwindcss";`,
    },
    contact: {
      desc: "Get in touch",
      code: `const contact = {
  email:  "gabrielcolomoll@gmail.com",
  loc:    "Palma de Mallorca",
  github: "github.com/Bielcolom"
};`,
    },
    hi: {
      desc: "Just say hello",
      code: `console.log("Hello 👋  — thanks for stopping by.");`,
    },
  },
};

export const es: Translations = {
  navbar: {
    devMessage: "Actualmente la web está en desarrollo...",
  },
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
    skills: {
      desc: "Cosas en las que soy bueno",
      code: `const skills = [
  "TypeScript",
  "React / Next.js",
  "Node.js",
  "GraphQL",
];`,
    },
    stack: {
      desc: "Mi setup actual",
      code: `// Stack actual
import { Next15 }    from "next";
import { React19 }   from "react";
import { TS5 }       from "typescript";
import { Tailwind4 } from "tailwindcss";`,
    },
    contact: {
      desc: "Ponte en contacto",
      code: `const contact = {
  email:  "gabrielcolomoll@gmail.com",
  loc:    "Palma de Mallorca",
  github: "github.com/Bielcolom"
};`,
    },
    hi: {
      desc: "Solo saludar",
      code: `console.log("Hola 👋  — gracias por pasarte.");`,
    },
  },
};

export const translations: Record<Locale, Translations> = { en, es };

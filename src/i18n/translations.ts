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
    who: string;
    skills: string;
    stack: string;
    contact: string;
    hi: string;
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
    who: "A short bio",
    skills: "Things I am good at",
    stack: "My current setup",
    contact: "Get in touch",
    hi: "Just say hello",
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
    who: "Una breve bio",
    skills: "Cosas en las que soy bueno",
    stack: "Mi setup actual",
    contact: "Ponte en contacto",
    hi: "Solo saludar",
  },
};

export const translations: Record<Locale, Translations> = { en, es };

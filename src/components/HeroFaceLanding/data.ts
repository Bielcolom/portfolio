export interface MenuItem {
  id: string;
  label: string;
  desc: string;
  code: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "who",
    label: "who",
    desc: "A short bio",
    code: `const me = {
  name: "Biel Colom",
  role: "Full-stack developer",
  loc: "Palma de Mallorca",
  email: "gabrielcolomoll@gmail.com"
};`,
  },
  {
    id: "skills",
    label: "skills",
    desc: "Things I am good at",
    code: `const skills = [
  "TypeScript",
  "React / Next.js",
  "Node.js",
  "GraphQL",
  "PostgreSQL"
];`,
  },
  {
    id: "stack",
    label: "stack",
    desc: "My current setup",
    code: `// Current stack
import { Next15 }    from "next";
import { React19 }   from "react";
import { TS5 }       from "typescript";
import { Tailwind4 } from "tailwindcss";`,
  },
  {
    id: "contact",
    label: "contact",
    desc: "Get in touch",
    code: `const contact = {
  email:  "gabrielcolomoll@gmail.com",
  loc:    "Palma de Mallorca",
  github: "github.com/Bielcolom"
};`,
  },
  {
    id: "hi",
    label: "hi",
    desc: "Just say hello",
    code: `console.log("Hello 👋  — thanks for stopping by.");`,
  },
];

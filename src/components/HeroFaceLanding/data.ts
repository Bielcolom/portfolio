export interface MenuItemBase {
  id: string;
  label: string;
}

/** Full item after merging with localized translations. */
export interface MenuItem extends MenuItemBase {
  desc: string;
  code: string;
}

export type EditorView = "closed" | "menu" | "viewing";

export const MENU_ITEMS: MenuItemBase[] = [
  { id: "who",        label: "who"        },
  { id: "stack",      label: "stack"      },
  { id: "experience", label: "experience" },
  { id: "projects",   label: "projects"   },
  { id: "contact",    label: "contact"    },
  { id: "socials",    label: "socials"    },
];

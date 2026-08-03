export interface MenuItemBase {
  id: string;
  label: string;
}

/** Full item after merging with localized translations. */
export interface MenuItem extends MenuItemBase {
  num: string;
  desc: string;
}

/** Site index — each item maps 1:1 to a page section with the same id. */
export const MENU_ITEMS: MenuItemBase[] = [
  { id: "about",      label: "about"      },
  { id: "experience", label: "experience" },
  { id: "projects",   label: "projects"   },
  { id: "stack",      label: "stack"      },
  { id: "education",  label: "education"  },
  { id: "contact",    label: "contact"    },
];

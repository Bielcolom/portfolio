export interface MenuItemBase {
  id: string;
}

/** Full item after merging with localized translations. */
export interface MenuItem extends MenuItemBase {
  num: string;
  label: string;
  desc: string;
}

/** Site index — each item maps 1:1 to a page section with the same id. */
export const MENU_ITEMS: MenuItemBase[] = [
  { id: "about"      },
  { id: "experience" },
  { id: "projects"   },
  { id: "stack"      },
  { id: "education"  },
  { id: "contact"    },
];

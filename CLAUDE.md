

# Portfolio — Biel Colom

Personal portfolio landing page. Single route (`/`), deployed on Vercel.

## Stack

- Next.js 16.3.1 — App Router only, no Pages Router
- React 19.2.8 + TypeScript strict
- SCSS modules — no Tailwind, no CSS-in-JS
- React Compiler enabled (`reactCompiler: true`) — no manual `useMemo`/`useCallback`.
  Runs as the native Rust port inside Turbopack via `experimental.turbopackRustReactCompiler`,
  so there is no `babel-plugin-react-compiler` dependency. The flag is Turbopack-only:
  a `--webpack` build will throw.
- Turbopack for dev and build
- Framer Motion — hero tilt springs and the name's ghost-typing animation
- Dark-only design: `_themes.scss` defines a single palette, no light/dark pair

## Project structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout with LanguageProvider
│   ├── page.tsx                # Only page — navbar + HeroFaceLanding + Sections
│   ├── global-error.tsx        # Root error boundary (replaces layout on crash)
│   └── styles/                 # Global SCSS: abstracts, base, globals
├── components/
│   ├── CvLink/                 # Navbar "CV" button — opens the PDF for the active locale
│   ├── LangToggle/             # EN/ES toggle button
│   ├── Sections/               # Docs-style content sections below the hero (anchor ids = menu ids)
│   └── HeroFaceLanding/        # Main interactive hero component
│       ├── index.tsx           # Orchestrator — composes everything
│       ├── data.ts             # Site index order (ids only); ids double as section anchors
│       ├── useAnimationPhase   # Hook: manages reveal animation phases
│       ├── useViewportWidth    # Hooks: viewport width + height; isMobile derived from width
│       ├── useEditorState      # Hook: index state (filter, selection, keyboard nav → onOpen)
│       ├── FaceMedia           # Video/image display with error fallback
│       ├── MagicKeyboard/      # Interactive QWERTY keyboard (desktop only)
│       └── ScreenIndex/        # Desktop screen content: index + face card; MenuList is shared with mobile
└── i18n/
    ├── context.tsx             # LanguageProvider + useLanguage hook
    └── translations.ts         # EN + ES strings: index descs + section content
```

## Architecture decisions

**Single source of truth for content:**
`data.ts` holds only the `id` of each index item — it defines which sections exist and in what order. Labels, descriptions and section content all come from `translations.ts`. Never add content to `data.ts` — add it to both locales in `translations.ts`.

**Index ids are section anchors:** each `MENU_ITEMS` id matches the `id` of a `<section>` in `Sections/`. Choosing an item in the hero index smooth-scrolls to that section. Adding a section means adding it in `data.ts` (id), `translations.ts` (items + sections, both locales).

**Mobile hero is a native layout, not a device mockup:** desktop shows the floating screen + keyboard; mobile renders face card + typed name + MenuList directly on the page. No phone frame — a phone inside a phone hurt credibility.

**Face clips are per-breakpoint, sized to their display box.** Browsers downscale `<video>` with a cheap filter (unlike images), so an oversized clip renders visibly mushy: `face-lg.mp4` (558×720) for the desktop card, `face-sm.mp4` (224×224) for the 56px mobile avatar, with `face-poster.jpg` / `face-poster-sm.jpg` as poster + fallback for each. If the card size changes, re-encode to match — do not just reuse a bigger file. Both clips are cropped from the same portrait master (`assets/biel-presentation.mp4`, git-ignored): the desktop crop is the full frame width, the mobile crop is a tight square on the head, because at 56px only the face reads. Encode with `hqdn3d=4:3:6:4.5` before scaling and stay at CRF ≤ 24: the shirt is dark, low-contrast and grainy, and a leaner encode starves those blocks and collapses the chest gradient into a flat bright patch. The posters are the videos' own last frame (`select` on the final index), never a frame re-cut from the master — otherwise they don't match the clip.

**CVs are one PDF per locale in `/public/cv/`**, linked from `cv.href` in `translations.ts` (navbar `CvLink` + a box in the contact section). The visitor only sees the CV for the active language. The EN file is the Ireland-targeted version (no birth date or photo; it states EU citizenship instead). To update a CV, overwrite the PDF and keep the filename, which is also the name people get when they download it.

**Custom hooks live next to the component that owns them**, not in a shared `/hooks` folder.

**Language detection uses `useSyncExternalStore`**, not `useState + useEffect`. This avoids hydration mismatches (SSR always gets "en"; `getSnapshot` reads localStorage/navigator on client). Do not change this pattern — it was broken twice before landing on this solution.

## Conventions

- Comments in English only, no castellano
- No comments unless the WHY is non-obvious; never comment WHAT the code does
- No inline styles — always use CSS modules
- Hover states via `@media (hover: hover) and (pointer: fine)` (touch-safe)
- z-index values defined in `$z-indexes` map in `_variables.scss`
- Every user-visible string goes through `t` from `useLanguage()` — nothing hardcoded

### SCSS design tokens — mandatory

All spacing and font-size values must use the maps in `_variables.scss` via `map.get()`. Never write a raw pixel value that falls within 2 px of a token.

```
$size:       xs 4px · sm 8px · md 16px · lg 24px · xl 32px · xxl 48px
$font-sizes: xs 11px · sm 14px · base 16px · lg 18px · xl 40px
```

Usage pattern — every SCSS module that needs these must start with:
```scss
@use "sass:map";
@use "<relative-path>/app/styles/abstracts/variables" as vars;
// then: map.get(vars.$size, md)  /  map.get(vars.$font-sizes, xs)
```

Approximation rule: if a value is within 2 px of a token, use the token. Values that are equidistant between two tokens or are highly component-specific (e.g. SVG coordinates, border-width) stay as literals.

## What not to touch without thinking twice

- `/public/face-*.mp4|jpg` — main visual assets (see the per-breakpoint note above)
- `src/app/styles/abstracts/_variables.scss` — design tokens used everywhere
- `LanguageProvider` hydration pattern in `context.tsx` — fragile, known issues if changed

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->



# Portfolio — Biel Colom

Personal portfolio landing page: one page in two languages, English at `/` and Spanish at `/es`. Deployed on Vercel at https://www.gcolom.com (gcolom.com redirects there).

## Stack

- Next.js 16.3.1 — App Router only, no Pages Router
- React 19.2.8 + TypeScript strict
- SCSS modules — no Tailwind, no CSS-in-JS
- React Compiler enabled (`reactCompiler: true`) — no manual `useMemo`/`useCallback`.
  Runs as the native Rust port inside Turbopack via `experimental.turbopackRustReactCompiler`,
  so there is no `babel-plugin-react-compiler` dependency. The flag is Turbopack-only:
  a `--webpack` build will throw.
- Turbopack for dev and build
- three.js — the scroll-driven particle story (one `Points` draw call, custom shaders), loaded lazily
- Lenis — inertia scroll for wheel and trackpad (off under reduced motion)
- Framer Motion — scroll-linked values, springs, in-view reveals
- Dark-only design: `_themes.scss` defines a single palette, no light/dark pair

## Project structure

```
src/
├── proxy.ts                    # Locale routing (Next 16's middleware): "/" serves English, Spanish browsers go to /es
├── app/                        # Next.js App Router
│   ├── [lang]/                 # en | es, both prerendered; the root layout lives here
│   │   ├── layout.tsx          # Fonts (Hubot Sans + Mona Sans), metadata per locale, viewport, js flag, providers, cursor
│   │   ├── page.tsx            # The page: JSON-LD + SiteNav + Particles + Hero, About, Story, Panel(Projects, Stack, Education), Contact
│   │   └── opengraph-image.tsx # Link preview card per locale (1200×630, next/og); twitter-image.tsx re-exports it
│   ├── og/                     # Static Hubot Sans instances (OFL) for the card: Satori draws variable fonts at default axes only
│   ├── global-not-found.tsx    # 404 for unmatched addresses: its own document, since the root layout sits under [lang]
│   ├── global-error.tsx        # Root error boundary (replaces layout on crash)
│   ├── robots.ts, sitemap.ts   # Crawl rules; both languages with their alternates
│   ├── llms.txt/route.ts       # Markdown digest of the page for AI assistants, built from translations
│   └── styles/                 # Global SCSS: abstracts (variables, themes, mixins), base, globals
├── components/
│   ├── Hero/                   # First viewport: kinetic name (cursor pressure), portrait clip, pitch, CTAs
│   ├── Particles/              # index.tsx loads Field.tsx lazily (canvas + loop); engine.ts (three), shapes.ts, shaders.ts
│   ├── About/                  # Statement lit word by word on scroll + facts
│   ├── Story/                  # "What I do" (#experience): pinned, four skill chapters; chapters.ts is shared with Particles
│   ├── Panel/                  # Raised sheet that opens to full bleed (clip-path) over the story
│   ├── Projects/ Stack/ Education/ Contact/
│   ├── SiteNav/                # Fixed bar + full-screen menu (circle reveal, view-transition navigation)
│   ├── SmoothScroll/           # Lenis; exports scrollToTarget() and lockScroll()
│   ├── Cursor/                 # Dot + ring; states from data-cursor / data-cursor-label
│   ├── Reveal/ TextRoll/ Magnetic/ LocalTime/ Availability/ CvLink/ LangToggle/ ArrowIcon/
├── content/
│   ├── sections.ts             # Page order (ids only); ids are section anchors and menu entries
│   ├── links.ts                # Email, ready-written drafts (mailto, Gmail, Outlook) + profile links
│   ├── site.ts                 # SITE_URL, locales and their addresses (LOCALE_PATH), the locale cookie
│   └── structuredData.ts       # JSON-LD: ProfilePage + WebSite + Person
└── i18n/
    ├── context.tsx             # LanguageProvider (locale from the route) + useLanguage hook
    └── translations.ts         # EN + ES strings for every section, plus `seo` (title, description, h1, services)
```

`PRODUCT.md` (audience, positioning, confirmed facts) and `DESIGN.md` (the visual system and its named rules) sit at the repo root. Read both before UI work. The design skills in `.claude/skills/` (Impeccable, Emil Kowalski's motion skills) read them too.

Facts about Gabriel come from the sibling repo `../ai-job-search-master` (`.claude/skills/job-application-assistant/01-candidate-profile.md`, `CLAUDE.md`, `cv/generales/main_ireland.tex`, `main_spain.tex`). Its rules apply here too: "core developer since its earliest development" (never "lead"), "tens of thousands of users" (never a number), nothing about WOZZO's revenue, no testing or leadership claims beyond what it confirms, and no em-dashes in prose. The owner asked (2026-10-10) for the site to be a presentation of what he can do, not a CV: no company named as the example in the chapters, WOZZO only once (current job, About facts), Verifactu as a detail inside "critical integrations", and an explicit line for freelance projects next to job availability.

## Architecture decisions

**Single source of truth for content:**
`content/sections.ts` holds only the section ids, in page order. Labels and content come from `translations.ts`. Adding a section means: the id in `sections.ts`, a label in `items` and its content in both locales, and a `<section id>` in its component.

**The particle story is driven by the DOM, not by its own timeline.** `Particles/index.tsx` reads four elements every frame: `[data-particles="hero"]` (how far the hero has scrolled: portrait → cloud), `[data-particles="story"]` (cloud → stack, then the chapters through `chapterFloat()`), `[data-particles="stage"]` (where shapes stand and how big, measured live) and `[data-particles="exit"]` (the Panel: scatter). Shape 0 is the portrait: it has no stored positions, the vertex shader lays it out from the video's on-screen box and samples the video's colours, so the handoff from `<video>` to particles is pixel-aligned. The canvas is fixed behind `main` (z-index), so the hero, About and Story keep transparent backgrounds; the Panel and Contact are solid and cover it.

**Particles degrade.** No WebGL 2 sets `html[data-particles="off"]`: the video simply scrolls away and the story shows line drawings (`Story/ChapterArt.tsx`). Reduced motion keeps the shapes but cross-fades them without flight, idle spin or cursor push. `Particles/index.tsx` mounts `Field` (a `next/dynamic` chunk with three.js, shapes and shaders) 1.4s after first paint, when idle. Inside the chunk every import is static, so editing any engine file hot-reloads into a fresh engine instead of leaving an old one running in an open tab.

**Chapters swap at the middle of each morph.** `Story/chapters.ts` maps pinned-scroll progress to a chapter position; the text (`activeChapter`) and the shapes (`chapterFloat`) both read it, so they cannot drift apart.

**Content is visible without the client.** An inline script in `[lang]/layout.tsx` adds `.js` before first paint; reveal styles only hide content under `.js`. `SmoothScroll` sets `data-ready` on mount; if it never does, the script withdraws `.js` after 5s.

**Hero clip:** `hero-lg.mp4` (720×960) and `hero-sm.mp4` (480×640, phones via `<source media>`), both `crop=1080:1440:0:0` of the master (`assets/biel-presentation.mp4`, git-ignored), `hqdn3d=3:3:5:4`, CRF 21/22, no audio. `hero-first.jpg` is the poster; `hero-last.jpg` is the resting frame for reduced motion, blocked autoplay, the particle texture fallback and the link preview card. Posters are the encoded clip's own frames (`select=eq(n\,0)` / `eq(n\,96)`), never re-cut from the master. The portrait box is 3:4; if it changes, re-encode rather than reuse a bigger file. The clip is started from script (`video.play()`), not `autoPlay`: React does not render `muted` into the server HTML.

**Contact is a click and a few blanks.** `mailto()` in `content/links.ts` builds emails that open already written (subject and body, CRLF line breaks). The hero, the menu and the contact email use the generic draft `t.mail`; under the contact headline, `t.contact.intents` holds one draft for a role and one for a project, with bracketed gaps to fill. On phones (`FINE_POINTER` false) they are plain mailto links. On computers mailto often leads nowhere (no mail app set up, or one since uninstalled; the owner's own Windows was like that), so a click opens a chooser instead: Gmail and Outlook web compose (`gmailCompose`, `outlookCompose`), the mail app, or copy the address; the hero's "Email me" and the menu's email jump to the contact block with the page transition (`jumpTo` in SmoothScroll). Copy email stays beside them, and once a mailto has been tried a line points to it.

**CVs are one PDF per locale in `/public/cv/`**, linked from `cv.href` in `translations.ts` (bar `CvLink`, the hero's "View CV" button and a row in the contact links). The EN file is the Ireland-targeted version (no birth date or photo; it states EU citizenship instead). To update a CV, overwrite the PDF and keep the filename.

**Page transitions:** the language toggle and the menu's links use `document.startViewTransition` with a WAAPI clip-path on `::view-transition-new(root)` (circle from the toggle; wipe up for navigation). Without support, or under reduced motion, they swap in place.

**Custom hooks live next to the component that owns them**, not in a shared `/hooks` folder.

**Language lives in the URL.** English is `/` and Spanish `/es`, both prerendered by `app/[lang]` (`generateStaticParams`, `dynamicParams = false`), so each language is indexed at its own address and the server HTML is already in the right language: no client detection, no hydration mismatch. `proxy.ts` rewrites `/` to `/en` internally, redirects `/en` to `/` (308), and sends a visit to `/` from a Spanish or Catalan browser to `/es` (307). Once the visitor uses the toggle, the `locale` cookie overrules the browser. `LanguageProvider` starts from the route's locale; the toggle swaps the strings in place (inside the view transition), sets the cookie, `document.title` and `<html lang>`, and rewrites the address with `history.replaceState`, passing `history.state` through because the router keeps its own state there. This replaced the earlier `useSyncExternalStore` + localStorage detection on 2026-10-10 (owner's request: a Spanish page that search engines can index).

**Search engines and AI assistants read the same facts as visitors.** `generateMetadata` in `[lang]/layout.tsx` builds title, description, canonical, hreflang (`en`, `es`, `x-default` → `/`) and Open Graph from `t.seo`; `[lang]/opengraph-image.tsx` draws the preview card (name, role, availability, `hero-last.jpg`) from the same strings, prerendered for both locales. `[lang]/page.tsx` embeds JSON-LD from `content/structuredData.ts`: a `ProfilePage` whose main entity is the `Person` (job title, skills, languages, education, profiles in `sameAs`, freelance services in `makesOffer`). `robots.ts` lets every crawler in, AI ones included; `sitemap.ts` lists both languages; `/llms.txt` is a Markdown digest. All of it reads `translations.ts` and `LOCALE_PATH`, so a fact or an address changes everywhere at once. The visible name is decorative (aria-hidden letters); the page's one `<h1>` is visually hidden and carries `t.seo.h1` (name, role, city).

**The raw HTML has to read like the page.** AI crawlers mostly take the server HTML without CSS or script. `TextRoll` draws both faces of each letter with CSS from `data-glyph`, so a label is text once; pieces set on separate lines (title lines, marquee items, the hero name) keep a space between them, which never renders between block or flex items but stops words running together.

## Conventions

- Comments in English only, no castellano
- No comments unless the WHY is non-obvious; never comment WHAT the code does
- No inline styles — always use CSS modules (runtime values set from JS, such as motion values and the particle canvas, are the exception; `global-error.tsx` and `global-not-found.tsx` too, since they render without the site's layout and stylesheets)
- Hover states via `@media (hover: hover) and (pointer: fine)` (touch-safe)
- z-index values defined in `$z-indexes` map in `_variables.scss`
- Every user-visible string goes through `t` from `useLanguage()` — nothing hardcoded

### SCSS design tokens — mandatory

All spacing and font-size values must use the maps in `_variables.scss` via `map.get()`. Never write a raw pixel value that falls within 2 px of a token.

```
$size:       xs 4px · sm 8px · md 16px · lg 24px · xl 32px · xxl 48px
$font-sizes: xs 12px · sm 14px · base 16px · lg 20px · xl 40px
$display:    name · contact · statement · section · chapter · project · marquee · entry · email (fluid clamps)
```

Usage pattern — every SCSS module that needs these must start with:
```scss
@use "sass:map";
@use "<relative-path>/app/styles/abstracts/variables" as vars;
// then: map.get(vars.$size, md)  /  map.get(vars.$font-sizes, xs)  /  map.get(vars.$display, section)
```

Approximation rule: if a value is within 2 px of a token, use the token. Values that are equidistant between two tokens or are highly component-specific (e.g. SVG coordinates, border-width) stay as literals.

Colors live in `$colors` and are emitted as CSS custom properties by `_themes.scss` (`var(--bone)`, `var(--line)`…); easings as `var(--ease-out)`, `var(--ease-expo)`, `var(--ease-in-out)`. Never hand-type a hex that a token covers. Small text never goes darker than `--text-subtle` (#8a857c), the last step that clears 4.5:1 on ink and ink-raised. `--signal` (green) is for availability only. Mixins in `abstracts/_mixins.scss`: `button-primary`, `button-secondary`, `label` (uppercase chrome), `meta` (case-preserving tags), `display`, `visually-hidden`, `phone`, `tablet-down`, `hover`.

### Motion

The story is the one authored sequence: the hero's load (letters rising, the portrait's clip-path reveal), then the scroll from portrait to particles through the four chapters. Elsewhere, reveals are quiet and varied (word masks, drawn hairlines, a drawn timeline). Every movement has a `prefers-reduced-motion` branch that keeps opacity and drops the transform. Blinking or pulsing elements stop within 5 seconds (WCAG 2.2.2). Animate Framer values with full `transform` strings, not `x`/`y`/`scale` shorthands.

## What not to touch without thinking twice

- `/public/hero-*.mp4|jpg` — main visual assets (see the clip note above)
- `src/app/styles/abstracts/_variables.scss` — design tokens used everywhere
- Locale routing: `proxy.ts`, `content/site.ts` and the `[lang]` segment move together; canonical, hreflang, the sitemap, `llms.txt` and the JSON-LD all derive from `LOCALE_PATH`
- `GROUP` and `TILT` in `Particles/shapes.ts` — the vertex shader matches them by number; change both sides together

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

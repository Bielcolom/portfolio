

# Portfolio — Biel Colom

Personal portfolio landing page. Single route (`/`), deployed on Vercel.

## Stack

- Next.js 16.2.5 — App Router only, no Pages Router
- React 19.2.0 + TypeScript strict
- SCSS modules — no Tailwind, no CSS-in-JS
- React Compiler enabled (`reactCompiler: true`) — no manual `useMemo`/`useCallback`
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

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: C:\Users\Biel\Documents\Projects\PersonalProjects\portfolio\node_modules\next\dist\docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output CLAUDE.md|01-app:{04-glossary.md}|01-app/01-getting-started:{01-installation.md,02-project-structure.md,03-layouts-and-pages.md,04-linking-and-navigating.md,05-server-and-client-components.md,06-fetching-data.md,07-mutating-data.md,08-caching.md,09-revalidating.md,10-error-handling.md,11-css.md,12-images.md,13-fonts.md,14-metadata-and-og-images.md,15-route-handlers.md,16-proxy.md,17-deploying.md,18-upgrading.md}|01-app/02-guides:{ai-agents.md,analytics.md,authentication.md,backend-for-frontend.md,caching-without-cache-components.md,cdn-caching.md,ci-build-caching.md,content-security-policy.md,css-in-js.md,custom-server.md,data-security.md,debugging.md,deploying-to-platforms.md,draft-mode.md,environment-variables.md,forms.md,how-revalidation-works.md,incremental-static-regeneration.md,instant-navigation.md,instrumentation.md,internationalization.md,json-ld.md,lazy-loading.md,local-development.md,mcp.md,mdx.md,memory-usage.md,migrating-to-cache-components.md,multi-tenant.md,multi-zones.md,open-telemetry.md,package-bundling.md,ppr-platform-guide.md,prefetching.md,preserving-ui-state.md,production-checklist.md,progressive-web-apps.md,public-static-pages.md,redirecting.md,rendering-philosophy.md,sass.md,scripts.md,self-hosting.md,single-page-applications.md,static-exports.md,streaming.md,tailwind-v3-css.md,third-party-libraries.md,videos.md,view-transitions.md}|01-app/02-guides/migrating:{app-router-migration.md,from-create-react-app.md,from-vite.md}|01-app/02-guides/testing:{cypress.md,jest.md,playwright.md,vitest.md}|01-app/02-guides/upgrading:{codemods.md,version-14.md,version-15.md,version-16.md}|01-app/03-api-reference:{07-edge.md,08-turbopack.md}|01-app/03-api-reference/01-directives:{use-cache-private.md,use-cache-remote.md,use-cache.md,use-client.md,use-server.md}|01-app/03-api-reference/02-components:{font.md,form.md,image.md,link.md,script.md}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.md,manifest.md,opengraph-image.md,robots.md,sitemap.md}|01-app/03-api-reference/03-file-conventions/02-route-segment-config:{dynamicParams.md,instant.md,maxDuration.md,preferredRegion.md,runtime.md}|01-app/03-api-reference/03-file-conventions:{default.md,dynamic-routes.md,error.md,forbidden.md,instrumentation-client.md,instrumentation.md,intercepting-routes.md,layout.md,loading.md,mdx-components.md,not-found.md,page.md,parallel-routes.md,proxy.md,public-folder.md,route-groups.md,route.md,src-folder.md,template.md,unauthorized.md}|01-app/03-api-reference/04-functions:{after.md,cacheLife.md,cacheTag.md,catchError.md,connection.md,cookies.md,draft-mode.md,fetch.md,forbidden.md,generate-image-metadata.md,generate-metadata.md,generate-sitemaps.md,generate-static-params.md,generate-viewport.md,headers.md,image-response.md,next-request.md,next-response.md,not-found.md,permanentRedirect.md,redirect.md,refresh.md,revalidatePath.md,revalidateTag.md,unauthorized.md,unstable_cache.md,unstable_noStore.md,unstable_rethrow.md,updateTag.md,use-link-status.md,use-params.md,use-pathname.md,use-report-web-vitals.md,use-router.md,use-search-params.md,use-selected-layout-segment.md,use-selected-layout-segments.md,userAgent.md}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.md,allowedDevOrigins.md,appDir.md,assetPrefix.md,authInterrupts.md,basePath.md,cacheComponents.md,cacheHandlers.md,cacheLife.md,compress.md,crossOrigin.md,cssChunking.md,deploymentId.md,devIndicators.md,distDir.md,env.md,expireTime.md,exportPathMap.md,generateBuildId.md,generateEtags.md,headers.md,htmlLimitedBots.md,httpAgentOptions.md,images.md,incrementalCacheHandlerPath.md,inlineCss.md,logging.md,mdxRs.md,onDemandEntries.md,optimizePackageImports.md,output.md,pageExtensions.md,poweredByHeader.md,productionBrowserSourceMaps.md,proxyClientMaxBodySize.md,reactCompiler.md,reactMaxHeadersLength.md,reactStrictMode.md,redirects.md,rewrites.md,sassOptions.md,serverActions.md,serverComponentsHmrCache.md,serverExternalPackages.md,staleTimes.md,staticGeneration.md,taint.md,trailingSlash.md,transpilePackages.md,turbopack.md,turbopackFileSystemCache.md,turbopackIgnoreIssue.md,typedRoutes.md,typescript.md,urlImports.md,useLightningcss.md,viewTransition.md,webVitalsAttribution.md,webpack.md}|01-app/03-api-reference/05-config:{02-typescript.md,03-eslint.md}|01-app/03-api-reference/06-cli:{create-next-app.md,next.md}|01-app/03-api-reference/07-adapters:{01-configuration.md,02-creating-an-adapter.md,03-api-reference.md,04-testing-adapters.md,05-routing-with-next-routing.md,06-implementing-ppr-in-an-adapter.md,07-runtime-integration.md,08-invoking-entrypoints.md,09-output-types.md,10-routing-information.md,11-use-cases.md}|02-pages/01-getting-started:{01-installation.md,02-project-structure.md,04-images.md,05-fonts.md,06-css.md,11-deploying.md}|02-pages/02-guides:{analytics.md,authentication.md,babel.md,ci-build-caching.md,content-security-policy.md,css-in-js.md,custom-server.md,debugging.md,draft-mode.md,environment-variables.md,forms.md,incremental-static-regeneration.md,instrumentation.md,internationalization.md,lazy-loading.md,mdx.md,multi-zones.md,open-telemetry.md,package-bundling.md,post-css.md,preview-mode.md,production-checklist.md,redirecting.md,sass.md,scripts.md,self-hosting.md,static-exports.md,tailwind-v3-css.md,third-party-libraries.md}|02-pages/02-guides/migrating:{app-router-migration.md,from-create-react-app.md,from-vite.md}|02-pages/02-guides/testing:{cypress.md,jest.md,playwright.md,vitest.md}|02-pages/02-guides/upgrading:{codemods.md,version-10.md,version-11.md,version-12.md,version-13.md,version-14.md,version-9.md}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.md,02-dynamic-routes.md,03-linking-and-navigating.md,05-custom-app.md,06-custom-document.md,07-api-routes.md,08-custom-error.md}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.md,02-static-site-generation.md,04-automatic-static-optimization.md,05-client-side-rendering.md}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.md,02-get-static-paths.md,03-forms-and-mutations.md,03-get-server-side-props.md,05-client-side.md}|02-pages/03-building-your-application/06-configuring:{12-error-handling.md}|02-pages/04-api-reference:{06-edge.md,08-turbopack.md}|02-pages/04-api-reference/01-components:{font.md,form.md,head.md,image-legacy.md,image.md,link.md,script.md}|02-pages/04-api-reference/02-file-conventions:{instrumentation.md,proxy.md,public-folder.md,src-folder.md}|02-pages/04-api-reference/03-functions:{get-initial-props.md,get-server-side-props.md,get-static-paths.md,get-static-props.md,next-request.md,next-response.md,use-params.md,use-report-web-vitals.md,use-router.md,use-search-params.md,userAgent.md}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.md,allowedDevOrigins.md,assetPrefix.md,basePath.md,bundlePagesRouterDependencies.md,compress.md,crossOrigin.md,deploymentId.md,devIndicators.md,distDir.md,env.md,exportPathMap.md,generateBuildId.md,generateEtags.md,headers.md,httpAgentOptions.md,images.md,logging.md,onDemandEntries.md,optimizePackageImports.md,output.md,pageExtensions.md,poweredByHeader.md,productionBrowserSourceMaps.md,proxyClientMaxBodySize.md,reactStrictMode.md,redirects.md,rewrites.md,serverExternalPackages.md,trailingSlash.md,transpilePackages.md,turbopack.md,typescript.md,urlImports.md,useLightningcss.md,webVitalsAttribution.md,webpack.md}|02-pages/04-api-reference/04-config:{01-typescript.md,02-eslint.md}|02-pages/04-api-reference/05-cli:{create-next-app.md,next.md}|02-pages/04-api-reference/06-adapters:{01-configuration.md,02-creating-an-adapter.md,03-api-reference.md,04-testing-adapters.md,05-routing-with-next-routing.md,06-implementing-ppr-in-an-adapter.md,07-runtime-integration.md,08-invoking-entrypoints.md,09-output-types.md,10-routing-information.md,11-use-cases.md}|03-architecture:{accessibility.md,fast-refresh.md,nextjs-compiler.md,supported-browsers.md}|04-community:{01-contribution-guide.md,02-rspack.md}<!-- NEXT-AGENTS-MD-END -->

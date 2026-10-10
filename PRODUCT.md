# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters, hiring managers and tech leads in Ireland and in Spain, weighted equally. English and Spanish are both first-class: neither locale is a translation of the other. They arrive from a CV, a job application or LinkedIn, often on a phone, and decide within about thirty seconds whether to open the CV or get in touch.

Also, since 2026-10-10: people who want a website, web app or mobile app built (freelance). They judge the same way, by what he can do and how the site itself is made, and they act by writing to him rather than opening the CV.

## Product Purpose

Personal portfolio of Gabriel Colom Moll, full-stack developer, built to land his next role and freelance projects. It is a presentation of what he can do, not a CV: the CV is one click away for whoever needs the history. Success means a visitor leaves knowing who he is, what he can build, that he is available, and how to reach him, and has opened the CV or the contact links.

## Positioning

Two things a neighbouring portfolio cannot truthfully copy:

- He has owned the user experience of WOZZO's HR platform since its earliest stages; it is the company's most important product, used by tens of thousands of people, and he ships critical integrations on it end to end (Stripe payments, SSO, Verifactu under a legal deadline).
- The site itself is the evidence of his interface judgement. Its craft is the claim, so every detail on it is part of the pitch.

## Operating Context

- Visitors come from applications, LinkedIn and shared links; desktop at work and mobile in the LinkedIn app are both common.
- One CV PDF per locale in `/public/cv/`. The English CV is the Ireland-targeted version: no birth date or photo, and it states EU citizenship.
- Currently based in Palma de Mallorca, working full time at WOZZO while completing a Computer Engineering degree at UOC.

## Capabilities and Constraints

- Single route (`/`), Next.js App Router, SCSS modules with design tokens, dark-only, deployed on Vercel.
- Every user-visible string lives in `src/i18n/translations.ts`, in both locales.
- Availability (confirmed 2026-10-10): open to new roles in Ireland (happy to relocate), in Spain, or remote, and to freelance projects (websites, web apps, mobile apps). He is an EU citizen, which the English locale states because it removes the visa question for Irish employers; the Spanish locale omits it.

## Brand Commitments

- Name: Gabriel Colom Moll. Role: full-stack developer (confirmed 2026-10-10; the site previously mixed "frontend" and "full-stack").
- Portrait video and posters of his face are the site's main visual assets.
- Availability for a new role and for freelance work is stated explicitly, not implied.
- Capabilities lead, the employer does not (owner, 2026-10-10): the "what I do" chapters describe what he can do, with no company named as the example. WOZZO appears once, as his current job in the About facts; JornAda and FacturAda are not named; Verifactu is a detail inside "critical integrations".
- The editor-and-keyboard hero was replaced on 2026-10-10, at the owner's request, by "Made of the work": the portrait dissolves into 3D particles that form what he has built. The owner asked for current landing techniques (scroll reveals, scrollytelling, kinetic type, interactive 3D, cursor effects, clip-path masks, page transitions).

## Evidence on Hand

Source of truth: the sibling repo `ai-job-search-master` (candidate profile and the Ireland and Spain CVs). Its wording rules bind this site.

- Experience: WOZZO, Full Stack Developer, March 2024 to present, hybrid in Palma. Core developer on JornAda (time tracking, leave, HR administration) since its earliest development; designed and built JornAda's AI assistant (answers from the product database, executes actions such as assigning a schedule to a team, schedules plain-language reports by email and in-app); integrated Verifactu into FacturAda under a legal deadline (many thousands of invoices); Stripe, SSO, i18n; ships the React Native and Expo apps, sharing logic, hooks, API clients, types and design tokens with the web; onboards intern developers; contributes to CI/CD with GitHub Actions.
- Projects: Music Social Platform (its business plan won 3rd Prize, PalmaActiva 2024; now being built), a public Next.js 15 + React 19 template, a Spotify clone (Redux), this portfolio.
- Education: Computer Engineering at UOC (in progress), ASIR (2022 to 2024), scientific-technical baccalaureate (2018 to 2020); Udemy courses in probability for ML and linear algebra; introduction to Python.
- Languages: Spanish and Catalan (native), English (intermediate), as stated on the CVs.
- CVs (EN, ES), GitHub (`Bielcolom`), LinkedIn (`gabriel-colom-moll`), email.
- Absent, and must not be fabricated: testimonials, case studies, product screenshots of WOZZO work, metrics beyond "tens of thousands of users".

## Product Principles

1. The site is the proof. Craft is the claim, so any rough detail undermines the pitch more than a missing feature would.
2. Never make a visitor guess. Who he is, what he does, that he is available and how to reach him are findable within seconds on any device.
3. Bilingual parity. Both locales get the same care, length and tone.
4. Truth over flourish. Only real facts, real projects and real numbers.

## Accessibility & Inclusion

WCAG 2.1 AA. Motion respects `prefers-reduced-motion`; the keyboard-driven hero must stay usable with keyboard only and with a screen reader.

---
name: Gabriel Colom Moll — Portfolio
description: A full-stack developer's portfolio where his portrait dissolves into the things he has built.
colors:
  ink: "#0b0a09"
  ink-raised: "#141311"
  bone: "#efebe4"
  text-body: "#c8c3ba"
  text-muted: "#a6a197"
  text-subtle: "#8a857c"
  signal: "#5fe08f"
  line-soft: "rgba(239, 235, 228, 0.07)"
  line: "rgba(239, 235, 228, 0.13)"
  line-strong: "rgba(239, 235, 228, 0.26)"
typography:
  name:
    fontFamily: "Hubot Sans, Arial, sans-serif"
    fontSize: "clamp(64px, 12vw, 232px)"
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: "-0.035em"
  section:
    fontFamily: "Hubot Sans, Arial, sans-serif"
    fontSize: "clamp(44px, 6.4vw, 96px)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  statement:
    fontFamily: "Hubot Sans, Arial, sans-serif"
    fontSize: "clamp(28px, 3.5vw, 58px)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Mona Sans, Arial, sans-serif"
    fontSize: "16px–20px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Hubot Sans, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
  meta:
    fontFamily: "Hubot Sans, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  button: "999px"
  panel-entry: "40px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    height: "52px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    border: "1px solid {colors.line-strong}"
    rounded: "{rounded.button}"
    height: "52px"
---

# Design System: Gabriel Colom Moll — Portfolio

## Overview

**Creative North Star: "Made of the work"**

The first viewport is a poster: his name set across the page in two lines, the portrait standing between them. The first line sits behind the portrait, the second crosses in front and inverts over the light wall. The clip plays once: he steps forward, crosses his arms and smiles.

Scroll, and the portrait comes apart into about twenty thousand particles. They drift as a cloud behind a statement that lights up word by word, then form, one chapter at a time, what he can do: a three-layer stack (interface, API, data) with traffic running between the plates, the assistant mid-reply with its sparkle, a phone and a browser with data running between them, a payment card with the padlock of a secure sign-in. A raised sheet then slides over the stage and opens to full bleed for the record: projects, stack, education. It ends as it began, on rounded corners, and the close follows on ink, asking the two questions the site answers: a new role, or a new project.

Warm monochrome. The portrait is the only real colour on the page, and the particles carry that colour only while they are still him.

The visual rejections stand from the owner's history: no device mockup inside a phone, no light theme, no generic card grid. The previous editor-and-keyboard concept was replaced on 2026-10-10 because it read as dated.

**Key Characteristics:**
- Bone on warm near-black, no accent hue; a single green light means "open to new roles" and nothing else.
- Hubot Sans for everything that speaks at size, Mona Sans for reading. Both are variable on weight and width; the name's letters swell on both axes near the mouse.
- One fixed WebGL canvas behind the transparent first half of the page; the second half is solid.
- One authored story, scroll-driven from the hero to the end of experience; the rest of the page reveals quietly.

## Colors

### Neutral
- **Ink** (`ink`): the page.
- **Ink Raised** (`ink-raised`): the sheet that carries projects, stack and education, and the open menu.
- **Bone** (`bone`): the name, headings, the primary button, particles once they leave the portrait.
- **Body** (`text-body`), **Muted** (`text-muted`), **Subtle** (`text-subtle`): the text ramp.
- **Lines** (`line-soft`, `line`, `line-strong`): hairlines and outlines.

### Signal
- **Signal Green** (`signal`): the availability light only.

### Named Rules
**The Subtle Floor Rule.** No text is darker than Subtle (#8a857c). It is the last step that clears 4.5:1 on both Ink and Ink Raised.

**The Portrait Owns The Colour Rule.** Nothing else on the page is coloured. Particles sample the video while they sit on it and cool to bone as they leave.

**The One Fill Rule.** In any view, one control is filled with bone: View CV in the hero. Everything else is outlined or text.

## Typography

**Display:** Hubot Sans (variable wght 200–900, wdth 75–125)
**Text:** Mona Sans (variable wght 200–900, wdth 75–125)

### Hierarchy
- **Name** (700, 12vw, 0.8, uppercase): the hero only. Cursor pressure takes letters up to wght 900 / wdth 125.
- **Section** (700, wdth 105%, up to 96px): section titles, the menu's links.
- **Chapter** (700, up to 76px), **Project** (700, up to 72px), **Statement** (600, up to 58px).
- **Body** (Mona Sans 400, 16–20px, 1.5, max ~46ch).
- **Label** (Hubot 500, 12px, uppercase, 0.08em): chrome only, such as the clock, meta lines, fact labels.
- **Meta** (Hubot 500, 14px, case kept): tags and tech lists, so JornAda, FacturAda and i18n keep their spelling.

### Named Rules
**The Case Is Content Rule.** Product names are never uppercased. Labels may be; tags and tech lists may not.

**The Skills Lead Rule.** The story is told as capabilities (end to end, AI that acts, web and mobile, critical integrations), described as what he does, never as what a company did. The employer appears once, as his current job in the About facts.

## Motion

- **Load (the one choreographed entrance):** the name's letters rise from their line masks 45ms apart, the portrait opens from the bottom with a clip-path while the clip settles from 1.25×, the pitch, buttons and availability follow. CSS only, so it runs without the client.
- **The story (scroll-driven):** portrait → cloud (as the hero scrolls away) → stack → assistant → devices → card (pinned, four chapters of 80svh) → scatter (as the sheet arrives). Particles leave on staggered beats with a swirl in flight. Drag the stage to turn the shape; the cursor pushes particles aside; touch pushes where the finger lands.
- **Statement:** each word's opacity follows the scroll.
- **Reveals:** headings rise word by word from masks; project rows draw their hairline then raise the name; education entries slide in beside a line that draws itself; the marquees drift and lean with scroll speed.
- **Transitions:** the menu grows from its button as a circle; choosing an entry wipes the destination up over the menu (View Transitions); switching language grows the other language out of the toggle as a circle; the projects sheet opens from an inset rounded rectangle to full bleed and closes on rounded bottom corners (40px, 24px on phones). Nothing slides under its edge: content that hides behind a sheet reads as a cut mid-scroll.
- **Cursor:** a dot plus a trailing ring. The ring fills over controls, becomes a 168px inverting lens over the name, and carries a label over the stage ("Drag") and the source link ("Open"). Mouse only.
- **Reduced motion:** no smooth scroll, no custom cursor, no cursor pressure, no letter or clip movement (opacity only); particles cross-fade between shapes without flight; marquees stand still; the hero shows the clip's last frame.

## Layout

The hero is a fixed composition sized from the viewport (`--portrait-h: min(64svh, 38vw)`), with the first line clear of the portrait so the whole name reads. Below 900px it stacks: first line, portrait, second line overlapping the portrait's bottom, then role and place on two lines, pitch, buttons, availability. The stacked portrait follows the screen's height (`clamp(200px, 36svh, 78vw)`) so the buttons stay in the first view on short phones (iPhone SE included).

The story is a pinned 100svh view: text left, stage right (stacked on phones, the stage taking whatever height the text leaves). The particles measure the stage's DOM box every frame, so the layout decides where the shapes stand.

Content after the story lives on one raised sheet; the close is full-height on ink.

## Components

- **Buttons:** pills, 52px in the hero, 44px elsewhere. Primary is filled bone; secondary is outlined and fills bone from the bottom on hover. Labels roll to a second copy on hover. Hero buttons are magnetic. Press: scale 0.97.
- **Availability:** the green light (two rings on load, then still) with status, places and eligibility; a compact status-only form sits in the bar on wide screens.
- **Bar:** monogram, Palma's live clock, availability, CV, EN/ES, Menu. On phones the clock goes and the menu is its icon alone, so the availability light always fits; between 601 and 1100px the light gives way to the centred clock. Blends with `difference`; hides on scroll down, returns on scroll up; a 2px progress line runs along the top.
- **Menu:** full-screen on Ink Raised; huge links with rolling labels; email, profiles and availability beside them.
- **Contact answers:** two large outlined pills under the contact question ("A new role", "A new project"), 64px, magnetic, arrow nudging on hover. Each opens a pre-written email; a quiet line beneath says so. On a computer the click keeps the pill filled and opens a row beneath it instead: Gmail, Outlook, the mail app, copy the address, as 40px outlined pills.

## Do's and Don'ts

### Do:
- **Do** take colours from the tokens and spacing and type sizes from the maps in `_variables.scss`.
- **Do** keep the hero, statement and story backgrounds transparent: the particle canvas lives behind them.
- **Do** give every movement a reduced-motion branch that keeps opacity and drops the transform.
- **Do** re-encode the hero clip to its box (3:4) instead of reusing a larger file.

### Don't:
- **Don't** add a second hue. Status green is reserved for availability.
- **Don't** uppercase product names or tags.
- **Don't** put a device mockup inside a phone.
- **Don't** stack another WebGL moment on the page; the story is the one.

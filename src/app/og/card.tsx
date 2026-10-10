import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LOCALES, PageKey, isLocale } from "@/content/site";
import { translations } from "@/i18n/translations";

/* The link preview card, shared by every page's opengraph-image and
   twitter-image routes; each page picks which availability it states */

/* A route handler takes its params from its own generateStaticParams, never
   from the [lang] layout: without this the cards would render on demand */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/* English for both languages: a per-locale alt needs generateImageMetadata,
   which cannot sit beside generateStaticParams and would leave [lang] unprerendered */
export const cardAlt = (page: PageKey) => {
  const { en } = translations;
  const { status, where } = page === "services" ? en.services.availability : en.availability;
  return `Gabriel Colom Moll, ${en.meta.role.toLowerCase()} in ${en.meta.location}, beside a portrait of him smiling with his arms crossed. ${status}: ${where}.`;
};
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Satori reads only inline styles and literal colours, so the tokens from
   _variables.scss are repeated here */
const INK = "#0b0a09";
const BONE = "#efebe4";
const TEXT_MUTED = "#a6a197";
const TEXT_SUBTLE = "#8a857c";
const SIGNAL = "#5fe08f";

const EDGE = 48;
const PORTRAIT = { width: 400, height: 534 };
/* "COLOM MOLL" sets 6.86em wide: at 95px it stops one EDGE short of the portrait */
const NAME_SIZE = 95;
const LABEL_SIZE = 22;
const LABEL_LINE = 1.4;
const LABEL_TRACKING = LABEL_SIZE * 0.08;
const DOT = 5;
const DOT_SPACE = 12;

/* Static instances of Hubot Sans from Google Fonts (OFL, licence beside them):
   Satori draws a variable font at its default axes only */
const [bold, medium, portrait] = await Promise.all([
  readFile(join(process.cwd(), "src/app/og/HubotSans-Bold.ttf")),
  readFile(join(process.cwd(), "src/app/og/HubotSans-Medium.ttf")),
  readFile(join(process.cwd(), "public/hero-last.jpg"), "base64"),
]);

const label = {
  fontSize: LABEL_SIZE,
  fontWeight: 500,
  letterSpacing: LABEL_TRACKING,
  lineHeight: LABEL_LINE,
  textTransform: "uppercase",
} as const;

/** The hero's name and its last frame, with role and availability: for a
    role on the home page, for clients on the services page */
export async function card(params: Promise<{ lang: string }>, page: PageKey) {
  const { lang } = await params;
  if (!isLocale(lang)) return new Response(null, { status: 404 });
  const t = translations[lang];
  const availability = page === "services" ? t.services.availability : t.availability;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          gap: EDGE,
          width: "100%",
          height: "100%",
          padding: EDGE,
          background: INK,
          fontFamily: "Hubot Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                /* At line-height 0.8 the cap top sits 0.056em under the line box:
                   lifted, it lines up with the portrait's top edge */
                marginTop: NAME_SIZE * -0.056,
                fontSize: NAME_SIZE,
                fontWeight: 700,
                lineHeight: 0.8,
                letterSpacing: NAME_SIZE * -0.035,
                textTransform: "uppercase",
                color: BONE,
              }}
            >
              <span>Gabriel</span>
              {/* The hero's wider word space: at this tracking the font's own reads as one word */}
              <div style={{ display: "flex", gap: NAME_SIZE * 0.28 }}>
                <span>Colom</span>
                <span>Moll</span>
              </div>
            </div>
            {/* Too long for one line (Spanish is), it breaks at the seam as the hero
                does on phones: the dot hangs off the place's left edge and is cut
                away with it. The role's trailing letter-spacing counts as space */}
            <div
              style={{
                ...label,
                display: "flex",
                flexWrap: "wrap",
                columnGap: DOT_SPACE - LABEL_TRACKING + DOT + DOT_SPACE,
                overflow: "hidden",
                marginTop: 32,
                color: TEXT_MUTED,
              }}
            >
              <span>{t.meta.role}</span>
              <span style={{ display: "flex", position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: -(DOT_SPACE + DOT),
                    top: (LABEL_SIZE * LABEL_LINE - DOT) / 2,
                    width: DOT,
                    height: DOT,
                    borderRadius: DOT,
                    background: TEXT_SUBTLE,
                  }}
                />
                {t.meta.location}
              </span>
            </div>
          </div>

          {/* Pulls the last baseline onto the portrait's bottom edge: the line box
              runs 0.315em below the baseline */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: LABEL_SIZE * -0.315 }}>
            <span style={{ flexShrink: 0, width: 14, height: 14, marginTop: 9, borderRadius: 14, background: SIGNAL }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ ...label, color: BONE, textWrap: "balance" }}>{availability.status}</span>
              <span style={{ ...label, color: TEXT_MUTED }}>{availability.where}</span>
            </div>
          </div>
        </div>

        <img
          src={`data:image/jpeg;base64,${portrait}`}
          alt=""
          width={PORTRAIT.width}
          height={PORTRAIT.height}
          style={{ objectFit: "cover" }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Hubot Sans", data: bold, weight: 700, style: "normal" },
        { name: "Hubot Sans", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}

# Freaky Mack Studios — website

The Freaky Mack Studios site, built from the approved Option A ("Story") designs in `design/`. It's a Next.js static site: every page is pre-rendered, so it deploys to Vercel or any static host.

## The client

- **Freaky Mack Studios** began as six years of advertising filmmaking at Freaky Mack and is now a larger creative studio for commercial, narrative and digital storytelling.
- **Final approver:** Izaan Khan, Founder & Creative Producer · freakymackstudios@gmail.com · +91 97115 42274.
- **Past clients:** McDonald's, Google, Adidas Originals, Mercedes-Benz, Fila, PC Jewellers, Times of India.
- **Look:** minimal, premium, clean. Black & white with one accent (Cobalt `#1F3BFF`), and moderate, smooth motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → out/
npm start          # serve out/ locally (unknown URLs get the 404 page)
npm run lint
```

Checks (Playwright with the preinstalled Chromium; run against `npm run dev` or `npm start`):

```bash
npm run shoot -- [route …] [--widths 1440,390] [--out dir] [--base url]   # screenshots; fails on overflow or console errors
npm run check -- [--base url]                                             # interactions, theme, contrast sweep of every page
node scripts/compare.mjs design/screenshots/02-Work.jpg shots/work-1440.png cmp   # board vs render, side by side
```

## Pages

| Route | Board | What it does |
|---|---|---|
| `/` | `Main` | Home: the chapter-by-chapter story. The sentence builder hands its answers to `/start-a-project`. |
| `/work` | `Work` | Filter chips (a radio group) re-flow two staggered, tilted columns. |
| `/work/[slug]` | `Project` | Case-study template, one static page per project: play toggle, credits, brief/idea/on screen, stills, next project. |
| `/studio` | `Studio` | Story, timeline, beliefs, services, process, client stickers. |
| `/originals` | `Originals` | Featured podcast player and episode list share one "now playing" state; slate; "Pitch us". |
| `/people` | `People` | Founder, crew grid, collaborators, "Email your reel". |
| `/start-a-project` | `Contact` | Enquiry form: four chip radio groups drive a live sentence; `?fmt=&who=` pre-fills them; name, email and brief are validated. |
| `/thanks` | `Thanks` | Shown after sending. The footer signs off "Cut. Print. Talk soon." |
| 404 | `NotFound` | Any unknown URL (`404.html` in the export). |
| `/privacy`, `/terms` | `Privacy`, `Terms` | Legal drafts with an "On this page" nav. |

`SiteNav` and `SiteFooter` wrap every page except Home, which keeps its own per the Main board. Old pitch links (`/option-a/` … `/option-d/`) redirect to `/`.

## Where things live

`design/` holds the approved boards (`boards/*.dc.html`, the source of truth for layout and copy) and their 1440px renders (`screenshots/`); `CLAUDE.md` has the build instructions.

```
src/
├── app/
│   ├── page.tsx, _components/     Home
│   ├── (site)/…                   every other page (the group layout adds nav + footer)
│   ├── not-found.tsx              404
│   ├── layout.tsx                 fonts, metadata, theme head script, theme picker
│   ├── globals.css                colour tokens for Light and Dark
│   ├── sitemap.ts, robots.ts, opengraph-image.png
├── components/site/               nav, footer, mobile menu, chip radio group, shared blocks
├── content/                       all copy and placeholders — edit here, not in the pages
│   ├── projects.ts                the 8 projects (add videoUrl / stills when they arrive)
│   ├── originals.ts, people.ts, studio.ts, enquiry-options.ts
│   └── legal/privacy.tsx, legal/terms.tsx
└── shared/
    ├── config.ts                  contact details, social links, showreel, site URL
    ├── enquiry.ts                 form validation and sending
    └── theme/                     Light/Dark + accent system
```

## Theme: Light, Dark and accents

The site opens in **Dark with the Grey accent** by default (the client's choice). The boards are drawn in Light · Cobalt, and every page works in Light or Dark (black ground, white text) with any of the accents **Cobalt, Grey, Lime, Orange, Pink**. Colours are tokens in `globals.css` (`--ink`, `--surface`, `--inv-bg`, …) switched by `data-theme` on `<html>`; the accent comes from `--accent`, `--on-accent` and `--accent-text`.

While pitching, a floating picker (bottom-left) switches them. The choice is kept across pages and reloads, and links carry it: `/work/?theme=dark&accent=grey`.

The default look is `DEFAULT_THEME` / `DEFAULT_ACCENT` / `DEFAULT_GROUND` in `src/shared/theme/theme.ts`; the server renders it, so it also holds without JavaScript. If you change the defaults, bump `STORAGE_KEY` there so visitors' earlier picks don't override them. To lock the site to the default for launch, build with `NEXT_PUBLIC_PITCH_MODE=off` (no picker, query ignored).

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and robots. On Vercel it falls back to the production domain. |
| `NEXT_PUBLIC_ENQUIRY_ENDPOINT` | Where both enquiry forms post: the studio's Google Apps Script web app, which saves each enquiry in a Google Sheet and emails freakymackstudios@gmail.com (free; setup in `docs/enquiry-form-google-sheet.md`). Can also be set in `src/shared/config.ts` (`CONTACT.enquiryEndpoint`). Without it, sending opens a pre-filled email in the visitor's email app. |
| `NEXT_PUBLIC_PITCH_MODE` | `off` hides the theme picker and locks the defaults. |

## Content still owed by the client

Anything in `[square brackets]` is missing content — `[Project title]`, `[Client]`, `[Name]`, `[Role]`, `[Year]`, `[City]`, `[Studio address]`, `[X] working days`, the `[Range 1–3]` budget options. They stay visible until real content arrives; replace them in `src/content/` and `src/shared/config.ts`.

Still to send: a 10–15s homepage loop and the full reel link · project videos, 3–5 stills and credits per project · about text · team photos · client logos and testimonials (with permission) · social handles · domain and hosting details.

**Legal:** Privacy and Terms are drafts. Fill every bracket (legal entity, address, city, hosting / form / analytics tools, retention period, grievance officer) and have a lawyer review both before launch.

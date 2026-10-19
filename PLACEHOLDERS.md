# Freaky Mack Studios: placeholder checklist

Every piece of missing content on the site, where it shows, what it's for, and who needs to supply it.
Fill in the **Answer** column (or send the files) and hand it back. I'll wire everything in.

**Who supplies what**
- **YOU**: something you decide or set up: accounts, keys, domain, tool choices.
- **CLIENT**: content only Freaky Mack (Izaan Khan) can give: names, photos, films, quotes, legal details.
- **BOTH**: you decide the format and the client gives the content.

Placeholders are written exactly as they appear on the site (e.g. `[Project title]`), so you can search for them.
Paths are relative to the repo root.

> **Heads-up:** the homepage has its own copies of the projects, people, podcast episodes, client list and social links. When the content comes in, I'll point the homepage at the same data as the inner pages so every value only has to be entered once.

> **Content form applied (Oct 2026).** The client's filled-in form is now on the site: every film's client, credits and story (the form printed each film's answers under the *next* film's heading, so answers were matched by the details in each box), the homepage's six films, the address, WhatsApp, Instagram/YouTube links, the 24-hour reply time, the crew and Izaan's bio. Films the client filled in completely show their full story; partly filled and blank films show only what was given, with no placeholders. **Still open:** Kara Feel (asked for on the homepage, but no file), Film 39's "same as above" (read as the Republic Day team), "The Last Precence" (shown as "The Last Presence"), the founder quote, Vimeo/LinkedIn, budget ranges ("no fixed budget"), the legal details in section 1, stills and film links. Rows 1.1, 1.2, 1.4, 1.5, 1.7 and 1.8 (Instagram) below are done.

> **Stills and publishing (Oct 2026).** Three stills per film came in for 28 films (`public/work/<slug>/`, data in `src/content/stills.ts`, taken at each film's own resolution; burnt-in letterbox bars trimmed). A film is **published** only when it has both stills and written content: 26 films are live. The rest are listed by name only under **"Publishing soon"** on /work, with no page: 12 have content but no stills (their source files weren't on the Mac when the stills were pulled: pTron, India Fashion Awards, Albela, TOIFA Aftermovie, The Midnight Hour, Rudraprayag, Kashi, Falaknama — Film 01, BharatBenz × Dhingra Trucking, Soanbhadra, Nayi Soch Wali Azadi, The Last Presence — Teaser), 2 have stills but no written content (Changa, PC Jeweller × Sonalika Sahay), and Zykaz Interview has neither. Each one goes live by itself once the missing piece arrives.

---

## 1. Fill once, used everywhere

| # | Value | Shows on | Where in code | Purpose | Supplied by | Answer |
|---|---|---|---|---|---|---|
| 1.1 | `[STUDIO ADDRESS]` / `[Studio address]` | Footer on every page, Start a project, Privacy, Terms | `src/app/_components/Footer.tsx:45`, `src/components/site/SiteFooter.tsx:48`, `src/app/(site)/start-a-project/page.tsx:78`, `src/content/legal/privacy.tsx:25,37`, `src/content/legal/terms.tsx:23,33` | Studio's postal address (7 places) | CLIENT | |
| 1.2 | `[CITY]` / `[City]` | Same places as 1.1 | The same 7 places (Start a project: `:80`, shown as "[City], India") | Studio's city | CLIENT | |
| 1.3 | `[CITY]` (court city) | Terms §09 "Governing law" | `src/content/legal/terms.tsx:31` | City whose courts handle disputes. It may differ from 1.2, so ask the lawyer. | CLIENT (with lawyer) | |
| 1.4 | `[LEGAL ENTITY NAME]` | Privacy §01, Terms §01 | `privacy.tsx:25`, `terms.tsx:23` | Registered business name (e.g. "Freaky Mack Studios LLP" or the proprietor's name) | CLIENT | |
| 1.5 | `[X] working days` | Start a project ("What happens next", step 02), Thanks page | `src/app/(site)/start-a-project/page.tsx:16`, `src/app/(site)/thanks/page.tsx:39` | How quickly the studio promises to reply to an enquiry | CLIENT | |
| 1.6 | Company start year, and "six years" | Hero, meta description, Studio page ×3, founder bio | `src/app/_components/Hero.tsx:76`, `src/app/layout.tsx:16`, `src/app/(site)/studio/page.tsx:13,56,92`, `src/app/(site)/people/page.tsx:86` | Confirms "six years of advertising" is still accurate | CLIENT | |
| 1.7 | YouTube channel URL | Footer (all pages), homepage "Watch on YouTube ↗", Originals "Subscribe on YouTube ↗" | `src/shared/config.ts:32`, plus hard-coded copies in `src/app/_components/Podcast.tsx:27` and `src/app/_components/Footer.tsx:36` | Link to the podcast and films channel | CLIENT | |
| 1.8 | Social links: Instagram, Vimeo, LinkedIn | Footer on every page | `src/shared/config.ts:31,33,34`, plus hard-coded copies in `src/app/_components/Footer.tsx:35-38` | Studio social profiles. They currently point to the platforms' home pages. | CLIENT | |
| 1.9 | `Last updated [DATE]` | Privacy, Terms | `src/components/site/LegalPage.tsx:39` | Date the legal text was finalised, filled in after the lawyer's review | YOU | |

**Leads to confirm with the client (not verified):** an older draft in `Documentation/freaky-mack-studios-home.html` mentions "Andheri West, Mumbai". The client questionnaire `Documentation/FreakyMack_Website_Client_Questionnaire_Short.pages` may already answer some items here.

---

## 2. Home `/`

### Showreel
| # | Placeholder | Where | Purpose | Supplied by | Answer |
|---|---|---|---|---|---|
| 2.1 | ~~`[ 10–15 SEC LOOP, MUTED ]`~~ | `public/reel/`, `REEL.loop` in `src/shared/config.ts` | **Done:** `FM_Showreel_15Sec_V_01.mp4` (14.75s) plays silently on loop, re-encoded without audio (WebM + MP4, 720p ≈ 1.8 MB, 1080p for wide screens ≈ 3.1 MB). | — | Done |
| 2.2 | ~~Loop poster~~ | `public/reel/reel-poster.jpg` | **Done:** a still from the loop, shown while it loads and for reduced-motion visitors. | — | Done |
| 2.3 | ~~`[ FULL SHOWREEL — EMBED, SOUND ON ]`~~ | `REEL.full` in `src/shared/config.ts`, `FullReelPlayer` in `src/shared/reel.tsx` | **Done:** the complete showreel (1:29) plays from CloudFront (S3 bucket as fallback) with play/pause, a scrubbable timeline, volume and fullscreen: the full-quality MP4 on desktop and the 720p MP4 on phones, both uploaded and verified. | — | Done |
| 2.4 | ~~`tap to open · [DURATION]`~~ | `REEL.duration` in `src/shared/config.ts` | **Done: 1:30**, from `Freaky Mack_Showreel.mov` | — | 1:30 |
| 2.5 | `Now playing · Showreel [YEAR]` | `src/app/_components/Reel.tsx:106` | Year of the reel | CLIENT | |

### Chapter 01: Selected work (6 rows)
**Done:** the homepage now shows the first six films from `src/content/projects.ts`: Mercedes-Benz Global Star, Changa, PC Jeweller TVC, India Fashion Awards, Albela and McDonald's Chicken McWings. To change which films appear, reorder the list in that file.

- **2.6 `[ STILL — {title} ]`** (`src/app/_components/WorkPreview.tsx`): the preview image that changes on hover. The first project still is reused here. **Supplied by:** CLIENT (covered by section 5).

### Chapter 03: Testimonials (×8)
Source: `src/content/testimonials.ts` (shown by `src/app/_components/Testimonials.tsx`, a row of equal cards with arrows)

| # | Placeholder | Where | Purpose | Supplied by | Answer |
|---|---|---|---|---|---|
| 2.7 | ~~`"[Client testimonial — two or three lines in their own words.]"`~~ | 8 cards | Real quotes from clients, used **with their written permission** | CLIENT | **Done:** Abhishek Patni (NoughtOne), Rajpal Yadav, Mallika Ghoshal (Development Alternatives), Prabhsimran Singh, Fila Team, Kashif Mirani, Pradhyumn Jaat, Bombay Times Team. Rajpal Yadav's quote replaced with the new one the client sent (the first matched Kashif Mirani's almost word for word). |
| 2.8 | ~~`[Name]`~~ | every card | Person quoted | CLIENT | Done |
| 2.9 | ~~`[Role], [Brand]`~~ | every card | Their role or company | CLIENT | Done as given (Rajpal Yadav shown as "Actor"; Fila and Bombay Times teams as "Client") |
| 2.10 | Avatar | every card | Square headshot (or brand logo for the teams), at least 240px, **provided or approved by the person** | CLIENT | Open: every card shows initials until a photo arrives. Add it as `photo` in `src/content/testimonials.ts`, file in `public/testimonials/` |

### Chapter 04: Podcast
**Done (coming soon):** the podcast hasn't launched, so Chapter 04 is now a type-only "Coming soon." block with an "On air soon" sticker and a "Want to be on it? Say hello" email link. No episode art, titles or player. **Nothing needed until the podcast launches.**

### Chapter 05: People (4 faces)
Source: `src/app/_components/People.tsx`. Should match `/people` (section 7).

| # | Placeholder | Where | Purpose | Supplied by | Answer |
|---|---|---|---|---|---|
| 2.14 | `[Name] · [Role]` ×3 | `:10-12` | Three key crew members shown next to Izaan | CLIENT | |
| 2.15 | `[ PHOTO ]` ×4 | `:33` | Portraits: Izaan plus the three above, portrait orientation, at least 1200px tall | CLIENT | |

### Client stickers
`src/app/_components/ClientScatter.tsx:8-17` has real names but no logos. Use logos only with the client brands' permission (see 10.8).

---

## 3. Footer on every other page
`src/components/site/SiteFooter.tsx:48` holds `[STUDIO ADDRESS], [CITY]`, which is covered by 1.1 and 1.2. The social links at `:38-41` are covered by 1.7 and 1.8.

---

## 4. Work `/work`

| # | Placeholder | Where | Purpose | Supplied by | Answer |
|---|---|---|---|---|---|
| 4.1 | `[ STILL ]` ×41 | `src/app/(site)/work/_components/WorkGrid.tsx:23` | Card image for each project, a 4:5 or 16:9 key still | CLIENT | |
| 4.2 | `[Client] · [Year]` on cards | Filled from `src/content/projects.ts` | Titles are done; the missing clients and years are listed in section 5 | CLIENT | |
| 4.3 | ~~`[NN] in total`~~ | `WorkGrid.tsx` | **Done:** counts the films in the data (41) | — | 41 |

---

## 5. Project pages `/work/[slug]` (41 films)

**Done:** the 41 films from the content library (`FILE_STRUCTURE.md`) are now the projects in `src/content/projects.ts`, in the order shown on `/work`. Each has its format, runtime and frame shape, plus the client, director and cast wherever the file name states them. "Film 01 of 41" and "Next up" work automatically.

**Still owed for every project (CLIENT):**

| Field | Placeholder | Where it shows | Purpose |
|---|---|---|---|
| logline | `[One-line logline — what the film is, in a sentence.]` | Under the title, search/social description | One sentence |
| year | `[Year]` (except the three below that have one) | Hero meta, /work card | Release year |
| who | `[Client]` (where the file name doesn't say) | Under the title, /work card | Client, brand or artist |
| brief | `[Two or three lines on what the client needed and who it was for.]` | "The brief" | 2–3 lines |
| idea | `[How we cracked it — the concept, the look, the one decision that made the film.]` | "The idea" | 2–3 lines |
| on screen | `[Where it ran and what happened — only real results, shared with the client's permission.]` | "On screen" | Where it ran and real results, approved by the client |
| credits | `[Name]` for Agency, Producer, Director of photography, Editor, Colour, Sound (and Client/Director where unknown) | Credits list | A blank role can be hidden |
| stills | `[ STILL 01 — WIDE ]`, `[ STILL 02 ]`, `[ STILL 03 ]` | "Frames from the film", /work card, homepage preview | 3 stills, 16:9, at least 2400px wide (you'll send these later) |
| video | `[ FILM — YOUTUBE / VIMEO EMBED ]` | Player | Filled when the films are uploaded (see 11.5) |

**Per film.** Anything in `[brackets]` still needs an answer. Check every title: they come from file names.

| Slug (URL) | Title on site | Format | Client / artist | Year | Runtime | Frame | Director | Source file |
|---|---|---|---|---|---|---|---|---|
| `mercedes-benz-global-star` | Mercedes-Benz Global Star | Ad film | Mercedes-Benz | `[Year]` | 1:35 | 16:9 | Izaan Khan | `Ad. Films/Mercedes-Benz Global Star  I  Directed by Izaan Khan - Freaky Mack (1080p, h264).mp4` |
| `changa` | Changa | Music video | Aghor × IKKA | `[Year]` | 3:52 | 16:9 | `[Name]` | `Music Videos/Changa (Official Video) Aghor x IKKA  Ashock  Inflict  Latest HipHop Song  Big Bang Music - Big Bang Music (1080p, h264).mp4` |
| `pc-jeweller-tvc` | PC Jeweller TVC | Ad film | PC Jeweller | 2017 | 1:14 | 16:9 | `[Name]` | `Ad. Films/Ad. PC Jeweller TVC 2017 featuring Akshay Kumar & Twinkle Khanna - PCJeweller (1080p, h264).mp4` |
| `india-fashion-awards` | India Fashion Awards | Event film | `[Client]` | `[Year]` | 3:45 | 16:9 | `[Name]` | `Event Films/India Fashion Awards I Freaky Mack Productions - Freaky Mack (1080p, h264).mp4` |
| `albela` | Albela | Fashion film | `[Client]` | `[Year]` | 2:56 | 16:9 | `[Name]` | `Fashion Films/Albela_Final.m4v` |
| `mcdonalds-chicken-mcwings` | McDonald’s Chicken McWings | Ad film | McDonald’s India | `[Year]` | 0:22 | 16:9 | Izaan Khan | `Ad. Films/McDonalds_s Chicken McWings I Director Izaan Khan I Freaky Mack Production - Freaky Mack (1080p, h264).mp4` |
| `toifa-aftermovie` | TOIFA Aftermovie | Event film | `[Client]` | `[Year]` | 2:02 | 16:9 | `[Name]` | `Event Films/TOIFA_Aftermovie.mov` |
| `the-midnight-hour` | The Midnight Hour | Short film | `[Client]` | `[Year]` | 3:11 | 16:9 | `[Name]` | `Short Films/The Midnight Hour.mp4` |
| `dbs-lifestyle` | DBS Lifestyle | Corporate film | DBS Lifestyle | 2023 | 4:08 | 16:9 | `[Name]` | `Corporate Videos/DBS Lifestyle  I  Corporate Film 2023  I  Freaky Mack Films - Freaky Mack (1080p, h264).mp4` |
| `rudraprayag` | Rudraprayag | Documentary | `[Client]` | `[Year]` | 3:47 | 16:9 | `[Name]` | `Documentaries/Renew_Rudraprayag.mov` |
| `rock-it` | Rock.it | Ad film | Rock.it | `[Year]` | 1:44 | 2.39:1 | Izaan Khan | `Ad. Films/Rock.it  I  Directed by Izaan Khan  I  Freaky Mack Productions - Freaky Mack (1080p, h264).mp4` |
| `kashi` | Kashi | Short film | `[Client]` | `[Year]` | 4:29 | 16:9 | `[Name]` | `Short Films/Kashi_ColorGrade.m4v` |
| `pkcc` | PKCC | Govt. ad | `[Client]` | `[Year]` | 2:27 | 16:9 | `[Name]` | `Govt. Ads/PKCC FINAL_1080p.mp4` |
| `citta-moisturizing-baby-balm` | CITTA Moisturizing Baby Balm | Ad film | CITTA | `[Year]` | 1:00 | 16:9 | Izaan Khan | `Ad. Films/CITTA Moisturizing Baby Balm  I  Directed by Izaan Khan  I  TV Commercial - Freaky Mack (1080p, h264).mp4` |
| `zypp-electric` | Zypp Electric App | Ad film | Zypp Electric | `[Year]` | 0:58 | 16:9 | Izaan Khan | `Ad. Films/Zypp Electric App  I  Directed by Izaan Khan  I  Freaky Mack Production - Freaky Mack (1080p, h264).mp4` |
| `mcdonalds-veg-surprise` | McDonald’s Veg Surprise | Ad film | McDonald’s India | `[Year]` | 0:30 | 16:9 | `[Name]` | `Ad. Films/McDonald_s India N&E I Veg Surprise is back! - McDonaldsinIndia (1080p, h264).mp4` |
| `ptron` | pTron | Ad film | pTron | `[Year]` | 1:00 | 16:9 | `[Name]` | `Ad. Films/p tron (aparshakti)_ FINAL FULL VIDEO.MP4` |
| `film-for-ace` | Film for Ace | Ad film | `[Client]` | `[Year]` | 1:11 | 16:9 | `[Name]` | `Ad. Films/Film for Ace.mp4` |
| `jaldi-bidai` | Jaldi Bidai | Ad film | `[Client]` | `[Year]` | 1:18 | 16:9 | `[Name]` | `Ad. Films/Jaldi Bidai_Film.mov.mp4` |
| `falaknama` | Falaknama — Film 01 | Ad film | `[Client]` | `[Year]` | 0:39 | 9:16 | `[Name]` | `Ad. Films/Falaknama_Couple-esv2-90p-bg-0p.MOV` |
| `falaknama-02` | Falaknama — Film 02 | Ad film | `[Client]` | `[Year]` | 0:30 | 9:16 | `[Name]` | `Ad. Films/VIDEO-2026-02-26-21-26-33 copy.mp4` |
| `falaknama-03` | Falaknama — Film 03 | Ad film | `[Client]` | `[Year]` | 0:23 | 9:16 | `[Name]` | `Ad. Films/VIDEO-2026-02-26-21-26-33.mp4` |
| `zykaz-cafe` | Zykaz Cafe | Ad film | Zykaz | `[Year]` | 0:35 | 4:3 | `[Name]` | `Ad. Films/Zykaz_Cafe_Square.mov.mp4` |
| `zykaz-interview` | Zykaz Interview | Ad film | Zykaz | `[Year]` | 0:32 | 16:9 | `[Name]` | `Ad. Films/Zykaz_Interview_FinalCut.mov` |
| `bharatbenz-dhingra-trucking` | BharatBenz × Dhingra Trucking | Corporate film | Dhingra Trucking | `[Year]` | 7:42 | 16:9 | `[Name]` | `Corporate Videos/Bharat Benz   Dhingra Trucking - DHINGRA TRUCKING (1080p, h264).mp4` |
| `soanbhadra` | Soanbhadra | Documentary | `[Client]` | `[Year]` | 9:45 | 16:9 | `[Name]` | `Documentaries/DA_Soanbhadra.mp4` |
| `bombay-times-fashion-week` | Bombay Times Fashion Week — Green Room | Event film | Bombay Times | 2020 | 3:13 | 16:9 | `[Name]` | `Event Films/Bombay Times Fashion Week  I  March 2020  I  Green Room  I  Film by Freaky Mack_720p.mp4` |
| `sawe-international-excellence-awards` | SAWE International Excellence Awards | Event film | SAWE | `[Year]` | 1:24 | 16:9 | `[Name]` | `Event Films/SAWE International Excellence Awards  I  Dubai  I  Creative Partner - Freaky Mack.mp4` |
| `noughtone-show` | NoughtOne Show | Event film | NoughtOne | `[Year]` | 0:54 | 9:16 | `[Name]` | `Event Films/NoughtOne Show.mp4` |
| `pc-jeweller-sonalika-sahay` | PC Jeweller × Sonalika Sahay | Fashion film | PC Jeweller | `[Year]` | 0:46 | 16:9 | `[Name]` | `Fashion Films/PC Jeweller  I  Sonalika Sahay  I  Freaky Mack - Advertising Agency - Freaky Mack (1080p, h264) (1).mp4` |
| `noughtone` | NoughtOne | Fashion film | NoughtOne | `[Year]` | 1:21 | 16:9 | `[Name]` | `Fashion Films/NoughtOne.mp4` |
| `harshita-gaur` | Harshita Gaur | Fashion film | Harshita Gaur | `[Year]` | 0:52 | 9:16 | `[Name]` | `Fashion Films/Film Harshita Gaur.mp4` |
| `fabindia-01` | Fabindia — Film 01 | Fashion film | Fabindia | `[Year]` | 1:00 | 16:9 | `[Name]` | `Fashion Films/Fabindia.mp4` |
| `fabindia-02` | Fabindia — Film 02 | Fashion film | Fabindia | `[Year]` | 0:58 | 16:9 | `[Name]` | `Fashion Films/Fabindia 2.mp4` |
| `sex-sorted` | Sex Sorted | Govt. ad | Haryana Government | `[Year]` | 2:32 | 16:9 | `[Name]` | `Govt. Ads/SEX SORTED whats app file_1080p.mp4` |
| `sexual-harassment-haryana` | Sexual Harassment | Govt. ad | Haryana Government | `[Year]` | 2:49 | 2.35:1 | `[Name]` | `Govt. Ads/Saxual Harrasment for Haryana Govt.mov` |
| `voting-campaign` | Voting Campaign | Govt. ad | Haryana Government | `[Year]` | 1:41 | 16:9 | `[Name]` | `Govt. Ads/Voting Campaign - Freaky Mack (480p, h264).mp4` |
| `happy-republic-day` | Happy Republic Day | Short film | `[Client]` | `[Year]` | 2:19 | 16:9 | Izaan Khan | `Short Films/Happy Republic Day  I  Directed by Izaan Khan  I  Freaky Mack Productions - Freaky Mack (1080p, h264).mp4` |
| `nayi-soch-wali-azadi` | Nayi Soch Wali Azadi | Short film | `[Client]` | `[Year]` | 3:58 | 4:3 | `[Name]` | `Short Films/Nayi Soch Wali Azadi_Final Cut.mp4` |
| `s-and-s-trailer` | S&S — Trailer | Short film | `[Client]` | `[Year]` | 1:00 | 16:9 | `[Name]` | `Short Films/S&S_Trailer.mov` |
| `tlp-teaser` | TLP — Teaser | Short film | `[Client]` | `[Year]` | 1:26 | 16:9 | `[Name]` | `Short Films/TLP_Teaser_Final.mp4` |

**Please confirm (CLIENT):**
- **Titles to check:** Rudraprayag (file `Renew_Rudraprayag`: is the client "Renew"?), Soanbhadra (file `DA_Soanbhadra`: what does "DA" stand for, and is the spelling "Sonbhadra"?), Sexual Harassment (the file name misspells it; is there a proper campaign title?), Film for Ace, Jaldi Bidai, PKCC, Sex Sorted, S&S — Trailer, TLP — Teaser.
- ~~**Untitled films**~~ **Answered on the form:** the two vertical cuts are more Falaknama films, now "Falaknama — Film 02/03". Falaknama's client is still `[Client]`.
- **Film 39, Nayi Soch Wali Azadi:** the form says "As same as above" (Happy Republic Day). Same director (Izaan Khan)? Same client? Not changed until confirmed.
- **Govt. ads:** answered. Sex Sorted, Sexual Harassment and Voting Campaign are all for the Haryana Government.
- **Clients:** India Fashion Awards, TOIFA Aftermovie, Albela, Kashi, The Midnight Hour, Happy Republic Day, Nayi Soch Wali Azadi and the Govt. ads. Which are Freaky Mack's own films (these would feed the Originals slate)?
- **Low-resolution masters:** Fabindia ×2 (406p), Voting Campaign (480p), Sexual Harassment (362p) and the two vertical cuts (480p). Higher-resolution files would look much better on the site.
- **Vertical films (9:16):** Falaknama, Harshita Gaur, NoughtOne Show and the two vertical cuts. I'll give these a vertical player when the videos go in.

## 6. Studio `/studio`

| # | Placeholder | Where | Purpose | Supplied by | Answer |
|---|---|---|---|---|---|
| 6.1 | ~~`[ On set — behind the scenes still ]`~~ | `src/app/(site)/studio/page.tsx` | Large behind-the-scenes photo, landscape, at least 2400px wide | CLIENT | **Done:** from the studio's photo folder (Oct 2026), with a strip of eight more frames (`src/content/bts.ts`, `public/bts/`) |
| 6.2 | `on set, [Year]` | `studio/page.tsx:81` | Year that photo was taken | CLIENT | |
| 6.3 | ~~`Chapter 1 · [Year]`~~ | `src/content/studio.ts:3` | **Removed:** the timeline cards show "Chapter 1–4" with no years | — | Done |
| 6.4 | `Chapter 2 · [Year]` | `studio.ts:4` | Year McDonald's, Google and Adidas Originals came on board | CLIENT | |
| 6.5 | `Chapter 3 · [Year]` | `studio.ts:5` | Year Mercedes-Benz, Fila, PC Jewellers and Times of India came on board | CLIENT | |

---

## 7. Originals `/originals`

### The podcast
**Done (coming soon):** the featured player and the "Every episode" list are replaced by a type-only "Coming soon." section (kicker "The Freaky Mack Podcast", a "What to expect" list and the email link). The Thanks page card now says "Coming soon". **Nothing needed until launch**; when it launches the studio sends the YouTube channel link, episode titles, guests and lengths.

### The slate (3 upcoming originals)
Source: `src/content/originals.ts` and the posters in `src/app/(site)/originals/page.tsx:62`. The cards link to `/work` until these films have their own pages.

| Card | `[Title]` | `[One-line logline.]` | `[Status]` (e.g. In development / Shooting / Post) | `[ Poster ]` (2:3 image) |
|---|---|---|---|---|
| Short film | | | | |
| Web series | | | | |
| Documentary | | | | |

**Supplied by:** CLIENT for everything in section 7.

---

## 8. People `/people`

| # | Placeholder | Where | Purpose | Supplied by | Answer |
|---|---|---|---|---|---|
| 8.1 | `[ Portrait — Izaan ]` | `src/app/(site)/people/page.tsx:57` | Founder portrait (the same photo works on the homepage), at least 1600px tall | CLIENT | **Done** (`public/people/izaan-khan-portrait.webp`, 1207×1600) |
| 8.2 | `"[A line from Izaan on why he started Freaky Mack Studios.]"` | `people/page.tsx:82` | Founder quote, one sentence | CLIENT | |
| 8.3 | `[Two or three lines of bio — how he got into film, six years at Freaky Mack, what he wants the studio to make next.]` | `people/page.tsx:86` | Founder bio | CLIENT | |
| 8.4 | Founder Instagram and LinkedIn | `src/shared/config.ts:35-36` | Izaan's personal profile links. They currently point to the platforms' home pages. | CLIENT | |
| 8.5 | `[Name]` · `[Role]` ×8 | `src/content/people.ts:7-15` | Core crew. The count of 8 can change. | CLIENT | See the table below |
| 8.6 | `[ Photo ]` ×8 | `people/page.tsx:114` | Crew portraits, same crop for all | CLIENT | **Done** for all four crew: AB Rahim Shah, Ashok Kumar Naik, Tridip K Maity, Salan Lamare (`public/people/`). Bigger photos of Rahim and Ashok would still help (theirs are 372×569 and 493×677). |
| 8.7 | `[One line on the directors, cinematographers and editors Freaky Mack works with project by project.]` | `people/page.tsx:138` | Intro line for the collaborators section | CLIENT | |

| Crew # | Name | Role |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |
| 7 | | |
| 8 | | |

---

## 9. Start a project `/start-a-project` and Thanks `/thanks`

| # | Placeholder | Where | Purpose | Supplied by | Answer |
|---|---|---|---|---|---|
| 9.1 | `[X] working days` | See 1.5 | Reply promise | CLIENT | |
| 9.2 | `[Studio address]`, `[City], India` | See 1.1 and 1.2 | Sidebar, "The studio" | CLIENT | |
| 9.3 | `[Range 1]` | `src/content/enquiry-options.ts:32` | Budget option 1 (e.g. "Under ₹5L"). Also sent in the enquiry email. | CLIENT | |
| 9.4 | `[Range 2]` | `enquiry-options.ts:33` | Budget option 2 (e.g. "₹5–15L") | CLIENT | |
| 9.5 | `[Range 3]` | `enquiry-options.ts:34` | Budget option 3 (e.g. "₹15L+") | CLIENT | |

Hint text inside the form fields ("Hi, I'm…", "you@brand.com", "+91") is intentional and doesn't need filling.

---

## 10. Privacy `/privacy` and Terms `/terms`

These are drafts under India's DPDP Act 2023. **A lawyer must review both before launch.**

| # | Placeholder | Where | Purpose | Supplied by | Answer |
|---|---|---|---|---|---|
| 10.1 | `[LEGAL ENTITY NAME]` | See 1.4 | Registered business name | CLIENT | |
| 10.2 | `[STUDIO ADDRESS]`, `[CITY]` | See 1.1 and 1.2 | Registered address | CLIENT | |
| 10.3 | `[ANALYTICS TOOL]` ×2 | `src/content/legal/privacy.tsx:26,29` | Which analytics the site uses (e.g. Vercel Analytics, Google Analytics, or "none") | YOU | |
| 10.4 | `[HOSTING PROVIDER]` | `privacy.tsx:29` | Website host: Vercel (and Cloudflare for video, if used) | YOU | |
| 10.5 | `[FORM PROVIDER]` | `privacy.tsx:29` | Service that delivers enquiry emails (e.g. Formspree) | YOU | |
| 10.6 | `[Choose before launch: …]` (cookies) | `privacy.tsx:31` | Pick one: **(a)** "We only use cookies that are essential for the site to work." or **(b)** analytics cookies with a consent banner. **(b) needs a cookie banner, which I'd have to build.** | YOU (with the client) | |
| 10.7 | `[X] months` | `privacy.tsx:32` | How long enquiries are kept (retention period) | CLIENT (with lawyer) | |
| 10.8 | Client names and logos "appear with their permission" | `src/content/legal/terms.tsx:25` | Confirm the studio has permission to show every client name and logo on the site | CLIENT | |
| 10.9 | `Grievance officer: [NAME]` | `privacy.tsx:37` | Person who handles data complaints (required under the DPDP Act) | CLIENT | |
| 10.10 | `respond within [X] days` | `privacy.tsx:37` | Grievance response time. This is not the same [X] as 1.5. | CLIENT (with lawyer) | |
| 10.11 | `[DOMAIN]` | `src/content/legal/terms.tsx:23` | The site's domain, e.g. freakymackstudios.com | YOU | |
| 10.12 | `courts in [CITY]` | See 1.3 | Governing-law city | CLIENT (with lawyer) | |
| 10.13 | `Last updated [DATE]` | See 1.9 | Date the text was finalised | YOU | |

---

## 11. Setup and accounts (YOU)

| # | Item | Where | Purpose | Answer |
|---|---|---|---|---|
| 11.1 | **Domain** | `NEXT_PUBLIC_SITE_URL` (Vercel env), `src/shared/config.ts:8` | The live address. It feeds the sitemap, robots.txt, social previews and Terms. Buy it and point it at Vercel. | |
| 11.2 | **Enquiry form endpoint** | `CONTACT.enquiryEndpoint` in `src/shared/config.ts` (or `NEXT_PUBLIC_ENQUIRY_ENDPOINT`) | The Google Apps Script web app URL that saves enquiries to a Google Sheet and emails the studio (free). Setup: `docs/enquiry-form-google-sheet.md`. Without it, "Send it over" opens the visitor's email app and asks them to press Send. | STUDIO | **Done:** Apps Script web app on zellarinternational@gmail.com, set in `config.ts` |
| 11.3 | **Hide the theme picker at launch** | `NEXT_PUBLIC_PITCH_MODE=off` (Vercel env) | The Light/Dark/accent picker is for pitching only. Also tell me the final theme and accent (currently Dark + Grey). | |
| 11.4 | **Vercel plan** | Vercel dashboard | Hobby (free) is for non-commercial use, so move to Pro before the client launch. | |
| 11.5 | **Cloudflare Stream** | Cloudflare dashboard, then `REEL` in `config.ts` and the project videos | Buy the **Starter Bundle ($5/month)**, upload the films, then send me your `customer-xxxx` code and each video's ID. Allow only your domain and `*.vercel.app` to play them. | Customer code: <br> Video IDs: |
| 11.6 | **Business email** | `src/shared/config.ts:13` | Keep freakymackstudios@gmail.com, or switch to e.g. hello@yourdomain? (CLIENT decides) | |
| 11.7 | **Analytics** | See 10.3 | Pick one, or none. This decides the cookie wording in 10.6. | |

Contact details already filled in and real: freakymackstudios@gmail.com, +91 97115 42274, and WhatsApp on the same number. **CLIENT:** confirm these are final.

---

## 12. Media checklist (CLIENT sends, YOU host)

| Item | How many | Format / size | Used on |
|---|---|---|---|
| ~~Logo vectors~~ | **Received** | FreakyMack_Logo_26.pdf, page 4 (white logo), now `assets/brand/fm-logo-*.svg` and `fm-mark-*.svg` | Nav, footer, blob mark, watermarks, social image. Drawn in the text colour, with no inversion. |
| Favicon / app icon | 1 | Made from the mark (I can make it) | Browser tab. **Currently missing.** |
| Homepage loop | 1 | 10–15s, muted, 720p, about 2–3MB | Home reel card |
| Full showreel | 1 | Master file (for Stream) or YouTube link | Home reel |
| Project films | 8 | Master files (for Stream) or YouTube/Vimeo links | Project pages |
| Project stills | 3 per project (24) | 16:9 JPG, at least 2400px wide | Project pages, /work cards, homepage preview |
| Behind-the-scenes photo | 1 | Landscape JPG, at least 2400px wide | Studio | **Done** |
| Founder portrait | 1 | Portrait JPG, at least 1600px tall | People, Home |
| Crew portraits | 8 (3 also used on Home) | Portrait JPG, same crop and light | People, Home |
| Testimonial avatars | 8 | Square, at least 240px, headshot or brand logo, provided or approved by the person | Home |
| Episode thumbnails | 6 (3 newest on Home) | 16:9 | Originals, Home |
| Slate posters | 3 | 2:3 | Originals |
| Client logos (optional) | Up to 7 | SVG/PNG, **only with each brand's permission** | Home and Studio client stickers (currently text) |

---

## 13. What I'll do once answers arrive (no action needed from you)

- Point the homepage's copies (work list, people, podcast, clients, footer links) at the shared data, so each value lives in one place.
- Add image and video fields to the projects, stills, episodes, crew and slate data, and replace the grey placeholder blocks with the real media, loading lazily.
- Build the Cloudflare Stream player, with a poster shown until someone clicks play.
- Generate the favicon from the logo mark.
- Build a cookie banner if option (b) is chosen in 10.6.
- Remove the legal draft brackets once the lawyer has signed off, and set the "Last updated" date.

// Site checks: each board's renderVals() interactions, the enquiry form, navigation, the pitch theme picker
// (and that it persists across pages), and a WCAG contrast sweep of every page in Light and Dark.
// Usage: node scripts/interact.mjs [--base http://localhost:3000]
import { chromium } from "playwright";

const args = process.argv.slice(2);
const bi = args.indexOf("--base");
const base = bi >= 0 ? args.splice(bi, 2)[1] : "http://localhost:3000";

let failures = 0;
const check = (ok, msg) => {
  console.log(`${ok ? "  ✓" : "  ✗"} ${msg}`);
  if (!ok) failures++;
};
const root = (page) => page.locator("[data-theme]").first();

/** Every visible text node vs the nearest opaque background behind it (WCAG: 4.5:1, 3:1 at 24px+). */
async function contrastSweep(page) {
  return page.evaluate(() => {
    const parse = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return { r, g, b, a };
    };
    const lum = ({ r, g, b }) => {
      const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const bgOf = (el) => {
      for (let n = el; n; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage !== "none") return null; // text over a gradient still: skip
        const c = parse(cs.backgroundColor);
        if (c && c.a >= 0.99) return c;
      }
      return parse(getComputedStyle(document.documentElement).backgroundColor);
    };
    const bad = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const el = walker.currentNode.parentElement;
      if (!el || seen.has(el) || !walker.currentNode.textContent.trim()) continue;
      seen.add(el);
      if (el.closest("[aria-hidden=\"true\"]")) continue; // decorative text
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (cs.visibility === "hidden" || r.width === 0 || r.height === 0 || Number(cs.opacity) === 0) continue;
      const fg = parse(el instanceof SVGElement ? cs.fill : cs.color); // SVG text is painted by fill
      const bg = bgOf(el);
      if (!fg || !bg) continue;
      // Blend semi-transparent text over its background.
      const mix = { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a) };
      const [l1, l2] = [lum(mix), lum(bg)].sort((a, b) => b - a);
      const ratio = (l1 + 0.05) / (l2 + 0.05);
      const large = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700);
      if (ratio < (large ? 3 : 4.5)) bad.push(`${ratio.toFixed(2)}:1 "${el.textContent.trim().slice(0, 40)}"`);
    }
    return bad;
  });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`${base}/`, { waitUntil: "networkidle" });

console.log("Homepage interactions");
await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
const scrollBefore = await page.evaluate(() => window.scrollY);
await page.getByRole("button", { name: "Open the showreel" }).click();
const shows = (loc) => loc.waitFor({ state: "visible", timeout: 3000 }).then(() => true, () => false); // the reel fades between states
const theatre = page.getByRole("dialog", { name: "Freaky Mack Studios showreel" });
const full = theatre.locator("video[controls]");
check(await shows(full), "reel card opens the full showreel");
const fsBox = await theatre.boundingBox();
check(fsBox && fsBox.x === 0 && fsBox.y === 0 && fsBox.width === 1440 && fsBox.height === 900, `full reel fills the whole screen (${fsBox && `${fsBox.width}×${fsBox.height}`})`);
const fullSrcs = await full.evaluate((v) => [...v.querySelectorAll("source")].map((s) => s.getAttribute("src") + "|" + (s.getAttribute("media") ?? "")));
check(
  fullSrcs.length === 4 &&
    /^https:\/\/d12r07g6j7a5zr\.cloudfront\.net\/showreel\/.*_720p\.mp4\|\(max-width: 899px\)$/.test(fullSrcs[0]) &&
    /s3\.us-east-1\.amazonaws\.com\/.*_720p\.mp4/.test(fullSrcs[1]) &&
    /cloudfront\.net\/.*Showreel\.mp4\|$/.test(fullSrcs[2]) && /amazonaws\.com\/.*Showreel\.mp4\|$/.test(fullSrcs[3]),
  `full reel: CloudFront first, S3 fallback, 720p on phones, then full quality (${fullSrcs.length} sources)`,
);
await page.mouse.move(720, 450);
// Going full screen resizes the window, so the page may re-flow under the player: let it settle, then try to scroll.
await page.waitForTimeout(1000);
const heldAt = await page.evaluate(() => window.scrollY);
await page.mouse.wheel(0, 600);
await page.waitForTimeout(400);
const nudge = page.getByText("Close the reel to keep scrolling");
const afterWheel = await page.evaluate(() => window.scrollY);
check(afterWheel === heldAt && (await nudge.isVisible()), `scrolling while the reel plays is held, and the close-the-reel nudge appears (scrollY ${heldAt} → ${afterWheel}; opened at ${scrollBefore})`);
const nb = await nudge.boundingBox();
const cb = await page.getByRole("button", { name: "Close the reel" }).boundingBox();
check(nb && cb && nb.y > cb.y + cb.height && nb.x + nb.width > 1440 - 120, "nudge sits top-right, just under the Close button");
await page.waitForTimeout(2800);
check(!(await nudge.isVisible()), "nudge goes away on its own");
await page.getByRole("button", { name: "Close the reel" }).click();
check(await theatre.waitFor({ state: "detached", timeout: 3000 }).then(() => true, () => false), "Close ends the full reel");
await page.waitForTimeout(300);
const backAt = await page.evaluate(() => [window.scrollY, getComputedStyle(document.documentElement).overflow]);
check(Math.abs(backAt[0] - scrollBefore) <= 2 && backAt[1] === "visible", `closing puts the page back exactly where it was, and it scrolls again (${backAt.join(", ")}; opened at ${scrollBefore})`);
await page.getByRole("button", { name: "Open the showreel" }).click();
await shows(full);
await page.keyboard.press("Escape");
check(await theatre.waitFor({ state: "detached", timeout: 3000 }).then(() => true, () => false), "Escape closes the full reel");
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
const loop = page.locator('[aria-label="Open the showreel"] video');
await loop.waitFor({ state: "attached", timeout: 5000 }).catch(() => {});
const loopState = await loop.evaluate((v) => ({ muted: v.muted, loop: v.loop, inline: v.playsInline, src: v.currentSrc, poster: v.poster })).catch(() => null);
check(!!loopState && loopState.muted && loopState.loop && loopState.inline && /reel-loop-720\.(webm|mp4)$/.test(loopState.src) && /reel-poster\.jpg$/.test(loopState.poster), `homepage reel plays the silent 720p loop at 1440px (${loopState ? loopState.src.split("/").pop() : "no video"})`);
// Chrome pauses muted autoplay while it's off screen (at the top of the page the card sits just below
// the fold), so bring it into view first.
await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
await page.waitForTimeout(1200);
const loopNow = await loop.evaluate((v) => ({ paused: v.paused, t: +v.currentTime.toFixed(2), y: Math.round(v.getBoundingClientRect().top), sy: scrollY })).catch((e) => String(e));
check(!loopNow.paused && loopNow.t > 0.3, `the loop is actually playing (${JSON.stringify(loopNow)})`);
// The "new!" sticker hangs over the card's edge instead of being cut off by it.
const stick = await page.evaluate(() => {
  const card = document.querySelector('[aria-label="Open the showreel"]').getBoundingClientRect();
  const tag = [...document.querySelectorAll("#reel span")].find((e) => e.textContent.trim() === "new!").getBoundingClientRect();
  return { over: Math.round(tag.right - card.right) };
});
check(stick.over > 0, `"new!" sticker overhangs the card, not clipped (${stick.over}px past the edge)`);
// "or scroll the story" glides to the grown reel, alone in the window.
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.getByRole("link", { name: /scroll the story/ }).click();
await page.waitForTimeout(2200);
const framed = await page.evaluate(() => {
  const r = document.querySelector('[aria-label="Open the showreel"]').getBoundingClientRect();
  const h1 = document.querySelector("#top h1").getBoundingClientRect();
  const next = document.querySelector("#ch1").getBoundingClientRect();
  return { cover: +((r.width * r.height) / (innerWidth * innerHeight)).toFixed(2), centre: Math.round(r.top + r.height / 2), heroGone: h1.bottom <= 0, nextBelow: next.top >= innerHeight };
});
check(framed.cover > 0.66 && Math.abs(framed.centre - 450) < 6 && framed.heroGone && framed.nextBelow, `scroll the story → reel fully grown and centred, nothing else in view (${JSON.stringify(framed)})`);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.locator("#ch1 li").nth(2).hover();
await page.waitForTimeout(800);
const shownPreview = await page.evaluate(() => [...document.querySelectorAll('#ch1 [aria-hidden="false"]')].map((e) => e.textContent.trim()).filter((t) => /PC Jeweller/.test(t)).length);
check(shownPreview >= 2, "hovering row 03 cross-fades the preview and caption to PC Jeweller");
// Work list: every title on one line, at desktop and tablet widths, and the active row slides (transform) instead of re-flowing.
for (const w of [1440, 1024, 768]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(300);
  const lines = await page.evaluate(() => [...document.querySelectorAll("#ch1 li a > span > span:last-child > span:first-child")].map((t) => ({ h: t.getBoundingClientRect().height, lh: parseFloat(getComputedStyle(t).lineHeight), cut: t.scrollWidth > t.clientWidth + 1 })));
  check(lines.length === 6 && lines.every((l) => l.h < l.lh * 1.5 && !l.cut), `work titles fit on one line at ${w}px`);
}
await page.setViewportSize({ width: 1440, height: 900 });
check(await page.evaluate(() => getComputedStyle(document.querySelector("#ch1 li a > span")).transitionProperty.includes("transform")), "active work row glides with a transform transition");
await page.getByRole("button", { name: "music video", exact: true }).click();
await page.getByRole("button", { name: "face on screen" }).click();
await page.waitForTimeout(700); // the pill words slide in
const sentence = (await page.locator("#ch3 p").first().innerText()).replace(/\s+/g, " ");
check(/a music video/.test(sentence) && /a face on screen/.test(sentence), `sentence builder → "${sentence}"`);
const ch4 = page.locator("#ch4");
check((await ch4.getByText("Coming", { exact: false }).count()) > 0 && (await ch4.getByText("On air soon").isVisible()), "podcast chapter shows Coming soon");
check(/^mailto:/.test((await ch4.getByRole("link", { name: /Say hello/ }).getAttribute("href")) ?? "") && !(await ch4.getByText(/EPISODE ART|Episode title|Now playing/).count()), "podcast chapter: email CTA, no episode placeholders");

console.log("Theme switch");
const bg = () => root(page).evaluate((el) => getComputedStyle(el).backgroundColor);
const fg = () => root(page).evaluate((el) => getComputedStyle(el).color);
const accentVar = () => root(page).evaluate((el) => getComputedStyle(el).getPropertyValue("--accent").trim().toUpperCase());
const serverHtml = await (await page.request.get(`${base}/studio/`)).text();
check(/<html[^>]*data-theme="dark"/.test(serverHtml), "server HTML already carries the default Dark (works without JS)");
check((await root(page).getAttribute("data-theme")) === "dark" && (await bg()) === "rgb(10, 10, 10)" && (await fg()) === "rgb(255, 255, 255)", `defaults to Dark: black ground, white text (${await bg()} / ${await fg()})`);
check((await accentVar()) === "#1F3BFF", `the accent is Cobalt (${await accentVar()})`);
check((await page.getByRole("button", { name: /accent|^Ground/ }).count()) === 0, "no accent or ground options");
const toggle = page.getByRole("switch", { name: "Dark theme" });
const tb = await toggle.boundingBox();
check(tb && tb.x + tb.width > 1440 - 40 && tb.y + tb.height > 900 - 40 && (await toggle.getAttribute("aria-checked")) === "true", "theme switch sits bottom-right, on (Dark)");
await toggle.click();
await page.waitForTimeout(1000);
check((await root(page).getAttribute("data-theme")) === "light" && (await bg()) === "rgb(255, 255, 255)" && (await toggle.getAttribute("aria-checked")) === "false", "switch → Light: data-theme=light on white");
check(!(await root(page).getAttribute("data-vt")), "the circle transition finishes and cleans up");
await page.reload({ waitUntil: "networkidle" });
check((await root(page).getAttribute("data-theme")) === "light", "reload keeps Light");
await toggle.click();
await page.waitForTimeout(1000);
check((await root(page).getAttribute("data-theme")) === "dark" && (await bg()) === "rgb(10, 10, 10)", "switch → Dark again");

console.log("Contrast sweep");
for (const [label, q] of [["Light", "/?theme=light"], ["Dark", "/?theme=dark"]]) {
  await page.goto(`${base}${q}`, { waitUntil: "networkidle" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(400);
  const bad = await contrastSweep(page);
  check(bad.length === 0, `${label}: all text ≥ WCAG AA${bad.length ? `\n      ${bad.slice(0, 12).join("\n      ")}` : ""}`);
}

console.log("Old pitch links");
await page.goto(`${base}/option-b/`);
await page.waitForURL(`${base}/`, { timeout: 5000 }).catch(() => {});
check(new URL(page.url()).pathname === "/", `/option-b/ lands on / (${page.url()})`);

console.log("Work & project pages");
await page.goto(`${base}/work/`, { waitUntil: "networkidle" });
const CARD = 'section a[href^="/work/"]:not([href="/work/"])';
const cards = page.locator(CARD);
const allCount = await cards.count();
await page.getByRole("radio", { name: "Fashion films" }).click();
await page.waitForTimeout(900); // leaving cards animate out, the rest glide into place
const settled = await page.evaluate(() => [...document.querySelectorAll('section a[href^="/work/"]:not([href="/work/"])')].map((a) => getComputedStyle(a.parentElement).opacity));
check(settled.every((o) => o === "1"), `filtered cards settle fully visible (${settled.join(", ")})`);
check((await cards.count()) === 4 && allCount === 26 && !(await page.getByText(/in total/).count()), `Fashion films filter shows 4 of ${allCount}, with no visible count`);
check(!(await page.getByRole("radio", { name: "Music videos" }).count()), "formats with no published film have no filter chip");
await page.keyboard.press("ArrowRight");
check((await page.getByRole("radio", { name: "Event films" }).getAttribute("aria-checked")) === "true", "arrow key moves the filter");
await page.getByRole("radio", { name: "All work" }).click();
await cards.first().click();
await page.waitForURL(/\/work\/mcdonalds-chicken-mcwings\/?$/);
check(await page.getByText(`Film 01 of ${allCount}`).isVisible(), `project counter reads Film 01 of ${allCount}`);
const film = page.getByRole("button", { name: "Play the film" });
await film.click();
check((await page.getByRole("button", { name: "Pause the film" }).getAttribute("aria-pressed")) === "true" && (await page.getByText(/Now playing/).isVisible()), "project play toggle → Now playing");
check((await page.locator('a[href="/work/mcdonalds-veg-surprise/"], a[href="/work/mcdonalds-veg-surprise"]').count()) > 0, "Next up links to the second film");
// A film the studio filled in completely shows every part of its story; one it left partly blank shows only what it gave.
const storyOf = () => page.evaluate(() => ["The brief", "The idea", "On screen"].filter((l) => [...document.querySelectorAll("main *")].some((e) => e.children.length === 0 && e.textContent.trim() === l)));
check((await storyOf()).length === 3, "a fully filled film shows its brief, idea and on-screen story");
// Stills: the film's frames load as real images (poster + three frames), with alt text from the extraction.
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
await page.waitForTimeout(800);
const frames = await page.evaluate(() => [...document.querySelectorAll('main img[src*="/work/mcdonalds-chicken-mcwings/"]')].filter((i) => i.alt).map((i) => ({ ok: i.complete && i.naturalWidth >= 1920, alt: i.alt })));
check(frames.length === 7 && frames.every((f) => f.ok && f.alt.length > 5), `all 7 McWings stills load at full resolution with alt text (${frames.length} images)`);
for (const slug of ["mcdonalds-chicken-mcwings", "harshita-gaur", "zykaz-cafe"]) {
  await page.goto(`${base}/work/${slug}/`, { waitUntil: "networkidle" });
  const c = await croppedOn();
  check(c.length === 0, `${slug}: every frame shown whole, in its own shape (${c.length} cropped)`);
}
await page.goto(`${base}/work/mcdonalds-chicken-mcwings/`, { waitUntil: "networkidle" });
await page.goto(`${base}/work/pc-jeweller-tvc/`, { waitUntil: "networkidle" });
const partial = await page.evaluate(() => document.querySelector("main").innerText);
check((await storyOf()).length === 0 && !/\[(Client|Year|Name|One-line|Two or three|How we cracked|Where it ran)/.test(partial) && /R Balki/.test(partial), "a partly filled film shows only what the studio gave, with no placeholders");
await page.goto(`${base}/work/`, { waitUntil: "networkidle" });
// No still is cropped: every cover-fitted image sits in a box of its own shape (16:9, 9:16, 4:3, 2.39:1…).
async function croppedOn() {
  return page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    await new Promise((r) => setTimeout(r, 600));
    return [...document.querySelectorAll("main img")]
      .filter((i) => i.alt && getComputedStyle(i).objectFit === "cover" && i.naturalWidth)
      .map((i) => ({ box: i.clientWidth / i.clientHeight, img: i.naturalWidth / i.naturalHeight, src: i.getAttribute("src") }))
      .filter((r) => Math.abs(r.box / r.img - 1) > 0.015);
  });
}
const cropWork = await croppedOn();
check(cropWork.length === 0, `work cards show each still whole, in its own shape (${cropWork.length} cropped${cropWork[0] ? ": " + cropWork[0].src : ""})`);
await page.evaluate(() => scrollTo(0, 0));
const workText = await page.evaluate(() => document.querySelector("main").innerText);
check(!/\[(Client|Year|STILL)/.test(workText), "work cards show real stills and no [Client], [Year] or [ STILL ] placeholders");
// Films without stills or without written content are listed by name only, under "Publishing soon", and get no page.
const soon = page.locator('section[aria-label="Publishing soon"]');
check((await soon.getByText("pTron", { exact: true }).count()) === 1 && (await soon.locator("a").count()) === 0, "unfinished films are listed by name under Publishing soon, without links");
check((await page.request.get(`${base}/work/ptron/`)).status() === 404, "an unpublished film has no page yet");
check((await page.getByRole("link", { name: "Work" }).first().getAttribute("aria-current")) === "page", "nav marks Work active on a project page");
await page.goto(`${base}/work/s-and-s-trailer/`, { waitUntil: "networkidle" });
check((await page.locator('a[href^="/work/mcdonalds-chicken-mcwings"]').count()) > 0, "last project's Next up wraps to the first");

console.log("Originals");
await page.goto(`${base}/originals/`, { waitUntil: "networkidle" });
const pod = page.locator("#podcast");
check((await pod.getByRole("heading", { name: /Coming\s+soon/ }).isVisible()) && (await pod.locator("li").count()) === 3, "Originals podcast: Coming soon heading and what-to-expect list");
check((await pod.locator("button").count()) === 0 && !(await page.getByText(/Latest episode|Every episode|\[Guest\]/).count()), "Originals podcast: no player or episode placeholders");

console.log("Start a project");
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "music video", exact: true }).click();
await page.getByRole("button", { name: "agency", exact: true }).click();
await page.getByRole("link", { name: /Tell us the rest/ }).click();
await page.waitForURL(/start-a-project/);
await page.waitForTimeout(300);
check((await page.getByRole("radio", { name: "music video" }).getAttribute("aria-checked")) === "true" && (await page.getByRole("radio", { name: "agency" }).getAttribute("aria-checked")) === "true", `homepage sentence pre-fills the form (${new URL(page.url()).search})`);
await page.waitForTimeout(700); // sentence words settle
const summary = () => page.locator("form p").first().innerText().then((x) => x.replace(/\s+/g, " "));
check(/You need a music video for an agency, as soon as possible\./.test(await summary()), `live sentence → "${await summary()}"`);
await page.getByRole("radio", { name: "Flexible" }).click();
await page.waitForTimeout(700); // the phrase swaps with a fade
check(/whenever it’s right\./.test(await summary()), "When chip updates the sentence");
await page.getByRole("radio", { name: "music video" }).focus();
await page.keyboard.press("ArrowRight");
check((await page.getByRole("radio", { name: "fashion film" }).getAttribute("aria-checked")) === "true" && (await page.evaluate(() => document.activeElement?.textContent)) === "fashion film", "ArrowRight selects and focuses the next format");
check((await page.locator('[role="radiogroup"]').count()) === 4 && (await page.locator('[role="radio"][tabindex="0"]').count()) === 4, "4 radio groups, one tab stop each");
await page.locator("#c-fmt-other").fill("an animated explainer");
await page.locator("#c-who-other").fill("a startup");
await page.waitForTimeout(700);
check(/You need an animated explainer for a startup,/.test(await summary()), `typed answers fill the sentence → "${await summary()}"`);
check((await page.locator('[aria-labelledby="q-fmt"] [aria-checked="true"], [aria-labelledby="q-who"] [aria-checked="true"]').count()) === 0 && (await page.locator('[role="radio"][tabindex="0"]').count()) === 4, "typing un-checks the chips, tab stops stay");
await page.getByRole("radio", { name: "agency" }).click();
await page.waitForTimeout(700);
check((await page.locator("#c-who-other").inputValue()) === "" && /for an agency,/.test(await summary()) && /an animated explainer/.test(await summary()), "picking a chip clears only its typed answer");
await page.getByRole("button", { name: "Send it over →" }).click();
check((await page.locator('[aria-invalid="true"]').count()) === 3, "empty submit flags name, email and brief");
check((await page.evaluate(() => document.activeElement?.getAttribute("name"))) === "name", "focus moves to the first error");
await page.getByLabel("Your name").fill("Test Person");
await page.getByLabel("Email").fill("not-an-email");
await page.getByLabel("The story so far").fill("A launch film.");
await page.getByRole("button", { name: "Send it over →" }).click();
check((await page.getByText("That email doesn’t look quite right.").isVisible()), "bad email is caught");
await page.getByLabel("Email").fill("test@brand.com");
await page.getByRole("button", { name: "Send it over →" }).click();
await page.waitForURL(/\/thanks\/?$/, { timeout: 8000 }).catch(() => {});
check(/\/thanks\/?$/.test(new URL(page.url()).pathname), `valid submit lands on /thanks (${page.url()})`);
check(await page.getByText("Cut. Print. Talk soon.").isVisible(), "Thanks footer sign-off");
check((await page.getByRole("link", { name: "Start a project" }).first().getAttribute("aria-current")) === "page", "nav CTA marked current on Thanks");

console.log("Legal, 404");
await page.goto(`${base}/privacy/`, { waitUntil: "networkidle" });
await page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name: "Cookies" }).click();
await page.waitForTimeout(300);
const inView = await page.locator("#p7").evaluate((el) => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.top < 200; });
check(page.url().endsWith("#p7") && inView, "Privacy anchor nav jumps to Cookies");
check((await page.locator("#p1, #p2, #p3, #p4, #p5, #p6, #p7, #p8, #p9, #p10, #p11, #p12, #p13").count()) === 13, "Privacy has 13 sections");
await page.goto(`${base}/terms/`, { waitUntil: "networkidle" });
check((await page.locator('section[id^="t"]').count()) === 11, "Terms has 11 sections");
const res = await page.goto(`${base}/missing-page/`, { waitUntil: "networkidle" });
check(res.status() === 404 && (await page.getByText("This scene didn’t make the edit.").isVisible()), `unknown URL → 404 page (${res.status()})`);

console.log("Theme across pages");
await page.goto(`${base}/?theme=dark`, { waitUntil: "networkidle" });
await page.getByRole("switch", { name: "Dark theme" }).click();
await page.waitForTimeout(900);
await page.locator('nav a[href="/studio"], nav a[href="/studio/"]').first().click();
await page.waitForURL(/\/studio/);
check((await root(page).getAttribute("data-theme")) === "light", "Light carries over on client navigation");
await page.goto(`${base}/people/`, { waitUntil: "networkidle" });
check((await root(page).getAttribute("data-theme")) === "light", "…and after a fresh load without the query");
await page.goto(`${base}/?theme=dark`, { waitUntil: "networkidle" }); // back to the default

console.log("Mobile menu");
const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
await phone.goto(`${base}/work/`, { waitUntil: "networkidle" });
await phone.getByRole("button", { name: "Open menu" }).click();
const menu = phone.locator("#fm-menu");
check(await menu.isVisible(), "menu opens");
await phone.waitForTimeout(600);
check((await menu.evaluate((el) => getComputedStyle(el).opacity)) === "1", "menu panel animates fully in");
await phone.keyboard.press("Escape");
await menu.waitFor({ state: "detached", timeout: 2000 }).catch(() => {});
check(!(await menu.isVisible()), "Esc closes the menu");
await phone.getByRole("button", { name: "Open menu" }).click();
await menu.getByRole("link", { name: /Originals/ }).click();
await phone.waitForURL(/\/originals/);
await phone.waitForTimeout(300);
check(!(await menu.isVisible()), "navigating closes the menu");
await phone.close();

console.log("Contrast sweep · every page");
const PAGES = ["/work/", "/work/mcdonalds-chicken-mcwings/", "/work/pc-jeweller-tvc/", "/studio/", "/originals/", "/people/", "/start-a-project/", "/thanks/", "/privacy/", "/terms/", "/missing-page/"];
for (const [label, q] of [["Light", "theme=light"], ["Dark", "theme=dark"]]) {
  const bad = [];
  for (const r of PAGES) {
    await page.goto(`${base}${r}?${q}`, { waitUntil: "networkidle" });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(250);
    bad.push(...(await contrastSweep(page)).map((b) => `${r} ${b}`));
  }
  check(bad.length === 0, `${label}: every page ≥ WCAG AA${bad.length ? `\n      ${bad.slice(0, 15).join("\n      ")}` : ""}`);
}

console.log("Motion (homepage)");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mp = await ctx.newPage();
  mp.on("pageerror", (e) => errors.push(String(e)));
  mp.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await mp.goto(`${base}/`, { waitUntil: "networkidle" });
  await mp.waitForTimeout(1500);
  // Drag the blob mark far across the page; it follows, then springs back on release.
  const mark = mp.locator("section#top > div.cursor-grab").first();
  const home = await mark.boundingBox();
  await mp.mouse.move(home.x + home.width / 2, home.y + home.height / 2);
  await mp.mouse.down();
  await mp.mouse.move(home.x + 700, home.y + 420, { steps: 12 });
  await mp.waitForTimeout(150);
  const held = await mark.boundingBox();
  check(Math.abs(held.x - home.x) > 500 && Math.abs(held.y - home.y) > 300, `blob follows the drag (moved ${Math.round(held.x - home.x)}, ${Math.round(held.y - home.y)})`);
  await mp.mouse.up();
  await mp.mouse.move(5, 5); // off the mark, so its hover lift ends too
  await mp.waitForTimeout(1600);
  const back = await mark.boundingBox();
  check(Math.abs(back.x - home.x) < 2 && Math.abs(back.y - home.y) < 2, `blob springs back on release (off by ${Math.round(back.x - home.x)}, ${Math.round(back.y - home.y)})`);
  // The showreel is straight, and grows in place while the page scrolls until it covers ~70% of the window.
  const reel = mp.getByRole("button", { name: "Open the showreel" });
  const tilt = await reel.evaluate((el) => getComputedStyle(el).transform);
  const sizes = [];
  for (const y of [300, 900, 1200, 1450, 1800]) {
    await mp.evaluate((y) => window.scrollTo(0, y), y);
    await mp.waitForTimeout(600);
    const r = await reel.boundingBox();
    sizes.push({ y, cover: (r.width * r.height) / (1440 * 900), centre: r.y + r.height / 2 });
  }
  const pinned = sizes.slice(1, 4);
  check(tilt === "none", `showreel card is straight (${tilt})`);
  check(
    sizes[0].cover < 0.3 && pinned.every((s, i) => i === 0 || s.cover > pinned[i - 1].cover) && pinned.every((s) => Math.abs(s.centre - 450) < 4),
    `showreel grows while held in the middle (${pinned.map((s) => Math.round(s.cover * 100) + "%").join(" → ")})`,
  );
  check(Math.abs(sizes[4].cover - 0.7) < 0.03 && sizes[4].centre < 450, `showreel reaches ~70% of the window, then the page scrolls on (${Math.round(sizes[4].cover * 100)}%)`);
  await mp.evaluate(() => window.scrollTo(0, 0));
  await mp.waitForTimeout(400);
  // Sections below the fold start hidden and reveal when scrolled to.
  const people = mp.locator("#ch5 h2");
  const before = await people.evaluate((el) => getComputedStyle(el.closest("[data-reveal]")).opacity);
  await people.scrollIntoViewIfNeeded();
  await mp.waitForTimeout(1400);
  const after = await people.evaluate((el) => getComputedStyle(el.closest("[data-reveal]")).opacity);
  check(before === "0" && after === "1", `below-the-fold heading reveals on scroll (opacity ${before} → ${after})`);
  // Scroll-linked: the hero text drifts away; there is no progress bar across the top.
  const bar = await mp.evaluate(() => [...document.querySelectorAll("body *")].some((el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.position === "fixed" && r.top === 0 && r.height <= 4 && r.width > 200; }));
  const heroY = await mp.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector("section#top > div.flex")).transform).m42);
  check(!bar && heroY > 20, `no top progress bar, and hero text drifts (${Math.round(heroY)}px)`);
  await ctx.close();
  // Without JavaScript nothing is left hidden.
  const nojs = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const np = await nojs.newPage();
  await np.goto(`${base}/`, { waitUntil: "load" });
  const hidden = await np.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((el) => getComputedStyle(el).opacity !== "1").length);
  check(hidden === 0, `without JavaScript every section is visible (${hidden} hidden)`);
  await nojs.close();
}

console.log("Motion (other pages)");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const sp = await ctx.newPage();
  sp.on("pageerror", (e) => errors.push(String(e)));
  // A section below the fold starts hidden and reveals when scrolled to (Studio's process cards).
  await sp.goto(`${base}/studio/`, { waitUntil: "networkidle" });
  await sp.waitForTimeout(1200);
  const card = sp.locator('section[aria-label="How we work"] li').first();
  const o1 = await card.evaluate((el) => getComputedStyle(el).opacity);
  await card.scrollIntoViewIfNeeded();
  await sp.waitForTimeout(1500);
  const o2 = await card.evaluate((el) => getComputedStyle(el).opacity);
  const tilt = await card.evaluate((el) => getComputedStyle(el.firstElementChild).transform);
  check(o1 === "0" && o2 === "1" && tilt !== "none", `Studio cards reveal on scroll and keep their tilt (opacity ${o1} → ${o2})`);
  // The hero plays in on load.
  await sp.goto(`${base}/people/`, { waitUntil: "networkidle" });
  await sp.waitForTimeout(1800);
  const h1 = await sp.evaluate(() => getComputedStyle(document.querySelector("h1").closest("[data-reveal]")).opacity);
  check(h1 === "1", "People hero plays in on load");
  await ctx.close();
  // Without JavaScript nothing is hidden on any page.
  const nojs = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const np = await nojs.newPage();
  const hiddenOn = [];
  for (const r of ["/work/", "/work/mcdonalds-chicken-mcwings/", "/work/pc-jeweller-tvc/", "/studio/", "/originals/", "/people/", "/start-a-project/", "/thanks/", "/privacy/", "/missing-page/"]) {
    await np.goto(`${base}${r}`, { waitUntil: "load" });
    const n = await np.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((el) => getComputedStyle(el).opacity !== "1").length);
    if (n) hiddenOn.push(`${r}: ${n}`);
  }
  check(hiddenOn.length === 0, `without JavaScript every page is fully visible${hiddenOn.length ? ` (${hiddenOn.join(", ")})` : ""}`);
  await nojs.close();
}

check(errors.length === 0, `no page errors${errors.length ? `: ${errors.join("; ")}` : ""}`);
await browser.close();
process.exit(failures ? 1 : 0);

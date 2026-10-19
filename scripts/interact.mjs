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
// YouTube is out of reach in some test environments: thumbnails are answered with one of the site's own
// 16:9 frames, and the player itself isn't loaded. Every page and context the checks open goes through this.
const youtubeStandIn = async (target) => {
  await target.route("https://i.ytimg.com/**", (r) => r.fulfill({ path: "public/work/dbs-lifestyle/01.jpg", contentType: "image/jpeg" }));
  await target.route(/youtube(-nocookie)?\.com\//, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>YouTube</title>" }));
};
const origNewPage = browser.newPage.bind(browser);
browser.newPage = async (...a) => { const pg = await origNewPage(...a); await youtubeStandIn(pg); return pg; };
const origNewContext = browser.newContext.bind(browser);
browser.newContext = async (...a) => { const c = await origNewContext(...a); await youtubeStandIn(c); return c; };
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
// Enquiries never leave the test: the studio's Google Apps Script endpoint is answered here instead, and
// what the forms send is kept for the checks. `enquiryReply` switches the answer (ok, or a failure).
const enquiries = [];
let enquiryReply = { ok: true };
await page.route("https://script.google.com/**", async (route) => {
  const req = route.request();
  enquiries.push({ type: req.headers()["content-type"], body: JSON.parse(req.postData() || "{}") });
  await route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(enquiryReply) });
});
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
// When the reel finishes, the player closes by itself.
await page.getByRole("button", { name: "Open the showreel" }).click();
await shows(full);
await full.evaluate((v) => v.dispatchEvent(new Event("ended")));
check(await theatre.waitFor({ state: "detached", timeout: 3000 }).then(() => true, () => false), "the full reel closes by itself when it ends");
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
// Hero "Press play" → hero leaves, screen goes black, 3-2-1, then the full reel plays full screen.
await page.evaluate(() => window.scrollTo(0, 0));
await page.evaluate(() => {
  // Record each countdown beep's pitch.
  window.__beeps = [];
  const create = AudioContext.prototype.createOscillator;
  AudioContext.prototype.createOscillator = function () {
    const o = create.call(this);
    const start = o.start.bind(o);
    o.start = (...a) => (window.__beeps.push(o.frequency.value), start(...a));
    return o;
  };
});
await page.getByRole("button", { name: "Press play" }).click();
const dialog = page.getByRole("dialog", { name: "Freaky Mack Studios showreel" });
await page.waitForTimeout(1000);
const away = await page.evaluate(() => {
  const op = (sel) => Number(getComputedStyle(document.querySelector(sel)).opacity);
  const x = (sel) => document.querySelector(sel).getBoundingClientRect().left;
  return { text: op('#top [data-exit="fade"]'), logo: x('header [data-exit="left"]'), cta: x('header [data-exit="right"]'), scroll: getComputedStyle(document.documentElement).overflow };
});
check(away.text < 0.05 && away.logo < -1000 && away.cta > 1440 && away.scroll === "hidden", `Press play: hero text fades, logo exits left, CTA exits right, scroll locked (${JSON.stringify(away)})`);
const counted = [];
for (let i = 0; i < 16 && counted.length < 3; i++) {
  const n = await dialog.locator("span").filter({ hasText: /^[123]$/ }).first().textContent({ timeout: 300 }).catch(() => null);
  if (n && counted.at(-1) !== n) counted.push(n);
  await page.waitForTimeout(250);
}
check(counted.join("") === "321", `countdown runs 3 → 2 → 1 (${counted.join(",")})`);
await page.waitForTimeout(400);
const beeps = await page.evaluate(() => window.__beeps.map(Math.round));
check(beeps.join() === "880,880,1760", `countdown beeps on 3, 2 and 1, higher on 1 (${beeps.join(", ")} Hz)`);
const cinemaVideo = dialog.locator("video");
await page.waitForFunction(() => document.querySelector('[role="dialog"] video')?.dataset.on === "true", null, { timeout: 3000 }).catch(() => {});
const cv = await cinemaVideo.evaluate((v) => ({ on: v.dataset.on, controls: v.controls, sources: v.querySelectorAll("source").length, op: getComputedStyle(v).opacity }));
check(cv.on === "true" && cv.controls && cv.sources === 4, `full reel takes the screen with controls after the countdown (${JSON.stringify(cv)})`);
await page.mouse.wheel(0, 500);
await page.waitForTimeout(300);
check((await dialog.getByText("Close the reel to keep scrolling").isVisible()) && (await page.evaluate(() => window.scrollY)) === 0, "scrolling during the reel is held and nudges to close it");
await page.keyboard.press("Escape");
await page.waitForTimeout(1600);
const back = await page.evaluate(() => ({
  cinema: document.querySelector("[data-cinema]") !== null,
  text: Number(getComputedStyle(document.querySelector('#top [data-exit="fade"]')).opacity),
  focus: document.activeElement?.textContent?.trim(),
  scroll: getComputedStyle(document.documentElement).overflow,
}));
check(!back.cinema && back.text > 0.95 && back.focus === "Press play" && back.scroll !== "hidden", `Escape ends the reel, the hero comes back and focus returns (${JSON.stringify(back)})`);
// And when the reel finishes, it takes the visitor straight back to the page.
await page.getByRole("button", { name: "Press play" }).click();
await page.waitForFunction(() => document.querySelector('[role="dialog"] video')?.dataset.on === "true", null, { timeout: 8000 }).catch(() => {});
await page.evaluate(() => document.querySelector('[role="dialog"] video').dispatchEvent(new Event("ended")));
await page.waitForTimeout(1600);
const afterEnd = await page.evaluate(() => ({
  cinema: document.querySelector("[data-cinema]") !== null,
  text: Number(getComputedStyle(document.querySelector('#top [data-exit="fade"]')).opacity),
  scroll: getComputedStyle(document.documentElement).overflow,
  y: window.scrollY,
}));
check(!afterEnd.cinema && afterEnd.text > 0.95 && afterEnd.scroll !== "hidden" && afterEnd.y === 0, `when the reel ends, the visitor is back on the page automatically (${JSON.stringify(afterEnd)})`);
await page.locator("#ch1 li").nth(2).hover();
await page.waitForTimeout(800);
const shownPreview = await page.evaluate(() => {
  const layer = [...document.querySelectorAll('#ch1 [aria-hidden="false"]')].find((e) => getComputedStyle(e).opacity === "1");
  return layer ? { text: layer.textContent, photos: layer.querySelectorAll("img[alt]:not([alt=''])").length } : null;
});
check(!!shownPreview && /PC Jeweller · Ad film/.test(shownPreview.text) && /PC Jeweller TVC/.test(shownPreview.text) && shownPreview.photos === 3, `hovering row 03 cross-fades to a collage of three PC Jeweller frames with its caption (${shownPreview?.photos} photos)`);
// Brand cloud: the project clients join the headline brands; hovering one with a film opens its cover,
// linking to the film on YouTube (a placeholder link until the real ones are in).
const clients = page.locator('section[aria-label="Clients"]');
// The site scrolls smoothly; Playwright would place the pointer mid-scroll and the tag would slide out from under it.
await page.evaluate(() => (document.documentElement.style.scrollBehavior = "auto"));
await clients.scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
check((await clients.locator("[data-brand]").count()) >= 20 && (await clients.getByRole("button", { name: "Google", exact: true }).count()) === 0, "brand cloud lists 20 brands; brands without a film are plain tags");
await clients.getByRole("button", { name: "Mercedes-Benz", exact: true }).hover();
await page.waitForFunction(() => [...document.querySelectorAll("[id^='brand-card-']")].some((c) => getComputedStyle(c).opacity === "1"), null, { timeout: 3000 }).catch(() => {});
const card = clients.getByRole("link", { name: /Watch Mercedes-Benz Global Star .* on YouTube/ });
const cardOk = await card.evaluate((a) => {
  const box = a.closest("[id^='brand-card-']");
  const img = a.querySelector("img[alt]:not([alt=''])");
  return { op: getComputedStyle(box).opacity, href: a.getAttribute("href"), target: a.target, img: !!img && img.naturalWidth > 0 };
});
check(cardOk.op === "1" && cardOk.href === "https://youtu.be/nbpE1OmMjmU" && cardOk.target === "_blank" && cardOk.img, `hovering a brand shows its film's cover, linking to the film on YouTube (${JSON.stringify(cardOk)})`);
await page.mouse.move(5, 5);
await page.waitForTimeout(600);
check((await card.evaluate((a) => getComputedStyle(a.closest("[id^='brand-card-']")).opacity)) === "0", "the brand card fades away when the pointer leaves");
await page.evaluate(() => (document.documentElement.style.scrollBehavior = ""));
// Testimonials: eight real quotes in cards of one size, stepped through with the arrows.
const quotes = page.locator('section[aria-label="What clients say"]');
await quotes.scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
const qInfo = await quotes.evaluate((sec) => {
  const figs = [...sec.querySelectorAll("figure")];
  return { n: figs.length, sizes: new Set(figs.map((f) => `${f.offsetWidth}x${f.offsetHeight}`)).size, text: sec.textContent };
});
check(qInfo.n === 8 && qInfo.sizes === 1 && !/\[(Client|Name|Role|Brand)/.test(qInfo.text) && /Rajpal Yadav/.test(qInfo.text) && /Bombay Times Team/.test(qInfo.text), `testimonials: 8 quotes, every card the same size, no placeholders (${qInfo.n} cards, ${qInfo.sizes} size)`);
const prevQ = quotes.getByRole("button", { name: "Previous testimonial" });
const nextQ = quotes.getByRole("button", { name: "Next testimonial" });
check((await prevQ.isDisabled()) && (await quotes.getByText("01 / 08").isVisible()), "testimonials start at 01 / 08 with Previous off");
await nextQ.click();
await page.waitForFunction(() => document.querySelector('section[aria-label="What clients say"]')?.textContent.includes("02 / 08"), null, { timeout: 3000 }).catch(() => {});
check((await quotes.getByText("02 / 08").count()) === 1 && !(await prevQ.isDisabled()), "Next steps one card and the counter follows");
await prevQ.click();
await page.waitForTimeout(800);
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
check(!(await ch4.getByText(/EPISODE ART|Episode title|Now playing/).count()), "podcast chapter: no episode placeholders");
// "Want to be on it? Say hello" brings you to Chapter 06, and white bubbles point out what to fill in.
const hintState = () => page.evaluate(() => {
  const r = document.querySelector("#contact form").getBoundingClientRect();
  return {
    inView: r.top < innerHeight && r.bottom > 0,
    shown: [...document.querySelectorAll("#contact [data-hint]")].map((h) => getComputedStyle(h).opacity === "1"),
    focus: document.activeElement?.id,
  };
});
await ch4.getByRole("link", { name: /Say hello/ }).click();
await page.waitForFunction(() => [...document.querySelectorAll("#contact [data-hint]")].every((h) => getComputedStyle(h).opacity === "1"), null, { timeout: 4000 }).catch(() => {});
let hs = await hintState();
check(hs.inView && hs.shown.length === 3 && hs.shown.every(Boolean) && hs.focus === "fm-name", `Say hello → Chapter 06, three bubbles, cursor in "Your name" (${JSON.stringify(hs)})`);
await page.locator("#fm-name").fill("Podcast Guest");
await page.waitForTimeout(500);
hs = await hintState();
check(!hs.shown[0] && hs.shown[1] && hs.shown[2], `a bubble goes once its field is filled (${JSON.stringify(hs.shown)})`);
await page.locator("#fm-name").fill("");

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
// The circle is a plain CSS animation on the transition layer (no CSS variables or script-driven animation
// there, which Safari handled unevenly: the light page popped in at once going to Light).
const circleOn = () => page.evaluate(() => new Promise((res) => setTimeout(() => res(document.getAnimations().filter((a) => a.animationName === "fm-vt").map((a) => a.effect.pseudoElement)), 120)));
await toggle.click();
const growOn = await circleOn();
check(growOn.length === 1 && growOn[0] === "::view-transition-new(root)", `to Light: the new (light) page grows out of the switch as a CSS-animated circle (${growOn})`);
await page.waitForTimeout(1000);
check((await root(page).getAttribute("data-theme")) === "light" && (await bg()) === "rgb(255, 255, 255)" && (await toggle.getAttribute("aria-checked")) === "false", "switch → Light: data-theme=light on white");
// On a cold start the transition's snapshot can take longer, so wait for it to finish rather than assume 1 s.
const vtDone = await page.waitForFunction(() => !document.documentElement.hasAttribute("data-vt"), null, { timeout: 4000 }).then(() => true, () => false);
check(vtDone && (await page.locator("style[data-vt-style]").count()) === 0, "the circle transition finishes and cleans up");
await page.reload({ waitUntil: "networkidle" });
check((await root(page).getAttribute("data-theme")) === "light", "reload keeps Light");
await toggle.click();
const shrinkOn = await circleOn();
check(shrinkOn.length === 1 && shrinkOn[0] === "::view-transition-old(root)", `to Dark: the old (light) page shrinks back into the switch (${shrinkOn})`);
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
check((await cards.count()) === 6 && allCount === 42 && !(await page.getByText(/in total/).count()), `Fashion films filter shows 6 of ${allCount}, with no visible count`);
check(!(await page.getByRole("radio", { name: "Documentaries" }).count()) && (await page.getByRole("radio", { name: "Music videos" }).count()) === 1, "formats with no published film have no filter chip (Documentaries); Music videos now has films");
await page.keyboard.press("ArrowRight");
check((await page.getByRole("radio", { name: "Event films" }).getAttribute("aria-checked")) === "true", "arrow key moves the filter");
await page.getByRole("radio", { name: "All work" }).click();
await cards.first().click();
await page.waitForURL(/\/work\/mcdonalds-chicken-mcwings\/?$/);
check(await page.getByText(`Film 01 of ${allCount}`).isVisible(), `project counter reads Film 01 of ${allCount}`);
// The film plays from YouTube: pressing play swaps the poster for the YouTube player.
const film = page.getByRole("button", { name: "Play McDonald’s Chicken McWings" });
await film.click();
const player = page.locator('iframe[src*="youtube-nocookie.com/embed/-Qhrky4ojhw"]');
check((await player.count()) === 1 && /autoplay=1/.test((await player.getAttribute("src")) ?? "") && (await player.getAttribute("title")) === "McDonald’s Chicken McWings on YouTube", "play → the film's YouTube player (privacy-enhanced, autoplay)");
check((await page.locator('a[href="/work/mcdonalds-veg-surprise/"], a[href="/work/mcdonalds-veg-surprise"]').count()) > 0, "Next up links to the second film");
// A film the studio filled in completely shows every part of its story; one it left partly blank shows only what it gave.
const storyOf = () => page.evaluate(() => ["The brief", "The idea", "On screen"].filter((l) => [...document.querySelectorAll("main *")].some((e) => e.children.length === 0 && e.textContent.trim() === l)));
check((await storyOf()).length === 3, "a fully filled film shows its brief, idea and on-screen story");
// Stills: the film's frames load as real images (poster + three frames), with alt text from the extraction.
// (Reloaded first: pressing play above swapped the poster for the YouTube player.)
await page.reload({ waitUntil: "networkidle" });
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
await page.waitForTimeout(800);
const frames = await page.evaluate(() => [...document.querySelectorAll('main img[src*="/work/mcdonalds-chicken-mcwings/"]')].filter((i) => i.alt).map((i) => ({ ok: i.complete && i.naturalWidth >= 1920, alt: i.alt })));
check(frames.length === 7 && frames.every((f) => f.ok && f.alt.length > 5), `all 7 McWings stills load at full resolution with alt text (${frames.length} images)`);
// Project images come in film shapes only: 16:9, or 9:16 for vertical films. McWings (2.55:1 frames),
// Harshita Gaur (vertical) and Zykaz Cafe (4:3) cover each case.
for (const slug of ["mcdonalds-chicken-mcwings", "harshita-gaur", "zykaz-cafe"]) {
  await page.goto(`${base}/work/${slug}/`, { waitUntil: "networkidle" });
  const c = await offShape();
  check(c.length === 0, `${slug}: every frame sits in a 16:9 (or 9:16 vertical) box (${c.length} off${c[0] ? ": " + JSON.stringify(c[0]) : ""})`);
}
await page.goto(`${base}/work/mcdonalds-chicken-mcwings/`, { waitUntil: "networkidle" });
await page.goto(`${base}/work/pc-jeweller-tvc/`, { waitUntil: "networkidle" });
const partial = await page.evaluate(() => document.querySelector("main").innerText);
check((await storyOf()).length === 0 && !/\[(Client|Year|Name|One-line|Two or three|How we cracked|Where it ran)/.test(partial) && /R Balki/.test(partial), "a partly filled film shows only what the studio gave, with no placeholders");
// A film added from the YouTube links sheet: its YouTube thumbnail is the cover, it plays from YouTube, and
// with no credits, story or frames of its own the page shows just the film.
await page.goto(`${base}/work/neeta-lulla-show/`, { waitUntil: "networkidle" });
const ytOnly = await page.evaluate(() => {
  const main = document.querySelector("main");
  const cover = main.querySelector('img[src*="i.ytimg.com/vi/ii-EsNFShMY/"]');
  return {
    cover: !!cover && cover.complete && cover.naturalWidth > 120,
    credits: /Credits/.test(main.innerText),
    frames: /Frames from the film/.test(main.innerText),
    title: /NEETA LULLA SHOW/i.test(main.innerText),
  };
});
check(ytOnly.cover && ytOnly.title && !ytOnly.credits && !ytOnly.frames, `a YouTube-only film: thumbnail cover, title, no empty credits or frames (${JSON.stringify(ytOnly)})`);
await page.getByRole("button", { name: "Play Neeta Lulla Show" }).click();
check((await page.locator('iframe[src*="youtube-nocookie.com/embed/ii-EsNFShMY"]').count()) === 1, "a YouTube-only film plays from YouTube");
await page.goto(`${base}/work/`, { waitUntil: "networkidle" });
// Project images: every cover-fitted image sits in a 16:9 box, or 9:16 when the frame is vertical.
async function offShape() {
  return page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    await new Promise((r) => setTimeout(r, 600));
    return [...document.querySelectorAll("main img")]
      .filter((i) => i.alt && getComputedStyle(i).objectFit === "cover" && i.naturalWidth && i.clientHeight)
      .map((i) => ({ box: +(i.clientWidth / i.clientHeight).toFixed(3), tall: i.naturalHeight > i.naturalWidth, src: i.getAttribute("src") }))
      .filter((r) => Math.abs(r.box / (r.tall ? 9 / 16 : 16 / 9) - 1) > 0.015);
  });
}
const offWork = await offShape();
check(offWork.length === 0, `work cards: every cover is 16:9 (or 9:16 vertical) (${offWork.length} off${offWork[0] ? ": " + JSON.stringify(offWork[0]) : ""})`);
await page.evaluate(() => scrollTo(0, 0));
const workText = await page.evaluate(() => document.querySelector("main").innerText);
check(!/\[(Client|Year|STILL)/.test(workText), "work cards show real stills and no [Client], [Year] or [ STILL ] placeholders");
// Films with no public video and no finished write-up are listed by name only, under "Publishing soon", and
// get no page. Films with a YouTube video are on the site.
const soon = page.locator('section[aria-label="Publishing soon"]');
const soonText = await soon.innerText();
check(
  ["Rudraprayag", "Zykaz Interview", "Soanbhadra", "PC Jeweller × Sonalika Sahay", "The Last Presence — Teaser"].every((n) => soonText.includes(n)) &&
    !/Neeta Lulla|Albela|pTron/.test(soonText) && (await soon.locator("a").count()) === 0,
  "Publishing soon: only the five films with no public video, by name, without links",
);
check((await page.request.get(`${base}/work/rudraprayag/`)).status() === 404 && (await page.request.get(`${base}/work/ptron/`)).status() === 200, "an unpublished film has no page; a film with a YouTube video does");
check((await page.getByRole("link", { name: "Work" }).first().getAttribute("aria-current")) === "page", "nav marks Work active on a project page");
await page.goto(`${base}/work/sang-tu-chalen/`, { waitUntil: "networkidle" });
check((await page.locator('a[href^="/work/mcdonalds-chicken-mcwings"]').count()) > 0, "last project's Next up wraps to the first");

console.log("Originals");
await page.goto(`${base}/originals/`, { waitUntil: "networkidle" });
const pod = page.locator("#podcast");
check((await pod.getByRole("heading", { name: /Coming\s+soon/ }).isVisible()) && (await pod.locator("li").count()) === 3, "Originals podcast: Coming soon heading and what-to-expect list");
check((await pod.locator("button").count()) === 0 && !(await page.getByText(/Latest episode|Every episode|\[Guest\]/).count()), "Originals podcast: no player or episode placeholders");
await pod.getByRole("link", { name: /Say hello/ }).click();
await page.waitForURL((u) => new URL(u).pathname === "/", { timeout: 8000 }).catch(() => {});
await page.waitForFunction(() => [...document.querySelectorAll("#contact [data-hint]")].every((h) => getComputedStyle(h).opacity === "1"), null, { timeout: 6000 }).catch(() => {});
const fromOriginals = await page.evaluate(() => ({
  url: location.pathname + location.search + location.hash,
  shown: [...document.querySelectorAll("#contact [data-hint]")].filter((h) => getComputedStyle(h).opacity === "1").length,
  inView: (() => { const r = document.querySelector("#contact form").getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })(),
}));
check(fromOriginals.url === "/#contact" && fromOriginals.shown === 3 && fromOriginals.inView, `Originals' Say hello lands on the homepage form with the bubbles, and tidies the address (${JSON.stringify(fromOriginals)})`);

console.log("Start a project");
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "music video", exact: true }).click();
await page.getByRole("button", { name: "agency", exact: true }).click();
await page.getByRole("link", { name: /Tell us the rest/ }).click();
await page.waitForURL(/start-a-project/);
await page.waitForTimeout(300);
// Content form: no budget bands (the studio quotes per project), and all three studio numbers.
check(!(await page.getByText(/Budget range|\[Range/).count()) && (await page.getByText(/no fixed budget/).count()) === 1, "no budget question; the next steps say quotes are built per project");
check((await page.locator('main a[href^="tel:"]').count()) === 3 && (await page.locator('a[href="https://wa.me/919318465829"]').count()) >= 1, "Start a project lists all three phone numbers and the WhatsApp number");
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
check((await page.locator('[role="radiogroup"]').count()) === 3 && (await page.locator('[role="radio"][tabindex="0"]').count()) === 3, "3 radio groups, one tab stop each");
await page.locator("#c-fmt-other").fill("an animated explainer");
await page.locator("#c-who-other").fill("a startup");
await page.waitForTimeout(700);
check(/You need an animated explainer for a startup,/.test(await summary()), `typed answers fill the sentence → "${await summary()}"`);
check((await page.locator('[aria-labelledby="q-fmt"] [aria-checked="true"], [aria-labelledby="q-who"] [aria-checked="true"]').count()) === 0 && (await page.locator('[role="radio"][tabindex="0"]').count()) === 3, "typing un-checks the chips, tab stops stay");
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
const sendMode = await page.locator("form[data-send]").getAttribute("data-send");
// The contrast sweeps above switch the page to reduced motion; the send sequence needs full motion.
await page.emulateMedia({ reducedMotion: "no-preference" });
if (sendMode === "post") {
  // The endpoint fails: the visitor is told, stays put and keeps what they typed.
  enquiryReply = { ok: false, error: "test" };
  await page.getByRole("button", { name: "Send it over →" }).click();
  await page.getByText("That didn’t go through.", { exact: false }).waitFor({ timeout: 10000 }).catch(() => {});
  await page.waitForFunction(() => !document.getElementById("fm-curtain"), null, { timeout: 4000 }).catch(() => {});
  const back = await page.evaluate(() => ({ curtain: !!document.getElementById("fm-curtain"), envelope: !!document.getElementById("fm-envelope"), form: getComputedStyle(document.querySelector("form[data-send]")).visibility }));
  check((await page.getByText("That didn’t go through.", { exact: false }).isVisible()) && /start-a-project/.test(page.url()) && (await page.getByLabel("Your name").inputValue()) === "Test Person" && !back.curtain && !back.envelope && back.form === "visible", `a failed send: the curtain goes back, the form returns with the answers, and it says so (${JSON.stringify(back)})`);
  enquiryReply = { ok: true };
  enquiries.length = 0;
  await page.getByRole("button", { name: "Send it over →" }).click();
  // The send sequence: the form folds into an envelope that flies off, then the black curtain covers the
  // screen; no "Sending…" line shows (it is only announced to screen readers).
  const env = await page.waitForSelector("#fm-envelope", { timeout: 2000 }).then(() => true, () => false);
  const quiet = await page.evaluate(() => { const st = document.querySelector("form[data-send] [role=status]"); return !st || st.classList.contains("sr-only"); });
  const curtain = await page.waitForSelector("#fm-curtain", { timeout: 5000 }).then(() => true, () => false);
  check(env && quiet && curtain, `sending: envelope, then the black curtain; no visible "Sending" text (envelope ${env}, curtain ${curtain})`);
  await page.waitForURL(/\/thanks\/?$/, { timeout: 8000 }).catch(() => {});
  const sent = enquiries[0];
  // On Thanks the curtain slides away and the pieces fly in and settle.
  await page.waitForFunction(() => !document.getElementById("fm-curtain"), null, { timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(1600);
  const settled = await page.evaluate(() => [...document.querySelectorAll("main [data-reveal]")].slice(0, 6).map((n) => getComputedStyle(n)).every((cs) => cs.opacity === "1" && (cs.transform === "none" || cs.transform === "matrix(1, 0, 0, 1, 0, 0)")));
  check(!(await page.evaluate(() => !!document.getElementById("fm-curtain"))) && settled, "Thanks: the curtain slides away and every piece lands in place");
  check(/\/thanks\/?$/.test(new URL(page.url()).pathname), `a confirmed send lands on /thanks (${page.url()})`);
  check(enquiries.length === 1 && /^text\/plain/.test(sent.type) && sent.body.name === "Test Person" && sent.body.email === "test@brand.com" && sent.body.brief === "A launch film." && sent.body.format === "an animated explainer" && /agency/.test(sent.body.audience) && !!sent.body.timing && sent.body.source === "Start a project" && /New enquiry/.test(sent.body.subject), `the enquiry carries every answer, as a simple text/plain request (${JSON.stringify(sent?.body)})`);
} else {
  // No endpoint in this build: the email app opens and the page asks them to press Send there.
  await page.getByRole("button", { name: "Send it over →" }).click();
  await page.waitForTimeout(800);
  check(/start-a-project/.test(page.url()) && (await page.getByText("Press Send there", { exact: false }).isVisible()), "without an endpoint: the email app opens and the page asks them to press Send (no Thanks yet)");
  await page.goto(`${base}/thanks/`, { waitUntil: "networkidle" });
}
check(await page.getByText("Cut. Print. Talk soon.").isVisible(), "Thanks footer sign-off");
check((await page.getByRole("link", { name: "Start a project" }).first().getAttribute("aria-current")) === "page", "nav CTA marked current on Thanks");
// The homepage form sends the same way, and drops what a bot fills into the hidden field.
const homeForm = async () => {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const f = page.locator("#contact form");
  await f.scrollIntoViewIfNeeded();
  await f.getByLabel("Your name").fill("Home Tester");
  await f.getByLabel("Email").fill("home@brand.com");
  await f.getByLabel("The story so far").fill("A 30s ad film.");
  return f;
};
if (sendMode === "post") {
  enquiries.length = 0;
  await (await homeForm()).getByRole("button", { name: "Send it over" }).click();
  await page.waitForURL(/\/thanks\/?$/, { timeout: 8000 }).catch(() => {});
  check(/\/thanks\/?$/.test(new URL(page.url()).pathname) && enquiries.length === 1 && enquiries[0].body.source === "Homepage" && enquiries[0].body.name === "Home Tester", `homepage form sends (source: Homepage) and lands on /thanks`);
  enquiries.length = 0;
  const f = await homeForm();
  await f.locator('input[name="website"]').evaluate((el) => { el.value = "http://spam.example"; });
  await f.getByRole("button", { name: "Send it over" }).click();
  await page.waitForURL(/\/thanks\/?$/, { timeout: 8000 }).catch(() => {});
  check(enquiries.length === 0 && /\/thanks\/?$/.test(new URL(page.url()).pathname), "a bot that fills the hidden field sees Thanks, but nothing is sent");
} else {
  await (await homeForm()).getByRole("button", { name: "Send it over" }).click();
  await page.waitForTimeout(800);
  check(new URL(page.url()).pathname === "/" && (await page.getByText("Press Send there", { exact: false }).isVisible()), "homepage form without an endpoint: asks them to press Send in their email app");
}
await page.emulateMedia({ reducedMotion: "reduce" }); // back to how the checks below expect it

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
// Phones: the homepage film list is a set of dropdowns; the open one shows one row of two frames.
await phone.goto(`${base}/`, { waitUntil: "networkidle" });
await phone.locator("#ch1").scrollIntoViewIfNeeded();
await phone.waitForTimeout(1200);
const panelState = () =>
  phone.evaluate(() =>
    [...document.querySelectorAll('#ch1 button[aria-controls^="ch1-panel-"]')].map((b) => {
      const panel = document.getElementById(b.getAttribute("aria-controls"));
      const imgs = [...panel.querySelectorAll("img[alt]:not([alt=''])")];
      const tops = new Set(imgs.map((i) => Math.round(i.getBoundingClientRect().top)));
      return { open: b.getAttribute("aria-expanded") === "true", h: Math.round(panel.getBoundingClientRect().height), imgs: imgs.length, rows: tops.size };
    }),
  );
let ps = await panelState();
check(ps.length === 6 && ps[0].open && ps[0].h > 80 && ps[0].imgs === 2 && ps[0].rows === 1 && ps.slice(1).every((p) => !p.open && p.h < 2), `phone: first film open with one row of two frames, the rest closed (${JSON.stringify(ps.map((p) => p.h))})`);
await phone.locator('#ch1 button[aria-controls="ch1-panel-2"]').click();
await phone.waitForTimeout(900);
ps = await panelState();
check(ps[2].open && ps[2].h > 80 && ps[2].imgs === 2 && !ps[0].open && ps[0].h < 2, `phone: tapping another film opens it and closes the one before (${JSON.stringify(ps.map((p) => p.h))})`);
check((await phone.locator("#ch1-panel-2").getByRole("link", { name: "Open project →" }).getAttribute("href"))?.startsWith("/work/pc-jeweller-tvc"), "phone: the open film links to its project");
// Phones: "Say hello" goes to the form, with no bubbles.
{
  await phone.goto(`${base}/`, { waitUntil: "networkidle" });
  const link = phone.locator("#ch4").getByRole("link", { name: /Say hello/ });
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await phone.waitForTimeout(1800);
  const ph = await phone.evaluate(() => ({
    inView: (() => { const r = document.querySelector("#contact form").getBoundingClientRect(); return r.top >= -2 && r.top < innerHeight / 2; })(),
    bubbles: [...document.querySelectorAll("#contact [data-hint]")].filter((h) => getComputedStyle(h).display !== "none" && getComputedStyle(h).opacity !== "0").length,
  }));
  check(ph.inView && ph.bubbles === 0, `phone: Say hello scrolls to the form, no bubbles (${JSON.stringify(ph)})`);
}
// Phones: only the ten major brands, as plain tags; no cards.
await phone.locator('section[aria-label="Clients"]').scrollIntoViewIfNeeded();
await phone.waitForTimeout(1000);
const phoneBrands = await phone.evaluate(() => {
  const sec = document.querySelector('section[aria-label="Clients"]');
  const shown = [...sec.querySelectorAll("[data-brand]")].filter((e) => getComputedStyle(e).display !== "none");
  const buttons = [...sec.querySelectorAll("button")].filter((e) => getComputedStyle(e).display !== "none");
  return { shown: shown.length, buttons: buttons.length };
});
check(phoneBrands.shown === 10 && phoneBrands.buttons === 0, `phone: ten major brands as plain tags, no hover cards (${JSON.stringify(phoneBrands)})`);
await phone.getByText("McDonald’s", { exact: true }).first().click();
await phone.waitForTimeout(500);
check(!(await phone.evaluate(() => [...document.querySelectorAll("[id^='brand-card-']")].some((c) => getComputedStyle(c).display !== "none" && getComputedStyle(c).opacity !== "0"))), "phone: tapping a brand opens no card");
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
  const mark = mp.locator("section#top div.cursor-grab").first();
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
  const heroY = await mp.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector("section#top > [data-exit=\"fade\"] > div.flex")).transform).m42);
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
  // Studio: no years on the timeline; services stack under their heading in two columns; the shared brand cloud.
  const labels = await sp.locator('section[aria-label="Timeline"] li').allInnerTexts();
  check(labels.length === 4 && labels.every((t) => !/\[Year\]|20\d\d/.test(t)), "Studio timeline shows chapters without years");
  const make = await sp.evaluate(() => {
    const sec = document.querySelector('section[aria-label="What we make"]');
    const h = sec.querySelector("h2").getBoundingClientRect();
    const rows = [...sec.querySelectorAll("li")].map((li) => li.getBoundingClientRect());
    return { below: rows.every((r) => r.top > h.bottom), cols: new Set(rows.map((r) => Math.round(r.left))).size, rows: rows.length };
  });
  check(make.rows === 8 && make.below && make.cols === 2, `Studio services sit below the heading in two columns (${JSON.stringify(make)})`);
  await sp.evaluate(() => (document.documentElement.style.scrollBehavior = "auto")); // see the homepage brand check
  const studioClients = sp.locator('section[aria-label="Clients"]');
  await studioClients.scrollIntoViewIfNeeded();
  await sp.waitForTimeout(1200);
  check((await studioClients.getByText("Films made for").count()) === 1 && (await studioClients.locator("[data-brand]").count()) >= 20, "Studio uses the shared brand cloud");
  await studioClients.getByRole("button", { name: "McDonald’s", exact: true }).hover();
  await sp.waitForFunction(() => [...document.querySelectorAll("[id^='brand-card-']")].some((c) => getComputedStyle(c).opacity === "1"), null, { timeout: 3000 }).catch(() => {});
  const studioCard = await studioClients.getByRole("link", { name: /Watch .*McWings.* on YouTube/ }).evaluate((a) => ({
    op: getComputedStyle(a.closest("[id^='brand-card-']")).opacity,
    href: a.getAttribute("href"),
  }));
  check(studioCard.op === "1" && studioCard.href === "https://youtu.be/-Qhrky4ojhw", `Studio brand hover opens the film card, linking to the film (${JSON.stringify(studioCard)})`);
  // Footer: each contact detail has its icon, and the three phones share one line, split by "|".
  for (const w of [1440, 1024, 768]) {
    await sp.setViewportSize({ width: w, height: 900 });
    const foot = await sp.evaluate(() => {
      const f = document.querySelector("footer");
      const tels = [...f.querySelectorAll("a[href^='tel:']")].map((a) => Math.round(a.getBoundingClientRect().top));
      return { tels: tels.length, rows: new Set(tels).size, icons: f.querySelectorAll("li svg").length };
    });
    check(foot.tels === 3 && foot.rows === 1 && foot.icons === 4, `footer at ${w}px: icons on every contact line, three phones on one line (${JSON.stringify(foot)})`);
  }
  await sp.setViewportSize({ width: 1440, height: 900 });
  // The hero plays in on load.
  await sp.goto(`${base}/people/`, { waitUntil: "networkidle" });
  await sp.waitForTimeout(1800);
  const h1 = await sp.evaluate(() => getComputedStyle(document.querySelector("h1").closest("[data-reveal]")).opacity);
  check(h1 === "1", "People hero plays in on load");
  // Behind-the-scenes photos (src/content/bts.ts): each page's photos load, at a real size, with alt text.
  for (const [r, want] of [["/studio/", 9], ["/people/", 1], ["/", 1], ["/start-a-project/", 1], ["/thanks/", 1], ["/missing-page/", 1]]) {
    await sp.goto(`${base}${r}`, { waitUntil: "networkidle" });
    const shots = await sp.evaluate(async () => {
      const imgs = [...document.querySelectorAll('img[src*="/bts/"]')];
      for (const i of imgs) { i.loading = "eager"; i.scrollIntoView({ block: "center" }); await i.decode().catch(() => {}); }
      return imgs.map((i) => ({ ok: i.naturalWidth > 0 && i.getBoundingClientRect().width > 60, alt: i.alt.length > 10 }));
    });
    check(shots.length === want && shots.every((x) => x.ok && x.alt), `${r}: ${want} behind-the-scenes photo${want > 1 ? "s" : ""} load at a real size, with alt text (${shots.length} found)`);
  }
  await sp.setViewportSize({ width: 1440, height: 900 });
  // Team photos: every crew member (and the founder) has a loaded portrait; no "[ PHOTO ]" left.
  for (const r of ["/people/", "/"]) {
    await sp.goto(`${base}${r}`, { waitUntil: "networkidle" });
    await sp.evaluate(async () => {
      for (const img of document.querySelectorAll('img[src*="/people/"]')) {
        img.loading = "eager";
        await img.decode().catch(() => {});
      }
    });
    const team = await sp.evaluate(() => ({
      imgs: [...document.querySelectorAll('img[src*="/people/"]')].map((i) => [i.alt.split(",")[0], i.naturalWidth > 0]),
      placeholder: document.body.innerText.includes("[ PHOTO ]"),
    }));
    const want = r === "/" ? 4 : 5;
    check(team.imgs.length === want && team.imgs.every(([, ok]) => ok) && !team.placeholder, `${r}: team portraits all load, no [ PHOTO ] left (${team.imgs.map(([n]) => n).join(", ")})`);
  }
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

// Full-page screenshots + layout checks with the preinstalled Chromium.
// Usage: node scripts/shoot.mjs [route ...] [--out dir] [--seg 1500] [--widths 1440,390] [--base http://localhost:3000]
//   With no routes it shoots every page. Routes may carry the pitch query, e.g. "/work/?theme=light".
//   Fails on horizontal overflow or console errors.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : fallback;
};
const base = flag("--base", "http://localhost:3000");
const out = flag("--out", "shots");
const seg = Number(flag("--seg", "0")); // >0: also save the full page in slices of this height
const widths = flag("--widths", "1440,390").split(",").map(Number);
const routes = args.filter((a) => !a.startsWith("--"));
const ALL = ["/", "/work/", "/work/mercedes-benz-global-star/", "/studio/", "/originals/", "/people/", "/start-a-project/", "/thanks/", "/privacy/", "/terms/", "/missing-page/"];
const list = routes.length ? routes : ALL;
const slug = (r) => r.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home";

const browser = await chromium.launch();
let failed = false;
fs.mkdirSync(out, { recursive: true });
for (const route of list) {
  for (const width of widths) {
    // Reduced motion from the first paint: animations and scroll reveals sit at their resting state.
    const page = await browser.newPage({ viewport: { width, height: width < 500 ? 844 : 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    // The 404 route answers with status 404 on purpose; that resource error isn't a page error.
    page.on("console", (m) => m.type() === "error" && !(route.includes("missing") && m.text().includes("404")) && errors.push(m.text()));
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const { sw, h } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      h: document.documentElement.scrollHeight,
    }));
    const name = `${slug(route)}-${width}.png`;
    await page.screenshot({ path: path.join(out, name), fullPage: true });
    if (seg > 0) {
      for (let y = 0, n = 1; y < h; y += seg, n++) {
        const clip = { x: 0, y, width, height: Math.min(seg, h - y) };
        await page.screenshot({ path: path.join(out, name.replace(".png", `-${String(n).padStart(2, "0")}.png`)), fullPage: true, clip });
      }
    }
    const overflow = sw > width;
    if (overflow || errors.length) failed = true;
    console.log(`${name}  height=${h}  scrollWidth=${sw}${overflow ? "  <-- OVERFLOW" : ""}`);
    for (const e of errors) console.log(`   error: ${e}`);
    await page.close();
  }
}
await browser.close();
process.exit(failed ? 1 : 0);

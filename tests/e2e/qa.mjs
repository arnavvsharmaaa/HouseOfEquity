// End-to-end QA for houseofequity.co. Runs against a running server:
//   npm run build && npm start   (or: npx next start -p 3100)
//   TARGET_URL=http://localhost:3100 npm run test:e2e
// Uses the locally installed Chrome (PW_CHANNEL=msedge for Edge). Artifacts: tests/e2e/artifacts/.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const BASE = process.env.TARGET_URL || "http://localhost:3100";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "artifacts");
const CHANNEL = process.env.PW_CHANNEL || "chrome";
const ONLY = process.env.ONLY?.split(",");
fs.mkdirSync(OUT, { recursive: true });

export const ROUTES = ["/", "/heloc"];
const VIEWPORTS = [[1440, 900], [1366, 768], [768, 1024], [390, 844]];

const results = [];
const log = (section, ok, msg) => results.push({ section, ok, msg });
const slug = (route) => (route === "/" ? "home" : route.slice(1).replace(/\//g, "-"));

async function open(browser, route, w, h, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...opts });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => log("console", false, `${route}: page error ${e.message}`));
  await page.goto(BASE + route, { waitUntil: "load" });
  return page;
}

// ---------- screenshots + horizontal overflow ----------
async function layout(browser) {
  for (const route of ROUTES) {
    for (const [w, h] of VIEWPORTS) {
      const page = await open(browser, route, w, h);
      await page.screenshot({ path: path.join(OUT, `${slug(route)}-${w}x${h}.png`), fullPage: true });
      const r = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        offenders: [...document.querySelectorAll("body *")]
          .filter((el) => { const b = el.getBoundingClientRect(); return b.width && b.right > innerWidth + 1; })
          .slice(0, 3).map((el) => el.tagName.toLowerCase() + "." + [...el.classList].slice(0, 2).join(".")),
      }));
      const ok = r.overflow <= 0 && r.offenders.length === 0;
      if (!ok) log("overflow", false, `${route} ${w}x${h}: ${r.overflow}px; ${r.offenders.join(", ")}`);
      await page.context().close();
    }
  }
  log("overflow", !results.some((r) => r.section === "overflow" && !r.ok), `${ROUTES.length} pages × ${VIEWPORTS.length} viewports checked for sideways scroll`);
}

// ---------- estimators fit one laptop screen ----------
async function fit(browser) {
  for (const route of ROUTES) {
    const page = await open(browser, route, 1366, 768);
    const boxes = await page.evaluate(() => {
      const header = document.querySelector("header").getBoundingClientRect().height;
      return [...document.querySelectorAll("[data-fit]")].map((el) => ({
        name: el.querySelector("h2")?.textContent?.trim() ?? el.id,
        h: Math.round(el.getBoundingClientRect().height),
        avail: Math.round(innerHeight - header),
      }));
    });
    for (const b of boxes) log("fit", b.h <= b.avail, `${route} "${b.name}": ${b.h}px of ${b.avail}px at 1366×768`);
    await page.context().close();
  }
}

// ---------- keyboard: visible focus, never hidden behind sticky header or bar ----------
async function focusInfo(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const ringEl = el.matches("input.sr-only") ? el.closest("label") : el;
    const cs = getComputedStyle(ringEl);
    const ring = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2) || (cs.boxShadow && cs.boxShadow !== "none");
    const r = ringEl.getBoundingClientRect();
    const obscured = (x, y) => {
      const hit = document.elementFromPoint(Math.min(Math.max(x, 1), innerWidth - 1), Math.min(Math.max(y, 1), innerHeight - 1));
      return !!hit && !ringEl.contains(hit) && !hit.contains(ringEl) && !!hit.closest("header, [data-track-location=mobile_bar]");
    };
    // Fully obscured = centre AND both vertical edges covered (WCAG 2.4.11 is about entirely hidden).
    const covered = obscured(r.left + r.width / 2, r.top + r.height / 2) && obscured(r.left + r.width / 2, r.top + 2) && obscured(r.left + r.width / 2, r.bottom - 2);
    const partly = obscured(r.left + r.width / 2, r.top + r.height / 2);
    const name = (el.getAttribute("aria-label") || el.labels?.[0]?.innerText || el.innerText || el.value || el.id || "").trim().replace(/\s+/g, " ").slice(0, 45);
    return { tag: el.tagName.toLowerCase(), name, ring, covered, partly, offscreen: r.bottom < 0 || r.top > innerHeight };
  });
}

async function keyboard(browser) {
  for (const route of ROUTES) {
    for (const [w, h] of [[1440, 900], [390, 844]]) {
      const page = await open(browser, route, w, h);
      let stops = 0;
      let problems = 0;
      for (let i = 0; i < 200; i++) {
        await page.keyboard.press("Tab");
        const f = await focusInfo(page);
        if (!f) continue;
        stops++;
        if (!f.ring || f.covered || f.partly || f.offscreen) {
          problems++;
          log("keyboard", false, `${route} ${w}px stop ${stops}: <${f.tag}> "${f.name}" ring=${f.ring} hidden=${f.covered} partlyHidden=${f.partly} offscreen=${f.offscreen}`);
        }
        if (f.name === "nmlsconsumeraccess.org") break;
      }
      log("keyboard", problems === 0, `${route} ${w}px: ${stops} focus stops, ${problems} problem(s)`);
      await page.context().close();
    }
  }
}

async function keyboardInteractions(browser) {
  const page = await open(browser, "/", 1440, 900);
  const goal = page.getByLabel("Your goal");
  await goal.focus();
  await page.keyboard.press("ArrowDown");
  log("interaction", (await goal.inputValue()) !== "equity", `sentence builder goal changes by keyboard → "${await goal.inputValue()}"`);
  const details = page.locator("details").first();
  await details.locator("summary").focus();
  await page.keyboard.press("Enter");
  const opened = await details.evaluate((d) => d.open);
  await page.waitForTimeout(250);
  const answerVisible = await details.locator("p").isVisible();
  await page.keyboard.press(" ");
  const closed = await details.evaluate((d) => !d.open);
  log("interaction", opened && answerVisible && closed, `FAQ: Enter opens (${opened}, answer visible ${answerVisible}), Space closes (${closed})`);
  await page.getByRole("tab", { name: "Home Equity Solutions" }).focus();
  await page.keyboard.press("ArrowRight");
  log("interaction", (await page.getByRole("tab", { name: "Buying & Refinancing" }).getAttribute("aria-selected")) === "true", "product tabs follow arrow keys");
  await page.context().close();

  const m = await open(browser, "/", 390, 844);
  await m.getByRole("button", { name: "Open menu" }).focus();
  await m.keyboard.press("Enter");
  await m.keyboard.press("Tab");
  const first = await focusInfo(m);
  await m.keyboard.press("Escape");
  const back = await m.evaluate(() => ({ expanded: document.activeElement?.getAttribute("aria-expanded"), menuHidden: document.querySelector("nav[data-track-location=mobile_menu]").hidden }));
  log("interaction", first?.name === "Home Equity", `mobile menu opens and Tab enters it ("${first?.name}")`);
  log("interaction", back.expanded === "false" && back.menuHidden, `Escape closes the menu and returns focus to the toggle (expanded=${back.expanded})`);
  await m.getByRole("button", { name: "Open menu" }).click();
  await m.mouse.click(200, 700);
  log("interaction", await m.evaluate(() => document.querySelector("nav[data-track-location=mobile_menu]").hidden), "tapping outside closes the mobile menu");
  await m.context().close();

  // Reduced motion: FAQ still works, no transitions on the details content.
  const r = await open(browser, "/", 1440, 900, { reducedMotion: "reduce" });
  const t = await r.locator("details").first().evaluate((d) => getComputedStyle(d, "::details-content").transitionDuration);
  log("interaction", /^0s|^0\.?0*s?$|none/.test(t) || t === "0s", `reduced motion: FAQ content transition is "${t}"`);
  await r.context().close();
}

// ---------- estimator math ----------
async function math(browser) {
  const page = await open(browser, "/", 1440, 900);
  const est = page.locator("#estimate");
  const out = () => est.locator("[data-result]").textContent();
  const equity = () => est.locator("dl dd").first().textContent();
  const set = async (label, v) => { const i = est.getByLabel(label, { exact: true }); await i.fill(String(v)); await i.blur(); };
  for (const c of [
    { v: 550000, m: 0, l: 0, exp: "$440,000", eq: "$550,000", note: "0 mortgage" },
    { v: 400000, m: 500000, l: 0, exp: "$0", eq: "$0", note: "mortgage > home value" },
    { v: 400000, m: 320000, l: 0, exp: "$0", eq: "$80,000", note: "exactly at 80% CLTV" },
    { v: 15000000, m: 2000000, l: 1000000, exp: "$9,000,000", eq: "$12,000,000", note: "very large values" },
  ]) {
    await set("Home Value", c.v); await set("Mortgage Balance", c.m); await set("Other Liens", c.l);
    log("math", (await out()) === c.exp && (await equity()) === c.eq, `home, ${c.note}: ${await out()} / equity ${await equity()} (expect ${c.exp} / ${c.eq})`);
  }
  const hv = est.getByLabel("Home Value", { exact: true });
  await hv.fill("999999999");
  const hint = await est.getByText("Maximum $20,000,000").isVisible();
  await hv.blur();
  log("math", hint && (await hv.inputValue()) === "$20,000,000", `home, typed $999,999,999 → shows "Maximum $20,000,000" hint and uses $20,000,000 (${await hv.inputValue()})`);
  await page.context().close();

  const hp = await open(browser, "/heloc", 1440, 900);
  const cap = hp.locator("#capacity");
  const capOut = () => cap.locator("[data-result]").textContent();
  const cset = async (label, v) => { const i = cap.getByLabel(label, { exact: true }); await i.fill(String(v)); await i.blur(); };
  await cset("Estimated Home Value", 800000); await cset("Remaining Mortgage Balance", 0);
  log("math", (await capOut()) === "$640,000", `heloc capacity, 0 mortgage: ${await capOut()} (expect $640,000)`);
  await cset("Remaining Mortgage Balance", 1000000);
  log("math", (await capOut()) === "$0", `heloc capacity, mortgage > value: ${await capOut()} (expect $0)`);
  const pay = hp.locator("#payment");
  const payOut = () => pay.locator("[data-result]").textContent();
  const amt = pay.getByLabel("HELOC Amount Needed");
  const rate = pay.getByLabel("Interest Rate (APR %)");
  for (const [a, r, t, exp] of [[75000, "8.15", "30 Years", "$558"], [75000, "0", "10 Years", "$625"], [5000000, "8.15", "30 Years", "$37,212"], [75000, "30", "10 Years", "$1,977"], [0, "8.15", "30 Years", "$0"]]) {
    await amt.fill(String(a)); await amt.blur(); await rate.fill(r); await pay.locator("label", { hasText: t }).click();
    log("math", (await payOut()) === exp, `payment $${a.toLocaleString("en-US")} @ ${r}% / ${t}: ${await payOut()} (expect ${exp})`);
  }
  await rate.fill("31");
  log("math", (await payOut()) === "—" && (await pay.getByText("Enter a rate between").isVisible()), "rate 31% → no payment, error shown");
  await hp.context().close();
}

// ---------- sentence-builder routing ----------
async function routing(browser) {
  const page = await open(browser, "/", 1440, 900);
  const expected = {
    researching: { equity: "/home-equity-loan", debt: "/debt-consolidation", renovation: "/heloc", buy: "/buy", refinance: "/refinance" },
    ready: Object.fromEntries(["equity", "debt", "renovation", "buy", "refinance"].map((g) => [g, `/contact?goal=${g}`])),
    comparing: Object.fromEntries(["equity", "debt", "renovation", "buy", "refinance"].map((g) => [g, "/rate-match"])),
  };
  let wrong = 0;
  for (const [stage, map] of Object.entries(expected)) {
    for (const [goal, href] of Object.entries(map)) {
      await page.getByLabel("Your goal").selectOption(goal);
      await page.getByLabel("Where you are").selectOption(stage);
      const got = await page.getByRole("link", { name: "See My Options" }).getAttribute("href");
      if (got !== href) { wrong++; log("routing", false, `${goal} + ${stage}: ${got} (expect ${href})`); }
    }
  }
  log("routing", wrong === 0, `15 goal × stage combinations, ${wrong} wrong`);
  await page.getByLabel("Your goal").selectOption("renovation");
  await page.getByLabel("Where you are").selectOption("researching");
  await page.getByRole("link", { name: "See My Options" }).click();
  await page.waitForURL("**/heloc");
  log("routing", true, "clicking renovation + researching lands on /heloc");
  await page.context().close();
}

// ---------- sticky mobile bar never covers the end of the page ----------
async function stickyBar(browser) {
  for (const route of ROUTES) {
    const page = await open(browser, route, 390, 844);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const r = await page.evaluate(() => {
      const bar = document.querySelector("[data-track-location=mobile_bar]").getBoundingClientRect();
      const last = document.querySelector("footer").lastElementChild.lastElementChild.getBoundingClientRect();
      return { barTop: Math.round(bar.top), lastBottom: Math.round(last.bottom) };
    });
    log("sticky-bar", r.lastBottom <= r.barTop, `${route}: footer ends ${r.lastBottom}px, bar starts ${r.barTop}px`);
    await page.context().close();
  }
}

const suites = { layout, fit, keyboard, keyboardInteractions, math, routing, stickyBar };
const browser = await chromium.launch({ channel: CHANNEL, headless: process.env.PW_HEADLESS !== "false" });
try {
  for (const [name, fn] of Object.entries(suites)) if (!ONLY || ONLY.includes(name)) await fn(browser);
} finally {
  await browser.close();
}

const sections = {};
for (const r of results) (sections[r.section] ??= []).push(r);
for (const [s, rs] of Object.entries(sections)) {
  console.log(`\n## ${s}`);
  for (const r of rs) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.msg}`);
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed} passed, ${failed} failed. Screenshots in ${path.relative(process.cwd(), OUT)}`);
fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(results, null, 2));
process.exit(failed ? 1 : 0);

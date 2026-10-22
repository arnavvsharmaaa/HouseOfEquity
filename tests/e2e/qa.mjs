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

export const ROUTES = [
  "/", "/heloc", "/home-equity-loan", "/cash-out-refinance", "/debt-consolidation", "/buy", "/refinance",
  "/programs", "/rate-match", "/about", "/contact", "/licensing", "/privacy", "/terms",
];
const SERVER_LOG = process.env.SERVER_LOG; // optional: the next start log, to confirm what was forwarded
let ipCounter = 0;
// Benchmark-range addresses (198.18.0.0/15): one per test, and a random block per run, so the
// server's in-memory rate limit never carries over between tests or between runs.
const runBlock = Math.floor(Math.random() * 256);
const freshIp = () => `198.18.${runBlock}.${++ipCounter}`;
const VIEWPORTS = [[1440, 900], [1366, 768], [768, 1024], [390, 844]];

const results = [];
const log = (section, ok, msg) => results.push({ section, ok, msg });
const slug = (route) => (route === "/" ? "home" : route.slice(1).replace(/\//g, "-"));

async function open(browser, route, w, h, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, extraHTTPHeaders: { "x-forwarded-for": freshIp() }, ...opts });
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
      for (let i = 0; i < 400; i++) {
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

// ---------- SEO basics on every page ----------
async function seo(browser) {
  const titles = new Map();
  const descriptions = new Map();
  for (const route of ROUTES) {
    const page = await open(browser, route, 1440, 900);
    const r = await page.evaluate(() => {
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
        try { return JSON.parse(s.textContent); } catch { return { invalid: true }; }
      });
      const types = ld.flatMap((d) => (d["@graph"] ? d["@graph"].map((g) => [].concat(g["@type"]).join("/")) : [d["@type"] ?? "INVALID"]));
      let headingJump = null;
      let prev = 1;
      for (const h of document.querySelectorAll("main h1, main h2, main h3, main h4")) {
        const lvl = Number(h.tagName[1]);
        if (lvl > prev + 1 && !headingJump) headingJump = `${h.tagName} "${h.textContent.trim().slice(0, 40)}" after h${prev}`;
        prev = lvl;
      }
      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content ?? "",
        canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
        ogImage: document.querySelector('meta[property="og:image"]')?.content ?? "",
        h1: document.querySelectorAll("h1").length,
        types,
        invalidLd: ld.some((d) => d.invalid),
        hasFaq: document.querySelectorAll("details").length > 0,
        headingJump,
      };
    });
    const expectedCanonical = `https://houseofequity.co${route === "/" ? "" : route}`;
    const problems = [];
    if (r.h1 !== 1) problems.push(`${r.h1} h1 elements`);
    if (!r.description || r.description.length < 70) problems.push("missing/short meta description");
    if (r.canonical.replace(/\/$/, "") !== expectedCanonical) problems.push(`canonical ${r.canonical}`);
    if (!r.ogImage) problems.push("no og:image");
    if (r.invalidLd) problems.push("invalid JSON-LD");
    if (!r.types.includes("FinancialService")) problems.push("no FinancialService JSON-LD");
    if (route !== "/" && !r.types.includes("BreadcrumbList")) problems.push("no BreadcrumbList");
    if (r.hasFaq && !r.types.includes("FAQPage")) problems.push("FAQ without FAQPage");
    if (r.headingJump) problems.push(`heading skips a level: ${r.headingJump}`);
    if (titles.has(r.title)) problems.push(`title duplicates ${titles.get(r.title)}`);
    if (descriptions.has(r.description)) problems.push(`description duplicates ${descriptions.get(r.description)}`);
    titles.set(r.title, route);
    descriptions.set(r.description, route);
    const shown = r.types.filter((t) => !["Organization", "Person", "FinancialService", "LocalBusiness/FinancialService"].includes(t));
    log("seo", problems.length === 0, `${route}: "${r.title}"${shown.length ? " + " + shown.join(", ") : ""}${problems.length ? " — " + problems.join("; ") : ""}`);
    await page.context().close();
  }
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const missing = ROUTES.filter((r) => !sitemap.includes(`<loc>https://houseofequity.co${r === "/" ? "" : r}</loc>`));
  log("seo", missing.length === 0, `sitemap.xml lists all ${ROUTES.length} pages${missing.length ? "; missing " + missing.join(", ") : ""}`);
  const robots = await (await fetch(`${BASE}/robots.txt`)).text();
  log("seo", robots.includes("Sitemap: https://houseofequity.co/sitemap.xml") && robots.includes("Disallow: /api/"), "robots.txt points to the sitemap and disallows /api/");
  for (const [from, to] of [["/digital-heloc", "/heloc"], ["/dscr", "/programs#dscr"], ["/testimonials", "/about"], ["/state-licensing", "/licensing"], ["/calculators", "/heloc"]]) {
    const res = await fetch(BASE + from, { redirect: "manual" });
    const loc = res.headers.get("location") ?? "";
    log("seo", (res.status === 308 || res.status === 301) && loc.endsWith(to), `permanent redirect ${from} → ${loc} (${res.status})`);
  }
}

// ---------- lead forms in the browser ----------
const pdfBytes = Buffer.from("%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n");
const serverLog = () => (SERVER_LOG && fs.existsSync(SERVER_LOG) ? fs.readFileSync(SERVER_LOG, "utf8") : "");
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function fillValid(page, { name = "Jane Tester", email = `jane+${Date.now()}@example.com` } = {}) {
  await page.getByLabel("Your name").fill(name);
  await page.getByLabel("Phone").fill("(949) 555-0142");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel(/I agree that Mohamad Fardous/).check();
  return email;
}

async function forms(browser) {
  // Validation: empty submit shows a focused error summary and per-field errors.
  let page = await open(browser, "/contact", 1440, 900);
  await page.getByRole("button", { name: "Send My Request" }).click();
  const alert = page.locator("form").getByRole("alert");
  await alert.waitFor();
  const items = await alert.locator("li").allTextContents();
  await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "alert", null, { timeout: 2000 }).catch(() => {});
  const focused = await page.evaluate(() => document.activeElement?.getAttribute("role"));
  const invalid = await page.locator("[aria-invalid=true]").count();
  log("forms", items.length === 4 && focused === "alert" && invalid === 4, `empty submit → ${items.length} errors listed, summary focused (${focused}), ${invalid} fields marked invalid: ${items.join(" | ")}`);
  await page.getByLabel("Your name").fill("J");
  await page.getByLabel("Phone").fill("555-12");
  await page.getByLabel("Email").fill("jane@");
  await page.getByRole("button", { name: "Send My Request" }).click();
  const msgs = (await page.locator("form").getByRole("alert").locator("li").allTextContents()).join(" | ");
  log("forms", /name/.test(msgs) && /10-digit/.test(msgs) && /valid email/.test(msgs), `bad values → specific messages: ${msgs}`);
  await page.locator("form").getByRole("alert").getByRole("link").first().click();
  log("forms", (await page.evaluate(() => document.activeElement?.getAttribute("name"))) === "name", "error summary link moves focus to its field");
  await page.context().close();

  // Goal prefill from ?goal= and success state; the analytics event carries no personal data.
  page = await open(browser, "/contact?goal=debt", 1440, 900);
  const goal = await page.getByLabel("What would you like to do?").inputValue();
  log("forms", goal === "debt", `/contact?goal=debt preselects goal "${goal}"`);
  const email = await fillValid(page);
  await page.getByRole("button", { name: "Send My Request" }).click();
  const heading = page.getByRole("heading", { name: /Thank you, Jane\. We received your request\./ });
  await heading.waitFor({ timeout: 10000 });
  await pause(100);
  const headingFocused = await heading.evaluate((h) => document.activeElement === h);
  const events = await page.evaluate(() => JSON.stringify(window.dataLayer ?? []));
  const leaked = ["Jane", email, "9495550142", "555-0142"].filter((v) => events.includes(v));
  log("forms", headingFocused, "valid submit → success message shown and focused");
  log("forms", events.includes("consultation_request_submit") && leaked.length === 0, `consultation_request_submit tracked with no personal data${leaked.length ? " — LEAKED " + leaked.join(", ") : ""}`);
  if (SERVER_LOG) {
    await pause(300);
    const log1 = serverLog();
    log("forms", log1.includes(email) && log1.includes("get_started") && log1.includes("'debt'"), "payload logged locally (no webhook set) with formType get_started and goal debt");
  }
  await page.context().close();

  // Honeypot: bots that fill the hidden field get a quiet success; nothing is logged or forwarded.
  page = await open(browser, "/contact", 1440, 900);
  const botEmail = await fillValid(page, { name: "Bot Account" });
  await page.locator('input[name="company"]').evaluate((el) => { el.value = "Acme Spam"; });
  await page.getByRole("button", { name: "Send My Request" }).click();
  await page.getByRole("heading", { name: /Thank you/ }).waitFor();
  await pause(300);
  log("forms", !SERVER_LOG || !serverLog().includes(botEmail), `honeypot filled → visitor sees success, lead ${SERVER_LOG ? "not logged or forwarded" : "(server log not checked)"}`);
  await page.context().close();

  // Rate Match uploads.
  page = await open(browser, "/rate-match", 1440, 900);
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({ name: "huge.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(10 * 1024 * 1024 + 1, 0x25) });
  const sizeError = await page.getByText("larger than 10 MB").first().isVisible();
  await page.getByRole("button", { name: /Remove/ }).click();
  await fileInput.setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hello") });
  const typeError = await page.getByText("Please upload a PDF or a photo").first().isVisible();
  await page.getByRole("button", { name: /Remove/ }).click();
  log("forms", sizeError && typeError, `upload: 10 MB + 1 byte rejected (${sizeError}), .txt rejected (${typeError}) before sending`);
  await fileInput.setInputFiles({ name: "loan-estimate.pdf", mimeType: "application/pdf", buffer: pdfBytes });
  const shown = await page.getByText("loan-estimate.pdf", { exact: true }).first().isVisible();
  const rmEmail = await fillValid(page, { name: "Rita Match" });
  await page.getByRole("button", { name: "Submit My Offer for Review" }).click();
  await page.getByRole("heading", { name: /Thank you, Rita/ }).waitFor({ timeout: 10000 });
  await pause(300);
  const fileLogged = !SERVER_LOG || (serverLog().includes(rmEmail) && serverLog().includes("loan-estimate.pdf"));
  log("forms", shown && fileLogged, `valid PDF shown as "loan-estimate.pdf" and sent with the lead (in server log: ${fileLogged})`);
  await page.context().close();
}

// ---------- /api/lead directly ----------
async function api() {
  const base = { name: "Api Tester", phone: "9495550100", email: "api@example.com", goal: "refinance", consent: "on", formType: "rate_match", source: "/rate-match" };
  const post = (fields, file, ip = freshIp()) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) fd.set(k, v);
    if (file) fd.set("file", new Blob([file.bytes], { type: file.type }), file.name);
    return fetch(`${BASE}/api/lead`, { method: "POST", body: fd, headers: { "x-forwarded-for": ip } });
  };
  let res = await post(base);
  log("api", res.status === 200 && (await res.json()).ok, `valid lead → ${res.status}`);
  res = await post({ ...base, consent: "" });
  let body = await res.json();
  log("api", res.status === 400 && !!body.errors?.consent, `missing consent → ${res.status}`);
  res = await post({ ...base, email: "nope", phone: "12" });
  body = await res.json();
  log("api", res.status === 400 && !!body.errors?.email && !!body.errors?.phone, `bad email + phone → ${res.status} (${Object.keys(body.errors ?? {}).join(", ")})`);
  res = await post(base, { name: "fake.pdf", type: "application/pdf", bytes: Buffer.from("not really a pdf") });
  body = await res.json();
  log("api", res.status === 400 && /doesn't look like/.test(body.errors?.file ?? ""), `PDF with the wrong contents → ${res.status}`);
  res = await post(base, { name: "big.pdf", type: "application/pdf", bytes: Buffer.concat([pdfBytes, Buffer.alloc(10 * 1024 * 1024)]) });
  log("api", res.status === 413 || res.status === 400, `file over 10 MB → ${res.status}`);
  res = await post({ ...base, formType: "contact" }, { name: "ok.pdf", type: "application/pdf", bytes: pdfBytes });
  body = await res.json();
  log("api", res.status === 400 && !!body.errors?.file, `file sent with the contact form → ${res.status}`);
  res = await post({ ...base, company: "spam" });
  log("api", res.status === 200, `honeypot → quiet ${res.status}`);
  const ip = freshIp();
  const statuses = [];
  for (let i = 0; i < 7; i++) statuses.push((await post(base, null, ip)).status);
  log("api", statuses.slice(0, 5).every((s) => s === 200) && statuses[5] === 429, `rate limit, same IP ×7 → ${statuses.join(", ")}`);
  res = await fetch(`${BASE}/api/lead`);
  log("api", res.status === 405, `GET /api/lead → ${res.status}`);
}

// ---------- homepage partner logos ----------
async function partners(browser) {
  const page = await open(browser, "/", 1440, 900);
  const section = page.locator("section[aria-labelledby=partners-title]");
  const before = await section.locator("img").evaluateAll((imgs) => imgs.map((i) => i.loading));
  await section.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll("section[aria-labelledby=partners-title] img")].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 10000 });
  const info = await section.locator("img").evaluateAll((imgs) =>
    imgs.map((i) => ({ alt: i.alt, ok: i.naturalWidth > 0, h: Math.round(i.getBoundingClientRect().height), linked: !!i.closest("a"), gray: getComputedStyle(i).filter })),
  );
  const broken = info.filter((i) => !i.ok).map((i) => i.alt);
  log("partners", info.length === 8 && broken.length === 0, `${info.length} images load (${broken.length ? "broken: " + broken.join(", ") : "none broken"})`);
  log("partners", info.every((i) => /logo|badge/i.test(i.alt) && i.alt.length > 8), `descriptive alt text: ${info.map((i) => i.alt).join(" | ")}`);
  log("partners", info.every((i) => !i.linked), "logos are not links");
  log("partners", before.every((l) => l === "lazy"), `all logos lazy-load (${before.join(",")})`);
  const row = info.slice(1, 7);
  log("partners", row.every((i) => i.h >= 20 && i.h <= 36) && row.every((i) => i.gray.includes("grayscale")), `partner logo heights ${row.map((i) => i.h).join("/")}px (max 36), grayscale at rest`);
  const band = await section.evaluate((el) => ({ h: Math.round(el.getBoundingClientRect().height), text: el.innerText }));
  log("partners", band.h <= 320 && !band.text.includes("J.D. Power"), `compact band: ${band.h}px tall, J.D. Power note moved out`);
  await page.context().close();
}

// ---------- no footnote markers; disclosures in the footer; no credit-score reassurance line ----------

async function claimsCheck(browser) {
  for (const route of [...ROUTES, "/contact?goal=equity"]) {
    for (const [w, h] of [[1440, 900], [390, 844]]) {
      const page = await open(browser, route, w, h);
      const r = await page.evaluate(() => ({
        sups: document.querySelectorAll("sup").length,
        disclosures: document.querySelectorAll("footer li[id^='disclosure-']").length,
        reassurance: /won.t affect your credit score/i.test(document.body.innerText),
      }));
      log(
        "claims",
        r.sups === 0 && r.disclosures > 0 && !r.reassurance,
        `${route} @${w}: ${r.sups} superscripts, ${r.disclosures} footer disclosures, ` +
          (r.reassurance ? `"Won't affect your credit score." still on the page` : "no credit-score reassurance line"),
      );
      await page.context().close();
    }
  }
}

// ---------- homepage presence, Zillow badge, keep-rate angle ----------
async function presence(browser) {
  for (const [w, h] of [[1366, 768], [1440, 900], [390, 844]]) {
    const page = await open(browser, "/", w, h);
    const r = await page.evaluate(() => {
      const box = document.querySelector("[data-advisor-presence]");
      const b = box.getBoundingClientRect();
      const bar = document.querySelector("[data-track-location=mobile_bar]");
      const barTop = bar && getComputedStyle(bar).display !== "none" ? bar.getBoundingClientRect().top : innerHeight;
      return {
        aboveFold: b.bottom <= barTop,
        bottom: Math.round(b.bottom),
        limit: Math.round(barTop),
        text: box.innerText.replace(/\s+/g, " "),
        sms: box.querySelector('a[href^="sms:"]')?.getAttribute("href"),
        book: [...box.querySelectorAll("a")].find((a) => /Book a call/.test(a.textContent))?.getAttribute("href"),
        portrait: box.querySelector('[role=img]')?.getAttribute("aria-label"),
        heights: [...box.querySelectorAll("a")].map((a) => Math.round(a.getBoundingClientRect().height)),
      };
    });
    log(
      "presence",
      r.aboveFold && /Mohamad Fardous/.test(r.text) && /NMLS #1448893/.test(r.text) && r.sms === "sms:+19495697945" && !!r.book && /Portrait placeholder/.test(r.portrait ?? "") && r.heights.every((x) => x >= 44),
      `${w}x${h}: advisor strip above the fold (bottom ${r.bottom}px ≤ ${r.limit}px), Text Moe → ${r.sms}, Book a call → ${r.book}, buttons ${r.heights.join("/")}px`,
    );
    await page.context().close();
  }
  const page = await open(browser, "/", 1440, 900);
  const badges = await page.locator('a[href*="zillow.com/profile"]').evaluateAll((as) => as.map((a) => a.textContent.replace(/\s+/g, " ").trim()));
  log("presence", badges.length >= 2 && badges.every((t) => /^5\.0 on Zillow · \S+ reviews/.test(t)), `Zillow badge links (${badges.length}): ${[...new Set(badges)].join(" | ")}`);
  const ev = [];
  await page.exposeFunction("__ev", (e) => ev.push(e));
  await page.evaluate(() => {
    window.dataLayer = window.dataLayer ?? [];
    const push = window.dataLayer.push.bind(window.dataLayer);
    window.dataLayer.push = (e) => { window.__ev(JSON.stringify(e)); return push(e); };
    document.querySelector('a[href^="sms:"]').addEventListener("click", (e) => e.preventDefault());
  });
  await page.locator('a[href^="sms:"]').first().click();
  await pause(200);
  log("presence", ev.some((e) => e.includes("mortgage_phone_click") && e.includes('"method":"text"')), `Text Moe click tracked as mortgage_phone_click (method text)`);
  await page.context().close();

  for (const route of ["/heloc", "/home-equity-loan"]) {
    const p = await open(browser, route, 1366, 768);
    const t = await p.locator("[data-keep-rate]").first().evaluate((el) => ({ text: el.innerText, top: el.getBoundingClientRect().top }));
    log("presence", /Keep your current mortgage rate/.test(t.text) && t.top < 768, `${route}: "${t.text.split("\n")[0]}" shown in the first screen (top ${Math.round(t.top)}px)`);
    await p.context().close();
  }
}

const suites = { claimsCheck, presence, partners, layout, fit, seo, keyboard, keyboardInteractions, math, routing, stickyBar, forms, api };
const browser = await chromium.launch({ channel: CHANNEL, headless: process.env.PW_HEADLESS !== "false" });
try {
  for (const [name, fn] of Object.entries(suites)) {
    if (ONLY && !ONLY.includes(name)) continue;
    try {
      await fn(browser);
    } catch (err) {
      log(name, false, `suite crashed: ${String(err.message).split(/\r?\n/)[0]}`);
    }
  }
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

# House of Equity — houseofequity.co

Marketing site for House of Equity, the consumer brand of independent mortgage broker
Mohamad Fardous (NMLS #1448893), sponsored by West Capital Lending, Inc. (NMLS #1566096,
CA DRE #02022356). House of Equity is **not a lender**.

Next.js (App Router, static generation) · TypeScript · Tailwind CSS v4 · deployed on Vercel.

> **Status: design preview.** All copy and claims mirror the Stitch designs exactly so Mohamad can
> review the experience. Nothing ships publicly until every item in
> [Before launch: verify](#before-launch-verify) is signed off.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

## Pages

`/` · `/heloc` · `/home-equity-loan` · `/cash-out-refinance` · `/debt-consolidation` · `/buy` ·
`/refinance` · `/programs` · `/rate-match` · `/about` · `/contact` · `/licensing` · `/privacy` · `/terms`,
plus `/sitemap.xml`, `/robots.txt`, `/opengraph-image` and a custom 404. Every page is statically
generated; only `/api/lead` runs on the server.

## Project layout

| Path | What lives there |
| --- | --- |
| `src/lib/claims.ts` | **Every marketing claim and figure** with its footer disclosure. Copy writes `{{key}}` to print a value, so every figure is identical site-wide. The disclosures are listed in the footer (no superscript markers on the page). |
| `src/lib/site.ts` | **Single source of truth**: NMLS/DRE numbers, phone, email, offices, the 22 licensed states, nav. |
| `src/lib/content/` | Page copy. `home.ts`/`heloc.ts` are verbatim from the designs; `pages.ts` marks each passage `[design]`, `[guide]` or `[new]`. |
| `src/lib/seo.ts` | Metadata helper (canonical + OG/Twitter + share image) and JSON-LD builders. |
| `src/lib/lead-schema.ts` | One zod schema for the lead forms, shared by the browser and `/api/lead`. |
| `src/lib/analytics.ts` | `track()` event helper (no third-party script yet). |
| `src/lib/equity.ts` | Estimator math: `capacity = max(0, value × CLTV − balances)` and amortized P&I. |
| `src/app/api/lead/route.ts` | Lead endpoint: validation, honeypot, rate limit, upload checks, forwarding. |
| `src/components/layout/` | Header, mobile menu, footer + disclosures, sticky mobile bar, delegated event listener. |
| `src/components/sections/` | Page blocks (`blocks.tsx`), shared sections (`shared.tsx`), breadcrumbs, legal layout. |
| `src/components/tools/` | Client-side estimators (`EstimateBuilder`, `CapacityEstimator`, `PaymentEstimator`). |
| `src/components/forms/` | `LeadForm` (Contact, Get Started, Rate Match with upload). |
| `tests/e2e/qa.mjs` | Playwright QA suite (see Testing). |
| `next.config.ts` | 301/308 redirects from old mfardous.com routes, security headers. |

Design tokens (from the Stitch `DESIGN.md`, "Plain Clarity") are in `src/app/globals.css`.

## Lead forms and `/api/lead`

The Contact / Get Started form (`/contact`, which preselects the goal from `?goal=`) and the Rate
Match form (`/rate-match`) post `multipart/form-data` to `/api/lead`, which:

1. rejects bodies over ~10.5 MB before parsing (`413`);
2. rate-limits each client IP to `LEAD_RATE_LIMIT` submissions per 10 minutes (`429`). The counter
   lives in memory, so on Vercel it is per-instance and best-effort; use a shared store (e.g. Upstash
   Redis) if spam becomes a problem;
3. returns a quiet `200` and forwards nothing when the hidden honeypot field `company` is filled;
4. validates fields with the shared zod schema and returns `400 { errors: { field: message } }`;
5. for Rate Match only, accepts one Loan Estimate (PDF, JPG, PNG, HEIC, WEBP; max 10 MB) and checks the
   file's first bytes, not just its name;
6. forwards the lead as JSON to `STUDIO_ESCROW_WEBHOOK_URL`, or, when that is not set, **logs the
   payload to the server console** (file contents omitted) and returns success.

Forwarded JSON: `name, phone (10 digits), email, goal, message, consent, formType
(contact | get_started | rate_match), source (page path), utm_*, submittedAt`, and `file` as
`{ name, type, size, base64 }` or `null`. Confirm this shape with Studio Escrow's inbound webhook.

Personal data never goes into URLs or analytics: only the goal category appears in `?goal=`, and
`consultation_request_submit` carries just the form type and goal.

> **⚠️ Deployment blocker for 10 MB uploads on Vercel.** Vercel Functions accept request bodies up to
> **4.5 MB**, so Loan Estimates between 4.5 and 10 MB will fail there (smaller files and all other
> fields work). Before launch, either upload files straight from the browser to storage (e.g. Vercel
> Blob client uploads) and send the file URL to `/api/lead`, or lower the limit to 4 MB in
> `src/lib/lead-schema.ts`.

## Analytics

`track(event, props)` pushes to `window.dataLayer` (ready for GTM/GA4) and logs in development.
Events: `financing_goal_select`, `home_equity_calculator_complete`, `consultation_request_submit`,
`mortgage_phone_click`, `application_start`. Phone clicks and goal-tile clicks are captured by one
delegated listener (`SiteEvents.tsx`), so links stay server-rendered. Event props are typed to
coarse labels only — **no dollar amounts or personal data can be sent.**

## Environment variables

| Name | Where | Purpose |
| --- | --- | --- |
| `STUDIO_ESCROW_WEBHOOK_URL` | Server only | Studio Escrow inbound webhook that `/api/lead` forwards leads to. Never prefixed `NEXT_PUBLIC_`. When unset, leads are logged to the server console instead. |
| `LEAD_RATE_LIMIT` | Server only, optional | Submissions allowed per IP per 10 minutes (default `5`). |

## Testing

```bash
npm run build
npx next start -p 3100 > server.log 2>&1 &           # any port
TARGET_URL=http://localhost:3100 SERVER_LOG=server.log npm run test:e2e
```

The suite (`tests/e2e/qa.mjs`, Playwright via `playwright-core` and your installed Chrome; set
`PW_CHANNEL=msedge` for Edge) checks every page for: sideways scroll at 1440/1366/768/390px; estimators
fitting one 1366×768 screen; titles, descriptions, canonicals, share images, JSON-LD
(FinancialService, BreadcrumbList, FAQPage), heading order, sitemap, robots and legacy redirects;
keyboard focus visibility and focus never hidden behind the sticky header or mobile bar; FAQ, tabs
and mobile menu by keyboard; estimator math at edge values; sentence-builder routing; the sticky bar
clearing the footer; form validation, error summary, goal prefill, success state, analytics without
personal data, honeypot, upload limits; and `/api/lead` validation, file sniffing, size limit and rate
limiting. Run a subset with `ONLY=forms,api`. Screenshots land in `tests/e2e/artifacts/` (git-ignored).

## Deployment (Vercel)

1. Import the repository in Vercel (framework preset: Next.js; no build settings to change).
2. Add `STUDIO_ESCROW_WEBHOOK_URL` (Production and Preview) under Settings → Environment Variables.
3. Point `houseofequity.co` at the project. To keep the old site's links, also add `mfardous.com`
   (and `www.`) as domains of this project, so the redirects in `next.config.ts` apply to them.
4. Resolve the upload-size blocker above and every item in "Before launch: verify".

## Before launch: verify

Every claim below appears on the site, either because it is in the Stitch designs or because it was written for the inner pages. Each needs a source,
written approval, or a rewrite before public launch (brand guide §13, "Non-negotiable publishing gates").
✅ = confirmed by Mohamad in review; ⚠️ = flagged, unconfirmed.

### Credentials & ratings
- ⚠️ **"170+ wholesale lenders"** (hero, Rate Match, bio, FAQ, CTA).
- ⚠️ **"Licensed in 22 States" / "Client stories from 22 states"**: state list is in `site.ts`; confirm each state on NMLS Consumer Access. Note: California is not in the list, but the Irvine, CA office is shown.
- ✅ **"5.0 Verified Client Rating on Zillow"** / **"5.0 Star Average"**: confirmed from mfardous.com; keep a dated source link.
- ⚠️ **"Top Broker"** badge: Mohamad suggested replacing with "Rocket Pro #1 National Broker Partner, 4 years".
- ✅ **"former Director of Finance at one of the nation's largest mortgage lenders"**: approved wording is "Former Director of Finance at one of the largest mortgage companies in the country"; update the copy to match.
- ⚠️ **"BBB A+"**: confirmed but not yet used anywhere.
- ⚠️ **Testimonials** (Sarah & David M., Marcus T., Elena R.): confirm they are genuine, with permission to publish and attribution.

### Speed & process
- ⚠️ **"Close in as few as 3 days\*"** (+ footnote: eligible digital HELOCs, funds after the 3-day rescission period).
- ⚠️ FAQ: **"the entire underwriting process takes hours instead of weeks"**.
- ⚠️ **"Apply 100% online" / "Apply online in minutes" / "A quick 5-minute phone chat"**.
- ⚠️ **"Appraisal waived when eligible" / "Automated valuation models often eliminate in-home appraiser visits"**.
- ⚠️ **"bank-grade encryption"** (How it works, step 2): describe the actual application portal.
- ⚠️ **"Fast pre-approvals" / "sponsored lending speed"**.

### Estimator card (homepage)
- ⚠️ **"Est. Monthly Savings: $X / mo"**: the Stitch prototype computes this as an *invented* formula (0.28% of the amount shown). No real basis; remove or replace with a real payment comparison.
- ⚠️ **"Speed to Funding: 3 to 7 Days"**: Mohamad indicated this is not his number.
- ⚠️ **"No SSN or hard credit pull required"**, **"Direct wholesale pricing comparison"**.
- ⚠️ **"Active Broker · Online" / "Just now"**: implies live chat that doesn't exist.

### Product terms & savings
- ⚠️ **"Draw period up to 10 years"**, **"Fixed rates from 10 to 30 years"**.
- ⚠️ **"Zero prepayment penalties"**: Mohamad asked to drop prepayment-penalty claims.
- ⚠️ **"Average monthly savings of $650+"**, **"freeing up hundreds every single month"**, **"22%+"** cards: Mohamad asked to drop savings amounts; the guide prohibits savings promises.
- ⚠️ **"options starting at just 3% down"**, **"0% down options for military veterans"**.
- ⚠️ **"zero retail lender markups"**, **"Low wholesale rates"**, **"Consolidate & save"**.

### Rate Match
- ⚠️ **"We'll beat it or tell you honestly that it's a good deal"** (approved alternative: "We'll beat it, or tell you honestly it's a good deal.").
- ⚠️ **"In 24 hours … exactly how much you can save"** (approved alternative: "Usually a response within 24 hours, no credit pull").
- ⚠️ Footer link label **"Rate Match Guarantee"**: "guarantee" needs approval.

### FAQ answers
- ⚠️ **Soft-pull answer** ("zero negative impact on your credit score").
- ⚠️ **"Is my home at risk?"**: the design answer reassures rather than stating the risk. The guide requires plainly saying the home secures the loan and nonpayment may put it at risk (agreed rewrite pending).
- ⚠️ **Broker compensation** ("In almost all cases … paid directly by the wholesale lender", "we often beat retail bank pricing").

### HELOC page (`/heloc`)
**Hero and trust**
- ⚠️ **"$30B+ in Equity / Evaluated via lending network"**: Figure's number, not Mohamad's.
- ⚠️ **"Top Rated Mortgage Broker"** with 5 stars: no source given.
- ⚠️ **"Kitchen Remodel Value — $85,000 Equity Tapped"** on the photo card: reads as a real client result; label it as an example or remove it.
- ⚠️ **"Talking with us won't affect your credit."**
- ⚠️ **"Apply 100% online"**, **"Close in as few as 3 days\*"**, **"No in-person appraisal when eligible"** (same as homepage).

**What you need to qualify**
- ⚠️ **"Typically 80% to 85% combined loan-to-value" / "Benchmark: Up to 85% CLTV"**.
- ⚠️ **"usually 640+ FICO" / "640+ Minimum Credit Score"**.
- ⚠️ **"premier Tier-1 wholesale discount margins"**.

**Capacity estimator**
- ⚠️ **"Lines of credit up to $750,000 across 170+ wholesale lending channels"**: Figure's limit, not Mohamad's.
- ⚠️ **"you could qualify to borrow up to"**: wording implies qualification; the estimate is illustrative only (the disclaimer is shown beside it).

**How it works**
- ⚠️ **"Takes ~5 minutes"**, **"instant automated property valuation (AVM)"**, **"Remote online notarization lets you sign from your dining table"** (RON availability varies by state).

**Payment estimator**
- ⚠️ **Prefilled rate "8.15%" labeled "Today's standard wholesale benchmark"**: an advertised rate needs a date, APR basis and assumptions (Reg Z / state ad rules), or the field should start empty for the visitor to enter.
- ⚠️ **"Lock in this estimate"** button: implies a rate lock; it only links to the contact form.
- ⚠️ The payment is **fully amortizing principal & interest**. Many HELOCs are interest-only during the draw period, so the real payment pattern differs; say so or offer both.

**Comparison table**
- ⚠️ **"100% online in minutes"**, **"Waived when eligible (digital AVM)"**.
- ⚠️ Bank HELOC **"Could take 4 to 8 weeks"**, **"Often requires branch visits"**, **"Only 1 bank's in-house rules"**.
- ⚠️ **"Yes (lower tax-deductible\* rates)"**: approved alternative is "Interest may be deductible for home improvements — consult a tax professional." The asterisk currently has no matching footnote.
- ⚠️ Personal loan **"much higher APR 14-30%"**: needs a dated source.

**Use cases**
- ⚠️ **"Consolidate 22%+ interest credit cards into a single lower payment"**.
- ⚠️ **"Keep a zero-balance revolving line open with no interest until used"**: some HELOCs charge annual or inactivity fees.
- ⚠️ **"flexible draw periods matching semester schedules"**.

**FAQ**
- ⚠️ **"closing in as few as 3 business days"** (the footnote says 3 days plus rescission) and **"Traditional bank options frequently take 4 to 8 weeks"**.
- ⚠️ **"In most instances, no"** in-person appraisal.
- ⚠️ **"Both options are available through our network"** (variable and fixed-rate draw).
- ⚠️ **Soft-pull answer** ("does not affect your credit scores").

### Inner pages: claims reused from the designs
Reused on additional pages and covered by the items above: "170+ wholesale lenders" (`/cash-out-refinance`,
`/refinance`, `/buy`, `/rate-match`, `/programs`, `/about`), "Fixed rates from 10 to 30 years" and
"Zero prepayment penalties" (`/home-equity-loan`), "22%+", "freeing up hundreds every single month" and
"Average monthly savings of $650+" (`/debt-consolidation` hero), "options starting at just 3% down",
"0% down options for military veterans", "Fast pre-approvals" (`/buy` hero and FAQ), the Rate Match
promises (`/rate-match`), the testimonials (`/about`, `/debt-consolidation`).

### Inner pages: new claims
- ⚠️ **"10+ years in mortgage finance"** (`/about` stats): the brief lists "10+ years" as approved; confirm the exact wording.
- ⚠️ **Programs offered** (`/programs`): Conventional/FHA/VA, Jumbo, Bank Statement, DSCR, Asset-Based, Interest-Only, Physician and Bridge are listed because the old site's routes redirect there. The guide says to list specialty and bridge programs **only if offered**; confirm each.
- ⚠️ **"Fixed or adjustable rates"** for cash-out refinancing, and "fixed-rate options may be available" for HELOCs (comparison tables).
- ⚠️ **"tells you honestly when keeping your current loan is the better choice"** (`/refinance` intro).
- ⚠️ **Call/text consent wording** on every form: needs compliance (TCPA) review.

### Inner pages: new explanatory copy (`[new]` in `src/lib/content/pages.ts`)
Plain-English explanations written for these pages, with no new numbers. Mohamad should read and approve:
- FAQs on `/home-equity-loan`, `/cash-out-refinance`, `/debt-consolidation`, `/buy`, `/refinance`, `/programs`, `/rate-match`.
- The equity comparison table (home equity loan vs HELOC vs cash-out), the cash-out trade-offs, the
  debt consolidation steps and "Things to weigh first", the refinance option cards, the program
  definitions, and the "What happens next" steps on `/contact`.
- Hero headlines not from the designs: "Replace your mortgage and take cash out." and "Lower your
  rate, change your term, or take cash out." Others come from the guide's slogan library ("Make More
  of What You Own.", "Financing That Feels Like Home.", "Home Financing, Made Human.", "Your Home. Your
  Goals. Let's Talk.", "Multiple payments? Explore a simpler approach.").
- **`/privacy` and `/terms` are drafts**, labeled on the page as pending compliance review.

### Estimators on the inner pages
- Payment estimators on `/home-equity-loan`, `/buy` and `/refinance` start with an **empty** rate (no
  advertised rate); the visitor enters one. `/heloc` keeps the design's prefilled 8.15% (flagged above).
- `/buy` shows principal & interest only and says taxes, insurance, mortgage insurance and HOA dues are excluded.

### Top Lending Partners (homepage)
- ⚠️ **Partner logos: confirm usage permission** for Rocket Pro (Elite Mortgage Broker badge), Spring EQ, EPM Wholesale, Nations Direct Mortgage, Kind Lending, LoanStream Mortgage, Figure and Broker Action Coalition. Files were copied from westcapitallending.com and mfardous.com into `public/partners/` (Figure and Spring EQ cropped to remove empty padding). Note the brand guide says "Do not … copy lender imagery or logos", so written permission from each company is needed.
- ⚠️ **"Rocket Mortgage's #1 National Broker Partner, 4 years"** (homepage trust band) and the J.D. Power note (footer disclosures, footnote 1), both from mfardous.com: confirm the current wording and that the J.D. Power reference (2022 – 2023 studies) may still be used.

### Footnotes, reassurance and hero presence
- ⚠️ **Zillow profile URL and review count are placeholders**: `zillow.url` (`https://www.zillow.com/profile/PLACEHOLDER-mohamad-fardous/`) and `zillow.reviewCount` (`XX`) in `src/lib/site.ts`. The badge "5.0 on Zillow · XX reviews" appears in the homepage hero card, the homepage and About testimonials headers.
- ⚠️ **Every footer disclosure is draft wording** written for this preview in `src/lib/claims.ts`; each needs compliance review and, where it states a fact (lender network size, review count, response time), a source.
- ⚠️ **"Won't affect your credit score."** appears only under buttons that start a quote, estimate or application, at most once per section: the homepage hero and Build your estimate, the `/heloc` hero, and the Rate Match and Get Started/contact form submits. It renders from `<QuoteAction>` / `<Reassurance>` in `src/components/ui/Claim.tsx`, with a footer disclosure that only a loan application triggers a hard inquiry. It is intentionally absent from nav, call/text/book, learn-more, final CTA and pre-approval buttons.
- ⚠️ **"Text Moe"** opens a text message to 949-569-7945: confirm that number accepts texts and that inbound texting is set up for compliant replies.
- ⚠️ **"Book a call"** goes to the contact form; there is no scheduling tool yet. Add a booking link (e.g. Calendly) if Mohamad uses one.
- ⚠️ **New copy, "Keep your current mortgage rate."** on `/heloc` and `/home-equity-loan`, with one plain sentence each explaining the product is a separate second loan.
- ⚠️ On `/heloc`, the design's line "Talking with us won't affect your credit." was replaced by the standard reassurance line (same position) so the site says it one way.
- ⚠️ **"$85,000 Equity Tapped"** (HELOC photo card) is footnoted as an illustrative example, not a client result.

### Missing data
- ⚠️ Irvine office ZIP code (not supplied; omitted from address and JSON-LD).
- ⚠️ Real photography: lifestyle hero, kitchen, homeowner photos, and **Mohamad's real portrait** (no AI images).

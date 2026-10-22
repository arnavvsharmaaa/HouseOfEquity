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

## Project layout

| Path | What lives there |
| --- | --- |
| `src/lib/site.ts` | **Single source of truth**: NMLS/DRE numbers, phone, email, offices, the 22 licensed states, nav. |
| `src/lib/content/` | Page copy (taken verbatim from the designs). |
| `src/lib/seo.ts` | Metadata helper (canonical + OG/Twitter) and JSON-LD builders. |
| `src/lib/analytics.ts` | `track()` event helper (no third-party script yet). |
| `src/lib/equity.ts` | Equity estimator math: `capacity = max(0, value × CLTV − balances)`. |
| `src/components/layout/` | Header, mobile menu, footer + disclosures, sticky mobile bar, delegated event listener. |
| `src/components/sections/` | Reusable page sections (trust strip, FAQ, steps, testimonials, CTA…). |
| `src/components/tools/` | Client-side calculators. |
| `next.config.ts` | 301 redirects from old mfardous.com routes, security headers. |

Design tokens (from the Stitch `DESIGN.md`, "Plain Clarity") are in `src/app/globals.css`.

## Analytics

`track(event, props)` pushes to `window.dataLayer` (ready for GTM/GA4) and logs in development.
Events: `financing_goal_select`, `home_equity_calculator_complete`, `consultation_request_submit`,
`mortgage_phone_click`, `application_start`. Phone clicks and goal-tile clicks are captured by one
delegated listener (`SiteEvents.tsx`), so links stay server-rendered. Event props are typed to
coarse labels only — **no dollar amounts or personal data can be sent.**

## Environment variables

| Name | Where | Purpose |
| --- | --- | --- |
| `STUDIO_ESCROW_WEBHOOK_URL` | Server only | Studio Escrow inbound webhook that `/api/lead` forwards leads to. Never prefixed `NEXT_PUBLIC_`. |

_(Lead forms, `/api/lead`, and deployment notes are added in the next phase.)_

## Before launch: verify

Every claim below appears on the site because it is in the Stitch designs. Each needs a source,
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

### HELOC page (next phase; from the HELOC design)
- ⚠️ **"$30B+ in Equity"**, **"Lines of credit up to $750,000"**: Figure's numbers, not Mohamad's.
- ⚠️ **"640+ FICO"**, **"Up to 85% CLTV"**, **"Tier-1 wholesale discount margins"**.
- ⚠️ **"lower tax-deductible\* rates"**: approved alternative is "may be deductible for home improvements; consult a tax professional".
- ⚠️ Comparison table cells (bank HELOC "4 to 8 weeks", personal loan "14–30% APR").

### Missing data
- ⚠️ Irvine office ZIP code (not supplied; omitted from address and JSON-LD).
- ⚠️ Real photography: lifestyle hero, kitchen, homeowner photos, and **Mohamad's real portrait** (no AI images).

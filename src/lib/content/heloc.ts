// /heloc copy, taken verbatim from the Stitch HELOC design.
// Claims that need sign-off before launch are tracked in README → "Before launch: verify".

import type { FinancingGoal } from "@/lib/analytics";

export const heroPoints = [
  "Apply 100% online",
  "No in-person appraisal when eligible",
  "Close in as few as 3 days*",
  "Guidance from a licensed advisor",
];

/** Hero "I want to" options, mapped onto the site-wide financing goals for attribution. */
export const helocUses: ReadonlyArray<{ value: string; label: string; goal: FinancingGoal }> = [
  { value: "improvements", label: "Make home improvements", goal: "renovation" },
  { value: "debt", label: "Pay off high-interest debt", goal: "debt" },
  { value: "expense", label: "Cover a major expense", goal: "equity" },
  { value: "education", label: "Fund education", goal: "equity" },
  { value: "other", label: "Something else", goal: "equity" },
];

export const qualifyCards = [
  {
    icon: "pie",
    title: "Enough Equity",
    body: "Typically 80% to 85% combined loan-to-value (CLTV). This leaves a solid cushion in your property while unlocking working liquidity.",
    footer: "Benchmark: Up to 85% CLTV",
  },
  {
    icon: "payments",
    title: "Steady Income",
    body: "Verifiable W-2, 1099, retirement distributions, or self-employed cash flow demonstrating ease in making ongoing monthly payments.",
    footer: "W-2, 1099, or Bank Statements",
  },
  {
    icon: "verified",
    title: "Payment History",
    body: "A reliable credit profile, usually 640+ FICO. Higher scores unlock our premier Tier-1 wholesale discount margins.",
    footer: "640+ Minimum Credit Score",
  },
] as const;

export const helocSteps = [
  {
    title: "Apply online in minutes",
    body: "100% digital, simple documentation upload from your computer or smartphone. No stacks of paperwork or office visits.",
    tag: "Takes ~5 minutes",
  },
  {
    title: "Digital Home Valuation",
    body: "Home value confirmed digitally, with in-person appraisal waived when eligible through instant automated property valuation (AVM).",
    tag: "Automated Verification",
  },
  {
    title: "Sign online and close",
    body: "Remote online notarization lets you sign from your dining table. Close in as few as 3 days, with funds released following rescission.",
    tag: "Digital E-Signature",
  },
];

export const comparison = {
  columns: ["House of Equity HELOC", "Traditional Bank HELOC", "Personal Loan"],
  rows: [
    {
      feature: "Application",
      values: ["100% online in minutes", "Often requires branch visits", "Varies by lender"],
    },
    {
      feature: "Lender Options",
      values: ["We shop 170+ wholesale lenders", "Only 1 bank's in-house rules", "Single lender quote"],
    },
    {
      feature: "Appraisal",
      values: [
        "Waived when eligible (digital AVM)",
        "Usually requires in-person appraisal",
        "Not needed (unsecured)",
      ],
    },
    {
      feature: "Closing Speed",
      values: ["In as few as 3 days*", "Could take 4 to 8 weeks", "Varies, generally quick"],
    },
    {
      feature: "Secured by Home",
      values: ["Yes (lower tax-deductible* rates)", "Yes", "No (much higher APR 14-30%)"],
    },
  ],
};

export const useCases = [
  {
    icon: "repair",
    title: "Home Improvements",
    body: "Finance additions, remodels, or repairs that add long-term property value.",
  },
  {
    icon: "card",
    title: "Paying Off Debt",
    body: "Consolidate 22%+ interest credit cards into a single lower payment with transparent terms.",
  },
  {
    icon: "school",
    title: "Education",
    body: "Cover college tuition or vocational degrees with flexible draw periods matching semester schedules.",
  },
  {
    icon: "celebration",
    title: "Major Expenses",
    body: "Handle weddings, family milestones, or medical needs with peace of mind.",
  },
  {
    icon: "health",
    title: "Emergency Savings",
    body: "Keep a zero-balance revolving line open with no interest until used, standing by for unforeseen needs.",
  },
] as const;

export const helocFaqs = [
  {
    q: "How long does a HELOC take?",
    a: "With our digital platform, eligible borrowers can complete application and verification in a matter of minutes, achieving closing in as few as 3 business days. Traditional bank options frequently take 4 to 8 weeks.",
  },
  {
    q: "Do I need an in-person appraisal?",
    a: "In most instances, no. When eligible, our wholesale underwriting uses an Automated Valuation Model (AVM) to confirm property value instantly, sparing you the delay, disruption, and cost of an appraiser visiting your residence.",
  },
  {
    q: "Is a HELOC a fixed or variable interest rate?",
    a: "Both options are available through our network. You can choose a standard variable line that adjusts with the Prime Rate, or a fixed-rate draw option that locks your interest rate and monthly payment for predictable long-term budgeting.",
  },
  {
    q: "Will checking my options affect my credit score?",
    a: "No. Initial eligibility reviews and rate quotes use a soft credit inquiry, which does not affect your credit scores or show as a hard inquiry to other lenders.",
  },
  {
    q: "What is the difference between a HELOC and a home equity loan?",
    a: "A home equity loan is disbursed as a lump sum upfront with immediate fixed monthly payments. A HELOC is an open revolving credit line: you only borrow when you want, pay interest exclusively on the balance drawn, and can reuse available funds as you pay them back down.",
  },
];

export const relatedLinks = [
  { href: "/home-equity-loan", title: "Home Equity Loan", body: "One lump sum with a fixed monthly payment." },
  { href: "/cash-out-refinance", title: "Cash-Out Refinance", body: "Replace your first mortgage and take cash out." },
  { href: "/debt-consolidation", title: "Debt Consolidation", body: "Combine high-interest balances into one payment." },
  { href: "/rate-match", title: "Rate Match", body: "Already have an offer? Send it for a second opinion." },
];

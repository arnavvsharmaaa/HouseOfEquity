// Homepage copy, taken verbatim from the Stitch homepage design.
// Claims that need sign-off before launch are tracked in README → "Before launch: verify".

import type { FinancingGoal } from "@/lib/analytics";

export const goals: ReadonlyArray<{ value: Exclude<FinancingGoal, "other">; label: string; href: string }> = [
  { value: "equity", label: "access my equity", href: "/home-equity-loan" },
  { value: "debt", label: "consolidate debt", href: "/debt-consolidation" },
  { value: "renovation", label: "renovate my home", href: "/heloc" },
  { value: "buy", label: "buy a home", href: "/buy" },
  { value: "refinance", label: "refinance", href: "/refinance" },
];

export const stages = [
  { value: "researching", label: "just researching" },
  { value: "ready", label: "ready to talk" },
  { value: "comparing", label: "comparing an offer" },
] as const;

export type Stage = (typeof stages)[number]["value"];

export const heroPaths: ReadonlyArray<{
  goal: FinancingGoal;
  title: string;
  hint: string;
  href: string;
  icon: "wallet" | "card" | "repair" | "key";
}> = [
  { goal: "equity", title: "Access my equity", hint: "Tap home value", href: "/home-equity-loan", icon: "wallet" },
  { goal: "debt", title: "Pay off debt", hint: "Consolidate & save", href: "/debt-consolidation", icon: "card" },
  { goal: "renovation", title: "Home improvements", hint: "Renovate & upgrade", href: "/heloc", icon: "repair" },
  { goal: "buy", title: "Buy or refinance", hint: "Low wholesale rates", href: "/buy", icon: "key" },
];

export const equityBenefits = [
  {
    title: "Apply online in minutes",
    body: "Straightforward digital application with clear document requests.",
  },
  {
    title: "Appraisal waived when eligible",
    body: "Automated valuation models often eliminate in-home appraiser visits.",
  },
  {
    title: "Close in as few as {{closeDays}}",
    body: "Direct wholesale underwriting enables rapid funding when speed counts.",
  },
];

export type ProductCard = {
  title: string;
  body: string;
  points?: string[];
  href: string;
  icon: "tree" | "payments" | "check" | "cottage" | "medal" | "briefcase";
};

export const equityProducts: ProductCard[] = [
  {
    title: "HELOC (Line of Credit)",
    body: "Draw cash only when you need it and only pay interest on what you use. Ideal for ongoing renovations or an emergency safety net.",
    points: ["Draw period up to 10 years", "Re-borrow as you pay it down"],
    href: "/heloc",
    icon: "tree",
  },
  {
    title: "Fixed Home Equity Loan",
    body: "One lump sum with a fixed, predictable monthly payment that never changes. Perfect for major one-time investments or large expenses.",
    points: ["Fixed rates from 10 to 30 years", "Zero prepayment penalties"],
    href: "/home-equity-loan",
    icon: "payments",
  },
  {
    title: "Debt Consolidation",
    body: "Roll multiple high-interest cards ({{cardRates}}) and personal loans into a single lower interest payment, freeing up hundreds every single month.",
    points: ["Average monthly savings of {{savings}}", "Simplify finances into one bill"],
    href: "/debt-consolidation",
    icon: "check",
  },
];

export const purchaseProducts: ProductCard[] = [
  {
    title: "Conventional Purchase",
    body: "Wholesale pricing with options starting at just {{downPayment}} down. Fast pre-approvals that make your offers stand out in competitive markets.",
    href: "/buy",
    icon: "cottage",
  },
  {
    title: "VA & FHA Financing",
    body: "0% down options for military veterans and flexible credit guidelines for first-time homebuyers with sponsored lending speed.",
    href: "/buy",
    icon: "medal",
  },
  {
    title: "Self-Employed & Jumbo",
    body: "Bank statement loans, DSCR investor products, and 1099 programs designed for business owners rejected by retail bank algorithms.",
    href: "/programs",
    icon: "briefcase",
  },
];

export const rateMatchSteps = [
  {
    title: "Send your Loan Estimate",
    body: "Email or upload any written loan estimate or fee sheet. No credit pull needed for a rate match evaluation.",
  },
  {
    title: "We shop {{lenders}} lenders",
    body: "We check our real-time wholesale network to find lower interest rates, waived fees, or better loan terms.",
  },
  {
    title: "Get a straight answer",
    body: "In {{rateMatch24}}, you get a clean breakdown showing exactly how much you can save, or our blessing to sign the other loan.",
  },
];

export const testimonials = [
  {
    quote:
      "Mohamad saved our renovation timeline after our big retail bank dragged their feet for 4 weeks. Closed our HELOC in 4 days with zero fuss.",
    name: "Sarah & David M.",
    loan: "Home Equity Line of Credit",
  },
  {
    quote:
      "We kept our 3.125% first mortgage and took out a standalone second loan to wipe out our credit card debt. Best financial decision we made this decade.",
    name: "Marcus T.",
    loan: "Debt Consolidation",
  },
  {
    quote:
      "As self-employed contractors, algorithmic banks turned us down. Mohamad got us approved within 48 hours using 12-month bank statements.",
    name: "Elena R.",
    loan: "Self-Employed Home Loan",
  },
];

export const howItWorks = [
  {
    title: "Talk to Moe",
    body: "A quick 5-minute phone chat with zero obligation. You share your goal, and we outline your real wholesale numbers.",
  },
  {
    title: "Apply securely",
    body: "A simple 100% online portal with bank-grade encryption. Upload minimal documents on your own schedule.",
  },
  {
    title: "Close with confidence",
    body: "Funds deposited directly into your bank account or keys in hand, backed by clear, transparent paperwork.",
  },
];

export const homeFaqs = [
  {
    q: "Will checking my options affect my credit score?",
    a: "No. Initial estimates, conversations with Mohamad, and wholesale scenario planning use a soft credit pull that has zero negative impact on your credit score. A formal hard inquiry only occurs if you decide to officially submit an application.",
  },
  {
    q: "What is the difference between a HELOC and a Home Equity Loan?",
    a: "A Fixed Home Equity Loan delivers a single lump-sum payout with a predictable fixed rate and fixed monthly payment. A HELOC functions similarly to a credit card secured by your home: you have a credit limit you can draw from as needed, and you only pay interest on the money you actually borrow.",
  },
  {
    q: "Is my home at risk when borrowing equity?",
    a: "Like any residential mortgage, equity loans are secured by your property. This is why we strictly analyze your debt-to-income ratio and borrow conservatively—ensuring your payment remains comfortable and sustainable over the entire loan term.",
  },
  {
    q: "How does House of Equity get paid as an independent broker?",
    a: "In almost all cases, our broker fee is paid directly by the wholesale lender you choose—not out of your pocket. By shopping {{lenders}} wholesale lenders, we often beat retail bank pricing even after broker compensation is factored in.",
  },
  {
    q: "How can a HELOC close in as few as 3 days?",
    a: "Our specialized wholesale equity programs utilize automated property valuations (AVMs) and instant digital income verification. When a borrower qualifies for an appraisal waiver, the entire underwriting process takes hours instead of weeks.",
  },
];

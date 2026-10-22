// Copy for the inner pages. Sources, in order of preference:
//   [design]  verbatim from the Stitch homepage/HELOC designs
//   [guide]   verbatim or closely adapted from the House of Equity brand guide
//   [new]     plain-English explanations written for these pages; no new numbers or promises.
// Every [new] passage is listed in README → "Before launch: verify" for Mohamad's review.

import type { RelatedLink } from "@/components/sections/blocks";

export const loanLinks = {
  heloc: { href: "/heloc", title: "HELOC", body: "A line of credit you draw from as needed." },
  homeEquityLoan: { href: "/home-equity-loan", title: "Home Equity Loan", body: "One lump sum with a fixed monthly payment." },
  cashOut: { href: "/cash-out-refinance", title: "Cash-Out Refinance", body: "Replace your first mortgage and take cash out." },
  debt: { href: "/debt-consolidation", title: "Debt Consolidation", body: "Combine high-interest balances into one payment." },
  buy: { href: "/buy", title: "Buy a Home", body: "Purchase loans, from first homes to jumbo." },
  refinance: { href: "/refinance", title: "Refinance", body: "Change your rate, your term, or both." },
  programs: { href: "/programs", title: "Loan Programs", body: "FHA, VA, jumbo, self-employed and more." },
  rateMatch: { href: "/rate-match", title: "Rate Match", body: "Already have an offer? Send it for a second opinion." },
} satisfies Record<string, RelatedLink>;

// ---------- shared FAQ answers (verbatim from the homepage design) ----------
const designFaq = {
  credit: {
    q: "Will checking my options affect my credit score?",
    a: "No. Initial estimates, conversations with Mohamad, and wholesale scenario planning use a soft credit pull that has zero negative impact on your credit score. A formal hard inquiry only occurs if you decide to officially submit an application.",
  },
  helocVsLoan: {
    q: "What is the difference between a HELOC and a Home Equity Loan?",
    a: "A Fixed Home Equity Loan delivers a single lump-sum payout with a predictable fixed rate and fixed monthly payment. A HELOC functions similarly to a credit card secured by your home: you have a credit limit you can draw from as needed, and you only pay interest on the money you actually borrow.",
  },
  risk: {
    q: "Is my home at risk when borrowing equity?",
    a: "Like any residential mortgage, equity loans are secured by your property. This is why we strictly analyze your debt-to-income ratio and borrow conservatively—ensuring your payment remains comfortable and sustainable over the entire loan term.",
  },
  brokerPay: {
    q: "How does House of Equity get paid as an independent broker?",
    a: "In almost all cases, our broker fee is paid directly by the wholesale lender you choose—not out of your pocket. By shopping {{lenders}} wholesale lenders, we often beat retail bank pricing even after broker compensation is factored in.",
  },
};

// ---------- /home-equity-loan ----------
export const homeEquityLoanFaqs = [
  designFaq.helocVsLoan,
  {
    // [new]
    q: "Do I have to refinance my first mortgage?",
    a: "No. A home equity loan is a separate second loan. Your existing first mortgage, and its rate, stay exactly as they are.",
  },
  designFaq.credit,
  designFaq.risk,
];

// ---------- /cash-out-refinance ----------
export const cashOutFaqs = [
  {
    // [new]
    q: "How is a cash-out refinance different from a HELOC or home equity loan?",
    a: "A cash-out refinance replaces your current first mortgage with a new, larger one, so you end up with one loan and one payment. A HELOC or home equity loan is a second loan that sits alongside your existing mortgage and leaves its rate untouched.",
  },
  {
    // [new]
    q: "Are there closing costs?",
    a: "Yes. A cash-out refinance is a new first mortgage, so it usually has closing costs. Mohamad will show you the total cost, not just the monthly payment, before you decide anything.",
  },
  {
    // [new]
    q: "Will my monthly payment go up?",
    a: "It depends on your new rate, the new loan amount and the term you choose. Starting a new 30-year term can lower the payment but add years of interest, so we compare the total cost over time with you.",
  },
  designFaq.credit,
];

// ---------- /debt-consolidation ----------
export const debtFaqs = [
  {
    // [new], answers the guide's requirement to avoid implying debt settlement
    q: "Is debt consolidation the same as debt settlement?",
    a: "No. Consolidation pays your existing balances in full with a new loan. Debt settlement negotiates to pay creditors less than you owe and can damage your credit. We do not offer debt settlement.",
  },
  {
    // [new]
    q: "Which loan is used to consolidate debt?",
    a: "Usually a home equity loan, a HELOC or a cash-out refinance. The right one depends on your current mortgage rate, how much you owe and how you prefer to repay. Mohamad will compare them side by side with you.",
  },
  designFaq.risk,
  designFaq.credit,
];

export const debtTradeoffs = [
  // [guide] "Explain potential tradeoffs and secured-loan risk."
  {
    title: "Your home becomes the security",
    body: "Credit card debt is unsecured. A home equity loan is secured by your house, so missing payments could put your home at risk.",
  },
  {
    title: "A lower payment isn't always a lower cost",
    body: "Spreading balances over a longer term can mean paying more interest in total, even when the monthly payment drops.",
  },
  {
    title: "There may be closing costs",
    body: "Fees and closing costs vary by loan and lender. We include them in every comparison.",
  },
  {
    title: "It works best with a plan",
    body: "Consolidating helps most when the paid-off cards aren't built back up again.",
  },
];

// ---------- /buy ----------
export const buyFaqs = [
  {
    // [new]; percentages are the design's own claims
    q: "How much do I need for a down payment?",
    a: "It depends on the loan. Conventional options start at {{downPayment}} down, VA loans offer 0% down{{^downPayment}} for eligible veterans, and FHA loans have flexible credit guidelines for first-time buyers. Mohamad will show you what fits your situation.",
  },
  {
    // [new]
    q: "What's the difference between pre-qualification and pre-approval?",
    a: "A pre-qualification is a quick estimate based on what you tell us. A pre-approval means your income, assets and credit have been reviewed, which gives sellers more confidence in your offer.",
  },
  designFaq.brokerPay,
  designFaq.credit,
];

// ---------- /refinance ----------
export const refinanceFaqs = [
  {
    // [new]
    q: "When does refinancing make sense?",
    a: "Usually when it lowers your total cost, shortens your term, or replaces an adjustable rate with a fixed one. If you already have a low first-mortgage rate, a HELOC or home equity loan may be a better way to borrow.",
  },
  {
    // [new]
    q: "What does a refinance cost?",
    a: "A refinance is a new mortgage, so there are usually closing costs. We show you the total cost and how long it takes for any savings to cover it before you decide.",
  },
  designFaq.brokerPay,
  designFaq.credit,
];

// ---------- /programs ----------
export const programsFaqs = [
  {
    // [new]
    q: "Which loan program is right for me?",
    a: "Tell Mohamad your goal and your situation. He will compare the programs you qualify for across {{lenders}} wholesale lenders and explain the trade-offs in plain English.",
  },
  designFaq.brokerPay,
];

// ---------- /rate-match ----------
export const rateMatchFaqs = [
  {
    // [design] wording from the Rate Match steps
    q: "Will a rate match review affect my credit?",
    a: "No. No credit pull is needed for a rate match evaluation.",
  },
  {
    // [new]
    q: "What should I send?",
    a: "Any written Loan Estimate or fee sheet from another lender. A PDF or a clear photo of each page works.",
  },
  {
    // [new]
    q: "What if the other offer is better?",
    a: "Then we'll tell you. If another lender has the best deal for your situation, you'll get an honest answer and our blessing to sign the other loan.",
  },
];

// ---------- equity product comparison [new], used on the equity and refinance pages ----------
const compareFeatures = [
  "How you get the money",
  "Interest rate",
  "Monthly payment",
  "Your current first mortgage",
  "Often a fit when",
] as const;

const compareProducts = {
  homeEquityLoan: {
    name: "Home Equity Loan",
    values: [
      "One lump sum at closing",
      "Fixed",
      "The same every month",
      "Stays exactly as it is",
      "You need a set amount for a one-time cost",
    ],
  },
  heloc: {
    name: "HELOC",
    values: [
      "Draw what you need from a credit line",
      "Usually variable; fixed-rate options may be available",
      "Based on what you've drawn",
      "Stays exactly as it is",
      "Costs come in stages, or you want a safety net",
    ],
  },
  cashOut: {
    name: "Cash-Out Refinance",
    values: [
      "Cash at closing from a new, larger first mortgage",
      "Fixed or adjustable",
      "One new payment replaces your current one",
      "Paid off and replaced",
      "Today's rates are better than your current rate",
    ],
  },
} as const;

/** Comparison table data with the given product first (highlighted column). */
export function equityCompare(order: Array<keyof typeof compareProducts>) {
  return {
    columns: order.map((k) => compareProducts[k].name),
    rows: compareFeatures.map((feature, i) => ({
      feature,
      values: order.map((k) => compareProducts[k].values[i] as string),
    })),
  };
}

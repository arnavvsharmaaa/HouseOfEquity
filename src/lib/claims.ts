// Every marketing claim and figure on the site, with its disclosure. This is the single source:
// copy references claims by key, so a figure changes everywhere when it changes here.
//
// In content strings, write {{key}} to print a claim's value. The disclosures are listed in the
// footer, in the order of this object.
// Disclosure wording is DRAFT pending compliance review (README → "Before launch: verify").

import { licensedStates, zillow } from "./site";

type Claim = { value: string; note: string };

export const claims = {
  rocket: {
    value: "#1",
    note: "Rocket Mortgage received the highest score in the J.D. Power 2022 – 2023 Primary Mortgage Servicer Satisfaction Studies. Visit jdpower.com/awards for more information.",
  },
  topBroker: {
    value: "Top Broker",
    note: "Refers to Mohamad Fardous's recognition as a Rocket Pro TPO Elite Mortgage Broker.",
  },
  lenders: {
    value: "170+",
    note: "The number of wholesale lenders available through the West Capital Lending, Inc. broker network. Not every lender offers every program, and availability varies by state, property and borrower.",
  },
  states: {
    value: `${licensedStates.length}`,
    note: `Mohamad Fardous (NMLS #1448893) is licensed to originate residential mortgage loans in ${licensedStates.length} states. See State Licensing for the list.`,
  },
  years: {
    value: "10+",
    note: "Years of professional experience in mortgage finance.",
  },
  zillow: {
    value: zillow.rating,
    note: "Average star rating of the client reviews on Mohamad Fardous's Zillow profile. Reviews reflect individual experiences.",
  },
  testimonials: {
    value: "",
    note: "Client stories describe individual experiences and are not a guarantee of future results. Timelines, rates and outcomes vary.",
  },
  credit: {
    value: "Won't affect your credit score.",
    note: "Talking with us, getting an estimate or a rate match review uses no credit check or only a soft inquiry, which does not affect your credit score. A hard credit inquiry happens only if you choose to submit a loan application.",
  },
  closeDays: {
    value: "3 days",
    note: "Close in as few as 3 days: eligible digital HELOCs only. Funds released after the 3-day right of rescission. Subject to credit and property approval.",
  },
  speedFunding: {
    value: "3 to 7 Days",
    note: "Illustrative funding timeline. Actual timing depends on underwriting, valuation and title, and is not guaranteed.",
  },
  rateMatch24: {
    value: "24 hours",
    note: "Typical response time for rate match reviews received on business days; not guaranteed.",
  },
  savings: {
    value: "$650+",
    note: "Savings figures are illustrations, not a promise. Your payment and savings depend on your balances, rates, term and fees. A lower monthly payment over a longer term can mean paying more interest overall.",
  },
  cardRates: {
    value: "22%+",
    note: "Credit card interest rate shown for illustration; your rates may be higher or lower.",
  },
  downPayment: {
    value: "3%",
    note: "Minimum down payment depends on the program and your qualifications: conventional options from 3% down; VA options from 0% down for eligible veterans and service members. Mortgage insurance or funding fees may apply.",
  },
  loanTerms: {
    value: "",
    note: "Draw periods, repayment terms and prepayment terms vary by lender and program. Some loans have early-closure, annual or other fees.",
  },
  helocLimits: {
    value: "$750,000",
    note: "Line amounts, credit score and combined loan-to-value (CLTV) figures describe programs available through the lending network. They vary by lender, property and borrower, and not all applicants qualify.",
  },
  equityVolume: {
    value: "$30B+",
    note: "Total home equity evaluated across the lending network, as reported by the network; not specific to House of Equity.",
  },
  example: {
    value: "",
    note: "Illustrative example of how a homeowner might use a HELOC; not a specific client's result.",
  },
  benchmarkRate: {
    value: "8.15",
    note: "Example rate for illustration only; not a rate quote or an offer of credit. Your rate depends on your credit, property, loan amount and the lender's program.",
  },
  marketComparison: {
    value: "",
    note: "Comparison figures for other lenders and loan types are general market estimates for illustration and vary by lender.",
  },
  tax: {
    value: "",
    note: "Interest may be tax-deductible in some cases, such as when the funds are used for home improvements. Consult a tax professional.",
  },
} satisfies Record<string, Claim>;

export type ClaimKey = keyof typeof claims;

export const claimKeys = Object.keys(claims) as ClaimKey[];

const TOKEN = /\{\{([a-zA-Z0-9]+)\}\}/g;

/** Token string → plain text. For metadata and JSON-LD. */
export function plain(text: string): string {
  return text.replace(TOKEN, (_, key: string) => claims[key as ClaimKey]?.value ?? "");
}

/** Splits a token string into text and claim parts. */
export function parseClaims(text: string): Array<string | { key: ClaimKey }> {
  const parts: Array<string | { key: ClaimKey }> = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const key = m[1] as ClaimKey;
    if (!(key in claims)) throw new Error(`Unknown claim token "${m[0]}" in: ${text}`);
    if (m.index! > last) parts.push(text.slice(last, m.index));
    parts.push({ key });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

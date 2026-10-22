// Brand guide, "Home equity estimator":
//   estimated equity           = value − secured balances
//   illustrative capacity      = max(0, value × CLTV − secured balances)

export const DEFAULT_CLTV = 0.8;

export function estimateEquity({
  homeValue,
  mortgageBalance,
  otherLiens,
  cltv = DEFAULT_CLTV,
}: {
  homeValue: number;
  mortgageBalance: number;
  otherLiens: number;
  cltv?: number;
}) {
  const balances = Math.max(0, mortgageBalance) + Math.max(0, otherLiens);
  const value = Math.max(0, homeValue);
  return {
    equity: Math.max(0, value - balances),
    capacity: Math.max(0, value * cltv - balances),
  };
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatUsd = (n: number) => usd.format(Math.round(n));

/** Parses "$1,250,000" / "1250000" → 1250000; anything unparseable → 0. */
export function parseUsd(input: string): number {
  const n = Number(input.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Fully amortizing monthly principal & interest:
 *   P × r(1+r)^n / ((1+r)^n − 1), with r = APR / 12 and n = years × 12.
 * A 0% rate falls back to straight-line repayment.
 */
export function monthlyPayment(principal: number, aprPercent: number, years: number): number {
  const n = Math.round(years * 12);
  if (principal <= 0 || n <= 0) return 0;
  const r = aprPercent / 100 / 12;
  if (r <= 0) return principal / n;
  const growth = Math.pow(1 + r, n);
  return (principal * r * growth) / (growth - 1);
}

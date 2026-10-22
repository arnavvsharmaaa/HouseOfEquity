"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { CurrencyField } from "./CurrencyField";
import { LiveAnnouncer } from "./LiveAnnouncer";
import { useReportCalculatorOnce } from "./useReportOnce";
import { PrimaryAction } from "@/components/ui/Claim";
import type { Calculator } from "@/lib/analytics";
import { claims } from "@/lib/claims";
import { formatUsd, monthlyPayment } from "@/lib/equity";
import { getStartedHref } from "@/lib/site";

const MAX_RATE = 30;

export type PaymentConfig = {
  calculator: Calculator;
  /** "loan": one amount field. "purchase": home price + down payment. */
  mode: "loan" | "purchase";
  amountLabel: string;
  defaultAmount: number;
  defaultPrice?: number;
  defaultDown?: number;
  terms: readonly number[];
  defaultTerm: number;
  /** Prefilled rate as text; "" leaves it for the visitor to enter. */
  defaultRate: string;
  rateHint: string;
  amountSummaryLabel: string;
  ctaLabel: string;
  ctaHref: string;
  footnote: string;
};

// Defaults are the HELOC design's copy and numbers.
export const helocPayment: PaymentConfig = {
  calculator: "heloc_payment",
  mode: "loan",
  amountLabel: "HELOC Amount Needed",
  defaultAmount: 75_000,
  terms: [10, 15, 20, 30],
  defaultTerm: 30,
  defaultRate: claims.benchmarkRate.value,
  rateHint: "Today's standard wholesale benchmark",
  amountSummaryLabel: "Selected Line:",
  ctaLabel: "Lock in this estimate",
  ctaHref: `${getStartedHref}?goal=equity`,
  footnote: "Estimate only. Your actual rate depends on your credit profile, property evaluation, and lender program.",
};

const pillClass =
  "flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-field bg-white text-[17px] font-medium text-ink transition-[background-color,border-color,color,transform] duration-150 ease-out hover:border-navy motion-safe:active:scale-[0.98] has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-navy";

export function PaymentEstimator({ config = helocPayment }: { config?: PaymentConfig }) {
  const [amount, setAmount] = useState(config.defaultAmount);
  const [price, setPrice] = useState(config.defaultPrice ?? 450_000);
  const [down, setDown] = useState(config.defaultDown ?? 45_000);
  const [term, setTerm] = useState(config.defaultTerm);
  const [rateText, setRateText] = useState(config.defaultRate);
  const uid = useId();
  const rateId = `${uid}-rate`;

  const loan = config.mode === "purchase" ? Math.max(0, price - down) : amount;
  const rate = Number(rateText);
  const rateBlank = rateText.trim() === "";
  const rateValid = !rateBlank && Number.isFinite(rate) && rate >= 0 && rate <= MAX_RATE;
  const payment = rateValid ? monthlyPayment(loan, rate, term) : 0;
  const downPct = price > 0 ? Math.round((down / price) * 1000) / 10 : 0;

  const markTouched = useReportCalculatorOnce(config.calculator, [amount, price, down, term, rateText]);
  const touch = (setter: (v: number) => void) => (v: number) => {
    markTouched();
    setter(v);
  };

  const rateDescribedBy = [`${rateId}-hint`, !rateBlank && !rateValid && `${rateId}-error`].filter(Boolean).join(" ");

  return (
    <div className="grid overflow-hidden rounded-panel border border-line lg:grid-cols-12">
      {/* Inputs */}
      <div className="space-y-5 bg-panel p-5 sm:p-8 lg:col-span-7 lg:px-10 lg:py-8">
        {config.mode === "purchase" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <CurrencyField label="Home Price" value={price} onChange={touch(setPrice)} min={50_000} max={3_000_000} step={5_000} slider={false} />
            <CurrencyField
              label="Down Payment"
              hint={price > 0 ? `${downPct}% of price` : undefined}
              value={down}
              onChange={touch((v) => setDown(Math.min(v, price)))}
              min={0}
              max={3_000_000}
              step={1_000}
              slider={false}
            />
          </div>
        ) : (
          <CurrencyField label={config.amountLabel} value={amount} onChange={touch(setAmount)} min={10_000} max={500_000} step={5_000} slider={false} />
        )}

        <fieldset>
          <legend className="text-[17px] font-medium leading-7 text-ink">Repayment Term</legend>
          <div className={`mt-1 grid gap-3 ${config.terms.length > 2 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
            {config.terms.map((t) => (
              <label key={t} className={pillClass}>
                <input
                  type="radio"
                  name={`${uid}-term`}
                  value={t}
                  checked={term === t}
                  onChange={() => {
                    markTouched();
                    setTerm(t);
                  }}
                  className="sr-only"
                />
                {t} Years
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-2">
            <label htmlFor={rateId} className="text-[17px] font-medium leading-7 text-ink">
              Interest Rate (APR %)
            </label>
            <span id={`${rateId}-hint`} className="text-[15px] text-navy">
              {config.rateHint}
            </span>
          </div>
          <div className="relative mt-1">
            <input
              id={rateId}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={rateText}
              onChange={(e) => {
                markTouched();
                setRateText(e.target.value.replace(/[^0-9.]/g, ""));
              }}
              aria-invalid={!rateBlank && !rateValid}
              aria-describedby={rateDescribedBy}
              className="min-h-12 w-full rounded-[12px] border border-field bg-white pl-4 pr-10 text-[19px] font-medium text-ink aria-[invalid=true]:border-2 aria-[invalid=true]:border-error"
            />
            <span aria-hidden className="absolute right-4 top-1/2 -translate-y-1/2 text-[19px] text-body">
              %
            </span>
          </div>
          {!rateBlank && !rateValid && (
            <p id={`${rateId}-error`} className="pt-1 text-[16px] font-medium text-error">
              Enter a rate between 0 and {MAX_RATE}%.
            </p>
          )}
        </div>
      </div>

      {/* Result (dark panel, as in the HELOC design) */}
      <div className="flex flex-col justify-between gap-5 bg-ink p-5 text-white sm:p-8 lg:col-span-5 lg:px-10 lg:py-8">
        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.1em] text-white/80">Estimated Monthly Breakdown</p>
          <p data-result className="mt-2 text-[44px] font-semibold leading-tight tracking-tight">
            {rateValid ? formatUsd(payment) : "—"}
          </p>
          <p className="text-[17px] text-white/80">
            {rateBlank ? "Enter an interest rate to see your payment" : "Principal & Interest / month"}
          </p>
        </div>
        <LiveAnnouncer
          message={rateValid ? `Estimated payment ${formatUsd(payment)} per month` : rateBlank ? "" : "Enter a valid interest rate"}
        />
        <dl className="space-y-1 border-t border-white/25 pt-4 text-[18px]">
          <div className="flex justify-between gap-3">
            <dt className="text-white/80">{config.amountSummaryLabel}</dt>
            <dd className="font-semibold">{formatUsd(loan)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-white/80">Selected Term:</dt>
            <dd className="font-semibold">{term} Years</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-white/80">Interest Rate:</dt>
            <dd className="font-semibold">
              {rateValid ? `${rate.toFixed(2)}% APR` : "—"}
            </dd>
          </div>
        </dl>
        <div className="space-y-3">
          <PrimaryAction tone="dark" align="center">
            <Link
              href={config.ctaHref}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-white px-7 text-[17px] font-medium text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-panel focus-visible:outline-white motion-safe:active:scale-[0.98]"
            >
              {config.ctaLabel}
            </Link>
          </PrimaryAction>
          <p className="text-center text-[15px] leading-snug text-white/80">
            <strong className="font-semibold text-white">Illustration only. Not an approval or rate quote.</strong>{" "}
            {config.footnote}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { CurrencyField } from "./CurrencyField";
import { useReportCalculatorOnce } from "./useReportOnce";
import { formatUsd, monthlyPayment } from "@/lib/equity";
import { getStartedHref } from "@/lib/site";

const terms = [10, 15, 20, 30] as const;
const MAX_RATE = 30;

export function HelocPaymentEstimator() {
  const [amount, setAmount] = useState(75_000);
  const [term, setTerm] = useState<(typeof terms)[number]>(30);
  const [rateText, setRateText] = useState("8.15");
  const rateId = useId();

  const rate = Number(rateText);
  const rateValid = rateText.trim() !== "" && Number.isFinite(rate) && rate >= 0 && rate <= MAX_RATE;
  const payment = rateValid ? monthlyPayment(amount, rate, term) : 0;

  const markTouched = useReportCalculatorOnce("heloc_payment", [amount, term, rateText]);

  return (
    <div className="grid overflow-hidden rounded-panel border border-line lg:grid-cols-12">
      {/* Inputs */}
      <div className="space-y-5 bg-panel p-5 sm:p-8 lg:col-span-7 lg:px-10 lg:py-8">
        <CurrencyField
          label="HELOC Amount Needed"
          value={amount}
          onChange={(v) => {
            markTouched();
            setAmount(v);
          }}
          min={10_000}
          max={500_000}
          step={5_000}
          slider={false}
        />

        <fieldset>
          <legend className="text-[17px] font-medium leading-7 text-ink">Repayment Term</legend>
          <div className="mt-1 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {terms.map((t) => (
              <label
                key={t}
                className="flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-field bg-white text-[17px] font-medium text-ink transition-colors hover:border-navy has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-navy"
              >
                <input
                  type="radio"
                  name="heloc-term"
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
              Today&apos;s standard wholesale benchmark
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
              aria-invalid={!rateValid}
              aria-describedby={`${rateId}-hint${rateValid ? "" : ` ${rateId}-error`}`}
              className="min-h-12 w-full rounded-[12px] border border-field bg-white pl-4 pr-10 text-[19px] font-medium text-ink aria-[invalid=true]:border-error"
            />
            <span aria-hidden className="absolute right-4 top-1/2 -translate-y-1/2 text-[19px] text-body">
              %
            </span>
          </div>
          {!rateValid && (
            <p id={`${rateId}-error`} className="pt-1 text-[16px] font-medium text-error">
              Enter a rate between 0 and {MAX_RATE}%.
            </p>
          )}
        </div>
      </div>

      {/* Result (dark panel, as in the design) */}
      <div className="flex flex-col justify-between gap-5 bg-ink p-5 text-white sm:p-8 lg:col-span-5 lg:px-10 lg:py-8">
        <div aria-live="polite" aria-atomic="true">
          <p className="text-[14px] font-semibold uppercase tracking-[0.1em] text-white/80">
            Estimated Monthly Breakdown
          </p>
          <p className="mt-2 text-[44px] font-semibold leading-tight tracking-tight">
            {rateValid ? formatUsd(payment) : "—"}
          </p>
          <p className="text-[17px] text-white/80">Principal &amp; Interest / month</p>
        </div>
        <dl className="space-y-1 border-t border-white/25 pt-4 text-[18px]">
          <div className="flex justify-between gap-3">
            <dt className="text-white/80">Selected Line:</dt>
            <dd className="font-semibold">{formatUsd(amount)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-white/80">Selected Term:</dt>
            <dd className="font-semibold">{term} Years</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-white/80">Interest Rate:</dt>
            <dd className="font-semibold">{rateValid ? `${rate.toFixed(2)}% APR` : "—"}</dd>
          </div>
        </dl>
        <div className="space-y-3">
          <Link
            href={`${getStartedHref}?goal=equity`}
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-white px-7 text-[17px] font-medium text-ink transition-colors hover:bg-panel focus-visible:outline-white"
          >
            Lock in this estimate
          </Link>
          <p className="text-center text-[15px] leading-snug text-white/80">
            <strong className="font-semibold text-white">Illustration only. Not an approval or rate quote.</strong>{" "}
            Estimate only. Your actual rate depends on your credit profile, property evaluation, and
            lender program.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CircleCheck, SlidersHorizontal } from "lucide-react";
import { CltvField } from "./CltvField";
import { CurrencyField } from "./CurrencyField";
import { useReportCalculatorOnce } from "./useReportOnce";
import { buttonClass, cx } from "@/components/ui/primitives";
import { DEFAULT_CLTV, estimateEquity, formatUsd } from "@/lib/equity";
import { getStartedHref } from "@/lib/site";

const pct = (part: number, whole: number) => (whole > 0 ? Math.min(100, Math.max(0, (part / whole) * 100)) : 0);

export function HelocCapacityEstimator() {
  const [homeValue, setHomeValue] = useState(800_000);
  const [mortgageBalance, setMortgageBalance] = useState(550_000);
  const [otherLiens, setOtherLiens] = useState(0);
  const [cltv, setCltv] = useState(DEFAULT_CLTV);

  const { capacity } = estimateEquity({ homeValue, mortgageBalance, otherLiens, cltv });
  const balances = mortgageBalance + otherLiens;
  const maxCap = homeValue * cltv;
  const cltvLabel = `${Math.round(cltv * 100)}%`;

  const markTouched = useReportCalculatorOnce("equity_estimator", [
    homeValue,
    mortgageBalance,
    otherLiens,
    cltv,
  ]);
  const touch = (setter: (v: number) => void) => (v: number) => {
    markTouched();
    setter(v);
  };

  // Stacked bar of the home's value: what's owed | what may be borrowed | equity left untouched.
  const segments = [
    { label: "Current balances", value: Math.min(balances, homeValue), className: "bg-field" },
    { label: "Could borrow", value: capacity, className: "bg-ink" },
    {
      label: "Equity cushion",
      value: Math.max(0, homeValue - Math.max(balances, maxCap)),
      className: "bg-white",
    },
  ];

  return (
    <div className="rounded-panel border border-line bg-panel p-4 sm:p-8 lg:px-10 lg:py-7">
      <p className="mb-4 flex items-center gap-2 text-[17px] font-semibold text-navy">
        <SlidersHorizontal aria-hidden className="size-5 shrink-0" />
        Adjust the sliders below to calculate your custom borrowing capacity
      </p>

      <div className="grid items-stretch gap-5 lg:grid-cols-12 lg:gap-6">
        {/* Inputs + visual */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          <fieldset className="grid gap-x-5 gap-y-3 rounded-card border border-line bg-white p-4 sm:grid-cols-2 sm:p-5">
            <legend className="sr-only">Your home and balances</legend>
            <CurrencyField
              label="Estimated Home Value"
              value={homeValue}
              onChange={touch(setHomeValue)}
              min={200_000}
              max={2_000_000}
              step={10_000}
            />
            <CurrencyField
              label="Remaining Mortgage Balance"
              value={mortgageBalance}
              onChange={touch(setMortgageBalance)}
              min={0}
              max={1_500_000}
              step={5_000}
            />
            <CurrencyField
              label="Other Liens"
              hint="$0 if none"
              value={otherLiens}
              onChange={touch(setOtherLiens)}
              min={0}
              max={500_000}
              step={5_000}
            />
            <CltvField value={cltv} onChange={touch(setCltv)} />
          </fieldset>

          <div className="rounded-card border border-line bg-white p-4 sm:p-5">
            <p className="text-[16px] font-medium text-ink">Your home&apos;s value, {formatUsd(homeValue)}</p>
            <div aria-hidden className="mt-2 flex h-6 overflow-hidden rounded-full border border-line">
              {segments.map((s) => (
                <span
                  key={s.label}
                  className={cx("h-full transition-[width] duration-300", s.className)}
                  style={{ width: `${pct(s.value, homeValue)}%` }}
                />
              ))}
            </div>
            <dl className="mt-3 grid gap-x-5 gap-y-1 text-[16px] sm:grid-cols-2">
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-2 text-body">
                  <span aria-hidden className="size-3 rounded-full bg-field" />
                  Current balances
                </dt>
                <dd className="whitespace-nowrap font-medium text-ink">{formatUsd(balances)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-2 text-body">
                  <span aria-hidden className="size-3 rounded-full bg-ink" />
                  Could borrow
                </dt>
                <dd className="whitespace-nowrap font-medium text-ink">{formatUsd(capacity)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2 sm:col-span-2">
                <dt className="text-body">Max Borrowing Cap ({cltvLabel})</dt>
                <dd className="whitespace-nowrap font-medium text-ink">{formatUsd(maxCap)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Result */}
        <div className="flex flex-col justify-between gap-4 rounded-card border border-line bg-white p-5 sm:p-6 lg:col-span-5">
          <div className="space-y-2">
            <h2 id="capacity-title" className="text-[26px] font-medium leading-tight tracking-tight text-ink sm:text-[28px]">
              How much could I borrow with a HELOC?
            </h2>
            <p className="text-[18px] leading-relaxed text-body">
              Lines of credit up to $750,000 across 170+ wholesale lending channels. You only pay
              for what you draw.
            </p>
          </div>
          <div className="space-y-1 border-y border-line py-4" aria-live="polite" aria-atomic="true">
            <p className="text-[16px] text-body">In this scenario, you could qualify to borrow up to:</p>
            <p className="text-[40px] font-semibold leading-tight tracking-tight text-ink">
              {formatUsd(capacity)}
            </p>
            <p className="inline-flex items-center gap-1.5 text-[16px] font-medium text-navy">
              <CircleCheck aria-hidden className="size-[18px]" />
              {cltvLabel} Combined LTV Threshold
            </p>
          </div>
          <div className="space-y-3">
            <Link href={`${getStartedHref}?goal=equity`} className={buttonClass("primary", "w-full")}>
              Check my HELOC options
              <ArrowRight aria-hidden className="size-5" />
            </Link>
            <p className="text-center text-[15px] leading-snug text-body">
              <strong className="font-semibold text-ink">*Illustration only. Not an approval or rate quote.</strong>{" "}
              Based on {cltvLabel} of your home&apos;s value. Actual amounts subject to full review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

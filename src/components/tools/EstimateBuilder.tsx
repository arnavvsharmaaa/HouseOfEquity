"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, Lock, ShieldCheck } from "lucide-react";
import { CltvField } from "./CltvField";
import { CurrencyField } from "./CurrencyField";
import { useReportCalculatorOnce } from "./useReportOnce";
import { buttonClass } from "@/components/ui/primitives";
import { track, type FinancingGoal } from "@/lib/analytics";
import { goals, stages, type Stage } from "@/lib/content/home";
import { DEFAULT_CLTV, estimateEquity, formatUsd } from "@/lib/equity";
import { advisor, getStartedHref } from "@/lib/site";

const metricTitle: Record<FinancingGoal, string> = {
  equity: "Estimated Available Equity",
  debt: "Available to Consolidate Debt",
  renovation: "Available Renovation Funds",
  buy: "Estimated Available Equity",
  refinance: "Estimated Available Equity",
};

/** Where "See My Options" goes. Only the goal category ever appears in the URL. */
function destinationFor(goal: FinancingGoal, stage: Stage) {
  if (stage === "comparing") return "/rate-match";
  if (stage === "ready") return `${getStartedHref}?goal=${goal}`;
  return goals.find((g) => g.value === goal)?.href ?? "/";
}

function InlineSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <span className="relative my-1 inline-block align-middle">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="min-h-12 max-w-full cursor-pointer appearance-none rounded-full border border-navy-line bg-navy-tint py-0.5 pl-4 pr-11 text-[22px] font-medium text-navy hover:bg-[#e5ecf6] sm:text-[28px] xl:text-[30px]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 top-1/2 size-6 -translate-y-1/2 text-navy"
      />
    </span>
  );
}

export function EstimateBuilder() {
  const [goal, setGoal] = useState<FinancingGoal>("equity");
  const [stage, setStage] = useState<Stage>("researching");
  const [homeValue, setHomeValue] = useState(550_000);
  const [mortgageBalance, setMortgageBalance] = useState(250_000);
  const [otherLiens, setOtherLiens] = useState(0);
  const [cltv, setCltv] = useState(DEFAULT_CLTV);

  const { equity, capacity } = estimateEquity({ homeValue, mortgageBalance, otherLiens, cltv });

  const markTouched = useReportCalculatorOnce("equity_estimator", [
    homeValue,
    mortgageBalance,
    otherLiens,
    cltv,
  ]);
  const touch =
    <T,>(setter: (v: T) => void) =>
    (v: T) => {
      markTouched();
      setter(v);
    };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h2
          id="estimate-title"
          className="inline-block rounded-full border border-line bg-white px-3.5 py-1 text-[13px] font-semibold uppercase tracking-[0.1em] text-navy"
        >
          Build your estimate
        </h2>
        <p className="text-[26px] font-normal leading-[1.5] text-ink sm:text-[32px] xl:text-[34px]">
          I want to{" "}
          <InlineSelect
            label="Your goal"
            value={goal}
            options={goals}
            onChange={(v) => {
              setGoal(v);
              track("financing_goal_select", { goal: v, location: "sentence_builder" });
            }}
          />{" "}
          and I&apos;m currently{" "}
          <InlineSelect label="Where you are" value={stage} options={stages} onChange={setStage} />.
        </p>
        <p className="text-[18px] leading-relaxed text-body">
          No pushy sales calls or endless telemarketer lists. We provide honest wholesale numbers
          directly from {advisor.name}.
        </p>
      </div>

      <div className="grid items-stretch gap-5 lg:grid-cols-12 lg:gap-6">
        {/* Inputs */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          <fieldset className="grid gap-x-5 gap-y-3 rounded-card border border-line bg-white p-4 sm:grid-cols-2 sm:p-5">
            <legend className="sr-only">Your home and balances</legend>
            <CurrencyField
              label="Home Value"
              value={homeValue}
              onChange={touch(setHomeValue)}
              min={100_000}
              max={2_000_000}
              step={5_000}
            />
            <CurrencyField
              label="Mortgage Balance"
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

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link href={destinationFor(goal, stage)} className={buttonClass("primary", "shrink-0 self-start")}>
              See My Options
              <ArrowRight aria-hidden className="size-5" />
            </Link>
            <ul className="space-y-1 text-[16px] text-body">
              <li className="flex items-center gap-2">
                <ShieldCheck aria-hidden className="size-5 shrink-0 text-navy" />
                No SSN or hard credit pull required
              </li>
              <li className="flex items-center gap-2">
                <Lock aria-hidden className="size-5 shrink-0 text-navy" />
                Direct wholesale pricing comparison
              </li>
            </ul>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col rounded-[24px] border border-line bg-white p-4 sm:p-5 lg:col-span-5">
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-line pb-2">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-[14px] font-semibold text-white"
              >
                MF
              </span>
              <div>
                <span className="block text-[17px] font-medium leading-tight text-ink">{advisor.name}</span>
                <span className="text-[14px] font-medium text-navy">Active Broker · Online</span>
              </div>
            </div>
            <span className="shrink-0 text-[14px] text-body">Just now</span>
          </div>

          <div className="flex-1 space-y-3 rounded-card border border-line bg-panel p-4">
            <div aria-live="polite" aria-atomic="true">
              <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-body">
                Here&apos;s your estimate so far
              </p>
              <p className="text-[18px] font-medium text-ink">{metricTitle[goal]}</p>
              <p className="text-[34px] font-medium leading-tight tracking-tight text-ink">
                {formatUsd(capacity)}
              </p>
            </div>
            <dl className="space-y-1 rounded-[14px] border border-line bg-white px-4 py-3 text-[18px]">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-body">Total home equity:</dt>
                <dd className="whitespace-nowrap font-medium text-ink">{formatUsd(equity)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-body">Est. Monthly Savings:</dt>
                <dd className="whitespace-nowrap font-medium text-ink">{formatUsd(capacity * 0.0028)} / mo</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-body">Speed to Funding:</dt>
                <dd className="whitespace-nowrap font-medium text-navy">3 to 7 Days</dd>
              </div>
            </dl>
          </div>

          <p className="mt-3 text-[15px] leading-snug text-body">
            <strong className="font-semibold text-ink">
              Illustration only. Not an approval or rate quote.
            </strong>{" "}
            Based on {Math.round(cltv * 100)}% combined loan-to-value minus your balances.
          </p>
        </div>
      </div>
    </div>
  );
}

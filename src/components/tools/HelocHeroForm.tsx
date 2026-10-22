"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reassurance } from "@/components/ui/Claim";
import { buttonClass } from "@/components/ui/primitives";
import { track } from "@/lib/analytics";
import { helocUses } from "@/lib/content/heloc";
import { getStartedHref } from "@/lib/site";

export function HelocHeroForm() {
  const [use, setUse] = useState(helocUses[0].value);
  const goal = helocUses.find((u) => u.value === use)?.goal ?? "equity";

  return (
    <div data-primary-cta>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="heloc-goal" className="mb-1 block text-[17px] font-medium text-ink">
            I want to
          </label>
          <div className="relative">
            <select
              id="heloc-goal"
              value={use}
              onChange={(e) => setUse(e.target.value)}
              className="min-h-[52px] w-full cursor-pointer appearance-none rounded-full border border-field bg-panel pl-5 pr-12 text-[18px] font-medium text-ink"
            >
              {helocUses.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink"
            />
          </div>
        </div>
        <Link
          href={`${getStartedHref}?goal=${goal}`}
          onClick={() => track("financing_goal_select", { goal, location: "heloc_hero" })}
          className={buttonClass("primary", "shrink-0")}
        >
          Check my HELOC options
        </Link>
    </div>
    {/* Under the whole row, since the button sits beside the select. */}
    <Reassurance />
    </div>
  );
}

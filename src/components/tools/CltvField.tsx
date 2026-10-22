"use client";

import { useId } from "react";
import { DEFAULT_CLTV } from "@/lib/equity";

const options = [0.7, 0.75, 0.8, 0.85, 0.9];

/** Assumed combined loan-to-value picker shared by the equity estimators. */
export function CltvField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[17px] font-medium leading-7 text-ink">
        Assumed CLTV
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-describedby={`${id}-help`}
        className="mt-1 min-h-12 w-full rounded-[12px] border border-field bg-white px-4 text-[19px] text-ink"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {Math.round(o * 100)}%{o === DEFAULT_CLTV ? " (typical)" : ""}
          </option>
        ))}
      </select>
      <p id={`${id}-help`} className="pt-1 text-[15px] leading-snug text-body">
        Combined loan-to-value: the share of your home&apos;s value all loans may total.
      </p>
    </div>
  );
}

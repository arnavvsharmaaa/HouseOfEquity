"use client";

import { useEffect, useId, useState } from "react";
import { formatUsd, parseUsd } from "@/lib/equity";

/**
 * Dollar input with a paired slider. Typing is the precise path (and the accessible one);
 * the slider is a convenience. Both stay in sync.
 */
export function CurrencyField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  hint,
  slider = true,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  hint?: string;
  /** Show the paired range slider (default true). */
  slider?: boolean;
}) {
  const id = useId();
  const [text, setText] = useState(formatUsd(value));
  const [editing, setEditing] = useState(false);

  // Reflect slider changes in the text box unless the user is typing in it.
  useEffect(() => {
    if (!editing) setText(formatUsd(value));
  }, [value, editing]);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <label htmlFor={id} className="text-[17px] font-medium leading-7 text-ink">
          {label}
        </label>
        {hint && (
          <span id={`${id}-hint`} className="text-[15px] text-body">
            {hint}
          </span>
        )}
      </div>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-describedby={hint ? `${id}-hint` : undefined}
        value={text}
        onFocus={() => setEditing(true)}
        onChange={(e) => {
          setText(e.target.value);
          onChange(Math.min(parseUsd(e.target.value), max * 10));
        }}
        onBlur={() => {
          setEditing(false);
          setText(formatUsd(value));
        }}
        className="mt-1 min-h-12 w-full rounded-[12px] border border-field bg-white px-4 text-[19px] font-medium text-ink"
      />
      {slider && (
        <input
          type="range"
          aria-label={`${label} slider`}
          min={min}
          max={max}
          step={step}
          value={Math.min(Math.max(value, min), max)}
          aria-valuetext={formatUsd(value)}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { track, type Calculator } from "@/lib/analytics";

/**
 * Fires home_equity_calculator_complete once, after the visitor has changed an input and
 * paused for a moment. Call `markTouched()` from input handlers. No amounts are ever sent.
 */
export function useReportCalculatorOnce(
  calculator: Calculator,
  deps: readonly unknown[],
) {
  const touched = useRef(false);
  const reported = useRef(false);

  useEffect(() => {
    if (!touched.current || reported.current) return;
    const t = setTimeout(() => {
      reported.current = true;
      track("home_equity_calculator_complete", { calculator });
    }, 1500);
    return () => clearTimeout(t);
  }, deps);

  return function markTouched() {
    touched.current = true;
  };
}

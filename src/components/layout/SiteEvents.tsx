"use client";

import { useEffect } from "react";
import { track, type FinancingGoal } from "@/lib/analytics";
import { captureUtm } from "@/lib/utm";

// One delegated listener so server-rendered links stay server components:
// - every tel: link fires mortgage_phone_click (location from the nearest data-track-location)
// - links with data-goal="<goal>" fire financing_goal_select
// - links marked data-track="application_start" fire application_start
export function SiteEvents() {
  useEffect(() => {
    captureUtm(window.location.search);

    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link) return;
      const location =
        link.closest<HTMLElement>("[data-track-location]")?.dataset.trackLocation ?? "unknown";
      if (link.getAttribute("href")?.startsWith("tel:")) {
        track("mortgage_phone_click", { location });
      } else if (link.dataset.goal) {
        track("financing_goal_select", { goal: link.dataset.goal as FinancingGoal, location });
      } else if (link.dataset.track === "application_start") {
        track("application_start", { location });
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

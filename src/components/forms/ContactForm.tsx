"use client";

import { useSearchParams } from "next/navigation";
import { LeadForm } from "./LeadForm";
import type { FinancingGoal } from "@/lib/analytics";
import { goalValues } from "@/lib/lead-schema";

/**
 * /contact serves both "Contact" and "Get Started". Arriving with ?goal=… (from the sentence
 * builder or a CTA) preselects that goal and records the form as get_started. Only the goal
 * category is ever read from the URL.
 */
export function ContactForm() {
  const param = useSearchParams().get("goal");
  const goal = (goalValues as readonly string[]).includes(param ?? "") ? (param as FinancingGoal) : undefined;
  return <LeadForm formType={goal ? "get_started" : "contact"} defaultGoal={goal ?? "equity"} />;
}

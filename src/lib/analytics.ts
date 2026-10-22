// Minimal analytics event helper. No third-party script is loaded yet: events are pushed to
// window.dataLayer (ready for GTM/GA4 later) and logged in development.
//
// Privacy rule (brand guide, "Data principle"): never send financial inputs or personal data.
// The prop types below only allow coarse, non-identifying labels, so a dollar amount, name,
// phone or email cannot be passed by accident.

export type FinancingGoal = "equity" | "debt" | "renovation" | "buy" | "refinance" | "other";

export type Calculator = "equity_estimator" | "heloc_payment" | "loan_payment" | "purchase_payment";

type EventMap = {
  financing_goal_select: { goal: FinancingGoal; location: string };
  home_equity_calculator_complete: { calculator: Calculator };
  consultation_request_submit: { form: "contact" | "get_started" | "rate_match"; goal?: FinancingGoal };
  mortgage_phone_click: { location: string; method: "call" | "text" };
  application_start: { location: string };
};

export type AnalyticsEvent = keyof EventMap;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track<E extends AnalyticsEvent>(event: E, props: EventMap[E]): void {
  if (typeof window === "undefined") return;
  const payload = { event, page_path: window.location.pathname, ...props };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", payload);
  }
}

// Captures UTM parameters on landing so lead forms can attribute the inquiry.
// Stored in sessionStorage only; never echoed back into URLs or analytics.

const KEY = "hoe_utm";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export function captureUtm(search: string): void {
  const params = new URLSearchParams(search);
  const found: Utm = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) found[key] = value.slice(0, 200);
  }
  if (Object.keys(found).length === 0) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    // Storage blocked (private mode); attribution is best-effort.
  }
}

export function readUtm(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Utm;
  } catch {
    return {};
  }
}

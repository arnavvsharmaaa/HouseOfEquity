import type { NextConfig } from "next";

// Old mfardous.com routes → new houseofequity.co routes (301).
// /rate-match and /contact keep the same path on the new site, so they need no rule.
const legacyRedirects: Array<[string, string]> = [
  ["/digital-heloc", "/heloc"],
  ["/conventional-fha-va", "/programs"],
  ["/jumbo", "/programs"],
  ["/bank-statement", "/programs"],
  ["/dscr", "/programs"],
  ["/asset-based", "/programs"],
  ["/interest-only", "/programs"],
  ["/doctor-loan", "/programs"],
  ["/bridge", "/programs"],
  ["/purchase-programs", "/buy"],
  ["/testimonials", "/about"],
  ["/state-licensing", "/licensing"],
  ["/calculators", "/heloc"],
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

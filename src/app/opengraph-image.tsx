import { ImageResponse } from "next/og";
import { advisor, site, sponsor } from "@/lib/site";

// Default share image for every page (pages without their own opengraph-image inherit it).
export const alt = `${site.name}: Your Home. More Possibilities.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px 80px",
          color: "#1a1a1a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, fontWeight: 600 }}>{site.name}</div>
          <div style={{ fontSize: 20, color: "#1f2a44", letterSpacing: 3, marginTop: 8 }}>
            {site.descriptor.toUpperCase()}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: -2 }}>Your Home.</div>
          <div style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: -2, fontWeight: 600 }}>
            More Possibilities.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#4a4a4a",
            borderTop: "2px solid #e5e5e5",
            paddingTop: 28,
          }}
        >
          <span>
            {advisor.name} · NMLS #{advisor.nmls} · {sponsor.shortName} NMLS #{sponsor.nmls}
          </span>
          <span style={{ color: "#1a1a1a" }}>{site.phone.display}</span>
        </div>
      </div>
    ),
    size,
  );
}

import { Fragment } from "react";
import { ShieldCheck } from "lucide-react";
import { claims, parseClaims, type ClaimKey } from "@/lib/claims";
import { cx } from "./primitives";

/** A claim's value from the single source, e.g. <Claim id="lenders" /> → 170+. */
export function Claim({ id }: { id: ClaimKey }) {
  return <>{claims[id].value}</>;
}

/** Renders a content string, replacing {{key}} tokens with the claim's value. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {parseClaims(text).map((part, i) =>
        typeof part === "string" ? (
          <Fragment key={i}>{part}</Fragment>
        ) : (
          <Fragment key={i}>{claims[part.key].value}</Fragment>
        ),
      )}
    </>
  );
}

/** "Won't affect your credit score." under every primary call to action. */
export function Reassurance({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <p
      data-reassurance
      className={cx(
        "mt-2 flex items-center gap-1.5 text-[16px]",
        tone === "dark" ? "text-white/85" : "text-body",
        className,
      )}
    >
      <ShieldCheck aria-hidden className={cx("size-[18px] shrink-0", tone === "dark" ? "text-white" : "text-navy")} />
      <span>
        <Claim id="credit" />
      </span>
    </p>
  );
}

/** Wraps a primary button so the reassurance line always sits directly under it. */
export function PrimaryAction({
  children,
  tone,
  align = "start",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  align?: "start" | "center" | "stretch";
  className?: string;
}) {
  return (
    <div
      data-primary-cta
      className={cx(
        "flex flex-col",
        align === "center" ? "items-center" : align === "stretch" ? "items-stretch" : "items-stretch sm:items-start",
        className,
      )}
    >
      {children}
      <Reassurance tone={tone} className={align === "center" ? "justify-center" : undefined} />
    </div>
  );
}

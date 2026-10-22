import { Fragment } from "react";
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

/** Layout for a primary button: full width on phones, natural width from sm up. */
export function PrimaryAction({
  children,
  align = "start",
  className,
}: {
  children: React.ReactNode;
  align?: "start" | "center" | "stretch";
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex flex-col",
        align === "center" ? "items-center" : align === "stretch" ? "items-stretch" : "items-stretch sm:items-start",
        className,
      )}
    >
      {children}
    </div>
  );
}
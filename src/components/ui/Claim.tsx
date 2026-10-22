import { Fragment } from "react";
import { ShieldCheck } from "lucide-react";
import { claims, footnoteId, footnoteNumber, parseClaims, type ClaimKey } from "@/lib/claims";
import { cx } from "./primitives";

/** Superscript footnote marker linking to the numbered disclosure in the footer. */
export function Fn({ id, className }: { id: ClaimKey; className?: string }) {
  const n = footnoteNumber(id);
  return (
    <sup data-fn={id} className={cx("ml-0.5 text-[0.7em] font-medium leading-none", className)}>
      <a href={`#${footnoteId(id)}`} aria-label={`Disclosure ${n}`} className="underline underline-offset-2 hover:no-underline">
        {n}
      </a>
    </sup>
  );
}

/** A claim's value followed by its marker, e.g. <Claim id="lenders" /> → 170+¹. */
export function Claim({ id }: { id: ClaimKey }) {
  return (
    <>
      {claims[id].value}
      <Fn id={id} />
    </>
  );
}

/** Renders a content string, turning {{key}} tokens into value + marker. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {parseClaims(text).map((part, i) =>
        typeof part === "string" ? (
          <Fragment key={i}>{part}</Fragment>
        ) : (
          <Fragment key={i}>
            {part.showValue && claims[part.key].value}
            <Fn id={part.key} />
          </Fragment>
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

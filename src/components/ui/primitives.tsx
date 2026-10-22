import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ImageIcon, Phone, Star } from "lucide-react";
import { site } from "@/lib/site";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-site px-4 sm:px-6", className)}>{children}</div>;
}

const buttonBase =
  "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-7 text-[17px] font-medium transition-colors";

const buttonVariants = {
  primary: "bg-ink text-white hover:bg-ink-hover",
  secondary: "border border-ink bg-white text-ink hover:bg-panel",
} as const;

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: keyof typeof buttonVariants };

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={cx(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function buttonClass(variant: keyof typeof buttonVariants = "primary", className?: string) {
  return cx(buttonBase, buttonVariants[variant], className);
}

/** Click-to-call. Fires mortgage_phone_click via the delegated SiteEvents listener. */
export function PhoneButton({
  label = <span className="whitespace-nowrap">Call {site.phone.display}</span>,
  variant = "secondary",
  className,
}: {
  label?: ReactNode;
  variant?: keyof typeof buttonVariants;
  className?: string;
}) {
  return (
    <a href={site.phone.href} className={buttonClass(variant, cx("text-center", className))}>
      <Phone aria-hidden className={cx("size-5", variant === "secondary" && "text-navy")} />
      {label}
    </a>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("text-[14px] font-semibold uppercase tracking-[0.12em] text-navy", className)}>
      {children}
    </p>
  );
}

export function IconCircle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        "flex size-12 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-navy",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Stars({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cx("flex items-center gap-0.5 text-star", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="size-[18px] fill-current" strokeWidth={0} />
      ))}
    </span>
  );
}

/**
 * Stand-in for photography that has not been supplied yet. Clearly labeled so nobody
 * mistakes it for final art, and exposed to assistive tech with the intended alt text.
 */
export function ImagePlaceholder({
  alt,
  note,
  className,
}: {
  /** The alt text the real photo should carry. */
  alt: string;
  /** Short visible label, e.g. "Photo to be supplied". */
  note?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder: ${alt}`}
      className={cx(
        "flex flex-col items-center justify-center gap-2 border-2 border-dashed border-field bg-panel p-4 text-center text-body",
        className,
      )}
    >
      <ImageIcon aria-hidden className="size-8 text-muted" strokeWidth={1.5} />
      <span className="text-[15px] font-medium leading-snug">{note ?? "Photo placeholder"}</span>
      <span className="max-w-[28ch] text-[14px] leading-snug">{alt}</span>
    </div>
  );
}

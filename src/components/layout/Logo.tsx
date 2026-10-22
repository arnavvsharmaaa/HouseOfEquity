import Link from "next/link";
import { DoorOpen } from "lucide-react";
import { site } from "@/lib/site";
import { cx } from "@/components/ui/primitives";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={cx("flex min-h-11 shrink-0 items-center gap-3", className)}>
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-ink"
      >
        <DoorOpen className="size-[22px]" strokeWidth={1.75} />
      </span>
      <span className="flex flex-col">
        <span className="text-[20px] font-medium leading-tight tracking-tight text-ink">{site.name}</span>
        {!compact && (
          <span className="hidden whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.03em] text-navy lg:block">
            {site.descriptor}
          </span>
        )}
      </span>
    </Link>
  );
}

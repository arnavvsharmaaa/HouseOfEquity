import Link from "next/link";
import { Phone } from "lucide-react";
import { getStartedHref, site } from "@/lib/site";

/** Sticky bottom bar on small screens: always-available Call + Get Started. */
export function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
      data-track-location="mobile_bar"
    >
      <div className="grid grid-cols-2 gap-3">
        <a
          href={site.phone.href}
          className="flex min-h-[52px] flex-col items-center justify-center rounded-full border border-ink bg-white px-3 text-ink"
        >
          <span className="flex items-center gap-1.5 text-[17px] font-medium leading-tight">
            <Phone aria-hidden className="size-[18px] text-navy" />
            Call
          </span>
          <span className="text-[14px] leading-tight text-body">{site.phone.display}</span>
        </a>
        <Link
          href={getStartedHref}
          className="flex min-h-[52px] items-center justify-center rounded-full bg-ink px-3 text-[17px] font-medium text-white"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

import { Phone } from "lucide-react";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";
import { ButtonLink } from "@/components/ui/primitives";
import { getStartedHref, site } from "@/lib/site";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-line bg-white"
      data-track-location="header"
    >
      <div className="relative mx-auto flex h-20 max-w-site items-center justify-between gap-3 px-4 sm:px-6 xl:gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden xl:block">
          <NavLinks variant="desktop" />
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Phone is always reachable: the number shows here from sm up, and in the
              sticky bottom bar (MobileActionBar) below that. */}
          <a
            href={site.phone.href}
            className="flex min-h-12 min-w-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line px-2 text-[17px] font-medium text-ink hover:text-ink-hover sm:border-0"
          >
            <Phone aria-hidden className="size-5 text-navy" />
            <span className="sr-only sm:not-sr-only">
              <span className="sr-only">Call </span>
              {site.phone.display}
            </span>
          </a>
          <div className="hidden md:block">
            <ButtonLink href={getStartedHref} className="whitespace-nowrap">
              Get Started
            </ButtonLink>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

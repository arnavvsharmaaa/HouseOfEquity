"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { ButtonLink, PhoneButton } from "@/components/ui/primitives";
import { getStartedHref } from "@/lib/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close when the route changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    // Escape closes and puts focus back on the toggle, so keyboard users keep their place.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    // A tap or click anywhere outside the menu closes it.
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="xl:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex size-12 items-center justify-center rounded-full border border-line bg-white text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-panel motion-safe:active:scale-[0.96]"
      >
        {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      <nav
        id={panelId}
        aria-label="Main"
        hidden={!open}
        // Following a link to the page you're already on doesn't change the route, so close here too.
        onClick={(e) => (e.target as Element).closest("a") && setOpen(false)}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-line bg-white px-4 pb-6 pt-2 sm:px-6"
        data-track-location="mobile_menu"
      >
        <NavLinks variant="mobile" />
        <div className="mt-6 flex flex-col gap-3">
          <ButtonLink href={getStartedHref}>Get Started</ButtonLink>
          <PhoneButton />
        </div>
      </nav>
    </div>
  );
}

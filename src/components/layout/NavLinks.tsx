"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/site";
import { cx } from "@/components/ui/primitives";

export function NavLinks({ variant }: { variant: "desktop" | "mobile" }) {
  const pathname = usePathname();

  return (
    <ul className={variant === "desktop" ? "flex items-center gap-1" : "flex flex-col"}>
      {mainNav.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cx(
                "flex min-h-11 items-center rounded-full transition-colors",
                variant === "desktop"
                  ? "whitespace-nowrap px-2.5 text-[17px] hover:text-ink"
                  : "border-b border-line px-1 py-3 text-[20px]",
                active ? "font-medium text-ink" : "text-body",
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

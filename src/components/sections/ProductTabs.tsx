"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  CircleCheck,
  House,
  Medal,
  Network,
  Wallet,
} from "lucide-react";
import { Rich } from "@/components/ui/Claim";
import { IconCircle, cx } from "@/components/ui/primitives";
import type { ProductCard } from "@/lib/content/home";

const icons = {
  tree: Network,
  payments: Wallet,
  check: BadgeDollarSign,
  cottage: House,
  medal: Medal,
  briefcase: BriefcaseBusiness,
} as const;

function Card({ card }: { card: ProductCard }) {
  const Icon = icons[card.icon];
  return (
    <li className="flex flex-col justify-between rounded-card border border-line bg-white p-7 transition-colors hover:border-navy/40 sm:p-8">
      <div className="space-y-4">
        <IconCircle>
          <Icon className="size-6" strokeWidth={1.75} />
        </IconCircle>
        <h3 className="text-[22px] font-medium text-ink">{card.title}</h3>
        <p className="text-[18px] leading-relaxed text-body">
          <Rich text={card.body} />
        </p>
        {card.points && (
          <ul className="space-y-2 pt-2">
            {card.points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[17px] text-ink">
                <CircleCheck aria-hidden className="size-5 shrink-0 text-navy" />
                <span>
                  <Rich text={p} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-6 border-t border-line pt-4">
        <Link
          href={card.href}
          className="inline-flex min-h-11 items-center gap-1.5 text-[17px] font-medium text-navy hover:underline"
        >
          Learn more<span className="sr-only"> about {card.title}</span>
          <ArrowRight aria-hidden className="size-[18px]" />
        </Link>
      </div>
    </li>
  );
}

export function ProductTabs({
  tabs,
}: {
  tabs: ReadonlyArray<{ id: string; label: string; cards: ProductCard[] }>;
}) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div className="mb-12 flex justify-center">
        <div
          role="tablist"
          aria-label="Loan categories"
          className="inline-flex flex-wrap justify-center gap-1 rounded-[28px] border border-line bg-panel p-1"
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={active === i}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={cx(
                "min-h-12 rounded-full px-6 text-[17px] font-medium transition-[background-color,color,transform] duration-150 ease-out motion-safe:active:scale-[0.98]",
                active === i ? "bg-ink text-white" : "text-body hover:text-ink",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={active !== i}
        >
          <ul className="grid gap-6 lg:grid-cols-3">
            {tab.cards.map((card) => (
              <Card key={card.title} card={card} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

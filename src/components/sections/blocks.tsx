// Page-level building blocks shared by the homepage, /heloc and the inner pages.
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, CalendarDays, Check, CircleCheck, FileUp, Quote, ShieldCheck, type LucideIcon } from "lucide-react";
import { SectionHeading, StepCards } from "./shared";
import {
  ButtonLink,
  Container,
  Eyebrow,
  IconCircle,
  ImagePlaceholder,
  PhoneButton,
  cx,
} from "@/components/ui/primitives";
import { howItWorks, rateMatchSteps } from "@/lib/content/home";
import { advisor, licensedStates, sponsor } from "@/lib/site";

/** Inner-page hero: badge, one H1, intro, check points, two actions, labeled photo slot. */
export function PageHero({
  badge,
  title,
  intro,
  points,
  primary,
  secondary,
  image,
  aside,
}: {
  badge: string;
  title: ReactNode;
  intro: ReactNode;
  points?: string[];
  primary?: { label: string; href: string };
  secondary?: ReactNode;
  image?: { alt: string; note: string };
  /** Replaces the image column (e.g. a form or a fact card). */
  aside?: ReactNode;
}) {
  const hasSide = Boolean(image || aside);
  return (
    <section className="pb-16 pt-6 lg:pb-24 lg:pt-10" data-track-location="page_hero">
      <Container>
        <div className={cx("grid items-center gap-12", hasSide && "lg:grid-cols-12 lg:gap-10")}>
          <div className={cx("space-y-6", hasSide && "lg:col-span-7")}>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-navy">
              <BadgeCheck aria-hidden className="size-[18px]" />
              <span className="text-[13px] font-semibold uppercase tracking-[0.1em]">{badge}</span>
            </p>
            <h1 className="max-w-3xl text-[40px] font-medium leading-[1.1] tracking-tight text-ink sm:text-[52px] lg:text-[56px]">
              {title}
            </h1>
            <div className="max-w-2xl text-[20px] leading-[32px] text-body">{intro}</div>
            {points && (
              <ul className="grid max-w-2xl gap-3 sm:grid-cols-2">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[18px] text-body">
                    <span aria-hidden className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-line text-ink">
                      <Check className="size-4" strokeWidth={2.5} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            )}
            {(primary || secondary) && (
              <div className="flex flex-col items-stretch gap-4 pt-2 sm:flex-row sm:items-center">
                {primary && <ButtonLink href={primary.href}>{primary.label}</ButtonLink>}
                {secondary}
              </div>
            )}
          </div>
          {aside && <div className="lg:col-span-5">{aside}</div>}
          {image && !aside && (
            <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
              <div className="rounded-panel border border-line bg-panel p-3">
                <ImagePlaceholder alt={image.alt} note={image.note} className="aspect-[4/3] w-full rounded-tile bg-white" />
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

/** Two-column explainer: heading + paragraphs on one side, a check list or panel on the other. */
export function Explainer({
  id,
  eyebrow,
  title,
  children,
  points,
  aside,
  tone = "panel",
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  points?: Array<{ title: string; body: string }>;
  aside?: ReactNode;
  tone?: "panel" | "white";
}) {
  return (
    <section
      aria-labelledby={id}
      className={cx("py-16 lg:py-24", tone === "panel" && "border-y border-line bg-panel")}
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-5 lg:col-span-6">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id={id} className="text-[32px] leading-tight tracking-tight text-ink sm:text-[40px]">
              {title}
            </h2>
            <div className="space-y-4 text-[19px] leading-[30px] text-body">{children}</div>
          </div>
          <div className="lg:col-span-6">
            {aside}
            {points && (
              <ul className={cx("space-y-4 rounded-card border border-line p-6 sm:p-8", tone === "panel" ? "bg-white" : "bg-panel")}>
                {points.map((p) => (
                  <li key={p.title} className="flex items-start gap-3.5">
                    <span aria-hidden className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                      <Check className="size-4" strokeWidth={2.5} />
                    </span>
                    <span>
                      <span className="block text-[19px] font-medium text-ink">{p.title}</span>
                      <span className="text-[18px] leading-relaxed text-body">{p.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export type OptionCard = { title: string; body: string; points?: string[]; href?: string; linkLabel?: string; icon?: LucideIcon; id?: string };

/** Grid of plain option cards; three columns only from 1024px. */
export function OptionCards({ cards, columns = 3 }: { cards: OptionCard[]; columns?: 2 | 3 }) {
  return (
    <ul className={cx("grid gap-6", columns === 3 ? "lg:grid-cols-3" : "md:grid-cols-2")}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <li key={card.title} id={card.id} className="flex scroll-mt-28 flex-col justify-between rounded-card border border-line bg-white p-7 sm:p-8">
            <div className="space-y-4">
              {Icon && (
                <IconCircle>
                  <Icon className="size-6" strokeWidth={1.75} />
                </IconCircle>
              )}
              <h3 className="text-[22px] font-medium text-ink">{card.title}</h3>
              <p className="text-[18px] leading-relaxed text-body">{card.body}</p>
              {card.points && (
                <ul className="space-y-2 pt-1">
                  {card.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[17px] text-ink">
                      <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-navy" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {card.href && (
              <div className="mt-6 border-t border-line pt-4">
                <Link href={card.href} className="inline-flex min-h-11 items-center gap-1.5 text-[17px] font-medium text-navy hover:underline">
                  {card.linkLabel ?? "Learn more"}
                  <span className="sr-only"> about {card.title}</span>
                  <ArrowRight aria-hidden className="size-[18px]" />
                </Link>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Feature comparison: a real table from 1024px, stacked cards below (no sideways scroll). */
export function CompareTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: Array<{ feature: string; values: string[] }>;
}) {
  const [first, ...rest] = columns;
  return (
    <>
      <div className="hidden overflow-hidden rounded-card border border-line bg-white lg:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="w-1/4 p-5 text-[17px] font-medium text-ink lg:p-6">
                Feature
              </th>
              <th scope="col" className="w-1/3 bg-ink p-5 text-[20px] font-semibold text-white lg:p-6">
                {first}
              </th>
              {rest.map((c) => (
                <th key={c} scope="col" className="p-5 text-[17px] font-medium text-ink lg:p-6">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.feature}>
                <th scope="row" className="p-5 text-[17px] font-medium text-ink lg:p-6">
                  {row.feature}
                </th>
                {row.values.map((v, i) => (
                  <td key={i} className={cx("p-5 text-[17px] lg:p-6", i === 0 ? "bg-panel font-semibold text-ink" : "text-body")}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-4 lg:hidden">
        {rows.map((row) => (
          <li key={row.feature} className="rounded-card border border-line bg-white p-5">
            <h3 className="text-[19px] font-medium text-ink">{row.feature}</h3>
            <dl className="mt-3 space-y-2 text-[17px]">
              {row.values.map((v, i) => (
                <div key={i} className={cx("rounded-[12px] px-3 py-2", i === 0 && "bg-ink text-white")}>
                  <dt className={cx("text-[14px] font-semibold uppercase tracking-[0.06em]", i === 0 ? "text-white/80" : "text-navy")}>
                    {columns[i]}
                  </dt>
                  <dd className={i === 0 ? "font-semibold" : "text-body"}>{v}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Plain risk statement required wherever a loan is secured by the home. */
export function RiskNote({ title = "A note on borrowing responsibly", children }: { title?: string; children: ReactNode }) {
  return (
    <section aria-labelledby="risk-title" className="pb-16 lg:pb-24">
      <Container>
        <div className="flex flex-col gap-5 rounded-panel border border-line bg-panel p-6 sm:flex-row sm:p-10">
          <IconCircle className="bg-white text-ink">
            <ShieldCheck className="size-6" strokeWidth={1.75} />
          </IconCircle>
          <div className="space-y-2">
            <h2 id="risk-title" className="text-[24px] font-medium text-ink">
              {title}
            </h2>
            <div className="max-w-3xl space-y-3 text-[19px] leading-[30px] text-body">{children}</div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export type RelatedLink = { href: string; title: string; body: string };

export function RelatedLinks({ title = "Compare other options", links }: { title?: string; links: RelatedLink[] }) {
  return (
    <section aria-labelledby="related-title" className="py-16 lg:py-20">
      <Container>
        <h2 id="related-title" className="mb-6 text-[28px] tracking-tight text-ink sm:text-[32px]">
          {title}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group flex h-full flex-col justify-between gap-3 rounded-card border border-line bg-white p-5 transition-[background-color,border-color,transform] duration-150 ease-out hover:border-navy/40 hover:bg-surface-hover motion-safe:active:scale-[0.99]"
              >
                <span>
                  <span className="block text-[19px] font-medium text-ink">{l.title}</span>
                  <span className="text-[17px] text-body">{l.body}</span>
                </span>
                <ArrowRight aria-hidden className="size-5 text-navy transition-transform duration-150 ease-out motion-safe:group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** "Already have an offer? Send it to us." (homepage design). */
export function RateMatchSection({ withButton = true }: { withButton?: boolean }) {
  return (
    <section aria-labelledby="rate-match-title" className="border-y border-line bg-panel py-16 lg:py-24">
      <Container>
        <div className="rounded-panel border border-line bg-white p-6 sm:p-12 lg:p-16">
          <SectionHeading
            id="rate-match-title"
            eyebrow="Wholesale Transparency"
            title="Already have an offer? Send it to us."
            intro="We'll beat it or tell you honestly that it's a good deal. Zero sales pressure, just a transparent second opinion from a licensed broker."
            className="mb-12 max-w-3xl"
          />
          <div className={cx(withButton && "mb-12")}>
            <StepCards steps={rateMatchSteps} />
          </div>
          {withButton && (
            <div className="text-center">
              <ButtonLink href="/rate-match">
                <FileUp aria-hidden className="size-5" />
                Submit My Offer for Review
              </ButtonLink>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

/** "Big-lender options. Personal guidance." (homepage design). */
export function AdvisorSection() {
  return (
    <section id="advisor" aria-labelledby="advisor-title" className="py-16 lg:py-24" data-track-location="advisor">
      <Container>
        <div className="grid items-center gap-10 rounded-panel border border-line bg-panel p-6 sm:p-12 lg:grid-cols-12 lg:gap-14 lg:p-16">
          <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="space-y-4 rounded-card border border-line bg-white p-6">
              <div className="relative overflow-hidden rounded-[16px]">
                <ImagePlaceholder
                  alt={`Professional portrait of mortgage advisor ${advisor.name}`}
                  note="Real portrait to be supplied (no AI images)"
                  className="aspect-[4/5] w-full rounded-[16px]"
                />
                <p className="absolute bottom-3 left-3 rounded-full bg-ink px-3 py-1 text-[14px] font-medium text-white">
                  NMLS #{advisor.nmls}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[22px] font-medium text-ink">{advisor.name}</p>
                <p className="text-[17px] text-body">{advisor.title}</p>
                <p className="text-[16px] font-medium text-navy">
                  Sponsored by {sponsor.shortName} (NMLS #{sponsor.nmls})
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <Eyebrow>Personal Accountability</Eyebrow>
            <h2 id="advisor-title" className="text-[32px] leading-tight tracking-tight text-ink sm:text-[40px]">
              Big-lender options. <br />
              <span className="font-medium">Personal guidance.</span>
            </h2>
            <p className="text-[19px] leading-[30px] text-body">
              {advisor.name} is an independent mortgage broker licensed to originate residential
              mortgage loans and home equity products in {licensedStates.length} states. As a former
              Director of Finance at one of the nation&apos;s largest mortgage lenders, Mohamad now
              works directly for homeowners—shopping wholesale rates across 170+ lenders to find you
              the best loan.
            </p>
            <figure className="space-y-2 rounded-tile border border-l-4 border-line border-l-ink bg-white p-6">
              <Quote aria-hidden className="size-7 text-navy" />
              <blockquote className="text-[19px] italic leading-relaxed text-ink">
                &ldquo;If another lender has the best deal for your situation, I will tell you. If I
                can beat it, I will.&rdquo;
              </blockquote>
              <figcaption className="text-[16px] font-semibold text-navy">— {advisor.name}</figcaption>
            </figure>
            <div className="flex flex-col items-stretch gap-4 pt-2 sm:flex-row sm:items-center">
              <ButtonLink href="/contact?goal=equity">
                <CalendarDays aria-hidden className="size-5" />
                Schedule a Call
              </ButtonLink>
              <PhoneButton />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** "How it works" three steps (homepage design). */
export function HowItWorksSection() {
  return (
    <section aria-labelledby="how-title" className="py-16 lg:py-24">
      <Container>
        <SectionHeading
          id="how-title"
          eyebrow="Simple, Dignified Process"
          title="How it works"
          intro="No endless paperwork, no retail delays. Three calm, straightforward steps."
          className="mb-14"
        />
        <StepCards steps={howItWorks} />
      </Container>
    </section>
  );
}

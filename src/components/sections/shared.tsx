import { BadgeCheck, Building2, Check, IdCard, Map as MapIcon, Plus, Quote } from "lucide-react";
import type { ReactNode } from "react";
import { EqualHousingIcon } from "@/components/layout/EqualHousingIcon";
import {
  ButtonLink,
  Container,
  Eyebrow,
  PhoneButton,
  Stars,
  cx,
} from "@/components/ui/primitives";
import { advisor, getStartedHref, licensedStates, sponsor } from "@/lib/site";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cx("mx-auto max-w-2xl space-y-3 text-center", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="text-[32px] leading-tight tracking-tight text-ink sm:text-[40px]">
        {title}
      </h2>
      {intro && <p className="text-[19px] leading-[30px] text-body">{intro}</p>}
    </div>
  );
}

/** Row of checkmark bullets used in teasers and cards. */
export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cx("space-y-2", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[17px] text-ink">
          <Check aria-hidden className="mt-1 size-5 shrink-0 text-navy" strokeWidth={2.25} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function TrustStrip() {
  const items = [
    {
      icon: <IdCard className="size-5" />,
      content: (
        <>
          <span className="font-medium text-ink">{advisor.name}</span> NMLS #{advisor.nmls}
        </>
      ),
    },
    {
      icon: <Building2 className="size-5" />,
      content: (
        <>
          {sponsor.shortName} <strong className="font-medium text-ink">NMLS #{sponsor.nmls}</strong>
        </>
      ),
    },
    {
      icon: <MapIcon className="size-5" />,
      content: (
        <>
          Licensed in <strong className="font-medium text-ink">{licensedStates.length} States</strong>
        </>
      ),
    },
    {
      icon: <EqualHousingIcon className="size-5" />,
      content: <>Equal Housing Opportunity</>,
    },
  ];

  return (
    <section aria-label="Licensing and credentials" className="border-y border-line bg-panel py-5">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[16px] text-body">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span aria-hidden className="text-navy">
                {item.icon}
              </span>
              <span>{item.content}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function NumberBadge({ n, tone = "ink" }: { n: number; tone?: "ink" | "navy" }) {
  return (
    <span
      aria-hidden
      className={cx(
        "flex size-10 shrink-0 items-center justify-center rounded-full text-[17px] font-medium text-white",
        tone === "navy" ? "bg-navy" : "bg-ink",
      )}
    >
      {n}
    </span>
  );
}

export function StepCards({
  steps,
  surface = "panel",
}: {
  steps: ReadonlyArray<{ title: string; body: string }>;
  surface?: "panel" | "white";
}) {
  return (
    <ol className="grid gap-6 lg:grid-cols-3">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={cx(
            "rounded-card border border-line p-7 sm:p-8",
            surface === "panel" ? "bg-panel" : "bg-white",
          )}
        >
          <NumberBadge n={i + 1} tone={i === 1 ? "navy" : "ink"} />
          <h3 className="mb-2 mt-6 text-[22px] font-medium text-ink">
            <span className="sr-only">Step {i + 1}: </span>
            {step.title}
          </h3>
          <p className="text-[18px] leading-relaxed text-body">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function Testimonials({
  items,
}: {
  items: ReadonlyArray<{ quote: string; name: string; loan: string }>;
}) {
  return (
    <section aria-labelledby="reviews-title" className="border-y border-line bg-panel py-16 lg:py-24">
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <Stars />
              <span className="text-[17px] font-medium text-ink">5.0 Star Average</span>
            </p>
            <h2 id="reviews-title" className="text-[32px] tracking-tight text-ink sm:text-[40px]">
              Real people. Real experiences.
            </h2>
          </div>
          <p className="text-[17px] text-body">Client stories from {licensedStates.length} states</p>
        </div>
        <ul className="grid gap-6 lg:grid-cols-3">
          {items.map((t) => (
            <li key={t.name} className="flex flex-col justify-between rounded-card border border-line bg-white p-7 sm:p-8">
              <figure className="flex h-full flex-col justify-between">
                <blockquote className="space-y-4">
                  <Quote aria-hidden className="size-7 text-navy" />
                  <p className="text-[18px] leading-relaxed text-body">&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-6">
                  <span className="block text-[17px] font-medium text-ink">{t.name}</span>
                  <span className="text-[16px] text-body">{t.loan}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** FAQ accordion built on native <details>: keyboard and screen-reader friendly, no JS. */
export function FaqList({
  faqs,
  title = "Frequently asked questions",
  eyebrow = "Clear Answers",
  intro = "Plain language explanations for everyday homeowners.",
}: {
  faqs: ReadonlyArray<{ q: string; a: string }>;
  title?: string;
  eyebrow?: string;
  intro?: string;
}) {
  return (
    <section aria-labelledby="faq-title" className="border-y border-line bg-panel py-16 lg:py-24">
      <div className="mx-auto max-w-[880px] px-4 sm:px-6">
        <SectionHeading id="faq-title" eyebrow={eyebrow} title={title} intro={intro} className="mb-12" />
        <div className="space-y-3.5">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-tile border border-line bg-white">
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-tile p-5 text-left text-[19px] font-medium text-ink transition-colors hover:bg-surface-hover sm:p-6">
                {f.q}
                <Plus
                  aria-hidden
                  className="size-6 shrink-0 text-navy transition-transform duration-200 ease-out group-open:rotate-45 motion-reduce:transition-none"
                />
              </summary>
              <p className="border-t border-line/60 px-5 pb-6 pt-4 text-[18px] leading-relaxed text-body sm:px-6">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({
  eyebrow = "Good Things Start at Home",
  title = "Let's find the right option for you.",
  body = "No sales pressure. Just honest guidance, personal attention, and wholesale lender rates.",
  ctaLabel = "Get Started",
  ctaHref = getStartedHref,
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section aria-labelledby="final-cta-title" className="py-16 lg:py-24" data-track-location="final_cta">
      <Container>
        <div className="space-y-5 rounded-panel border border-line bg-white px-6 py-12 text-center sm:px-12 sm:py-16">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2
            id="final-cta-title"
            className="mx-auto max-w-2xl text-[32px] leading-tight tracking-tight text-ink sm:text-[40px]"
          >
            {title}
          </h2>
          <p className="mx-auto max-w-xl text-[19px] leading-[30px] text-body">{body}</p>
          <div className="flex flex-col items-stretch justify-center gap-4 pt-4 sm:flex-row sm:items-center">
            <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink>
            <PhoneButton />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function VerifiedBadge({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-navy">
      <BadgeCheck aria-hidden className="size-[18px]" />
      <span className="text-[13px] font-semibold uppercase tracking-[0.1em]">{children}</span>
    </p>
  );
}

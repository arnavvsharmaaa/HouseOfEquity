import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChartPie,
  Check,
  CookingPot,
  CreditCard,
  FileCheck,
  GraduationCap,
  HeartPulse,
  Landmark,
  PartyPopper,
  PenLine,
  Shield,
  ShieldCheck,
  Timer,
  Wallet,
  Wrench,
} from "lucide-react";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { FaqList, FinalCta, NumberBadge, SectionHeading } from "@/components/sections/shared";
import { HelocCapacityEstimator } from "@/components/tools/HelocCapacityEstimator";
import { HelocHeroForm } from "@/components/tools/HelocHeroForm";
import { HelocPaymentEstimator } from "@/components/tools/HelocPaymentEstimator";
import { Container, Eyebrow, IconCircle, ImagePlaceholder, Stars, cx } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  comparison,
  helocFaqs,
  helocSteps,
  heroPoints,
  qualifyCards,
  relatedLinks,
  useCases,
} from "@/lib/content/heloc";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { advisor, getStartedHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "HELOC: Home Equity Line of Credit",
  description:
    "How a HELOC works, what you need to qualify, and what you could borrow. Estimate your line and monthly payment, then talk with independent mortgage broker Mohamad Fardous.",
  path: "/heloc",
});

const qualifyIcons = { pie: ChartPie, payments: Wallet, verified: BadgeCheck } as const;
const stepIcons = [Timer, FileCheck, PenLine];
const useIcons = {
  repair: Wrench,
  card: CreditCard,
  school: GraduationCap,
  celebration: PartyPopper,
  health: HeartPulse,
} as const;

function Hero() {
  return (
    <section className="pb-16 pt-6 lg:pb-24 lg:pt-10" data-track-location="heloc_hero">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-7 lg:col-span-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-ink">
              <Landmark aria-hidden className="size-[18px]" />
              <span className="text-[13px] font-semibold uppercase tracking-[0.1em]">
                Home Equity Line of Credit
              </span>
            </p>
            <h1 className="text-[40px] font-medium leading-[1.1] tracking-tight text-ink sm:text-[52px] lg:text-[56px]">
              Get the cash you need without leaving home.
            </h1>
            <ul className="grid gap-3 sm:grid-cols-2">
              {heroPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[18px] text-body">
                  <span aria-hidden className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-line text-ink">
                    <Check className="size-4" strokeWidth={2.5} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="space-y-3 pt-1">
              <HelocHeroForm />
              <p className="flex items-center gap-2 text-[16px] text-body">
                <ShieldCheck aria-hidden className="size-5 shrink-0 text-navy" />
                Talking with us won&apos;t affect your credit.
              </p>
            </div>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
              <li className="flex items-center gap-3">
                <IconCircle className="size-10">
                  <Shield className="size-5" />
                </IconCircle>
                <span>
                  <span className="block text-[17px] font-semibold text-ink">$30B+ in Equity</span>
                  <span className="text-[15px] text-body">Evaluated via lending network</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Stars />
                <span className="text-[17px] font-medium text-ink">Top Rated Mortgage Broker</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-panel border border-line bg-panel p-3">
              <div className="relative overflow-hidden rounded-tile">
                <ImagePlaceholder
                  alt="Warm natural sunlight in a modern residential kitchen renovation"
                  note="Kitchen photo to be supplied"
                  className="aspect-[4/3] w-full rounded-tile bg-white pb-24"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-[14px] border border-line bg-white/95 p-4">
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-navy">
                      Kitchen Remodel Value
                    </p>
                    <p className="text-[22px] font-medium text-ink">$85,000 Equity Tapped</p>
                  </div>
                  <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                    <CookingPot className="size-5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function WhatIsHeloc() {
  return (
    <section aria-labelledby="what-title" className="border-y border-line bg-panel py-16 lg:py-24">
      <Container>
        <div className="mb-12 max-w-3xl">
          <Eyebrow>Clear Foundations</Eyebrow>
          <h2 id="what-title" className="mb-5 mt-2 text-[32px] tracking-tight text-ink sm:text-[40px]">
            What is a HELOC?
          </h2>
          <p className="text-[20px] leading-[32px] text-body">
            A Home Equity Line of Credit (HELOC) is a revolving line of credit secured by your home.
            Think of it like a credit card with a much lower interest rate: draw what you need,
            repay on your schedule, and draw again. You only pay interest on what you actually
            borrow.
          </p>
        </div>
        <h3 className="text-[24px] font-medium text-ink">What you need to qualify</h3>
        <ul className="mt-5 grid gap-6 lg:grid-cols-3">
          {qualifyCards.map((card) => {
            const Icon = qualifyIcons[card.icon];
            return (
              <li key={card.title} className="flex flex-col justify-between rounded-card border border-line bg-white p-7 sm:p-8">
                <div className="space-y-4">
                  <IconCircle className="text-ink">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </IconCircle>
                  <h4 className="text-[22px] font-medium text-ink">{card.title}</h4>
                  <p className="text-[18px] leading-relaxed text-body">{card.body}</p>
                </div>
                <p className="mt-6 border-t border-line pt-5 text-[14px] font-semibold uppercase tracking-[0.06em] text-ink">
                  {card.footer}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="border-y border-line bg-panel py-16 lg:py-24">
      <Container>
        <SectionHeading
          id="how-title"
          eyebrow="Effortless Digital Flow"
          title="How it works"
          intro="Three quiet, transparent milestones between you and your line of credit."
          className="mb-12"
        />
        <ol className="grid gap-6 lg:grid-cols-3">
          {helocSteps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <li key={step.title} className="flex flex-col justify-between gap-6 rounded-card border border-line bg-white p-7 sm:p-8">
                <div className="space-y-4">
                  <NumberBadge n={i + 1} />
                  <h3 className="text-[22px] font-medium text-ink">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="text-[18px] leading-relaxed text-body">{step.body}</p>
                </div>
                <p className="flex items-center gap-2 text-[16px] font-medium text-ink">
                  <Icon aria-hidden className="size-5 text-navy" />
                  {step.tag}
                </p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

function Comparison() {
  const [ours, ...others] = comparison.columns;
  return (
    <section aria-labelledby="compare-title" className="border-y border-line bg-panel py-16 lg:py-24">
      <Container>
        <SectionHeading
          id="compare-title"
          eyebrow="Side by Side"
          title="How a HELOC compares"
          intro="See how our independent broker line of credit stacks up against conventional alternatives."
          className="mb-12"
        />

        {/* Table from lg up */}
        <div className="hidden overflow-hidden rounded-card border border-line bg-white lg:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">HELOC compared with a bank HELOC and a personal loan</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-1/4 p-5 text-[17px] font-medium text-ink lg:p-6">
                  Feature
                </th>
                <th scope="col" className="w-1/3 bg-ink p-5 text-[20px] font-semibold text-white lg:p-6">
                  {ours}
                </th>
                {others.map((c) => (
                  <th key={c} scope="col" className="p-5 text-[17px] font-medium text-ink lg:p-6">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {comparison.rows.map((row) => (
                <tr key={row.feature}>
                  <th scope="row" className="p-5 text-[17px] font-medium text-ink lg:p-6">
                    {row.feature}
                  </th>
                  {row.values.map((v, i) => (
                    <td
                      key={i}
                      className={cx(
                        "p-5 text-[17px] lg:p-6",
                        i === 0 ? "bg-panel font-semibold text-ink" : "text-body",
                      )}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stacked cards on small screens: no sideways scrolling */}
        <ul className="space-y-4 lg:hidden">
          {comparison.rows.map((row) => (
            <li key={row.feature} className="rounded-card border border-line bg-white p-5">
              <h3 className="text-[19px] font-medium text-ink">{row.feature}</h3>
              <dl className="mt-3 space-y-2 text-[17px]">
                {row.values.map((v, i) => (
                  <div key={i} className={cx("rounded-[12px] px-3 py-2", i === 0 && "bg-ink text-white")}>
                    <dt className={cx("text-[14px] font-semibold uppercase tracking-[0.06em]", i === 0 ? "text-white/80" : "text-navy")}>
                      {comparison.columns[i]}
                    </dt>
                    <dd className={i === 0 ? "font-semibold" : "text-body"}>{v}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function UseCases() {
  return (
    <section aria-labelledby="uses-title" className="py-16 lg:py-24">
      <Container>
        <div className="mb-12 max-w-2xl space-y-3">
          <Eyebrow>Flexibility</Eyebrow>
          <h2 id="uses-title" className="text-[32px] tracking-tight text-ink sm:text-[40px]">
            What you can use it for
          </h2>
          <p className="text-[19px] leading-[30px] text-body">
            A versatile line of credit designed to support your family&apos;s key financial goals.
          </p>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u) => {
            const Icon = useIcons[u.icon];
            return (
              <li key={u.title} className="space-y-4 rounded-card border border-line bg-panel p-7 sm:p-8">
                <IconCircle className="bg-white">
                  <Icon className="size-6" strokeWidth={1.75} />
                </IconCircle>
                <h3 className="text-[22px] font-medium text-ink">{u.title}</h3>
                <p className="text-[18px] leading-relaxed text-body">{u.body}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

function BorrowResponsibly() {
  return (
    <section aria-labelledby="responsible-title" className="pb-16 lg:pb-24">
      <Container>
        <div className="flex flex-col gap-5 rounded-panel border border-line bg-panel p-6 sm:flex-row sm:p-10">
          <IconCircle className="bg-white text-ink">
            <ShieldCheck className="size-6" strokeWidth={1.75} />
          </IconCircle>
          <div className="space-y-2">
            <h2 id="responsible-title" className="text-[24px] font-medium text-ink">
              A note on borrowing responsibly
            </h2>
            <p className="max-w-3xl text-[19px] leading-[30px] text-body">
              Your home secures a HELOC. Not making payments could put your home at risk. Because we
              are independent licensed advisors and not an automated call center, {advisor.name} will
              walk you through your total borrowing costs, draw periods, and repayment options
              before you decide anything.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Related() {
  return (
    <section aria-labelledby="related-title" className="py-16 lg:py-20">
      <Container>
        <h2 id="related-title" className="mb-6 text-[28px] tracking-tight text-ink sm:text-[32px]">
          Compare other ways to use your equity
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedLinks.map((l) => (
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

export default function HelocPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "HELOC", path: "/heloc" }]} />
      <Hero />
      <WhatIsHeloc />
      <section id="capacity" aria-labelledby="capacity-title" className="py-16 lg:py-24">
        <Container>
          <HelocCapacityEstimator />
        </Container>
      </section>
      <HowItWorks />
      <section id="payment" aria-labelledby="payment-title" className="py-16 lg:py-24">
        <Container>
          <div data-fit>
            <SectionHeading
              id="payment-title"
              eyebrow="Budget Planning"
              title="Estimate your monthly payment"
              intro="Based on loan amount, repayment term, and interest rate."
              className="mb-8"
            />
            <HelocPaymentEstimator />
          </div>
        </Container>
      </section>
      <Comparison />
      <UseCases />
      <BorrowResponsibly />
      <FaqList faqs={helocFaqs} eyebrow="Answers" title="Frequently Asked Questions" intro="" />
      <Related />
      <FinalCta
        eyebrow="Ready to Begin"
        title="Let's see what your home can do for you."
        body="Connect with an independent advisor and explore rates from 170+ wholesale lenders today."
        ctaLabel="Check my HELOC options"
        ctaHref={`${getStartedHref}?goal=equity`}
      />
      <JsonLd data={faqJsonLd(helocFaqs)} />
    </>
  );
}

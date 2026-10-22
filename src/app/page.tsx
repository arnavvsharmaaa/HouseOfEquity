import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CreditCard,
  FileUp,
  KeyRound,
  Quote,
  Star,
  Wallet,
  Wrench,
} from "lucide-react";
import { ProductTabs } from "@/components/sections/ProductTabs";
import {
  CheckList,
  FaqList,
  FinalCta,
  SectionHeading,
  StepCards,
  Testimonials,
  TrustStrip,
  VerifiedBadge,
} from "@/components/sections/shared";
import { EstimateBuilder } from "@/components/tools/EstimateBuilder";
import {
  ButtonLink,
  Container,
  Eyebrow,
  IconCircle,
  ImagePlaceholder,
  PhoneButton,
  Stars,
} from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  equityBenefits,
  equityProducts,
  heroPaths,
  homeFaqs,
  howItWorks,
  purchaseProducts,
  rateMatchSteps,
  testimonials,
} from "@/lib/content/home";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { advisor, licensedStates, site, sponsor } from "@/lib/site";

export const metadata = {
  ...pageMetadata({
    title: "Home Equity, HELOC & Mortgage Guidance",
    description:
      "Your Home. More Possibilities. Personal guidance on HELOCs, home equity loans, refinancing and buying from independent mortgage broker Mohamad Fardous, who shops 170+ wholesale lenders.",
    path: "/",
  }),
  // The homepage uses the site-level title rather than the "%s | House of Equity" template.
  title: { absolute: `${site.name} | Home Equity, HELOC & Mortgage Guidance` },
};

const pathIcons = { wallet: Wallet, card: CreditCard, repair: Wrench, key: KeyRound } as const;

function Hero() {
  return (
    <section className="pb-16 pt-10 lg:pb-24 lg:pt-16" data-track-location="hero">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-7 lg:col-span-7">
            <VerifiedBadge>Independent Wholesale Mortgage Broker</VerifiedBadge>
            <h1 className="text-[42px] font-normal leading-[1.08] tracking-tight text-ink sm:text-[56px] lg:text-[62px]">
              Your Home.
              <br />
              <span className="font-medium">More Possibilities.</span>
            </h1>
            <p className="max-w-xl text-[20px] leading-[32px] text-body">
              Personal guidance on home equity, refinancing, and buying from a real, accessible
              mortgage advisor who shops 170+ wholesale lenders for you.
            </p>

            <div className="pt-2">
              <h2 className="mb-3 text-[17px] font-medium text-ink">
                Choose a path to get tailored numbers:
              </h2>
              <ul className="grid max-w-xl gap-3.5 sm:grid-cols-2">
                {heroPaths.map((p) => {
                  const Icon = pathIcons[p.icon];
                  return (
                    <li key={p.title}>
                      <Link
                        href={p.href}
                        data-goal={p.goal}
                        className="group flex min-h-[76px] items-center justify-between gap-3 rounded-tile border border-line bg-white p-4 transition-colors hover:border-navy/40 hover:bg-neutral-50"
                      >
                        <span className="flex items-center gap-3.5">
                          <IconCircle className="size-11 transition-colors group-hover:bg-ink group-hover:text-white">
                            <Icon className="size-5" strokeWidth={1.75} />
                          </IconCircle>
                          <span>
                            <span className="block text-[18px] font-medium leading-tight text-ink">
                              {p.title}
                            </span>
                            <span className="text-[15px] text-body">{p.hint}</span>
                          </span>
                        </span>
                        <ArrowRight
                          aria-hidden
                          className="size-5 shrink-0 text-body transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col items-stretch gap-4 pt-2 sm:flex-row sm:items-center">
              <ButtonLink href="#estimate">Explore My Options</ButtonLink>
              <PhoneButton
                label={
                  <span>
                    Speak with {advisor.shortName}{" "}
                    <span className="whitespace-nowrap">({site.phone.display})</span>
                  </span>
                }
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-panel border border-line bg-white p-3">
              <ImagePlaceholder
                alt="Joyful couple holding new home keys"
                note="Lifestyle photo to be supplied"
                className="aspect-square w-full rounded-tile"
              />
              <div className="mt-3 flex flex-wrap sm:absolute sm:inset-x-6 sm:bottom-6 sm:mt-0 items-center justify-between gap-3 rounded-tile border border-line bg-white/95 p-4">
                <div className="flex items-center gap-3">
                  <IconCircle className="size-10">
                    <Star className="size-5" strokeWidth={1.75} />
                  </IconCircle>
                  <div>
                    <p className="flex items-center gap-1.5">
                      <Stars />
                      <span className="text-[16px] font-semibold text-ink">5.0</span>
                    </p>
                    <p className="text-[15px] text-body">Verified Client Rating on Zillow</p>
                  </div>
                </div>
                <span className="rounded-full border border-line bg-panel px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-navy">
                  Top Broker
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HelocTeaser() {
  return (
    <section aria-labelledby="heloc-teaser-title" className="pb-10">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 rounded-[16px] border border-line bg-panel p-5 md:flex-row md:items-center md:p-6">
          <div className="space-y-1">
            <h2 id="heloc-teaser-title" className="text-[21px] font-medium text-ink">
              Need cash? Try a HELOC.
            </h2>
            <p className="text-[18px] text-body">
              Borrow against your home&apos;s equity, apply 100% online, and close in as few as 3 days*.
            </p>
            <CheckList
              items={["Apply online", "No in-person appraisal when eligible", "Personal guidance"]}
              className="flex flex-wrap gap-x-6 gap-y-1 space-y-0 pt-2 [&_li]:text-[16px] [&_li]:font-medium"
            />
          </div>
          <ButtonLink href="/heloc" className="w-full shrink-0 md:w-auto">
            Learn about HELOCs
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

function KeepYourRate() {
  return (
    <section aria-labelledby="keep-rate-title" className="py-16 lg:py-24">
      <Container>
        <div className="grid items-center gap-8 rounded-panel border border-line bg-panel p-6 sm:p-12 lg:grid-cols-2 lg:gap-14 lg:p-16">
          <div className="relative overflow-hidden rounded-card border border-line bg-white">
            <ImagePlaceholder
              alt="Sunlit newly renovated residential kitchen"
              note="Kitchen photo to be supplied"
              className="aspect-[4/3] w-full border-0"
            />
            <p className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-line bg-white/95 px-3.5 py-1.5">
              <span aria-hidden className="size-2 rounded-full bg-navy" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-navy">
                Preserve Your 1st Rate
              </span>
            </p>
          </div>
          <div className="space-y-6">
            <Eyebrow>Smart Financing</Eyebrow>
            <h2 id="keep-rate-title" className="text-[34px] leading-tight tracking-tight text-ink sm:text-[42px]">
              Use your equity, <br />
              <span className="font-medium">keep your rate</span>
            </h2>
            <p className="text-[19px] leading-[30px] text-body">
              If you secured a low 3% or 4% mortgage in past years, don&apos;t refinance the entire
              loan. A Home Equity Loan or HELOC lets you take out cash for renovations, debt
              consolidation, or emergency savings without changing your existing low-rate first
              mortgage.
            </p>
            <ul className="space-y-4 pt-2">
              {equityBenefits.map((b) => (
                <li key={b.title} className="flex items-start gap-3.5">
                  <span aria-hidden className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                    <Check className="size-4" strokeWidth={2.5} />
                  </span>
                  <span>
                    <span className="block text-[18px] font-medium text-ink">{b.title}</span>
                    <span className="text-[17px] text-body">{b.body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <ButtonLink href="#estimate">Explore My Equity</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Estimate() {
  return (
    <section id="estimate" aria-labelledby="estimate-title" className="pb-16 lg:pb-24">
      <Container>
        <div className="rounded-panel border border-line bg-panel p-4 sm:p-8 lg:px-10 lg:py-7">
          <EstimateBuilder />
        </div>
      </Container>
    </section>
  );
}

function Products() {
  return (
    <section aria-labelledby="products-title" className="py-16 lg:py-24">
      <Container>
        <SectionHeading
          id="products-title"
          eyebrow="Wholesale Mortgage Portfolio"
          title="Home loans for every goal-getter"
          intro="Simple, plain-language options with zero retail lender markups."
          className="mb-8"
        />
        <ProductTabs
          tabs={[
            { id: "equity", label: "Home Equity Solutions", cards: equityProducts },
            { id: "purchase", label: "Buying & Refinancing", cards: purchaseProducts },
          ]}
        />
      </Container>
    </section>
  );
}

function RateMatch() {
  return (
    <section aria-labelledby="rate-match-title" className="border-y border-line bg-panel py-16">
      <Container>
        <div className="rounded-panel border border-line bg-white p-6 sm:p-12 lg:p-16">
          <SectionHeading
            id="rate-match-title"
            eyebrow="Wholesale Transparency"
            title="Already have an offer? Send it to us."
            intro="We'll beat it or tell you honestly that it's a good deal. Zero sales pressure, just a transparent second opinion from a licensed broker."
            className="mb-12 max-w-3xl"
          />
          <div className="mb-12">
            <StepCards steps={rateMatchSteps} />
          </div>
          <div className="text-center">
            <ButtonLink href="/rate-match">
              <FileUp aria-hidden className="size-5" />
              Submit My Offer for Review
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

function MeetMohamad() {
  return (
    <section id="advisor" aria-labelledby="advisor-title" className="py-16 lg:py-24" data-track-location="advisor">
      <Container>
        <div className="grid items-center gap-10 rounded-panel border border-line bg-panel p-6 sm:p-12 lg:grid-cols-12 lg:gap-14 lg:p-16">
          <div className="lg:col-span-5">
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
                <p className="text-[21px] font-medium text-ink">{advisor.name}</p>
                <p className="text-[17px] text-body">{advisor.title}</p>
                <p className="text-[16px] font-medium text-navy">
                  Sponsored by {sponsor.shortName} (NMLS #{sponsor.nmls})
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <Eyebrow>Personal Accountability</Eyebrow>
            <h2 id="advisor-title" className="text-[34px] leading-tight tracking-tight text-ink sm:text-[42px]">
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

function HowItWorks() {
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

export default function HomePage() {
  return (
    <>
      <Hero />
      <HelocTeaser />
      <TrustStrip />
      <KeepYourRate />
      <Estimate />
      <Products />
      <RateMatch />
      <MeetMohamad />
      <Testimonials items={testimonials} />
      <HowItWorks />
      <FaqList faqs={homeFaqs} />
      <FinalCta />
      <JsonLd data={faqJsonLd(homeFaqs)} />
    </>
  );
}

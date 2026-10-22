import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { AdvisorSection, HowItWorksSection, PageHero } from "@/components/sections/blocks";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { FinalCta, SectionHeading, Testimonials } from "@/components/sections/shared";
import { Container, PhoneButton } from "@/components/ui/primitives";
import { testimonials } from "@/lib/content/home";
import { pageMetadata } from "@/lib/seo";
import { advisor, getStartedHref, licensedStates, offices, site, sponsor } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Mohamad Fardous & House of Equity",
  description:
    "House of Equity is the consumer brand of independent mortgage broker Mohamad Fardous (NMLS #1448893), sponsored by West Capital Lending. Big-lender options, personal guidance.",
  path: "/about",
});

const stats = [
  { value: "170+", label: "wholesale lenders shopped" },
  { value: `${licensedStates.length}`, label: "states licensed" },
  { value: "10+", label: "years in mortgage finance" },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
      <PageHero
        badge="About House of Equity"
        title="Home Financing, Made Human."
        intro={
          <>
            <p>
              House of Equity is the consumer brand of {advisor.name}, an independent mortgage broker
              who pairs big-lender options with the personal guidance of a real advisor.
            </p>
            <p className="mt-4 text-[18px]">
              House of Equity is not a lender. Loans are originated by {advisor.name} (NMLS #{advisor.nmls}),
              sponsored by {sponsor.name} (NMLS #{sponsor.nmls}).
            </p>
          </>
        }
        primary={{ label: "Talk to an Advisor", href: getStartedHref }}
        secondary={<PhoneButton />}
        aside={
          <dl className="grid gap-4 rounded-panel border border-line bg-panel p-6 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col rounded-card border border-line bg-white p-5">
                <dt className="text-[17px] text-body">{s.label}</dt>
                <dd className="order-first text-[40px] font-medium leading-tight tracking-tight text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <AdvisorSection />
      <Testimonials items={testimonials} />
      <HowItWorksSection />

      <section aria-labelledby="offices-title" className="border-y border-line bg-panel py-16 lg:py-24" data-track-location="about_offices">
        <Container>
          <SectionHeading
            id="offices-title"
            eyebrow="Where We Are"
            title="Offices"
            intro={`Licensed in ${licensedStates.length} states, with offices in Michigan and California.`}
            className="mb-12"
          />
          <ul className="grid gap-6 md:grid-cols-2">
            {offices.map((o) => (
              <li key={o.id} className="rounded-card border border-line bg-white p-7 sm:p-8">
                <h3 className="flex items-center gap-2 text-[22px] font-medium text-ink">
                  <MapPin aria-hidden className="size-6 text-navy" />
                  {o.label}
                </h3>
                <address className="mt-3 text-[18px] not-italic leading-relaxed text-body">
                  {o.streetAddress}
                  <br />
                  {o.city}, {o.region} {o.postalCode}
                  <br />
                  <a href={site.phone.href} className="font-medium text-ink hover:underline">
                    {site.phone.display}
                  </a>
                </address>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center">
            <Link href="/licensing" className="inline-flex min-h-11 items-center gap-1.5 text-[18px] font-medium text-navy hover:underline">
              See state licensing and disclosures
              <ArrowRight aria-hidden className="size-5" />
            </Link>
          </p>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}

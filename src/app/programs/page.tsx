import { PageHero, OptionCards, RelatedLinks } from "@/components/sections/blocks";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { FaqList, FinalCta, SectionHeading } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container, PhoneButton } from "@/components/ui/primitives";
import { equityProducts, purchaseProducts } from "@/lib/content/home";
import { loanLinks, programsFaqs } from "@/lib/content/pages";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { getStartedHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Loan Programs: Conventional, FHA, VA, Jumbo, DSCR & More",
  description:
    "Every loan program in one place: home equity, conventional, FHA, VA, jumbo, bank statement, DSCR, asset-based, interest-only, physician and bridge loans, explained in plain English.",
  path: "/programs",
});

// Anchors match the old mfardous.com routes that redirect here.
const specialty = [
  {
    id: "conventional-fha-va",
    title: "Conventional, FHA & VA",
    body: "Conventional loans follow standard guidelines and aren't government-backed. FHA loans are government-insured with flexible credit guidelines. VA loans are for eligible veterans and service members.",
  },
  { id: "jumbo", title: "Jumbo Loans", body: "For loan amounts above the conforming loan limit in your county." },
  {
    id: "bank-statement",
    title: "Bank Statement Loans",
    body: "For self-employed borrowers who qualify using business or personal bank statements instead of tax returns.",
  },
  {
    id: "dscr",
    title: "DSCR Investor Loans",
    body: "For rental properties. Qualifying is based mainly on the property's rental income compared with its payment (the debt service coverage ratio).",
  },
  { id: "asset-based", title: "Asset-Based Loans", body: "Qualify using your savings and investments rather than employment income." },
  {
    id: "interest-only",
    title: "Interest-Only Loans",
    body: "Pay only interest for an initial period, then principal and interest. Payments rise when the interest-only period ends.",
  },
  { id: "doctor-loan", title: "Physician Loans", body: "Programs designed for doctors and other medical professionals." },
  { id: "bridge", title: "Bridge Loans", body: "Short-term financing to buy your next home before your current one sells." },
];

export default function ProgramsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Loan Programs", path: "/programs" }]} />
      <PageHero
        badge="Loan Programs"
        title="Home loans for every goal-getter"
        intro={<p>Simple, plain-language options with zero retail lender markups.</p>}
        primary={{ label: "Find my program", href: getStartedHref }}
        secondary={<PhoneButton />}
      />

      <section aria-labelledby="equity-title" className="border-y border-line bg-panel py-16 lg:py-24">
        <Container>
          <SectionHeading id="equity-title" eyebrow="Home Equity Solutions" title="Use the equity you've built" className="mb-12" />
          <OptionCards cards={equityProducts.map((p) => ({ title: p.title, body: p.body, points: p.points, href: p.href }))} />
        </Container>
      </section>

      <section aria-labelledby="purchase-title" className="py-16 lg:py-24">
        <Container>
          <SectionHeading id="purchase-title" eyebrow="Buying & Refinancing" title="Buy or refinance a home" className="mb-12" />
          <OptionCards cards={purchaseProducts.map((p) => ({ title: p.title, body: p.body, href: p.href }))} />
        </Container>
      </section>

      <section aria-labelledby="specialty-title" className="border-y border-line bg-panel py-16 lg:py-24">
        <Container>
          <SectionHeading
            id="specialty-title"
            eyebrow="Program Guide"
            title="Programs for every situation"
            intro="Availability varies by lender, state and borrower. Ask Mohamad which programs fit your situation."
            className="mb-12"
          />
          <OptionCards
            columns={2}
            cards={specialty.map((s) => ({ ...s, href: `${getStartedHref}?goal=other`, linkLabel: "Ask about this program" }))}
          />
        </Container>
      </section>

      <FaqList faqs={programsFaqs} />
      <RelatedLinks links={[loanLinks.buy, loanLinks.refinance, loanLinks.homeEquityLoan, loanLinks.rateMatch]} />
      <FinalCta />
      <JsonLd data={faqJsonLd(programsFaqs)} />
    </>
  );
}

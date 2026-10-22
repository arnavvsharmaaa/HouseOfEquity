import { Claim } from "@/components/ui/Claim";
import { claims } from "@/lib/claims";
import { BriefcaseBusiness, House, Medal } from "lucide-react";
import { HowItWorksSection, OptionCards, PageHero, RelatedLinks } from "@/components/sections/blocks";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { FaqList, FinalCta, SectionHeading } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { PaymentEstimator } from "@/components/tools/PaymentEstimator";
import { Container, PhoneButton } from "@/components/ui/primitives";
import { purchaseProducts } from "@/lib/content/home";
import { buyFaqs, loanLinks } from "@/lib/content/pages";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { getStartedHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Buy a Home: Purchase Loans & Pre-Approval",
  description:
    `Conventional, FHA, VA, jumbo and self-employed purchase loans with wholesale pricing from ${claims.lenders.value} lenders. Estimate your monthly payment and start a pre-approval with Mohamad Fardous.`,
  path: "/buy",
});

const programIcons = [House, Medal, BriefcaseBusiness];

export default function BuyPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Buy a Home", path: "/buy" }]} />
      <PageHero
        badge="Buy a Home"
        title="Financing That Feels Like Home."
        intro={
          <p>
            Wholesale pricing with options starting at just <Claim id="downPayment" /> down. Fast pre-approvals that make your
            offers stand out in competitive markets.
          </p>
        }
        points={["Options starting at {{downPayment}} down", "0% down options for military veterans", "Fast pre-approvals", "We shop {{lenders}} wholesale lenders"]}
        primary={{ label: "Start my pre-approval", href: `${getStartedHref}?goal=buy` }}
        secondary={<PhoneButton />}
        image={{ alt: "Family standing at the front door of their new home", note: "Lifestyle photo to be supplied" }}
      />

      <section aria-labelledby="programs-title" className="border-y border-line bg-panel py-16 lg:py-24">
        <Container>
          <SectionHeading
            id="programs-title"
            eyebrow="Purchase Programs"
            title="Home loans for every goal-getter"
            intro="Simple, plain-language options with zero retail lender markups."
            className="mb-12"
          />
          <OptionCards
            cards={purchaseProducts.map((p, i) => ({
              title: p.title,
              body: p.body,
              icon: programIcons[i],
              href: i === 2 ? "/programs#bank-statement" : "/programs#conventional-fha-va",
              linkLabel: "See program details",
            }))}
          />
        </Container>
      </section>

      <section id="payment" aria-labelledby="payment-title" className="py-16 lg:py-24">
        <Container>
          <div data-fit>
            <SectionHeading
              id="payment-title"
              eyebrow="Budget Planning"
              title="Estimate your monthly payment"
              intro="Based on home price, down payment, term, and interest rate."
              className="mb-8"
            />
            <PaymentEstimator
              config={{
                calculator: "purchase_payment",
                mode: "purchase",
                amountLabel: "Loan Amount",
                defaultAmount: 405_000,
                defaultPrice: 450_000,
                defaultDown: 45_000,
                terms: [15, 30],
                defaultTerm: 30,
                defaultRate: "",
                rateHint: "Enter a rate to estimate",
                amountSummaryLabel: "Loan Amount:",
                ctaLabel: "Start my pre-approval",
                ctaHref: `${getStartedHref}?goal=buy`,
                footnote: "Principal and interest only. Property taxes, homeowners insurance, mortgage insurance and HOA dues are not included.",
              }}
            />
          </div>
        </Container>
      </section>

      <HowItWorksSection />
      <FaqList faqs={buyFaqs} />
      <RelatedLinks links={[loanLinks.programs, loanLinks.refinance, loanLinks.rateMatch, loanLinks.homeEquityLoan]} />
      <FinalCta />
      <JsonLd data={faqJsonLd(buyFaqs)} />
    </>
  );
}

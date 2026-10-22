import { Claim } from "@/components/ui/Claim";
import { Quote } from "lucide-react";
import { Explainer, OptionCards, PageHero, RelatedLinks, RiskNote } from "@/components/sections/blocks";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { FaqList, FinalCta, SectionHeading } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { CapacityEstimator } from "@/components/tools/CapacityEstimator";
import { Container, PhoneButton } from "@/components/ui/primitives";
import { testimonials } from "@/lib/content/home";
import { debtFaqs, debtTradeoffs, loanLinks } from "@/lib/content/pages";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { advisor, getStartedHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Debt Consolidation with Home Equity",
  description:
    "Combine high-interest credit cards and personal loans into one payment using a home equity loan, HELOC or cash-out refinance. Understand the trade-offs and the risk before you decide.",
  path: "/debt-consolidation",
});

const review = testimonials.find((t) => t.loan === "Debt Consolidation")!;

export default function DebtConsolidationPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Debt Consolidation", path: "/debt-consolidation" }]} />
      <PageHero
        badge="Debt Consolidation"
        title="Multiple payments? Explore a simpler approach."
        intro={
          <p>
            Roll multiple high-interest cards (<Claim id="cardRates" />) and personal loans into a single
            lower interest payment, freeing up hundreds every single month.
          </p>
        }
        points={["Average monthly savings of {{savings}}", "Simplify finances into one bill", "Guidance from a licensed advisor"]}
        primary={{ label: "Talk through my debts", href: `${getStartedHref}?goal=debt` }}
        secondary={<PhoneButton />}
        image={{ alt: "Couple sorting household bills at their dining table", note: "Lifestyle photo to be supplied" }}
      />

      <Explainer
        id="how-title"
        eyebrow="How It Works"
        title="Consolidating with your home equity"
        points={[
          { title: "List what you owe", body: "Credit cards, personal loans and other balances, with their rates and payments." },
          { title: "Compare your options", body: "Mohamad compares a home equity loan, a HELOC and a cash-out refinance side by side." },
          { title: "Pay balances off at closing", body: "The new loan pays off the old balances, leaving one payment instead of several." },
        ]}
      >
        <p>
          You use a home equity loan, a HELOC or a cash-out refinance to pay off higher-interest
          balances such as credit cards and personal loans. Instead of several due dates and rates,
          you have one.
        </p>
        <p>This is not debt settlement: every balance is paid in full.</p>
      </Explainer>

      <section aria-labelledby="tradeoffs-title" className="py-16 lg:py-24">
        <Container>
          <SectionHeading
            id="tradeoffs-title"
            eyebrow="Before You Decide"
            title="Things to weigh first"
            intro="Consolidation can simplify your finances, but it isn't free of trade-offs."
            className="mb-12"
          />
          <OptionCards columns={2} cards={debtTradeoffs} />
        </Container>
      </section>

      <section id="capacity" aria-labelledby="capacity-title" className="border-y border-line bg-panel py-16 lg:py-24">
        <Container>
          <CapacityEstimator
            copy={{
              title: "Do I have enough equity to consolidate?",
              intro: "Enter your home's value and what you owe on it. This shows an illustrative amount you might borrow, not an approval.",
              resultLead: "You might be able to borrow up to:",
              ctaLabel: "Talk through my debts",
              ctaHref: `${getStartedHref}?goal=debt`,
            }}
          />
        </Container>
      </section>

      <section aria-labelledby="story-title" className="py-16 lg:py-24">
        <Container>
          <h2 id="story-title" className="sr-only">
            A client story
          </h2>
          <figure className="mx-auto max-w-3xl space-y-4 rounded-card border border-line bg-white p-7 sm:p-10">
            <Quote aria-hidden className="size-8 text-navy" />
            <blockquote className="text-[22px] leading-relaxed text-ink">&ldquo;{review.quote}&rdquo;</blockquote>
            <figcaption className="border-t border-line pt-4">
              <span className="block text-[18px] font-medium text-ink">{review.name}</span>
              <span className="text-[16px] text-body">
                {review.loan}
              </span>
            </figcaption>
          </figure>
        </Container>
      </section>

      <RiskNote>
        <p>
          Consolidating turns unsecured debt into debt secured by your home. Not making payments
          could put your home at risk. {advisor.name} will walk you through the total cost, including
          how a longer term affects the interest you pay, before you decide anything.
        </p>
      </RiskNote>

      <FaqList faqs={debtFaqs} />
      <RelatedLinks title="Ways to consolidate" links={[loanLinks.homeEquityLoan, loanLinks.heloc, loanLinks.cashOut, loanLinks.rateMatch]} />
      <FinalCta />
      <JsonLd data={faqJsonLd(debtFaqs)} />
    </>
  );
}

import { CompareTable, Explainer, PageHero, RelatedLinks, RiskNote } from "@/components/sections/blocks";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { FaqList, FinalCta, SectionHeading } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { CapacityEstimator } from "@/components/tools/CapacityEstimator";
import { Container, PhoneButton } from "@/components/ui/primitives";
import { cashOutFaqs, equityCompare, loanLinks } from "@/lib/content/pages";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { advisor, getStartedHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Cash-Out Refinance: Turn Equity into Cash",
  description:
    "Replace your current mortgage with a new, larger one and take the difference in cash. See how a cash-out refinance compares with a HELOC or home equity loan, and estimate what you could take out.",
  path: "/cash-out-refinance",
});

export default function CashOutRefinancePage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Cash-Out Refinance", path: "/cash-out-refinance" }]} />
      <PageHero
        badge="Cash-Out Refinance"
        title="Replace your mortgage and take cash out."
        intro={
          <p>
            A cash-out refinance pays off your current first mortgage with a new, larger one. You
            receive the difference in cash at closing, and you&apos;re left with one loan and one
            monthly payment.
          </p>
        }
        points={["One loan, one monthly payment", "Fixed or adjustable rates", "We shop {{lenders}} wholesale lenders", "Guidance from a licensed advisor"]}
        primary={{ label: "Check my options", href: `${getStartedHref}?goal=refinance` }}
        secondary={<PhoneButton />}
        image={{ alt: "Homeowner signing refinance documents at home", note: "Lifestyle photo to be supplied" }}
      />

      <Explainer
        id="fit-title"
        eyebrow="Weigh the Trade-offs"
        title="Is a cash-out refinance right for you?"
        points={[
          { title: "Your whole mortgage gets a new rate", body: "The new rate applies to your entire balance, not just the cash you take out." },
          { title: "There are closing costs", body: "It's a new first mortgage, so expect closing costs. We show the total cost up front." },
          { title: "A new term starts", body: "Restarting a 30-year term can lower the payment but add years of interest." },
        ]}
      >
        <p>
          A cash-out refinance can make sense when today&apos;s rates are close to, or better than,
          your current rate, or when you&apos;d like a single loan instead of two.
        </p>
        <p>
          If you secured a low 3% or 4% mortgage in past years, don&apos;t refinance the entire loan.
          A Home Equity Loan or HELOC lets you take out cash for renovations, debt consolidation, or
          emergency savings without changing your existing low-rate first mortgage.
        </p>
      </Explainer>

      <section id="capacity" aria-labelledby="capacity-title" className="py-16 lg:py-24">
        <Container>
          <CapacityEstimator
            copy={{
              title: "How much cash could I take out?",
              intro: "Cash-out refinances are limited to a share of your home's value. Adjust the numbers to see an illustrative amount.",
              resultLead: "In this scenario, you could take out up to:",
              ctaLabel: "Check my options",
              ctaHref: `${getStartedHref}?goal=refinance`,
            }}
          />
        </Container>
      </section>

      <section aria-labelledby="compare-title" className="border-y border-line bg-panel py-16 lg:py-24">
        <Container>
          <SectionHeading
            id="compare-title"
            eyebrow="Side by Side"
            title="Cash-out refinance, HELOC or home equity loan?"
            intro="Three ways to use your equity, and how they differ."
            className="mb-12"
          />
          <CompareTable caption="Cash-out refinance compared with a HELOC and a home equity loan" {...equityCompare(["cashOut", "heloc", "homeEquityLoan"])} />
        </Container>
      </section>

      <div className="pt-16 lg:pt-24">
        <RiskNote>
          <p>
            A cash-out refinance is secured by your home. Not making payments could put your home at
            risk. {advisor.name} will compare your total costs, including closing costs and the new
            term, before you decide anything.
          </p>
        </RiskNote>
      </div>

      <FaqList faqs={cashOutFaqs} />
      <RelatedLinks links={[loanLinks.heloc, loanLinks.homeEquityLoan, loanLinks.refinance, loanLinks.rateMatch]} />
      <FinalCta />
      <JsonLd data={faqJsonLd(cashOutFaqs)} />
    </>
  );
}

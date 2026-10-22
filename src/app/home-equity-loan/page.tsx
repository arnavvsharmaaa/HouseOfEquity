import { CompareTable, Explainer, PageHero, RelatedLinks, RiskNote } from "@/components/sections/blocks";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { FaqList, FinalCta, SectionHeading } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { CapacityEstimator } from "@/components/tools/CapacityEstimator";
import { PaymentEstimator } from "@/components/tools/PaymentEstimator";
import { Container, PhoneButton } from "@/components/ui/primitives";
import { equityBenefits } from "@/lib/content/home";
import { equityCompare, homeEquityLoanFaqs, loanLinks } from "@/lib/content/pages";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { advisor, getStartedHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Home Equity Loan: Fixed Rate, One Lump Sum",
  description:
    "Borrow a lump sum against your home with a fixed rate and a predictable payment, and keep your existing first mortgage. Estimate what you could borrow and your monthly payment.",
  path: "/home-equity-loan",
});

export default function HomeEquityLoanPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Home Equity Loan", path: "/home-equity-loan" }]} />
      <PageHero
        badge="Fixed Home Equity Loan"
        title="Make More of What You Own."
        intro={
          <p>
            One lump sum with a fixed, predictable monthly payment that never changes. Perfect for
            major one-time investments or large expenses.
          </p>
        }
        points={["Fixed rates from 10 to 30 years", "Zero prepayment penalties", "Keep your existing first mortgage", "Guidance from a licensed advisor"]}
        primary={{ label: "Check my options", href: `${getStartedHref}?goal=equity` }}
        secondary={<PhoneButton />}
        image={{ alt: "Homeowners reviewing renovation plans at their kitchen table", note: "Lifestyle photo to be supplied" }}
      />

      <Explainer id="keep-rate-title" eyebrow="Smart Financing" title="Use your equity, keep your rate" points={equityBenefits}>
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
              title: "How much could I borrow?",
              intro: "Enter your home's value and what you owe. You'll see an illustrative amount, and nothing here affects your credit.",
              resultLead: "In this scenario, you could borrow up to:",
              ctaLabel: "Check my options",
              ctaHref: `${getStartedHref}?goal=equity`,
            }}
          />
        </Container>
      </section>

      <section id="payment" aria-labelledby="payment-title" className="border-y border-line bg-panel py-16 lg:py-24">
        <Container>
          <div data-fit>
            <SectionHeading
              id="payment-title"
              eyebrow="Budget Planning"
              title="Estimate your monthly payment"
              intro="Based on loan amount, repayment term, and interest rate."
              className="mb-8"
            />
            <PaymentEstimator
              config={{
                calculator: "loan_payment",
                mode: "loan",
                amountLabel: "Loan Amount",
                defaultAmount: 75_000,
                terms: [10, 15, 20, 30],
                defaultTerm: 15,
                defaultRate: "",
                rateHint: "Enter the rate you were quoted",
                amountSummaryLabel: "Loan Amount:",
                ctaLabel: "Talk through my numbers",
                ctaHref: `${getStartedHref}?goal=equity`,
                footnote: "Your actual rate depends on your credit profile, property evaluation, and lender program.",
              }}
            />
          </div>
        </Container>
      </section>

      <section aria-labelledby="compare-title" className="py-16 lg:py-24">
        <Container>
          <SectionHeading
            id="compare-title"
            eyebrow="Side by Side"
            title="Home equity loan, HELOC or cash-out refinance?"
            intro="Three ways to use your equity, and how they differ."
            className="mb-12"
          />
          <CompareTable caption="Home equity loan compared with a HELOC and a cash-out refinance" {...equityCompare(["homeEquityLoan", "heloc", "cashOut"])} />
        </Container>
      </section>

      <RiskNote>
        <p>
          A home equity loan is secured by your home. Not making payments could put your home at
          risk. {advisor.name} will walk you through your total borrowing costs and repayment
          options before you decide anything.
        </p>
      </RiskNote>

      <FaqList faqs={homeEquityLoanFaqs} />
      <RelatedLinks title="Compare other ways to use your equity" links={[loanLinks.heloc, loanLinks.cashOut, loanLinks.debt, loanLinks.rateMatch]} />
      <FinalCta />
      <JsonLd data={faqJsonLd(homeEquityLoanFaqs)} />
    </>
  );
}

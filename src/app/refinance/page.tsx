import { HandCoins, Percent, ShieldCheck } from "lucide-react";
import { OptionCards, PageHero, RateMatchSection, RelatedLinks } from "@/components/sections/blocks";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { FaqList, FinalCta, SectionHeading } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { PaymentEstimator } from "@/components/tools/PaymentEstimator";
import { Container, PhoneButton } from "@/components/ui/primitives";
import { loanLinks, refinanceFaqs } from "@/lib/content/pages";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { getStartedHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Refinance Your Mortgage: Rate, Term or Cash-Out",
  description:
    "Compare rate-and-term and cash-out refinancing across 170+ wholesale lenders, or keep your low rate with a HELOC. Estimate a new payment and get a second opinion on any offer.",
  path: "/refinance",
});

export default function RefinancePage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Refinance", path: "/refinance" }]} />
      <PageHero
        badge="Refinance"
        title="Lower your rate, change your term, or take cash out."
        intro={
          <p>
            Refinancing replaces your current mortgage with a new one. Mohamad shops 170+ wholesale
            lenders to find terms that fit what you want to change, and tells you honestly when
            keeping your current loan is the better choice.
          </p>
        }
        points={["Rate-and-term refinance", "Cash-out refinance", "We shop 170+ wholesale lenders", "Guidance from a licensed advisor"]}
        primary={{ label: "Compare my options", href: `${getStartedHref}?goal=refinance` }}
        secondary={<PhoneButton />}
        image={{ alt: "Homeowner reviewing mortgage paperwork on a laptop at home", note: "Lifestyle photo to be supplied" }}
      />

      <section aria-labelledby="options-title" className="border-y border-line bg-panel py-16 lg:py-24">
        <Container>
          <SectionHeading
            id="options-title"
            eyebrow="Your Options"
            title="Three ways to refinance, or not"
            intro="Pick the change you want. We'll show you the total cost of each."
            className="mb-12"
          />
          <OptionCards
            cards={[
              {
                icon: Percent,
                title: "Rate-and-term refinance",
                body: "Replace your mortgage with a new one at a different rate, a different term, or both. You don't take cash out.",
                points: ["Lower rate or shorter term", "Switch from adjustable to fixed"],
                href: `${getStartedHref}?goal=refinance`,
                linkLabel: "Talk it through",
              },
              {
                icon: HandCoins,
                title: "Cash-out refinance",
                body: "Replace your mortgage with a larger one and take the difference in cash at closing.",
                points: ["One loan, one payment", "Uses your home equity"],
                href: "/cash-out-refinance",
              },
              {
                icon: ShieldCheck,
                title: "Keep your rate",
                body: "If you secured a low 3% or 4% mortgage in past years, don't refinance the entire loan. A Home Equity Loan or HELOC lets you take out cash without changing it.",
                points: ["Your first mortgage stays as is", "Borrow only what you need"],
                href: "/home-equity-loan",
              },
            ]}
          />
        </Container>
      </section>

      <section id="payment" aria-labelledby="payment-title" className="py-16 lg:py-24">
        <Container>
          <div data-fit>
            <SectionHeading
              id="payment-title"
              eyebrow="Budget Planning"
              title="Estimate a new monthly payment"
              intro="Based on loan amount, repayment term, and interest rate."
              className="mb-8"
            />
            <PaymentEstimator
              config={{
                calculator: "loan_payment",
                mode: "loan",
                amountLabel: "New Loan Amount",
                defaultAmount: 350_000,
                terms: [15, 20, 30],
                defaultTerm: 30,
                defaultRate: "",
                rateHint: "Enter the rate you were quoted",
                amountSummaryLabel: "New Loan:",
                ctaLabel: "Compare my options",
                ctaHref: `${getStartedHref}?goal=refinance`,
                footnote: "Compare the total cost, including closing costs and the new term, not only the monthly payment.",
              }}
            />
          </div>
        </Container>
      </section>

      <RateMatchSection />
      <FaqList faqs={refinanceFaqs} />
      <RelatedLinks links={[loanLinks.cashOut, loanLinks.homeEquityLoan, loanLinks.heloc, loanLinks.programs]} />
      <FinalCta />
      <JsonLd data={faqJsonLd(refinanceFaqs)} />
    </>
  );
}

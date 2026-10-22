import { Rich } from "@/components/ui/Claim";
import { claims } from "@/lib/claims";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageHero, RelatedLinks } from "@/components/sections/blocks";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { FaqList, NumberBadge } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container, PhoneButton } from "@/components/ui/primitives";
import { rateMatchSteps } from "@/lib/content/home";
import { loanLinks, rateMatchFaqs } from "@/lib/content/pages";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Rate Match: Get a Second Opinion on Your Loan Offer",
  description:
    `Already have a Loan Estimate? Send it to independent broker Mohamad Fardous. He'll check ${claims.lenders.value} wholesale lenders and either beat it or tell you honestly that it's a good deal. No credit pull.`,
  path: "/rate-match",
});

export default function RateMatchPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Rate Match", path: "/rate-match" }]} />
      <PageHero
        badge="Wholesale Transparency"
        title="Already have an offer? Send it to us."
        intro={
          <p>
            We&apos;ll beat it or tell you honestly that it&apos;s a good deal. Zero sales pressure, just
            a transparent second opinion from a licensed broker.
          </p>
        }
        points={["No credit pull needed{{^credit}}", "We shop {{lenders}} lenders", "A straight answer, either way", "Upload a PDF or photo"]}
        secondary={<PhoneButton />}
      />

      <section id="send-offer" aria-labelledby="form-title" className="border-y border-line bg-panel py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h2 id="form-title" className="mb-6 text-[32px] leading-tight tracking-tight text-ink sm:text-[40px]">
                Send your Loan Estimate
              </h2>
              <LeadForm formType="rate_match" defaultGoal="refinance" allowUpload submitLabel="Submit My Offer for Review" />
            </div>
            <aside aria-labelledby="steps-title" className="lg:col-span-5">
              <div className="rounded-card border border-line bg-white p-6 sm:p-8 lg:sticky lg:top-28">
                <h2 id="steps-title" className="text-[24px] font-medium text-ink">
                  What happens next
                </h2>
                <ol className="mt-5 space-y-6">
                  {rateMatchSteps.map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                      <NumberBadge n={i + 1} tone={i === 1 ? "navy" : "ink"} />
                      <div>
                        <h3 className="text-[19px] font-medium text-ink">
                          <Rich text={s.title} />
                        </h3>
                        <p className="text-[17px] leading-relaxed text-body">
                          <Rich text={s.body} />
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <FaqList faqs={rateMatchFaqs} intro="" />
      <RelatedLinks links={[loanLinks.refinance, loanLinks.heloc, loanLinks.buy, loanLinks.homeEquityLoan]} />
      <JsonLd data={faqJsonLd(rateMatchFaqs)} />
    </>
  );
}

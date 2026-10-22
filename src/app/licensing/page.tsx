import { ExternalLink } from "lucide-react";
import { EqualHousingIcon } from "@/components/layout/EqualHousingIcon";
import { PageHero } from "@/components/sections/blocks";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { SectionHeading } from "@/components/sections/shared";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { advisor, licensedStates, nmlsConsumerAccessHome, offices, site, sponsor } from "@/lib/site";

export const metadata = pageMetadata({
  title: "State Licensing & Disclosures",
  description:
    "Mohamad Fardous (NMLS #1448893) is licensed to originate residential mortgage loans in 22 states, sponsored by West Capital Lending, Inc. (NMLS #1566096, CA DRE #02022356). Verify on NMLS Consumer Access.",
  path: "/licensing",
});

const verifyLinks = [
  { href: advisor.nmlsConsumerAccessUrl, label: `${advisor.name}, NMLS #${advisor.nmls}` },
  { href: sponsor.nmlsConsumerAccessUrl, label: `${sponsor.name}, NMLS #${sponsor.nmls}` },
  { href: nmlsConsumerAccessHome, label: "NMLS Consumer Access home page" },
];

export default function LicensingPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "State Licensing", path: "/licensing" }]} />
      <PageHero
        badge="Licensing"
        title="State Licensing & Disclosures"
        intro={
          <p>
            {advisor.name} (NMLS #{advisor.nmls}) is licensed to originate residential mortgage loans
            and home equity products in the {licensedStates.length} states below, sponsored by{" "}
            {sponsor.name} (NMLS #{sponsor.nmls}, CA DRE #{sponsor.caDre}).
          </p>
        }
      />

      <section aria-labelledby="states-title" className="border-y border-line bg-panel py-16 lg:py-24">
        <Container>
          <SectionHeading id="states-title" eyebrow="Where We Lend" title={`Licensed in ${licensedStates.length} states`} className="mb-10" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {licensedStates.map((state) => (
              <li key={state} className="rounded-[14px] border border-line bg-white px-4 py-3 text-[18px] text-ink">
                {state}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="verify-title" className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 id="verify-title" className="text-[32px] leading-tight tracking-tight text-ink sm:text-[40px]">
                Verify a license
              </h2>
              <p className="mt-4 text-[19px] leading-[30px] text-body">
                You can confirm current licenses on NMLS Consumer Access, the official public registry.
              </p>
              <ul className="mt-6 space-y-2">
                {verifyLinks.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} rel="noopener" className="inline-flex min-h-11 items-center gap-2 text-[18px] font-medium text-navy underline underline-offset-2">
                      {l.label}
                      <ExternalLink aria-hidden className="size-4" />
                      <span className="sr-only">(opens NMLS Consumer Access)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <div className="rounded-card border border-line bg-panel p-6 sm:p-8">
                <h2 className="text-[24px] font-medium text-ink">Company information</h2>
                <dl className="mt-4 space-y-3 text-[18px]">
                  <div>
                    <dt className="font-medium text-ink">Mortgage broker</dt>
                    <dd className="text-body">
                      {advisor.name}, NMLS #{advisor.nmls}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-ink">Sponsoring company</dt>
                    <dd className="text-body">
                      {sponsor.name}, NMLS #{sponsor.nmls}, CA DRE #{sponsor.caDre}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-ink">Brand</dt>
                    <dd className="text-body">{site.name} is a brand used by {advisor.name} and is not a lender.</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-ink">Offices</dt>
                    {offices.map((o) => (
                      <dd key={o.id} className="text-body">
                        {o.streetAddress}, {o.city}, {o.region} {o.postalCode}
                      </dd>
                    ))}
                  </div>
                  <div>
                    <dt className="font-medium text-ink">Contact</dt>
                    <dd className="text-body">
                      <a href={site.phone.href} className="text-navy underline underline-offset-2">
                        {site.phone.display}
                      </a>{" "}
                      ·{" "}
                      <a href={`mailto:${site.email}`} className="break-all text-navy underline underline-offset-2">
                        {site.email}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-card border border-line bg-panel p-6 sm:p-8">
                <h2 className="flex items-center gap-2 text-[24px] font-medium text-ink">
                  <EqualHousingIcon className="size-7" />
                  Equal Housing Opportunity
                </h2>
                <p className="mt-3 text-[18px] leading-relaxed text-body">
                  {site.name} supports equal housing opportunity. {sponsor.name} is an Equal Housing
                  Lender. This is not a commitment to lend. All loans are subject to credit approval,
                  property review and underwriting.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

import Link from "next/link";
import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { advisor, licensedStates, site, sponsor } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "Terms for using houseofequity.co: information only, not a commitment to lend; calculators are illustrations; licensing and contact details for Mohamad Fardous and West Capital Lending.",
  path: "/terms",
});

// DRAFT for compliance review: not legal advice. Plain-English baseline only.
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      path="/terms"
      updated="October 22, 2026"
      intro={
        <p>
          By using {site.url.replace("https://", "")} you agree to these terms. {site.name} is a brand
          used by {advisor.name} (NMLS #{advisor.nmls}), an independent mortgage broker sponsored by{" "}
          {sponsor.name} (NMLS #{sponsor.nmls}, CA DRE #{sponsor.caDre}). {site.name} is not a lender.
        </p>
      }
      sections={[
        {
          id: "information",
          title: "Information only",
          body: (
            <p>
              The content on this site is general information about mortgage and home equity
              options. It is not financial, legal or tax advice, and it is not an offer or a
              commitment to lend. All loans are subject to credit approval, property review and
              underwriting. Rates, terms and programs may change without notice and are not
              available in every state.
            </p>
          ),
        },
        {
          id: "calculators",
          title: "Calculators and estimates",
          body: (
            <p>
              Calculator results are illustrations based on the numbers you enter and the
              assumptions shown. They are not an approval, a rate quote, an appraisal or a
              program-specific limit. Your actual terms depend on your credit, income, property and
              the lender&apos;s program.
            </p>
          ),
        },
        {
          id: "licensing",
          title: "Licensing",
          body: (
            <p>
              {advisor.name} is licensed to originate residential mortgage loans in{" "}
              {licensedStates.length} states. See{" "}
              <Link href="/licensing" className="text-navy underline underline-offset-2">
                State Licensing
              </Link>{" "}
              for the list and links to NMLS Consumer Access.
            </p>
          ),
        },
        {
          id: "communications",
          title: "Communications",
          body: (
            <p>
              If you send a form and agree to be contacted, we may call, text or email you about
              your request. You can opt out at any time; see our{" "}
              <Link href="/privacy" className="text-navy underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          ),
        },
        {
          id: "links",
          title: "Links to other sites",
          body: <p>Links to other websites, such as NMLS Consumer Access, are provided for convenience. We are not responsible for their content.</p>,
        },
        {
          id: "liability",
          title: "No warranty",
          body: (
            <p>
              We work to keep this site accurate and available, but it is provided &ldquo;as is&rdquo;
              without warranties of any kind. To the extent the law allows, we are not liable for
              losses arising from your use of the site.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Questions about these terms? Call {site.phone.display} or email{" "}
              <a href={`mailto:${site.email}`} className="text-navy underline underline-offset-2">
                {site.email}
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}

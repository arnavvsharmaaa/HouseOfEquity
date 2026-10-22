import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { advisor, site, sponsor } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How House of Equity and Mohamad Fardous collect, use and protect the information you share through houseofequity.co, including contact requests, Loan Estimate uploads and call or text consent.",
  path: "/privacy",
});

// DRAFT for compliance review: not legal advice. Plain-English baseline only.
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      updated="October 22, 2026"
      intro={
        <p>
          This policy explains what information {site.name} ({site.url.replace("https://", "")})
          collects, how it is used and the choices you have. {site.name} is a brand used by{" "}
          {advisor.name} (NMLS #{advisor.nmls}), an independent mortgage broker sponsored by{" "}
          {sponsor.name} (NMLS #{sponsor.nmls}).
        </p>
      }
      sections={[
        {
          id: "collect",
          title: "Information we collect",
          body: (
            <>
              <p>When you contact us through a form, we collect:</p>
              <ul>
                <li>your name, phone number and email address;</li>
                <li>the goal you choose and any message you write;</li>
                <li>on Rate Match, a Loan Estimate or fee sheet you choose to upload;</li>
                <li>the page you sent the form from and, if present, the campaign tags (UTM parameters) in the link you followed.</li>
              </ul>
              <p>
                The calculators on this site run in your browser. The numbers you type into them are
                not sent to us and are never placed in web addresses or analytics.
              </p>
            </>
          ),
        },
        {
          id: "use",
          title: "How we use it",
          body: (
            <ul>
              <li>to respond to your request and talk through your options;</li>
              <li>to review a Loan Estimate you send us for a rate match;</li>
              <li>to keep records required for licensed mortgage lending;</li>
              <li>to understand, in aggregate, which pages and campaigns bring people to us.</li>
            </ul>
          ),
        },
        {
          id: "sharing",
          title: "Who we share it with",
          body: (
            <>
              <p>We do not sell your personal information. We share it only:</p>
              <ul>
                <li>with {sponsor.name}, the mortgage company that sponsors {advisor.name};</li>
                <li>with service providers that help us operate, such as our customer relationship (CRM) system, under agreements to protect it;</li>
                <li>with lenders, only when you decide to apply for a loan;</li>
                <li>when the law requires it.</li>
              </ul>
            </>
          ),
        },
        {
          id: "calls",
          title: "Calls and text messages",
          body: (
            <p>
              If you check the consent box on a form, we may call or text you about your request,
              including by automated means. Consent is not a condition of any loan. Message and data
              rates may apply. Reply STOP to any text to opt out, or tell us on a call.
            </p>
          ),
        },
        {
          id: "security",
          title: "How we protect it",
          body: (
            <p>
              This site uses an encrypted (HTTPS) connection. We ask only for basic contact details
              here; detailed financial information is collected later, only if you choose to apply,
              through a secure application.
            </p>
          ),
        },
        {
          id: "choices",
          title: "Your choices",
          body: (
            <p>
              You can ask us to see, correct or delete the information you sent us, or to stop
              contacting you, by calling {site.phone.display} or emailing{" "}
              <a href={`mailto:${site.email}`} className="text-navy underline underline-offset-2">
                {site.email}
              </a>
              . Some records must be kept to meet lending laws.
            </p>
          ),
        },
        {
          id: "children",
          title: "Children",
          body: <p>This site is meant for adults and is not directed to children under 13.</p>,
        },
        {
          id: "changes",
          title: "Changes and contact",
          body: (
            <p>
              We may update this policy and will change the date above when we do. Questions? Call{" "}
              {site.phone.display} or email{" "}
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

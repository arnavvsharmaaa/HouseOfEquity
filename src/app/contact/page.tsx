import { Suspense } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageHero } from "@/components/sections/blocks";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { NumberBadge } from "@/components/sections/shared";
import { Container } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { advisor, offices, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact Mohamad Fardous | Get Started",
  description:
    "Send a short note or call 949-569-7945. Independent mortgage broker Mohamad Fardous will personally reach out to talk through your home equity, purchase or refinance goal.",
  path: "/contact",
});

// [new] Describes what happens next, as the brand guide asks for on the contact path.
const nextSteps = [
  { title: "You send this short form", body: "Just the basics. Financial details come later, through a secure application, only if you decide to go ahead." },
  { title: "Mohamad reaches out", body: "He personally reviews your note and calls or texts you to talk through your goal." },
  { title: "You decide", body: "You'll get plain-English options and real numbers. There's no obligation." },
];

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <PageHero
        badge="Get Started"
        title="Your Home. Your Goals. Let's Talk."
        intro={
          <p>
            Send a short note and {advisor.name} will personally get back to you. Checking your
            options won&apos;t affect your credit.
          </p>
        }
      />

      <section aria-labelledby="form-title" className="border-y border-line bg-panel py-16 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h2 id="form-title" className="mb-6 text-[32px] leading-tight tracking-tight text-ink sm:text-[40px]">
                Tell us what you&apos;d like to do
              </h2>
              <Suspense fallback={<LeadForm formType="contact" />}>
                <ContactForm />
              </Suspense>
            </div>
            <aside aria-label="What happens next and how to reach us" className="space-y-6 lg:col-span-5">
              <div className="rounded-card border border-line bg-white p-6 sm:p-8">
                <h2 className="text-[24px] font-medium text-ink">What happens next</h2>
                <ol className="mt-5 space-y-6">
                  {nextSteps.map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                      <NumberBadge n={i + 1} tone={i === 1 ? "navy" : "ink"} />
                      <div>
                        <h3 className="text-[19px] font-medium text-ink">{s.title}</h3>
                        <p className="text-[17px] leading-relaxed text-body">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-card border border-line bg-white p-6 sm:p-8" data-track-location="contact_details">
                <h2 className="text-[24px] font-medium text-ink">Prefer to call or email?</h2>
                <ul className="mt-4 space-y-1 text-[18px]">
                  <li>
                    <a href={site.phone.href} className="inline-flex min-h-11 items-center gap-2 font-medium text-ink hover:underline">
                      <Phone aria-hidden className="size-5 text-navy" />
                      {site.phone.display}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-2 break-all text-ink hover:underline">
                      <Mail aria-hidden className="size-5 shrink-0 text-navy" />
                      {site.email}
                    </a>
                  </li>
                </ul>
                <h3 className="mt-6 text-[19px] font-medium text-ink">Offices</h3>
                <ul className="mt-3 space-y-4 text-[17px] text-body">
                  {offices.map((o) => (
                    <li key={o.id} className="flex gap-2">
                      <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-navy" />
                      <address className="not-italic">
                        <span className="block font-medium text-ink">{o.label}</span>
                        {o.streetAddress}
                        <br />
                        {o.city}, {o.region} {o.postalCode}
                      </address>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}

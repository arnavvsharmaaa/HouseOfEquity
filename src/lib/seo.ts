import type { Metadata } from "next";
import { advisor, licensedStates, offices, site, sponsor } from "./site";

/** Per-page metadata with canonical URL and matching Open Graph / Twitter fields. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
  };
}

const orgId = `${site.url}/#organization`;
const personId = `${site.url}/#mohamad-fardous`;
const sponsorId = `${site.url}/#west-capital-lending`;

const areaServed = licensedStates.map((name) => ({ "@type": "State", name }));

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialService",
        "@id": orgId,
        name: site.name,
        url: site.url,
        slogan: site.tagline,
        description: `${site.descriptor}. ${site.name} is a brand of independent mortgage broker ${advisor.name} (NMLS #${advisor.nmls}), sponsored by ${sponsor.name} (NMLS #${sponsor.nmls}).`,
        telephone: site.phone.e164,
        email: site.email,
        logo: `${site.url}/icon.svg`,
        image: `${site.url}/opengraph-image`,
        founder: { "@id": personId },
        employee: { "@id": personId },
        parentOrganization: { "@id": sponsorId },
        areaServed,
        location: offices.map((o) => ({ "@id": `${site.url}/#office-${o.id}` })),
      },
      {
        "@type": "Organization",
        "@id": sponsorId,
        name: sponsor.name,
        identifier: [
          { "@type": "PropertyValue", propertyID: "NMLS", value: sponsor.nmls },
          { "@type": "PropertyValue", propertyID: "CA DRE", value: sponsor.caDre },
        ],
        sameAs: [sponsor.nmlsConsumerAccessUrl],
      },
      {
        "@type": "Person",
        "@id": personId,
        name: advisor.name,
        jobTitle: advisor.title,
        telephone: site.phone.e164,
        email: site.email,
        url: `${site.url}/about`,
        identifier: { "@type": "PropertyValue", propertyID: "NMLS", value: advisor.nmls },
        worksFor: [{ "@id": orgId }, { "@id": sponsorId }],
        affiliation: { "@id": sponsorId },
        sameAs: [advisor.nmlsConsumerAccessUrl],
      },
      ...offices.map((o) => ({
        "@type": ["LocalBusiness", "FinancialService"],
        "@id": `${site.url}/#office-${o.id}`,
        name: `${site.name} – ${o.city}, ${o.region}`,
        url: site.url,
        telephone: site.phone.e164,
        email: site.email,
        parentOrganization: { "@id": orgId },
        address: {
          "@type": "PostalAddress",
          streetAddress: o.streetAddress,
          addressLocality: o.city,
          addressRegion: o.region,
          ...(o.postalCode ? { postalCode: o.postalCode } : {}),
          addressCountry: "US",
        },
      })),
    ],
  };
}

export function faqJsonLd(faqs: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbJsonLd(items: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

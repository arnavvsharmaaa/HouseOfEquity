import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { EqualHousingIcon } from "./EqualHousingIcon";
import {
  advisor,
  licensedStates,
  nmlsConsumerAccessHome,
  offices,
  site,
  sponsor,
} from "@/lib/site";

const solutions = [
  { href: "/heloc", label: "HELOC" },
  { href: "/home-equity-loan", label: "Home Equity Loan" },
  { href: "/cash-out-refinance", label: "Cash-Out Refinance" },
  { href: "/debt-consolidation", label: "Debt Consolidation" },
  { href: "/buy", label: "Home Purchase" },
  { href: "/refinance", label: "Refinancing Options" },
  { href: "/programs", label: "Loan Programs" },
  { href: "/rate-match", label: "Rate Match Guarantee" },
];

const company = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/licensing", label: "State Licensing" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

function LinkList({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-navy">{title}</h2>
      <ul className="mt-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex min-h-11 items-center text-[17px] text-body hover:text-ink hover:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-panel" data-track-location="footer">
      <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Logo compact />
            <p className="max-w-sm text-[17px] text-body">
              Good Things Start at Home. Architectural dignity, transparent lending, and tranquil
              residential equity solutions.
            </p>
            <ul className="text-[17px] text-body">
              <li>
                <a href={site.phone.href} className="inline-flex min-h-11 items-center gap-2 hover:text-ink">
                  <Phone aria-hidden className="size-5 text-navy" />
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-2 break-all hover:text-ink">
                  <Mail aria-hidden className="size-5 shrink-0 text-navy" />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <LinkList title="Solutions" links={solutions} />
          <LinkList title="Company" links={company} />

          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-navy">Offices</h2>
            <ul className="mt-4 space-y-4 text-[17px] text-body">
              {offices.map((o) => (
                <li key={o.id}>
                  <address className="not-italic">
                    <span className="block font-medium text-ink">
                      {o.city}, {o.region}
                    </span>
                    {o.streetAddress}
                    <br />
                    {o.city}, {o.region} {o.postalCode}
                  </address>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Required disclosures */}
        <div className="mt-12 space-y-3 rounded-[16px] border border-line bg-white p-5 text-[15px] leading-relaxed text-body sm:p-6 [&>p]:max-w-[80ch]">
          <p className="flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.1em] text-ink">
            <EqualHousingIcon className="size-7 text-ink" />
            Equal Housing Opportunity
          </p>
          <p>
            Independent Mortgage Broker {advisor.name} (NMLS #{advisor.nmls}) sponsored by{" "}
            {sponsor.name} (NMLS #{sponsor.nmls}, CA DRE #{sponsor.caDre}). Licensed to originate
            residential mortgage loans and home equity products in {licensedStates.length} states.{" "}
            {site.name} is a brand used by {advisor.name} and is not a lender. {sponsor.name} is an
            Equal Housing Lender.
          </p>
          <p>
            This is not a commitment to lend. All loans are subject to credit approval, property
            review and underwriting. Rates, terms and programs may change without notice. Calculator
            results are illustrations only and are not an approval or rate quote. Your home secures a
            home equity loan, HELOC or mortgage; not making payments could put your home at risk.
          </p>
          <p>
            *Close in as few as 3 days: eligible digital HELOCs only. Funds released after the 3-day
            right of rescission. Subject to credit and property approval.
          </p>
          <p id="fn-jd-power" className="scroll-mt-28">
            <sup>1</sup> Rocket Mortgage received the highest score in the J.D. Power 2022 – 2023
            Primary Mortgage Servicer Satisfaction Studies. Visit jdpower.com/awards for more
            information.
          </p>
          <p>
            Verify licensing at{" "}
            <a
              href={advisor.nmlsConsumerAccessUrl}
              className="font-medium text-navy underline underline-offset-2"
              rel="noopener"
            >
              NMLS Consumer Access
            </a>{" "}
            (
            <a href={nmlsConsumerAccessHome} className="text-navy underline underline-offset-2" rel="noopener">
              nmlsconsumeraccess.org
            </a>
            ).
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 text-center text-[15px] text-body sm:flex-row sm:text-left">
          <p>
            © {year} {site.name} (houseofequity.co). All rights reserved.
          </p>
          <p>
            NMLS #{advisor.nmls} • NMLS #{sponsor.nmls}
          </p>
        </div>
      </div>
    </footer>
  );
}

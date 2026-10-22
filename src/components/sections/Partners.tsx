import Image from "next/image";
import { Container } from "@/components/ui/primitives";

// A quiet trust band under the trust strip. Wording from mfardous.com; the J.D. Power note lives in
// the footer disclosures as footnote 1. Logo usage permission is on the README verify list.

type Logo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Per-logo bounding box (px). Wide wordmarks get width, stacked marks get height, so all read the same size. */
  box: { w: number; h: number };
};

const partners: Logo[] = [
  { src: "/partners/spring-eq.png", alt: "Spring EQ Wholesale Lending logo", width: 2611, height: 805, box: { w: 112, h: 34 } },
  { src: "/partners/epm-wholesale.png", alt: "EPM Wholesale logo", width: 600, height: 236, box: { w: 96, h: 34 } },
  { src: "/partners/nations-direct-mortgage.png", alt: "Nations Direct Mortgage logo", width: 911, height: 161, box: { w: 136, h: 24 } },
  { src: "/partners/kind-lending.svg", alt: "Kind Lending logo", width: 233, height: 50, box: { w: 124, h: 27 } },
  { src: "/partners/loanstream-mortgage.jpg", alt: "LoanStream Mortgage logo", width: 400, height: 206, box: { w: 76, h: 36 } },
  { src: "/partners/figure.png", alt: "Figure logo", width: 457, height: 102, box: { w: 100, h: 22 } },
];

function LogoImage({ logo, className = "" }: { logo: Logo; className?: string }) {
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      loading="lazy"
      sizes="140px"
      unoptimized={logo.src.endsWith(".svg")}
      // Auto size capped by both limits keeps the aspect ratio (object-fit: contain behaviour).
      style={{ width: "auto", height: "auto", maxWidth: `min(${logo.box.w}px, 100%)`, maxHeight: logo.box.h }}
      className={`object-contain ${className}`}
    />
  );
}

const bac: Logo = {
  src: "/partners/broker-action-coalition.png",
  alt: "Broker Action Coalition logo",
  width: 1617,
  height: 563,
  box: { w: 90, h: 28 },
};

// No bottom padding: the next section's top padding supplies the gap.
export function PartnersSection() {
  return (
    <section aria-labelledby="partners-title" className="pt-10 lg:pt-12">
      <Container>
        <div className="grid items-center gap-6 rounded-panel border border-line bg-panel p-5 sm:p-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-10 lg:px-8">
          {/* Rocket Pro recognition */}
          <div className="flex items-center gap-4 lg:border-r lg:border-line lg:pr-8">
            <Image
              src="/partners/rocket-pro-elite.png"
              alt="Rocket Pro TPO Elite Mortgage Broker badge"
              width={175}
              height={175}
              loading="lazy"
              className="size-[72px] shrink-0"
            />
            <p className="text-[18px] font-medium leading-snug text-ink lg:text-[17px]">
              Rocket Mortgage&apos;s #1 National Broker Partner, 4&nbsp;years
              <sup className="ml-0.5 text-[12px]">
                <a href="#fn-jd-power" className="text-navy underline underline-offset-2" aria-label="Footnote 1: J.D. Power award details">
                  1
                </a>
              </sup>
            </p>
          </div>

          {/* Partner logos */}
          <div>
            <h2 id="partners-title" className="text-center text-[13px] font-semibold uppercase tracking-[0.12em] text-navy lg:text-left">
              Top Lending Partners
            </h2>
            <ul className="mt-4 grid grid-cols-3 items-center gap-x-4 gap-y-6 lg:flex lg:justify-between lg:gap-x-6">
              {partners.map((logo) => (
                <li key={logo.src} className="flex h-10 min-w-0 items-center justify-center">
                  {/* Muted at rest; full colour on hover (Tailwind applies hover: only on hover-capable devices). */}
                  <LogoImage logo={logo} className="opacity-70 grayscale transition-[filter,opacity] duration-200 ease-out hover:opacity-100 hover:grayscale-0" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-balance text-center text-[18px] text-body">
          Proud sponsor of the Broker Action Coalition
          <LogoImage logo={bac} />
        </p>
      </Container>
    </section>
  );
}

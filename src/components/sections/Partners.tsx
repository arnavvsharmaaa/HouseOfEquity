import Image from "next/image";
import { Container } from "@/components/ui/primitives";

// Wording copied from mfardous.com ("Top Lending Partners" / "Proud Sponsor").
// Logos from westcapitallending.com and mfardous.com; usage permission is on the README verify list.

type Logo = { src: string; alt: string; width: number; height: number; /** displayed height in px, tuned for optical balance around 40px */ display: number };

const partners: Logo[] = [
  { src: "/partners/spring-eq.png", alt: "Spring EQ Wholesale Lending logo", width: 2611, height: 805, display: 40 },
  { src: "/partners/epm-wholesale.png", alt: "EPM Wholesale logo", width: 600, height: 236, display: 40 },
  { src: "/partners/nations-direct-mortgage.png", alt: "Nations Direct Mortgage logo", width: 911, height: 161, display: 28 },
  { src: "/partners/kind-lending.svg", alt: "Kind Lending logo", width: 233, height: 50, display: 32 },
  { src: "/partners/loanstream-mortgage.jpg", alt: "LoanStream Mortgage logo", width: 400, height: 206, display: 44 },
  { src: "/partners/figure.png", alt: "Figure logo", width: 457, height: 102, display: 26 },
];

function LogoImage({ logo, className = "" }: { logo: Logo; className?: string }) {
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      loading="lazy"
      sizes="200px"
      unoptimized={logo.src.endsWith(".svg")}
      style={{ height: logo.display, width: "auto" }}
      className={`max-w-full object-contain ${className}`}
    />
  );
}

export function PartnersSection() {
  return (
    <section aria-labelledby="partners-title" className="py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="partners-title" className="text-[14px] font-semibold uppercase tracking-[0.12em] text-navy">
            Top Lending Partners
          </h2>

          <div className="mt-8 flex flex-col items-center gap-4">
            <Image
              src="/partners/rocket-pro-elite.png"
              alt="Rocket Pro TPO Elite Mortgage Broker badge"
              width={175}
              height={175}
              loading="lazy"
              className="size-24"
            />
            <p className="text-[22px] font-medium leading-snug text-ink">
              Rocket Mortgage&apos;s #1 National Broker Partner for 4 years
            </p>
            <p className="max-w-xl text-[15px] leading-relaxed text-body">
              Rocket Mortgage received the highest score in the J.D. Power 2022 – 2023 Primary
              Mortgage Servicer Satisfaction Studies. Visit jdpower.com/awards for more information.
            </p>
          </div>

          <ul className="mt-12 grid grid-cols-2 items-center gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((logo) => (
              <li key={logo.src} className="flex h-14 items-center justify-center">
                {/* Grayscale at rest; full colour on hover (hover-capable devices only). */}
                <LogoImage logo={logo} className="opacity-80 grayscale transition-[filter,opacity] duration-200 ease-out hover:opacity-100 hover:grayscale-0" />
              </li>
            ))}
          </ul>

          <hr className="mx-auto mt-12 max-w-md border-line" />

          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-[14px] font-semibold uppercase tracking-[0.12em] text-navy">
              Proud Sponsor: Broker Action Coalition
            </p>
            <LogoImage logo={{ src: "/partners/broker-action-coalition.png", alt: "Broker Action Coalition logo", width: 1617, height: 563, display: 56 }} />
          </div>
        </div>
      </Container>
    </section>
  );
}

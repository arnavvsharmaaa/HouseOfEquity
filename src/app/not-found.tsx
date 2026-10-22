import type { Metadata } from "next";
import { RelatedLinks } from "@/components/sections/blocks";
import { ButtonLink, Container, PhoneButton } from "@/components/ui/primitives";
import { loanLinks } from "@/lib/content/pages";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <section className="pb-8 pt-16 lg:pt-24">
        <Container>
          <div className="max-w-2xl space-y-5">
            <h1 className="text-[40px] font-medium leading-tight tracking-tight text-ink sm:text-[52px]">
              We couldn&apos;t find that page.
            </h1>
            <p className="text-[20px] leading-[32px] text-body">
              It may have moved. Start from the homepage, pick a topic below, or call and we&apos;ll
              help you directly.
            </p>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
              <ButtonLink href="/">Go to the homepage</ButtonLink>
              <PhoneButton />
            </div>
          </div>
        </Container>
      </section>
      <RelatedLinks title="Popular pages" links={[loanLinks.heloc, loanLinks.homeEquityLoan, loanLinks.buy, loanLinks.refinance]} />
    </>
  );
}

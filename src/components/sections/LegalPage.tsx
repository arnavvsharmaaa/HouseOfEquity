import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { Container } from "@/components/ui/primitives";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Readable long-form layout for policy pages: one column, 70ch measure, linked contents. */
export function LegalPage({
  title,
  path,
  updated,
  intro,
  sections,
}: {
  title: string;
  path: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <>
      <Breadcrumbs items={[{ name: title, path }]} />
      <article className="pb-16 pt-8 lg:pb-24">
        <Container>
          <div className="mx-auto max-w-[70ch]">
            <h1 className="text-[40px] font-medium leading-tight tracking-tight text-ink sm:text-[48px]">{title}</h1>
            <p className="mt-3 text-[17px] text-body">Last updated {updated}</p>

            <p className="mt-6 flex gap-3 rounded-[14px] border-2 border-navy-line bg-navy-tint p-4 text-[17px] text-ink">
              <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-navy" />
              <span>
                <strong className="font-semibold">Draft pending compliance review.</strong> This page
                will be finalized before the site launches.
              </span>
            </p>

            <div className="mt-8 space-y-4 text-[19px] leading-[30px] text-body">{intro}</div>

            <nav aria-labelledby="toc-title" className="mt-10 rounded-card border border-line bg-panel p-6">
              <h2 id="toc-title" className="text-[19px] font-medium text-ink">
                On this page
              </h2>
              <ol className="mt-3 list-decimal space-y-1 pl-6 text-[18px]">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="inline-flex min-h-11 items-center text-navy underline underline-offset-2">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="mt-12 scroll-mt-28">
                <h2 id={`${s.id}-title`} className="text-[28px] font-medium leading-tight text-ink">
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4 text-[19px] leading-[30px] text-body [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-6">{s.body}</div>
              </section>
            ))}
          </div>
        </Container>
      </article>
    </>
  );
}

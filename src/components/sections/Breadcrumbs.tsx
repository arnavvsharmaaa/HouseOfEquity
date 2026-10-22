import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

/** Visible breadcrumb trail plus matching BreadcrumbList JSON-LD. "Home" is added automatically. */
export function Breadcrumbs({ items }: { items: ReadonlyArray<{ name: string; path: string }> }) {
  return (
    <Container className="pt-4">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-[16px] text-body">
          <li>
            <Link href="/" className="inline-flex min-h-11 items-center hover:text-ink hover:underline">
              Home
            </Link>
          </li>
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1">
                <ChevronRight aria-hidden className="size-4" />
                {last ? (
                  <span aria-current="page" className="font-medium text-ink">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="inline-flex min-h-11 items-center hover:text-ink hover:underline">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </Container>
  );
}

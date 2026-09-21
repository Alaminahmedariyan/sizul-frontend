import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { getPortfolioItems } from "@/lib/api/portfolio";

import { Reveal, Stagger, StaggerItem } from "./motion";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

// Alternating wide and narrow tiles. Adjusts when there are only one or three items.
function spanClass(index: number, total: number) {
  if (total === 1 || (total === 3 && index === 2)) return "md:col-span-12";
  return index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5";
}

export async function FeaturedWork() {
  let items: Awaited<ReturnType<typeof getPortfolioItems>>["data"] = [];

  try {
    const res = await getPortfolioItems();
    items = res.data.slice(0, 4);
  } catch {
    items = [];
  }

  if (items.length === 0) return null;

  return (
    <Section id="work">
      <SectionHeading
        title="Recent projects"
        description="A look at what we have shipped for our clients."
      />

      <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {items.map((item, index) => (
          <StaggerItem key={item.id} className={spanClass(index, items.length)}>
            <Link
              href={`/portfolio/${item.slug}`}
              className="group relative block h-80 overflow-hidden rounded-3xl border border-border bg-muted shadow-[var(--shadow-sm)] transition-shadow duration-500 hover:shadow-[var(--shadow-xl)] md:h-[26rem]"
            >
              {item.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.coverImage}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-signal/60" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

              {item.industry && (
                <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                  {item.industry}
                </span>
              )}

              <span className="absolute right-5 top-5 flex size-10 translate-y-1 scale-90 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                <ArrowUpRight className="size-4" />
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  {item.title}
                </h3>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-12 text-center">
        <Link href="/portfolio" className="brand-btn-secondary">
          View full portfolio
        </Link>
      </Reveal>
    </Section>
  );
}

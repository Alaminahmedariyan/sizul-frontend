import { ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Reveal, Stagger, StaggerItem } from "@/components/marketing/motion";
import { Container } from "@/components/marketing/section";
import { SpotlightCard } from "@/components/marketing/spot-light-card";
import { getCaseStudies } from "@/lib/api/case-studies";

export default async function CaseStudiesPage() {
  let items: Awaited<ReturnType<typeof getCaseStudies>>["data"] = [];

  try {
    const res = await getCaseStudies();
    items = res.data;
  } catch {
    items = [];
  }

  return (
    <Container className="max-w-4xl py-20 md:py-28">
      <Reveal
        immediate
        className="mx-auto mb-14 max-w-2xl text-center md:mb-16"
      >
        <h1 className="text-4xl font-semibold leading-[1.1] md:text-5xl">
          Case Studies
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          Real results from real client partnerships.
        </p>
      </Reveal>

      {items.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Case studies are being updated. Please check back soon.
        </div>
      )}

      <Stagger className="flex flex-col gap-5">
        {items.map((item) => (
          <StaggerItem key={item.id}>
            <Link
              href={`/case-studies/${item.slug}`}
              className="group block rounded-3xl"
            >
              <SpotlightCard className="p-8 md:p-10">
                {(item.industry || item.clientName) && (
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {item.industry && (
                      <span className="brand-badge">{item.industry}</span>
                    )}
                    {item.clientName && <span>{item.clientName}</span>}
                  </div>
                )}

                <h2 className="mt-5 text-2xl font-semibold leading-snug">
                  {item.title}
                </h2>

                {item.results && (
                  <div className="mt-6 flex gap-4 rounded-2xl border border-primary/10 bg-primary/5 p-5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <TrendingUp className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Results</p>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {item.results}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-border pt-5 text-sm font-medium">
                  <span>Read case study</span>
                  <span className="flex size-9 items-center justify-center rounded-full border border-border transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </SpotlightCard>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Container>
  );
}
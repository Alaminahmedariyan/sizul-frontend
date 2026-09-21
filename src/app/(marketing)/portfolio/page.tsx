import { ArrowUpRight, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal, Stagger, StaggerItem } from "@/components/marketing/motion";
import { Container } from "@/components/marketing/section";
import { SpotlightCard } from "@/components/marketing/spot-light-card";
import { getPortfolioItems } from "@/lib/api/portfolio";

export default async function PortfolioPage() {
  let items: Awaited<ReturnType<typeof getPortfolioItems>>["data"] = [];

  try {
    const res = await getPortfolioItems();
    items = res.data;
  } catch {
    items = [];
  }

  return (
    <Container className="py-20 md:py-28">
      <Reveal
        immediate
        className="mx-auto mb-14 max-w-2xl text-center md:mb-16"
      >
        <h1 className="text-4xl font-semibold leading-[1.1] md:text-5xl">
          Our Portfolio
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          A selection of work we&apos;re proud of.
        </p>
      </Reveal>

      {items.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Portfolio is being updated. Please check back soon.
        </div>
      )}

      <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <StaggerItem key={item.id}>
            <Link
              href={`/portfolio/${item.slug}`}
              className="group block h-full rounded-3xl"
            >
              <SpotlightCard className="flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {item.coverImage ? (
                    <Image
                      src={item.coverImage}
                      width={800}
                      height={600}
                      alt={item.title}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="size-full object-cover transition-transform duration-700 ease-(--ease-out) group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5 text-primary/40">
                      <Layers className="size-10" />
                    </div>
                  )}

                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  {item.industry && (
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur-md">
                      {item.industry}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 items-start justify-between gap-4 p-6">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold leading-snug">
                      {item.title}
                    </h2>
                    {item.clientName && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.clientName}
                      </p>
                    )}
                  </div>

                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
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
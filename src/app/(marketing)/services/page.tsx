import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Reveal, Stagger, StaggerItem } from "@/components/marketing/motion";
import { Container } from "@/components/marketing/section";
import { SpotlightCard } from "@/components/marketing/spot-light-card";
import { getServices } from "@/lib/api/services";
import { getIconBubble } from "@/lib/icon-colors";
import { cn } from "@/lib/utils";

export default async function ServicesPage() {
  let services: Awaited<ReturnType<typeof getServices>>["data"] = [];

  try {
    const res = await getServices();
    services = res.data;
  } catch {
    // Backend unreachable — show empty state instead of crashing the page.
    services = [];
  }

  return (
    <Container className="py-20 md:py-28">
      <Reveal
        immediate
        className="mx-auto mb-14 max-w-2xl text-center md:mb-16"
      >
        <h1 className="text-4xl font-semibold leading-[1.1] md:text-5xl">
          Our Services
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          Everything you need to grow, under one roof.
        </p>
      </Reveal>

      {services.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
          Services are being updated. Please check back soon.
        </div>
      )}

      <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const { color, icon: Icon } = getIconBubble(index);

          return (
            <StaggerItem key={service.id}>
              <Link
                href={`/services/${service.slug}`}
                className="group block h-full rounded-3xl"
              >
                <SpotlightCard className="flex h-full flex-col p-8">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl text-white shadow-(--shadow-md)",
                      color,
                    )}
                  >
                    <Icon className="size-5" />
                  </div>

                  <h2 className="mt-8 text-xl font-semibold">{service.name}</h2>

                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.tagline ?? service.description}
                  </p>

                  {service.startingPrice && (
                    <p className="mt-6 inline-flex w-fit items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium">
                      Starting at {service.startingPrice} {service.currency}
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-5 text-sm font-medium">
                    <span>Explore service</span>
                    <span className="flex size-9 items-center justify-center rounded-full border border-border transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </SpotlightCard>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Container>
  );
}
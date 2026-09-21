import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { getServices } from "@/lib/api/services";
import { getIconBubble } from "@/lib/icon-colors";
import { cn } from "@/lib/utils";

import { Reveal, Stagger, StaggerItem } from "./motion";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";
import { SpotlightCard } from "./spot-light-card";

type ServiceList = Awaited<ReturnType<typeof getServices>>["data"];

export function ServicesSection({ services }: { services: ServiceList }) {
  if (services.length === 0) return null;

  // Four or more services get an asymmetric layout; fewer stay in an even row.
  const bento = services.length >= 4;
  const items = bento ? services.slice(0, 4) : services;

  return (
    <Section id="services">
      <SectionHeading
        title="Services built around growth"
        description="Choose one service or combine them. We shape the work around what your business actually needs."
      />

      <Stagger className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {items.map((service, index) => {
          const { color, icon: Icon } = getIconBubble(index);
          const wide = bento && (index === 0 || index === 3);

          return (
            <StaggerItem
              key={service.id}
              className={cn(wide && "lg:col-span-2")}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group block h-full rounded-3xl"
              >
                <SpotlightCard className="flex h-full flex-col p-8 group-hover:-translate-y-1">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-md)]",
                      color,
                    )}
                  >
                    <Icon className="size-5" />
                  </div>

                  <h3
                    className={cn(
                      "mt-8 text-xl font-semibold",
                      wide && "md:text-2xl",
                    )}
                  >
                    {service.name}
                  </h3>

                  <p
                    className={cn(
                      "mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground",
                      wide && "md:max-w-md md:text-base",
                    )}
                  >
                    {service.tagline ?? service.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-border pt-5 text-sm font-medium">
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

      <Reveal className="mt-12 text-center">
        <Link href="/services" className="brand-btn-secondary">
          View all services
        </Link>
      </Reveal>
    </Section>
  );
}

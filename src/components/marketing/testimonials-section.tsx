import { Quote, Star } from "lucide-react";
import Link from "next/link";

import type { getTestimonials } from "@/lib/api/testimonials";
import { cn } from "@/lib/utils";

import { Reveal, Stagger, StaggerItem } from "./motion";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";
import { SpotlightCard } from "./spot-light-card";

type TestimonialList = Awaited<ReturnType<typeof getTestimonials>>["data"];

type Testimonial = TestimonialList[number];

function Stars({ rating }: { rating: number }) {
  return (
    <div
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="flex gap-0.5 text-amber-500"
    >
      {[1, 2, 3, 4, 5].slice(0, rating).map((star) => (
        <Star key={star} className="size-4 fill-current" />
      ))}
    </div>
  );
}

function Author({ testimonial }: { testimonial: Testimonial }) {
  const subtitle = [testimonial.clientRole, testimonial.companyName]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-sm font-semibold text-primary-foreground">
        {testimonial.clientName?.charAt(0).toUpperCase() ?? "C"}
      </div>

      <div>
        <p className="text-sm font-medium leading-tight">
          {testimonial.clientName}
        </p>

        {subtitle && (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: TestimonialList;
}) {
  if (testimonials.length === 0) {
    return null;
  }

  const [featured, ...rest] = testimonials.slice(0, 3);

  return (
    <Section id="testimonials" tone="muted">
      <SectionHeading
        title="Don't just take our word for it"
        description="Real feedback from businesses we have partnered with."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Reveal
          className={cn(rest.length > 0 ? "lg:col-span-3" : "lg:col-span-5")}
        >
          <SpotlightCard className="flex h-full flex-col p-8 md:p-10">
            <Quote aria-hidden className="size-10 text-primary/25" />

            <blockquote className="mt-6 flex-1 text-xl font-medium leading-snug md:text-2xl">
              {featured.content}
            </blockquote>

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
              <Author testimonial={featured} />
              <Stars rating={featured.rating} />
            </div>
          </SpotlightCard>
        </Reveal>

        {rest.length > 0 && (
          <Stagger className="flex flex-col gap-5 lg:col-span-2">
            {rest.map((testimonial) => (
              <StaggerItem key={testimonial.id} className="flex-1">
                <SpotlightCard className="flex h-full flex-col p-6">
                  <Stars rating={testimonial.rating} />

                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/80">
                    {testimonial.content}
                  </p>

                  <div className="mt-6 border-t border-border pt-5">
                    <Author testimonial={testimonial} />
                  </div>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>

      <Reveal className="mt-12 text-center">
        <Link href="/case-studies" className="brand-btn-secondary">
          See client results
        </Link>
      </Reveal>
    </Section>
  );
}

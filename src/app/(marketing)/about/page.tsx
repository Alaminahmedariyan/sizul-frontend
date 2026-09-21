import { ArrowRight, Eye, type LucideIcon, Target, Users } from "lucide-react";
import Link from "next/link";

import { Reveal, Stagger, StaggerItem } from "@/components/marketing/motion";
import { Section } from "@/components/marketing/section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { SpotlightCard } from "@/components/marketing/spot-light-card";

const VALUES: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Results-Driven",
    description:
      "Every project is measured against real business outcomes — traffic, leads, and revenue, not just deliverables.",
    icon: Target,
  },
  {
    title: "Transparent Process",
    description:
      "You always know where your project stands. No black boxes, no surprise invoices.",
    icon: Eye,
  },
  {
    title: "Full-Service Team",
    description:
      "Web development, SEO, and video editing under one roof — no juggling multiple vendors.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <>
      <Section
        className="isolate overflow-hidden pb-16 md:pb-20"
        containerClassName="max-w-4xl text-center"
      >
        <div aria-hidden className="hero-grid -z-10" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        />

        <Reveal immediate>
          <h1 className="text-4xl font-semibold leading-[1.05] md:text-6xl">
            About Sizul
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            We&apos;re a full-service digital agency helping businesses grow
            online — combining web development, SEO, and video production into a
            single, accountable partnership.
          </p>
        </Reveal>
      </Section>

      <Section tone="muted">
        <SectionHeading title="What We Stand For" />

        <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {VALUES.map((value) => {
            const Icon = value.icon;

            return (
              <StaggerItem key={value.title}>
                <SpotlightCard className="h-full p-8">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>

      <Section containerClassName="max-w-4xl">
        <Reveal>
          <SpotlightCard
            variant="featured"
            className="px-8 py-14 text-center md:px-16 md:py-20"
          >
            <div
              aria-hidden
              className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            />
            <h2 className="text-3xl font-semibold md:text-4xl">
              Let&apos;s build something together
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Whether you need a new website, better search rankings, or
              engaging video content — we&apos;re ready to help.
            </p>
            <div className="mt-8">
              <Link href="/contact" className="brand-btn-primary">
                Get in Touch
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </SpotlightCard>
        </Reveal>
      </Section>
    </>
  );
}
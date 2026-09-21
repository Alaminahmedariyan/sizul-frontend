import { FileSearch, Palette, Rocket, Wrench } from "lucide-react";

import { GrowLine, Stagger, StaggerItem } from "./motion";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

const STEPS = [
  {
    icon: FileSearch,
    title: "Discovery",
    description:
      "We start by understanding your business, goals and audience before writing a single line of code.",
  },
  {
    icon: Palette,
    title: "Design",
    description:
      "Wireframes and visual design tailored to your brand, reviewed and refined with your feedback.",
  },
  {
    icon: Wrench,
    title: "Build",
    description:
      "Development and SEO setup run in parallel, with regular check-ins so nothing is a surprise.",
  },
  {
    icon: Rocket,
    title: "Launch and grow",
    description:
      "We launch, monitor performance and keep optimizing. Growth does not stop at go-live.",
  },
];

export function ProcessSection() {
  return (
    <Section id="process" tone="muted">
      <SectionHeading
        title="A process built for clarity"
        description="No black boxes. You always know what is happening and why."
      />

      <div className="relative">
        <GrowLine className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block" />

        <Stagger className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <StaggerItem key={step.title} className="group text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-[var(--shadow-md)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </div>
                <p className="mt-6 text-sm font-medium text-primary">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}

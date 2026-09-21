import { GlowCard } from "@/components/shared/glow-card";
import { STAT_LIST } from "@/lib/site";

import { CountUp, Reveal } from "./motion";
import { Container } from "./section";

export function StatsStrip() {
  return (
    <section className="pb-24 md:pb-32">
      <Container>
        <Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STAT_LIST.map((stat) => (
              <GlowCard
                key={stat.label}
                // Stats are not clickable, so drop the press-down scale.
                className="shadow-[var(--shadow-md)] [--glow-radius:1.25rem] active:scale-100"
                contentClassName="px-6 py-10 text-center md:py-12"
              >
                <p className="text-4xl font-semibold tabular-nums tracking-tight md:text-5xl">
                  <CountUp
                    to={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                    suffixClassName="text-primary"
                  />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </GlowCard>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
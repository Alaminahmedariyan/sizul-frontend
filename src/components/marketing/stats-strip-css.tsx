import { STAT_LIST } from "@/lib/site";

import { CountUp, Reveal } from "./motion";
import { Container } from "./section";

// Same layout as stats-strip.tsx but the glow does not follow the pointer:
// the whole card border lights up on hover. No client JS or GlowCard needed.
export function StatsStrip() {
  return (
    <section className="pb-24 md:pb-32">
      <Container>
        <Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STAT_LIST.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.25rem] border border-border bg-card px-6 py-10 text-center shadow-[var(--shadow-md)] transition-[border-color,box-shadow] duration-300 hover:border-primary/70 hover:shadow-[0_0_28px_-6px_color-mix(in_oklab,var(--primary)_50%,transparent)] md:py-12"
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
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
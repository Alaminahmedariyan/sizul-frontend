import {
  BarChart3,
  LineChart,
  type LucideIcon,
  Mail,
  Monitor,
  Phone,
  Rocket,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { formatStat, SITE, STATS } from "@/lib/site";
import { cn } from "@/lib/utils";

import { Reveal, Stagger, StaggerItem } from "./motion";
import { Container } from "./section";

const FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: TrendingUp, label: "SEO strategy and rankings" },
  { icon: Monitor, label: "Modern, responsive web design" },
  { icon: Rocket, label: "Speed, performance and security" },
  { icon: BarChart3, label: "More traffic and conversions" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-8 md:pb-20 md:pt-12">
      {/* ───────── Background ───────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* base wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />

        {/* grid, focused around the portrait side */}
        <div className="hero-grid [mask-image:radial-gradient(ellipse_70%_65%_at_68%_40%,black,transparent_75%)]" />

        {/* mesh glows */}
        <div className="absolute -right-32 -top-40 size-[40rem] rounded-full bg-primary/25 blur-[140px]" />
        <div className="absolute -left-24 top-1/3 size-[28rem] rounded-full bg-violet-500/15 blur-[130px]" />
        <div className="absolute -bottom-32 left-1/3 size-[26rem] rounded-full bg-signal/15 blur-[120px]" />

        {/* top highlight line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* bottom blend into next section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
        {/* ───────── Left: content ───────── */}
        <div className="flex flex-col justify-center">
          <Stagger immediate>
            <StaggerItem>
              <span className="brand-badge">
                <span className="signal-dot" />
                {SITE.availability}
              </span>
            </StaggerItem>

            <StaggerItem>
              <h1 className="mt-7 max-w-xl text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                We help businesses grow online with{" "}
                <span className="bg-gradient-to-r from-primary via-primary to-signal bg-clip-text text-transparent">
                  SEO and web design
                </span>{" "}
                that performs.
              </h1>
            </StaggerItem>

            <StaggerItem>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                Rank higher on search engines and turn visitors into paying
                customers, with strategy built on data instead of guesswork.
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/get-quote"
                  className="brand-btn-primary w-full justify-center sm:w-auto"
                >
                  Get a free quote
                </Link>
                <Link
                  href="/portfolio"
                  className="brand-btn-secondary w-full justify-center sm:w-auto"
                >
                  View our work
                </Link>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <Link
                  href={SITE.phoneHref}
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Phone className="size-4" />
                  {SITE.phone}
                </Link>
                <Link
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Mail className="size-4" />
                  {SITE.email}
                </Link>
              </div>
            </StaggerItem>

            <StaggerItem>
              <ul className="mt-10 grid grid-cols-1 gap-3 border-t border-border pt-8 sm:grid-cols-2">
                {FEATURES.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 text-sm font-medium"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Icon className="size-4" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          </Stagger>
        </div>

        {/* ───────── Right: cut-out portrait ───────── */}
        <Reveal
          immediate
          x={32}
          y={0}
          delay={0.25}
          className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[32rem] lg:h-[36rem] lg:max-w-none"
        >
          {/* dot pattern, faded at the edges */}
          <div
            aria-hidden
            className="absolute inset-x-[4%] bottom-[8%] top-[6%] -z-10 text-primary/35 [background-image:radial-gradient(currentColor_1.2px,transparent_1.2px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_68%)]"
          />

          {/* aurora glow */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[42%] -z-10 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/50 via-signal/30 to-transparent blur-[70px]"
          />

          {/* solid gradient disc behind the person */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[50%] -z-10 size-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-primary to-signal opacity-90 shadow-[0_30px_90px_-20px] shadow-primary/60 sm:size-[26rem]"
          />

          {/* transparent PNG, background removed */}
          <Image
            src="/images/hero-profile.png"
            alt="Founder portrait"
            fill
            priority
            sizes="(min-width: 1024px) 34rem, 90vw"
            className="z-10 object-contain object-bottom drop-shadow-[0_25px_40px_rgba(0,0,0,0.25)] [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]"
          />

          {/* sparkles */}
          <Sparkles className="absolute left-[8%] top-[10%] z-20 size-6 animate-float text-primary" />
          <Sparkles className="absolute right-[10%] top-[28%] z-20 size-4 animate-float-delayed text-signal" />
          <Sparkles className="absolute bottom-[30%] right-[4%] z-20 size-5 animate-float text-primary/70" />

          {/* floating stat cards */}
          <FloatCard className="left-0 top-[22%] sm:-left-6">
            <IconBubble className="bg-primary">
              <Trophy className="size-4" />
            </IconBubble>
            <StatText
              value={formatStat(STATS.years)}
              label={STATS.years.label}
            />
          </FloatCard>

          <FloatCard className="right-0 top-[48%] sm:-right-6" delayed>
            <IconBubble className="bg-emerald-500">
              <LineChart className="size-4" />
            </IconBubble>
            <StatText
              value={formatStat(STATS.projects)}
              label={STATS.projects.label}
            />
          </FloatCard>

          <FloatCard className="bottom-[16%] left-2 sm:-left-2">
            <IconBubble className="bg-amber-500">
              <Star className="size-4 fill-current" />
            </IconBubble>
            <StatText
              value={formatStat(STATS.rating)}
              label={STATS.rating.label}
            />
          </FloatCard>
        </Reveal>
      </Container>
    </section>
  );
}

function FloatCard({
  children,
  className,
  delayed = false,
}: {
  children: ReactNode;
  className?: string;
  delayed?: boolean;
}) {
  return (
    <div className={cn("absolute z-20 hidden sm:block", className)}>
      <div
        className={cn(
          "glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[var(--shadow-lg)] ring-1 ring-white/20",
          delayed ? "animate-float-delayed" : "animate-float",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function IconBubble({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-10 items-center justify-center rounded-full text-white shadow-md",
        className,
      )}
    >
      {children}
    </span>
  );
}

function StatText({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-lg font-semibold leading-none">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
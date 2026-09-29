import {
  BarChart3,
  LineChart,
  type LucideIcon,
  Mail,
  Monitor,
  Phone,
  Rocket,
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

const BLOB =
  "M470 85C560 82 640 135 668 235C695 335 650 465 622 555C596 640 480 690 345 672C215 655 112 565 83 445C60 345 108 245 190 172C268 105 380 88 470 85Z";

const ORBIT_BACK = "M-318 0A318 160 0 0 1 318 0";
const ORBIT_FRONT = "M-318 0A318 160 0 0 0 318 0";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-8 md:pb-20 md:pt-12">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />
        <div className="hero-grid [mask-image:radial-gradient(ellipse_70%_65%_at_68%_40%,black,transparent_75%)]" />
        <div className="absolute -right-32 -top-40 size-[40rem] rounded-full bg-primary/20 blur-[150px] dark:bg-primary/25" />
        <div className="absolute -left-24 top-1/3 size-[28rem] rounded-full bg-violet-500/10 blur-[140px] dark:bg-violet-500/15" />
        <div className="absolute -bottom-32 left-1/3 size-[26rem] rounded-full bg-signal/10 blur-[130px] dark:bg-signal/15" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-8">
        {/* Left content */}
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

        {/* Right visual */}
        <Reveal
          immediate
          x={32}
          y={0}
          delay={0.25}
          className="relative isolate mx-auto aspect-[820/730] w-full max-w-[46rem] [container-type:inline-size] lg:-mr-[6%] lg:ml-auto lg:w-[112%] lg:max-w-none"
        >
          {/* Ambient light */}
          <div
            aria-hidden="true"
            className="absolute -right-[12%] -top-[14%] z-0 h-[75%] w-[75%] rounded-full bg-[var(--hero-glow)] blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="absolute right-[12%] top-[10%] z-0 size-[62%] rounded-full bg-primary/10 blur-[100px] dark:bg-primary/15"
          />
          <div
            aria-hidden="true"
            className="absolute left-[25%] top-[28%] z-0 size-[45%] rounded-full bg-violet-500/10 blur-[90px]"
          />

          {/* ===================== BACK SVG ===================== */}
          <svg
            aria-hidden="true"
            role="presentation"
            focusable="false"
            viewBox="0 0 820 730"
            fill="none"
            className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible"
          >
            <defs>
              <linearGradient
                id="hv-blob"
                gradientUnits="userSpaceOnUse"
                x1="600"
                y1="100"
                x2="150"
                y2="620"
              >
                <stop offset="0" stopColor="var(--hero-blob-a)" />
                <stop offset="0.32" stopColor="var(--hero-blob-b)" />
                <stop offset="0.65" stopColor="var(--hero-blob-c)" />
                <stop offset="1" stopColor="var(--hero-blob-d)" />
              </linearGradient>

              <radialGradient
                id="hv-blob-top"
                gradientUnits="userSpaceOnUse"
                cx="520"
                cy="110"
                r="210"
              >
                <stop offset="0" stopColor="var(--hero-orbit-b)" stopOpacity="0.42" />
                <stop offset="1" stopColor="var(--hero-orbit-b)" stopOpacity="0" />
              </radialGradient>

              <radialGradient
                id="hv-blob-br"
                gradientUnits="userSpaceOnUse"
                cx="560"
                cy="530"
                r="230"
              >
                <stop offset="0" stopColor="var(--hero-orbit-a)" stopOpacity="0.36" />
                <stop offset="1" stopColor="var(--hero-orbit-a)" stopOpacity="0" />
              </radialGradient>

              <linearGradient
                id="hv-orbit-spectrum-back"
                gradientUnits="userSpaceOnUse"
                x1="-318"
                y1="0"
                x2="318"
                y2="0"
              >
                <stop offset="0" stopColor="#20E3D5" />
                <stop offset="0.2" stopColor="#18A9E8" />
                <stop offset="0.42" stopColor="#4D5FEA" />
                <stop offset="0.62" stopColor="#F27A6A" />
                <stop offset="0.82" stopColor="#9C5DE8" />
                <stop offset="1" stopColor="#C778F2" />
              </linearGradient>

              {/* BACK TRAIL — auto color change */}
              <linearGradient
                id="hv-orbit-trail-back"
                gradientUnits="userSpaceOnUse"
                x1="-318"
                y1="0"
                x2="318"
                y2="0"
              >
                <stop offset="0">
                  <animate
                    attributeName="stop-color"
                    values="#6FFFF3;#2ED4FF;#687CFF;#FF8B70;#B56CFF;#D69AFF;#6FFFF3"
                    dur="60s"
                    keyTimes="0;0.1667;0.3333;0.5;0.6667;0.8333;0.9999"
                    calcMode="discrete"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="0.5">
                  <animate
                    attributeName="stop-color"
                    values="#2ED4FF;#687CFF;#FF8B70;#B56CFF;#D69AFF;#6FFFF3;#2ED4FF"
                    dur="60s"
                    keyTimes="0;0.1667;0.3333;0.5;0.6667;0.8333;0.9999"
                    calcMode="discrete"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="1">
                  <animate
                    attributeName="stop-color"
                    values="#687CFF;#FF8B70;#B56CFF;#D69AFF;#6FFFF3;#2ED4FF;#687CFF"
                    dur="60s"
                    keyTimes="0;0.1667;0.3333;0.5;0.6667;0.8333;0.9999"
                    calcMode="discrete"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>

              <filter id="hv-blur-lg" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="38" />
              </filter>
              <filter id="hv-orbit-soft-back" x="-30%" y="-100%" width="160%" height="300%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
            </defs>

            {/* Blob + Back orbit */}
            <g transform="translate(410 365) scale(1.5) translate(-410 -365)">
              <path
                d={BLOB}
                fill="var(--hero-glow)"
                opacity="0.65"
                filter="url(#hv-blur-lg)"
                transform="translate(10 24)"
              />
              <circle
                cx="335"
                cy="110"
                r="170"
                fill="#ffffff"
                opacity="0.38"
                filter="url(#hv-blur-lg)"
              />
              <Dots x={552} y={97} cols={5} rows={4} color="#ffffff" fx={0.16} fy={0.08} />
              <Dots
                x={632}
                y={548}
                cols={5}
                rows={4}
                color="var(--hero-orbit-c)"
                fx={0.16}
                fy={0.1}
                flipY
              />

              <path d={BLOB} fill="url(#hv-blob)" />
              <path d={BLOB} fill="url(#hv-blob-top)" />
              <path d={BLOB} fill="url(#hv-blob-br)" />

              {/* BACK ORBIT — no black hole */}
              <g transform="translate(412 475) rotate(-15)">
                <path
                  d={ORBIT_BACK}
                  stroke="url(#hv-orbit-spectrum-back)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  opacity="0.62"
                />
                <path
                  d={ORBIT_BACK}
                  stroke="url(#hv-orbit-spectrum-back)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  opacity="0.16"
                  filter="url(#hv-orbit-soft-back)"
                />
                <path
                  d="M-292 12A318 160 0 0 1 292 12"
                  stroke="#ffffff"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  opacity="0.3"
                />

                {/* Moving color trail — back */}
                <path
                  d={ORBIT_BACK}
                  pathLength="100"
                  stroke="url(#hv-orbit-trail-back)"
                  strokeWidth="4.6"
                  strokeLinecap="round"
                  strokeDasharray="30 70"
                  strokeDashoffset="30"
                  opacity="0.95"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="30;-70"
                    dur="12s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Fine luminous trail */}
                <path
                  d={ORBIT_BACK}
                  pathLength="100"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="18 82"
                  opacity="0.55"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="18;-82"
                    dur="12s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            </g>
          </svg>

          {/* PORTRAIT */}
          <div className="absolute left-[45%] -top-[8%] z-20 h-[108%] w-full -translate-x-1/2 [mask-image:linear-gradient(to_bottom,black_97%,transparent_100%)]">
            <Image
              src="/images/hero-profile.png"
              alt="Founder portrait"
              title="Founder portrait"
              fill
              priority
              sizes="100vw"
              className="object-cover object-top drop-shadow-[0_0_28px_var(--hero-glow)]"
            />
          </div>

          {/* ===================== FRONT SVG ===================== */}
          <svg
            aria-hidden="true"
            role="presentation"
            focusable="false"
            viewBox="0 0 820 730"
            fill="none"
            className="pointer-events-none absolute inset-0 z-30 size-full overflow-visible"
          >
            <defs>
              <linearGradient
                id="hv-orbit-spectrum-front"
                gradientUnits="userSpaceOnUse"
                x1="-318"
                y1="0"
                x2="318"
                y2="0"
              >
                <stop offset="0" stopColor="#20E3D5" />
                <stop offset="0.2" stopColor="#18A9E8" />
                <stop offset="0.42" stopColor="#4D5FEA" />
                <stop offset="0.62" stopColor="#F27A6A" />
                <stop offset="0.82" stopColor="#9C5DE8" />
                <stop offset="1" stopColor="#C778F2" />
              </linearGradient>

              {/* FRONT TRAIL — auto color change */}
              <linearGradient
                id="hv-orbit-trail-front"
                gradientUnits="userSpaceOnUse"
                x1="-318"
                y1="0"
                x2="318"
                y2="0"
              >
                <stop offset="0">
                  <animate
                    attributeName="stop-color"
                    values="#6FFFF3;#2ED4FF;#687CFF;#FF8B70;#B56CFF;#D69AFF;#6FFFF3"
                    dur="60s"
                    keyTimes="0;0.1667;0.3333;0.5;0.6667;0.8333;0.9999"
                    calcMode="discrete"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="0.5">
                  <animate
                    attributeName="stop-color"
                    values="#2ED4FF;#687CFF;#FF8B70;#B56CFF;#D69AFF;#6FFFF3;#2ED4FF"
                    dur="60s"
                    keyTimes="0;0.1667;0.3333;0.5;0.6667;0.8333;0.9999"
                    calcMode="discrete"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="1">
                  <animate
                    attributeName="stop-color"
                    values="#687CFF;#FF8B70;#B56CFF;#D69AFF;#6FFFF3;#2ED4FF;#687CFF"
                    dur="60s"
                    keyTimes="0;0.1667;0.3333;0.5;0.6667;0.8333;0.9999"
                    calcMode="discrete"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>

              <filter id="hv-orbit-front-outer" x="-30%" y="-100%" width="160%" height="300%">
                <feGaussianBlur stdDeviation="13" />
              </filter>
              <filter id="hv-orbit-front-glow" x="-20%" y="-80%" width="140%" height="260%">
                <feGaussianBlur stdDeviation="4.5" />
              </filter>
            </defs>

            <g transform="translate(410 365) scale(1.5) translate(-410 -365)">
              <g transform="translate(412 475) rotate(-15)">
                <path
                  d={ORBIT_FRONT}
                  stroke="url(#hv-orbit-spectrum-front)"
                  strokeWidth="18"
                  strokeLinecap="round"
                  opacity="0.11"
                  filter="url(#hv-orbit-front-outer)"
                />
                <path
                  d={ORBIT_FRONT}
                  stroke="url(#hv-orbit-spectrum-front)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.25"
                  filter="url(#hv-orbit-front-glow)"
                />
                <path
                  d={ORBIT_FRONT}
                  stroke="url(#hv-orbit-spectrum-front)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  opacity="0.95"
                />
                <path
                  d={ORBIT_FRONT}
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  opacity="0.3"
                />

                {/* Moving color trail — front */}
                <path
                  d={ORBIT_FRONT}
                  pathLength="100"
                  stroke="url(#hv-orbit-trail-front)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="34 66"
                  strokeDashoffset="34"
                  opacity="0.98"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="34;-66"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Soft color trail */}
                <path
                  d={ORBIT_FRONT}
                  pathLength="100"
                  stroke="url(#hv-orbit-trail-front)"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray="24 76"
                  opacity="0.22"
                  filter="url(#hv-orbit-front-glow)"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="24;-76"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Thin white reflection */}
                <path
                  d={ORBIT_FRONT}
                  pathLength="100"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeDasharray="18 82"
                  opacity="0.55"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="18;-82"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* NO BLACK HOLE HERE */}

                {/* Micro sparkles */}
                <circle cx="-238" cy="72" r="1.5" fill="#ffffff" opacity="0.58" />
                <circle cx="-92" cy="116" r="1.1" fill="#20E3D5" opacity="0.65" />
                <circle cx="72" cy="119" r="1.35" fill="#ffffff" opacity="0.65" />
                <circle cx="205" cy="84" r="1.05" fill="#C778F2" opacity="0.58" />
              </g>
            </g>
          </svg>

          {/* FLOATING STAT CARDS */}
          <FloatCard className="left-[1%] top-[18.5%]">
            <IconBubble className="bg-[linear-gradient(145deg,#4a4fd6,#312e9f)]">
              <Trophy className="size-[46%]" />
            </IconBubble>
            <StatText value={formatStat(STATS.years)} label={STATS.years.label} />
          </FloatCard>

          <FloatCard className="right-[2%] top-[35.5%]" delayed>
            <IconBubble className="bg-[linear-gradient(145deg,#22c793,#0fa172)]">
              <LineChart className="size-[46%]" />
            </IconBubble>
            <StatText value={formatStat(STATS.projects)} label={STATS.projects.label} />
          </FloatCard>

          <FloatCard className="left-[3%] top-[66%]">
            <IconBubble className="bg-[linear-gradient(145deg,#ffc22e,#f5a300)]">
              <Star className="size-[46%] fill-current" />
            </IconBubble>
            <StatText value={formatStat(STATS.rating)} label={STATS.rating.label} />
          </FloatCard>
        </Reveal>
      </Container>
    </section>
  );
}

/* DOT GRID */
function Dots({
  x,
  y,
  cols,
  rows,
  gap = 19,
  r = 2.3,
  color,
  fx,
  fy,
  flipY = false,
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  gap?: number;
  r?: number;
  color: string;
  fx: number;
  fy: number;
  flipY?: boolean;
}) {
  const dots: ReactNode[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const opacity = Math.max(
        0.12,
        1 - fx * (cols - 1 - j) - fy * (flipY ? rows - 1 - i : i),
      );
      dots.push(
        <circle
          key={`${i}-${j}`}
          cx={x + j * gap}
          cy={y + i * gap}
          r={r}
          opacity={opacity}
        />,
      );
    }
  }
  return <g fill={color}>{dots}</g>;
}

/* FLOATING CARD */
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
    <div className={cn("absolute z-40 hidden sm:block", className)}>
      <div
        style={{
          gap: "1.9cqw",
          padding: "1.7cqw 3.4cqw 1.7cqw 2.4cqw",
          borderRadius: "3.4cqw",
        }}
        className={cn(
          "flex items-center",
          "bg-white/85 dark:bg-slate-950/72",
          "ring-1 ring-white/90 dark:ring-white/10",
          "backdrop-blur-xl",
          "shadow-[0_22px_50px_-16px_rgba(79,92,180,0.3)]",
          "dark:shadow-[0_22px_55px_-16px_rgba(0,0,0,0.65)]",
          delayed ? "animate-float-delayed" : "animate-float",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ICON BUBBLE */
function IconBubble({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      style={{
        width: "6.3cqw",
        height: "6.3cqw",
        minWidth: 34,
        minHeight: 34,
      }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        "text-white",
        "shadow-[0_8px_18px_-6px_rgba(0,0,0,0.35)]",
        "ring-1 ring-white/20",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* STAT TEXT */
function StatText({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p
        style={{ fontSize: "clamp(1.05rem, 3.3cqw, 1.9rem)" }}
        className="font-serif font-bold leading-none tracking-tight text-[#131a3d] dark:text-white"
      >
        {value}
      </p>
      <p
        style={{ fontSize: "clamp(0.65rem, 1.6cqw, 0.9rem)" }}
        className="mt-[0.5cqw] whitespace-nowrap text-slate-500 dark:text-slate-400"
      >
        {label}
      </p>
    </div>
  );
}
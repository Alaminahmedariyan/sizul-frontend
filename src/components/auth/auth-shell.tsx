import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { RankingShowcase } from "./ranking-showcase";

// Change this once and the panel, the mobile header and the footer update.
const BRAND_NAME = "Sizul";

const NOISE = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

function BrandMark({ tone }: { tone: "light" | "dark" }) {
  const onPanel = tone === "light";

  return (
    <span className="flex items-center gap-2.5">
      <span
        className={
          onPanel
            ? "flex size-9 items-center justify-center rounded-[10px] bg-[#F5B544] text-base font-semibold text-[#11123B]"
            : "flex size-9 items-center justify-center rounded-[10px] bg-[#11123B] text-base font-semibold text-[#F5B544] ring-1 ring-border"
        }
      >
        {BRAND_NAME.charAt(0)}
      </span>
      <span
        className={
          onPanel
            ? "text-lg font-semibold tracking-tight text-white"
            : "text-lg font-semibold tracking-tight text-foreground"
        }
      >
        {BRAND_NAME}
      </span>
    </span>
  );
}

type AuthShellProps = {
  title: string;
  description: string;
  alternate: { prompt: string; label: string; href: string };
  children: ReactNode;
};

export function AuthShell({
  title,
  description,
  alternate,
  children,
}: AuthShellProps) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel — desktop only */}
      <aside className="relative isolate hidden flex-col justify-between gap-12 overflow-hidden bg-[#11123B] p-12 text-[#F5F6FF] lg:flex xl:p-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_55%_at_85%_0%,rgba(99,102,241,0.5),transparent_70%),radial-gradient(45%_40%_at_0%_100%,rgba(245,181,68,0.14),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: NOISE }}
        />

        <Link
          href="/"
          className="w-fit"
          aria-label={`${BRAND_NAME} home`}
        >
          <BrandMark tone="light" />
        </Link>

        <div>
          <h2 className="max-w-md text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] xl:text-[2.5rem]">
            Watch your business climb the rankings.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/60">
            Reports, project updates and the work we are doing for you, in one
            place.
          </p>

          <div className="mt-10 max-w-md">
            <RankingShowcase />
          </div>
        </div>

        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} {BRAND_NAME}
        </p>
      </aside>

      {/* Form side */}
      <div className="flex flex-col px-6 py-6 sm:px-10">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="lg:hidden"
            aria-label={`${BRAND_NAME} home`}
          >
            <BrandMark tone="dark" />
          </Link>
          <Link
            href="/"
            className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
          >
            <ArrowLeft className="size-4" />
            Back to website
          </Link>

          <p className="text-sm text-muted-foreground">
            <span className="hidden sm:inline">{alternate.prompt} </span>
            <Link
              href={alternate.href}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {alternate.label}
            </Link>
          </p>
        </header>

        <div className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-[400px]">
            <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              {description}
            </p>

            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      {label}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
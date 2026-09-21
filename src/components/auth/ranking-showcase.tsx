"use client";

import { Globe, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ROW_HEIGHT = 88;
const ROW_GAP = 8;
const STEP = ROW_HEIGHT + ROW_GAP;
const LIST_HEIGHT = ROW_HEIGHT * 3 + ROW_GAP * 2;

const ROW_BASE =
  "absolute inset-x-0 top-0 rounded-xl p-3.5 transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

function SkeletonRow({ position, delay }: { position: number; delay: number }) {
  return (
    <div
      className={cn(ROW_BASE, "bg-white/[0.03] ring-1 ring-white/[0.06]")}
      style={{
        height: ROW_HEIGHT,
        transform: `translateY(${position * STEP}px)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="size-5 rounded-full bg-white/10" />
        <span className="h-2 w-1/3 rounded bg-white/10" />
      </div>
      <span className="mt-3 block h-3 w-3/4 rounded bg-white/[0.16]" />
      <span className="mt-2.5 block h-2 w-11/12 rounded bg-white/[0.08]" />
      <span className="mt-1.5 block h-2 w-2/3 rounded bg-white/[0.08]" />
    </div>
  );
}

// Decorative only: a search result that climbs from #3 to #1 once on load.
export function RankingShowcase() {
  // 0 = waiting, 1 = moving, 2 = landed on top
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage(2);
      return;
    }
    const start = window.setTimeout(() => setStage(1), 1100);
    const land = window.setTimeout(() => setStage(2), 2000);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(land);
    };
  }, []);

  const moved = stage >= 1;
  const landed = stage >= 2;

  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur"
    >
      <div className="flex h-11 items-center gap-2.5 rounded-full bg-white/[0.06] px-4 text-sm text-white/70 ring-1 ring-white/10">
        <Search className="size-4 text-white/50" />
        <span>best web design and SEO agency</span>
      </div>

      <div className="relative mt-4" style={{ height: LIST_HEIGHT }}>
        <SkeletonRow position={moved ? 1 : 0} delay={moved ? 60 : 0} />
        <SkeletonRow position={moved ? 2 : 1} delay={moved ? 120 : 0} />

        <div
          className={cn(
            ROW_BASE,
            "z-10 bg-white/[0.07] ring-1 ring-white/15 transition-[transform,box-shadow,background-color] duration-[1100ms]",
            landed &&
              "bg-white/[0.1] shadow-[0_0_0_1px_rgba(245,181,68,0.5),0_18px_40px_-18px_rgba(245,181,68,0.35)]",
          )}
          style={{
            height: ROW_HEIGHT,
            transform: `translateY(${(moved ? 0 : 2) * STEP}px)`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded-full bg-[#F5B544] text-[#11123B]">
              <Globe className="size-3" />
            </span>
            <span className="text-[11px] text-white/50">
              yourbusiness.com › services
            </span>
          </div>
          <p className="mt-2 text-[15px] font-medium leading-snug text-[#A5B4FC]">
            Web design and SEO that brings customers in
          </p>
          <p className="mt-1 line-clamp-1 text-xs text-white/55">
            Fast, search-optimised websites built to rank and convert.
          </p>

          <span
            className={cn(
              "absolute right-3.5 top-3.5 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors duration-500",
              landed ? "bg-[#F5B544] text-[#11123B]" : "bg-white/10 text-white/70",
            )}
          >
            #{landed ? 1 : 3}
          </span>
        </div>
      </div>
    </div>
  );
}
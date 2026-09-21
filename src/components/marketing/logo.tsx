import Link from "next/link";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showName = true,
}: {
  className?: string;
  showName?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} home`}
      className={cn("flex shrink-0 items-center gap-2.5", className)}
    >
      <span className="relative flex size-8 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-[var(--shadow-primary)]">
        <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/30 to-transparent" />
        <span className="relative">{SITE.name.charAt(0)}</span>
      </span>
      {showName && (
        <span className="text-[15px] font-semibold tracking-tight">
          {SITE.name}
        </span>
      )}
    </Link>
  );
}

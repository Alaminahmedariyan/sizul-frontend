import Image from "next/image";
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
      <Image
        src="/logo.png"
        alt={`${SITE.name} logo`}
        width={32}
        height={32}
        priority
        className="size-8 rounded-xl object-contain"
      />

      {showName && (
        <span className="text-[15px] font-semibold tracking-tight">
          {SITE.name}
        </span>
      )}
    </Link>
  );
}
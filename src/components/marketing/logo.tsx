import Image from "next/image";
import Link from "next/link";

import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({
  className,
}: {
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} home`}
      className={cn(
        "group relative flex shrink-0 items-center",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt={`${SITE.name} logo`}
        width={80}
        height={80}
        priority
        className={cn(
          "relative h-12 w-auto object-contain",
          "drop-shadow-[0_0_3px_rgba(59,130,246,0.95)]",
          "drop-shadow-[0_0_8px_rgba(59,130,246,0.65)]",
          "transition-all duration-300",
          "group-hover:drop-shadow-[0_0_4px_rgba(96,165,250,1)]",
          "group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.85)]",
        )}
      />
    </Link>
  );
}
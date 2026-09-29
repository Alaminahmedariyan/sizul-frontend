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
      <span className="relative block h-12 w-[96px]">
        <Image
          src="/logo-without-a.png"
          alt={`${SITE.name} logo`}
          width={1774}
          height={887}
          priority
          className="absolute inset-0 h-full w-full object-contain"
        />

        <Image
          src="/logo-a.png"
          alt=""
          aria-hidden="true"
          width={1774}
          height={887}
          priority
          className="logo-a-color absolute inset-0 h-full w-full object-contain"
        />
      </span>
    </Link>
  );
}

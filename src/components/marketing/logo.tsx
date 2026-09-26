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
      className={cn("flex shrink-0 items-center", className)}
    >
      <Image
        src="/logo.png"
        alt={`${SITE.name} logo`}
        width={60}
        height={60}
        priority
        className="h-12 w-auto object-contain"
      />
    </Link>
  );
}
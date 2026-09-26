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
      <span className="absolute -inset-3 rounded-full bg-blue-500/20 blur-xl transition-all duration-300 group-hover:bg-blue-400/35 group-hover:blur-2xl" />

      <Image
        src="/logo.png"
        alt={`${SITE.name} logo`}
        width={80}
        height={80}
        priority
        className="relative h-12 w-auto object-contain drop-shadow-[0_0_6px_rgba(59,130,246,0.9)] drop-shadow-[0_0_18px_rgba(37,99,235,0.55)] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,1)] group-hover:drop-shadow-[0_0_24px_rgba(59,130,246,0.75)]"
      />
    </Link>
  );
}
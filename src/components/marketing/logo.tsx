import Image from "next/image";
import Link from "next/link";

import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

import styles from "./logo.module.css";

export function Logo({
  className,
}: {
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} home`}
      className={cn("group relative flex shrink-0 items-center", className)}
    >
      <span className="relative block h-auto w-[104px] overflow-visible">
        <Image
          src="/logo-without-a-navbar.png"
          alt={`${SITE.name} logo`}
          width={1740}
          height={832}
          priority
          className="block h-auto w-full object-contain dark:hidden"
        />

        <Image
          src="/logo-without-a-navbar-dark.png"
          alt=""
          aria-hidden="true"
          width={1740}
          height={832}
          priority
          className="hidden h-auto w-full object-contain dark:block"
        />

        <span
          aria-hidden="true"
          className={styles.logoAAnimated}
        />
      </span>
    </Link>
  );
}
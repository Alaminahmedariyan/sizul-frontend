import Image from "next/image";
import Link from "next/link";
import { TRUSTED_LOGOS, type TrustedLogo } from "@/lib/site";

import { Container } from "./section";

type MarqueeItem = TrustedLogo & { id: string; duplicate: boolean };

const CARD =
  "group/card flex h-16 min-w-44 items-center justify-center rounded-xl border border-border bg-card px-8 outline-none transition-[border-color,box-shadow,transform] duration-300 hover:border-primary/70 hover:shadow-[0_0_24px_-6px_color-mix(in_oklab,var(--primary)_50%,transparent)] focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] active:border-primary";

// "/case-studies/acme" is an internal page; "https://acme.com" is external.
function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

function LogoContent({ item }: { item: MarqueeItem }) {
  if (item.logo) {
    return (
      <Image
        src={item.logo}
        alt={item.duplicate ? "" : item.name}
        width={120}
        height={32}
        unoptimized
        className="h-8 w-auto object-contain opacity-70 grayscale transition duration-300 group-hover/card:opacity-100 group-hover/card:grayscale-0"
      />
    );
  }

  return (
    <span className="text-lg font-semibold tracking-tight text-muted-foreground transition-colors duration-300 group-hover/card:text-foreground">
      {item.name}
    </span>
  );
}

function LogoCard({ item }: { item: MarqueeItem }) {
  if (!item.href) {
    return (
      <div className={CARD}>
        <LogoContent item={item} />
      </div>
    );
  }

  // Duplicates only exist for the looping animation, so keep them out of the
  // keyboard tab order.
  const tabIndex = item.duplicate ? -1 : undefined;

  if (isInternal(item.href)) {
    return (
      <Link
        href={item.href}
        aria-label={item.name}
        tabIndex={tabIndex}
        className={CARD}
      >
        <LogoContent item={item} />
      </Link>
    );
  }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.name}
      tabIndex={tabIndex}
      className={CARD}
    >
      <LogoContent item={item} />
    </a>
  );
}

// Same look as trusted-by.tsx but the glow does not follow the pointer:
// the whole border lights up on hover, press and keyboard focus.
export function TrustedBy() {
  const items: MarqueeItem[] = [
    ...TRUSTED_LOGOS.map((logo) => ({
      ...logo,
      id: `primary-${logo.name}`,
      duplicate: false,
    })),
    ...TRUSTED_LOGOS.map((logo) => ({
      ...logo,
      id: `duplicate-${logo.name}`,
      duplicate: true,
    })),
  ];

  return (
    <section aria-label="Trusted by" className="pb-16 md:pb-20">
      <Container>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Trusted by growing businesses
        </p>

        {/* Vertical padding leaves room for the glow so it is not clipped. */}
        <div className="marquee group/marquee py-4">
          <div className="marquee-track group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]">
            {items.map((item) => (
              <div
                key={item.id}
                aria-hidden={item.duplicate}
                className="mr-4 shrink-0"
              >
                <LogoCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
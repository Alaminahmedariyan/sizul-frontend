import Image from "next/image";
import Link from "next/link";
import { GlowCard } from "@/components/shared/glow-card";
import { TRUSTED_LOGOS, type TrustedLogo } from "@/lib/site";

import { Container } from "./section";

type MarqueeItem = TrustedLogo & { id: string; duplicate: boolean };

const CARD_BODY =
  "flex h-16 min-w-44 items-center justify-center rounded-[11px] px-8 outline-none focus-visible:ring-2 focus-visible:ring-ring";

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
        className="h-8 w-auto object-contain opacity-70 grayscale transition duration-300 group-hover/glow:opacity-100 group-hover/glow:grayscale-0"
      />
    );
  }

  return (
    <span className="text-lg font-semibold tracking-tight text-muted-foreground transition-colors duration-300 group-hover/glow:text-foreground">
      {item.name}
    </span>
  );
}

function LogoCardBody({ item }: { item: MarqueeItem }) {
  if (!item.href) {
    return (
      <div className={CARD_BODY}>
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
        className={CARD_BODY}
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
      className={CARD_BODY}
    >
      <LogoContent item={item} />
    </a>
  );
}

// Swap the entries in lib/site.ts for real client logos, or remove
// <TrustedBy /> from the page until you have permission to show them.
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
              <GlowCard
                key={item.id}
                aria-hidden={item.duplicate}
                className="mr-4 shrink-0"
              >
                <LogoCardBody item={item} />
              </GlowCard>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
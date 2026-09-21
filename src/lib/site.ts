export const SITE = {
  name: "Sizul",
  tagline: "Full-service digital agency",
  description:
    "Sizul is a digital agency that helps businesses rank higher on search engines and turn visitors into customers with SEO, web design and performance work.",
  phone: "+880 1617-421998",
  phoneHref: "tel:+8801617421998",
  email: "hello@yourcompany.com",
  responseTime: "24 hours",
  availability: "Now booking new projects",
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export type SiteStat = {
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
};

// Single source of truth for every number shown on the marketing site.
// Replace with your real figures.
export const STATS = {
  projects: { value: 120, suffix: "+", label: "Projects delivered" },
  retention: { value: 98, suffix: "%", label: "Client retention" },
  rating: { value: 4.9, suffix: "/5", decimals: 1, label: "Average rating" },
  years: { value: 6, suffix: "+", label: "Years in business" },
} satisfies Record<string, SiteStat>;

export const STAT_LIST: SiteStat[] = [
  STATS.projects,
  STATS.retention,
  STATS.rating,
  STATS.years,
];

export function formatStat(stat: SiteStat) {
  return `${stat.value.toFixed(stat.decimals ?? 0)}${stat.suffix}`;
}

export type TrustedLogo = {
  name: string;
  logo?: string; // path under /public, e.g. "/logos/acme.svg"
  href?: string; // optional link to the client's site
};

// Text placeholders. Add `logo` (and optionally `href`) once you have real
// client logos and permission to show them.
export const TRUSTED_LOGOS: TrustedLogo[] = [
  { name: "Acme Co" },
  { name: "Northwind" },
  { name: "Globex" },
  { name: "Initech" },
  { name: "Umbrella" },
  { name: "Hooli" },
  { name: "Stark Labs" },
];
import { type LucideIcon, Mail, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { getServices } from "@/lib/api/services";
import { SITE } from "@/lib/site";

import { FooterStage } from "./footer-stage";
import { Logo } from "./logo";
import { Container } from "./section";

type ServiceList = Awaited<ReturnType<typeof getServices>>["data"];

function FooterColumn({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm font-medium">{title}</p>
      <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
        {children}
      </ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="inline-block transition-all duration-300 hover:translate-x-0.5 hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}

function ContactLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-3 transition-colors hover:text-foreground"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-4" />
      </span>
      {children}
    </a>
  );
}

export async function Footer() {
  let services: ServiceList = [];

  try {
    const res = await getServices();
    services = res.data.slice(0, 5);
  } catch {
    services = [];
  }

  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      {/* Animated colour-burst stage with the palette button */}
      <FooterStage />

      <Container className="relative grid grid-cols-2 gap-x-6 gap-y-12 pt-16 md:grid-cols-12">
        <div className="col-span-2 md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {SITE.description}
          </p>
          <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground">
            <ContactLink href={SITE.phoneHref} icon={Phone}>
              {SITE.phone}
            </ContactLink>
            <ContactLink href={`mailto:${SITE.email}`} icon={Mail}>
              {SITE.email}
            </ContactLink>
          </div>
        </div>

        <FooterColumn title="Company" className="md:col-span-2 md:col-start-7">
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/portfolio">Portfolio</FooterLink>
          <FooterLink href="/case-studies">Case studies</FooterLink>
          <FooterLink href="/blog">Blog</FooterLink>
        </FooterColumn>

        <FooterColumn title="Services" className="md:col-span-2">
          {services.map((service) => (
            <FooterLink key={service.id} href={`/services/${service.slug}`}>
              {service.name}
            </FooterLink>
          ))}
          <FooterLink href="/services">All services</FooterLink>
        </FooterColumn>

        <FooterColumn title="Get in touch" className="md:col-span-2">
          <FooterLink href="/get-quote">Get a quote</FooterLink>
          <FooterLink href="/contact">Contact us</FooterLink>
        </FooterColumn>
      </Container>

      <div
        aria-hidden
        className="pointer-events-none mt-12 select-none overflow-hidden text-center"
      >
        <span className="text-ghost -mb-[0.16em] block text-[clamp(6rem,24vw,20rem)] font-semibold leading-[0.85] tracking-tighter">
          {SITE.name}
        </span>
      </div>

      <div className="relative border-t border-border bg-background/40 backdrop-blur-md">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>{SITE.tagline}</p>
        </Container>
      </div>
    </footer>
  );
}
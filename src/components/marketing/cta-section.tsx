import { Check } from "lucide-react";
import Link from "next/link";

import { SITE } from "@/lib/site";

import { Reveal } from "./motion";
import { Container } from "./section";

const ASSURANCES = [
  "No obligation",
  "Free first consultation",
  `Reply within ${SITE.responseTime}`,
];

export function CtaSection() {
  return (
    <section className="pb-24 md:pb-32">
      <Container>
        <Reveal>
          <div className="surface-inverse grain relative overflow-hidden rounded-[2rem] px-6 py-16 text-center md:px-16 md:py-24">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage:
                  "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
              }}
            />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white/85">
                <span className="signal-dot" />
                {SITE.availability}
              </span>

              <h2 className="mx-auto mt-7 max-w-2xl text-3xl font-semibold leading-[1.08] text-white md:text-5xl">
                Ready to grow your business online?
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base text-white/70 md:text-lg">
                Tell us what you are building. We will reply with clear next
                steps.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/get-quote"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-[oklch(0.25_0.1_262)] shadow-[0_12px_32px_-8px_oklch(0_0_0/50%)] transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
                >
                  Get a free quote
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-white/25 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
                >
                  Talk to our team
                </Link>
              </div>

              <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/60">
                {ASSURANCES.map((text) => (
                  <li key={text} className="inline-flex items-center gap-1.5">
                    <Check className="size-4 text-white/80" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

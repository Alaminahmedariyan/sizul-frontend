import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { getFaqs } from "@/lib/api/faqs";
import { SITE } from "@/lib/site";

import { Reveal } from "./motion";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

export async function FaqPreview() {
  let faqs: Awaited<ReturnType<typeof getFaqs>>["data"] = [];

  try {
    const res = await getFaqs();
    faqs = res.data.slice(0, 6);
  } catch {
    faqs = [];
  }

  if (faqs.length === 0) return null;

  return (
    <Section id="faq">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            title="Common questions"
            description="Quick answers to what clients ask us most."
            className="mb-8 md:mb-8"
          />

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
              <p className="font-medium">Still have a question?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask us directly. We reply within {SITE.responseTime}.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                Contact us
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-2xl border border-border bg-card px-6 transition-[border-color,box-shadow] duration-300 last:border-b data-[state=open]:border-primary/40 data-[state=open]:shadow-[var(--shadow-md)]"
              >
                <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}

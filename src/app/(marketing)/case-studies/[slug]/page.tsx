import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/marketing/motion";
import { Container } from "@/components/marketing/section";
import { SpotlightCard } from "@/components/marketing/spot-light-card";
import { getCaseStudyBySlug } from "@/lib/api/case-studies";

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let item: Awaited<ReturnType<typeof getCaseStudyBySlug>>["data"] | null =
    null;

  try {
    const res = await getCaseStudyBySlug(slug);
    item = res.data;
  } catch {
    notFound();
  }

  if (!item) notFound();

  // Challenge → Approach → Implementation is a real sequence, so it is numbered.
  const steps = [
    { title: "The Challenge", body: item.problem },
    { title: "Our Approach", body: item.strategy },
    { title: "Implementation", body: item.implementation },
  ].filter((step) => Boolean(step.body));

  return (
    <Container className="max-w-3xl py-20 md:py-28">
      <article>
        <Reveal immediate>
          <Link
            href="/case-studies"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All case studies
          </Link>

          {(item.industry || item.clientName) && (
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {item.industry && (
                <span className="brand-badge">{item.industry}</span>
              )}
              {item.clientName && <span>{item.clientName}</span>}
            </div>
          )}

          <h1 className="text-4xl font-semibold leading-[1.1] md:text-5xl">
            {item.title}
          </h1>
        </Reveal>

        {(steps.length > 0 || item.results) && (
          <Reveal className="mt-14">
            <ol>
              {steps.map((step, index) => {
                const isLast = index === steps.length - 1 && !item.results;

                return (
                  <li
                    key={step.title}
                    className={isLast ? "relative pl-16" : "relative pb-12 pl-16"}
                  >
                    <span className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-1 ring-primary/15">
                      {index + 1}
                    </span>

                    {!isLast && (
                      <span
                        aria-hidden
                        className="absolute bottom-2 left-5 top-12 w-px -translate-x-1/2 bg-border"
                      />
                    )}

                    <h2 className="pt-1.5 text-xl font-semibold">
                      {step.title}
                    </h2>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </li>
                );
              })}

              {item.results && (
                <li className="relative pl-16">
                  <span className="absolute left-0 top-7 z-10 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-(--shadow-primary)">
                    <TrendingUp className="size-5" />
                  </span>

                  <SpotlightCard variant="featured" className="p-8">
                    <h2 className="text-xl font-semibold">The Results</h2>
                    <p className="mt-3 text-lg leading-relaxed text-foreground/85">
                      {item.results}
                    </p>
                  </SpotlightCard>
                </li>
              )}
            </ol>
          </Reveal>
        )}
      </article>
    </Container>
  );
}
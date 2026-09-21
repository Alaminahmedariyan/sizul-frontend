import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal, Stagger, StaggerItem } from "@/components/marketing/motion";
import { Container } from "@/components/marketing/section";
import { SpotlightCard } from "@/components/marketing/spot-light-card";
import { getPortfolioBySlug } from "@/lib/api/portfolio";

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let item: Awaited<ReturnType<typeof getPortfolioBySlug>>["data"] | null =
    null;

  try {
    const res = await getPortfolioBySlug(slug);
    item = res.data;
  } catch {
    notFound();
  }

  if (!item) notFound();

  const meta = [
    { label: "Client", value: item.clientName },
    { label: "Industry", value: item.industry },
    { label: "Duration", value: item.duration },
  ].filter((entry) => Boolean(entry.value));

  return (
    <Container className="max-w-5xl py-20 md:py-28">
      <Reveal immediate>
        <Link
          href="/portfolio"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All projects
        </Link>

        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] md:text-5xl">
          {item.title}
        </h1>

        {meta.length > 0 && (
          <SpotlightCard variant="flat" className="mt-8">
            <dl className="flex flex-wrap gap-x-14 gap-y-5 p-6 md:p-8">
              {meta.map((entry) => (
                <div key={entry.label}>
                  <dt className="text-sm text-muted-foreground">
                    {entry.label}
                  </dt>
                  <dd className="mt-1 font-medium">{entry.value}</dd>
                </div>
              ))}
            </dl>
          </SpotlightCard>
        )}
      </Reveal>

      {item.coverImage && (
        <Reveal delay={0.1} className="mt-10">
          <div className="overflow-hidden rounded-3xl border border-border shadow-(--shadow-lg)">
            {/* biome-ignore lint/performance/noImgElement: image dimensions vary per portfolio item, next/image requires fixed width/height */}
            <img
              src={item.coverImage}
              alt={item.title}
              className="aspect-video w-full object-cover"
            />
          </div>
        </Reveal>
      )}

      {(item.description || item.websiteUrl) && (
        <Reveal className="mt-12">
          {item.description && (
            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          )}

          {item.websiteUrl && (
            <div className="mt-8">
              <a
                href={item.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-btn-primary"
              >
                Visit live site
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          )}
        </Reveal>
      )}

      {item.images.length > 0 && (
        <section className="mt-16">
          <Reveal>
            <h2 className="mb-6 text-2xl font-semibold">Gallery</h2>
          </Reveal>

          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {item.images.map((image) => (
              <StaggerItem key={image.id}>
                <div className="group overflow-hidden rounded-2xl border border-border shadow-(--shadow-sm) transition-shadow duration-500 hover:shadow-(--shadow-lg)">
                  {/* biome-ignore lint/performance/noImgElement: image dimensions vary per portfolio item, next/image requires fixed width/height */}
                  <img
                    src={image.url}
                    alt={image.altText ?? ""}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-(--ease-out) group-hover:scale-105"
                  />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}
    </Container>
  );
}
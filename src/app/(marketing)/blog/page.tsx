import { ArrowUpRight, CalendarDays } from "lucide-react";
import Link from "next/link";

import { Reveal, Stagger, StaggerItem } from "@/components/marketing/motion";
import { Container } from "@/components/marketing/section";
import { SpotlightCard } from "@/components/marketing/spot-light-card";
import { getBlogPosts } from "@/lib/api/blog";
import { cn } from "@/lib/utils";

function formatDate(value: string | number | Date) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getBlogPosts>>["data"] = [];

  try {
    const res = await getBlogPosts();
    posts = res.data;
  } catch (error) {
    console.error("Failed to load blog posts:", error);
    posts = [];
  }

  return (
    <Container className="max-w-5xl py-20 md:py-28">
      <Reveal
        immediate
        className="mx-auto mb-14 max-w-2xl text-center md:mb-16"
      >
        <h1 className="text-4xl font-semibold leading-[1.1] md:text-5xl">
          Blog
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          Insights on web development, SEO, and growth.
        </p>
      </Reveal>

      {posts.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No posts published yet. Check back soon.
        </div>
      )}

      <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {posts.map((post, index) => {
          const wide = index === 0;
          const tags = post.tags ?? [];

          return (
            <StaggerItem key={post.id} className={cn(wide && "md:col-span-2")}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block h-full rounded-3xl"
              >
                <SpotlightCard className="flex h-full flex-col p-8 md:p-9">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    {post.publishedAt && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-4" />
                        {formatDate(post.publishedAt)}
                      </span>
                    )}
                    {tags.slice(0, 3).map(({ tag }) => (
                      <span
                        key={tag.id}
                        className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <h2
                    className={cn(
                      "mt-5 font-semibold leading-snug",
                      wide ? "text-2xl md:text-3xl" : "text-xl",
                    )}
                  >
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p
                      className={cn(
                        "mt-3 text-sm leading-relaxed text-muted-foreground",
                        wide
                          ? "line-clamp-4 md:max-w-2xl md:text-base"
                          : "line-clamp-3",
                      )}
                    >
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-auto pt-8">
                    <div className="flex items-center justify-between border-t border-border pt-5 text-sm font-medium">
                      <span>Read article</span>
                      <span className="flex size-9 items-center justify-center rounded-full border border-border transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Container>
  );
}
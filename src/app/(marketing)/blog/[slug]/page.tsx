import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";

import { Reveal } from "@/components/marketing/motion";
import { Container } from "@/components/marketing/section";
import { getBlogPostBySlug } from "@/lib/api/blog";

function formatDate(value: string | number | Date) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof getBlogPostBySlug>>["data"] | null = null;

  try {
    const res = await getBlogPostBySlug(slug);
    post = res.data;
  } catch (error) {
    console.error("Failed to load blog post:", error);
    notFound();
  }

  if (!post) notFound();

  // Content is authored via Tiptap in the admin panel (HTML output). Sanitizing
  // here is defense-in-depth in case admin credentials are ever compromised or
  // the content field is edited directly in the database.
  const safeContentHtml = sanitizeHtml(post.content, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "blockquote",
      "h1",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "a",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
  });

  // Reading time from the plain text of the article (about 200 words a minute).
  const plainText = sanitizeHtml(post.content, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  // Tags may be missing depending on the endpoint, so fall back to an empty list
  const tags = post.tags ?? [];

  return (
    <Container className="max-w-3xl py-20 md:py-28">
      <article>
        <Reveal immediate>
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All articles
          </Link>

          {tags.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl font-semibold leading-[1.1] md:text-5xl">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {post.publishedAt && (
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" />
                <time dateTime={new Date(post.publishedAt).toISOString()}>
                  {formatDate(post.publishedAt)}
                </time>
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4" />
              {readingMinutes} min read
            </span>
          </div>
        </Reveal>

        {post.featuredImage && (
          <Reveal delay={0.1} className="mt-10">
            <div className="overflow-hidden rounded-3xl border border-border shadow-(--shadow-lg)">
              {/* biome-ignore lint/performance/noImgElement: featured image dimensions vary per post, next/image requires fixed width/height */}
              <img
                src={post.featuredImage}
                alt={post.title}
                className="aspect-video w-full object-cover"
              />
            </div>
          </Reveal>
        )}

        <div
          className="prose prose-neutral dark:prose-invert md:prose-lg mt-12 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-p:leading-relaxed prose-p:text-foreground/85 prose-li:text-foreground/85 prose-li:marker:text-primary prose-strong:text-foreground prose-a:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-primary/40 prose-blockquote:font-normal prose-blockquote:text-foreground/80 prose-img:rounded-2xl prose-img:border prose-img:border-border"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: content is sanitized above via sanitize-html
          dangerouslySetInnerHTML={{ __html: safeContentHtml }}
        />

        <div className="mt-16 border-t border-border pt-8">
          <Link href="/blog" className="brand-btn-secondary">
            <ArrowLeft className="size-4" />
            Back to all articles
          </Link>
        </div>
      </article>
    </Container>
  );
}
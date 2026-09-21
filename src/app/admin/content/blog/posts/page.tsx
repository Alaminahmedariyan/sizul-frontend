"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ContentTabs } from "@/components/admin/content-tabs";
import { type Column, DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useBlogPostsForManage, useCreateBlogPost } from "@/hooks/use-blog";

import type { BlogPost } from "@/lib/api/blog";

export default function BlogPostsPage() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useBlogPostsForManage();
  const createPost = useCreateBlogPost();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const posts = data?.data ?? [];

  const columns: Column<BlogPost>[] = [
    {
      header: "Title",
      cell: (p) => <span className="font-medium">{p.title}</span>,
    },
    { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    {
      header: "Published",
      cell: (p) =>
        p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "-",
    },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    createPost.mutate(
      { title, slug, content: "Start writing your post..." },
      {
        onSuccess: () => {
          setTitle("");
          setSlug("");
          toast.success("Draft created");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  if (isError)
    return <p className="text-destructive text-sm">{error?.message}</p>;

  return (
    <div>
      <PageHeader title="Blog Posts" />
      <ContentTabs />

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="max-w-xs"
        />
        <Input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="max-w-xs"
        />
        <Button type="submit" disabled={createPost.isPending}>
          Create draft
        </Button>
      </form>

      <DataTable
        columns={columns}
        data={posts}
        isLoading={isLoading}
        emptyMessage="No blog posts found."
        getRowKey={(p) => p.id}
        onRowClick={(p) => router.push(`/admin/content/blog/posts/${p.id}`)}
      />
    </div>
  );
}

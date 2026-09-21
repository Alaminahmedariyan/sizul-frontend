"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ContentTabs } from "@/components/admin/content-tabs";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  useBlogTags,
  useCreateBlogTag,
  useDeleteBlogTag,
} from "@/hooks/use-blog";

export default function BlogTagsPage() {
  const { data, isLoading } = useBlogTags();
  const createTag = useCreateBlogTag();
  const deleteTag = useDeleteBlogTag();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const tags = data?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    createTag.mutate(
      { name, slug },
      {
        onSuccess: () => {
          setName("");
          setSlug("");
          toast.success("Tag added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Blog Tags" />
      <ContentTabs />

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <Button type="submit" disabled={createTag.isPending}>
          Add tag
        </Button>
      </form>

      {isLoading && <p className="text-muted-foreground">Loading tags...</p>}
      {!isLoading && tags.length === 0 && <EmptyState title="No tags yet" />}

      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-2 border rounded-full px-3 py-1"
          >
            <span className="text-sm">{tag.name}</span>
            <ConfirmDeleteDialog
              trigger={
                <button
                  type="button"
                  className="text-muted-foreground hover:text-destructive text-xs"
                >
                  ✕
                </button>
              }
              onConfirm={() => deleteTag.mutate(tag.id)}
              isPending={deleteTag.isPending}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

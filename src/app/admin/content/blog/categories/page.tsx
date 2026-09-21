"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ContentTabs } from "@/components/admin/content-tabs";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import {
  useBlogCategories,
  useCreateBlogCategory,
  useDeleteBlogCategory,
  useUpdateBlogCategory,
} from "@/hooks/use-blog";

export default function BlogCategoriesPage() {
  const { data, isLoading } = useBlogCategories();
  const createCategory = useCreateBlogCategory();
  const updateCategory = useUpdateBlogCategory();
  const deleteCategory = useDeleteBlogCategory();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const categories = data?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    createCategory.mutate(
      { name, slug },
      {
        onSuccess: () => {
          setName("");
          setSlug("");
          toast.success("Category added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Blog Categories" />
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
        <Button type="submit" disabled={createCategory.isPending}>
          Add category
        </Button>
      </form>

      {isLoading && (
        <p className="text-muted-foreground">Loading categories...</p>
      )}
      {!isLoading && categories.length === 0 && (
        <EmptyState title="No categories yet" />
      )}

      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between border rounded-md p-3"
          >
            <span className="text-sm font-medium">{category.name}</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={category.isActive}
                  onCheckedChange={(checked) =>
                    updateCategory.mutate({
                      id: category.id,
                      payload: { isActive: !!checked },
                    })
                  }
                />
                <span className="text-xs">Active</span>
              </div>
              <ConfirmDeleteDialog
                trigger={
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                }
                onConfirm={() => deleteCategory.mutate(category.id)}
                isPending={deleteCategory.isPending}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

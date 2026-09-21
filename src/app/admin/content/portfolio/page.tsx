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

import {
  useCreatePortfolio,
  usePortfolioForManage,
} from "@/hooks/use-portfolio";

import type { Portfolio } from "@/lib/api/portfolio";

export default function ContentPortfolioPage() {
  const router = useRouter();
  const { data, isLoading, isError, error } = usePortfolioForManage();
  const createPortfolio = useCreatePortfolio();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const items = data?.data ?? [];

  const columns: Column<Portfolio>[] = [
    {
      header: "Title",
      cell: (i) => <span className="font-medium">{i.title}</span>,
    },
    { header: "Client", cell: (i) => i.clientName ?? "-" },
    { header: "Status", cell: (i) => <StatusBadge status={i.status} /> },
    { header: "Featured", cell: (i) => (i.isFeatured ? "Yes" : "No") },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    createPortfolio.mutate(
      { title, slug },
      {
        onSuccess: () => {
          setTitle("");
          setSlug("");
          toast.success("Portfolio item added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  if (isError)
    return <p className="text-destructive text-sm">{error?.message}</p>;

  return (
    <div>
      <PageHeader
        title="Portfolio"
        description="Showcase completed work on the public site"
      />
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
        <Button type="submit" disabled={createPortfolio.isPending}>
          Add
        </Button>
      </form>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyMessage="No portfolio items found."
        getRowKey={(i) => i.id}
        onRowClick={(i) => router.push(`/admin/content/portfolio/${i.id}`)}
      />
    </div>
  );
}

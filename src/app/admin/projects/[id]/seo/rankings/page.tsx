"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SeoTabs } from "@/components/admin/seo-tabs";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useCreateKeywordRanking,
  useDeleteKeywordRanking,
  useKeywordRankings,
} from "@/hooks/use-seo-keyword-rankings";

export default function SeoRankingsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useKeywordRankings(id);
  const createRanking = useCreateKeywordRanking(id);
  const deleteRanking = useDeleteKeywordRanking(id);

  const [keyword, setKeyword] = useState("");
  const [rank, setRank] = useState("");

  const rankings = data?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    createRanking.mutate(
      { keyword, rank: rank ? Number(rank) : undefined },
      {
        onSuccess: () => {
          setKeyword("");
          setRank("");
          toast.success("Keyword added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Keyword Rankings" />
      <SeoTabs projectId={id} />

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <Input
          placeholder="Keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          required
          className="max-w-xs"
        />
        <Input
          placeholder="Rank (optional)"
          type="number"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          className="w-32"
        />
        <Button type="submit" disabled={createRanking.isPending}>
          Add
        </Button>
      </form>

      {isLoading && (
        <p className="text-muted-foreground">Loading rankings...</p>
      )}
      {!isLoading && rankings.length === 0 && (
        <EmptyState title="No keywords tracked yet" />
      )}

      {!isLoading && rankings.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>Search Engine</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Current Rank</TableHead>
              <TableHead>Previous Rank</TableHead>
              <TableHead>Checked</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.keyword}</TableCell>
                <TableCell>{r.searchEngine}</TableCell>
                <TableCell>{r.device}</TableCell>
                <TableCell>{r.rank ?? "-"}</TableCell>
                <TableCell>{r.previousRank ?? "-"}</TableCell>
                <TableCell>
                  {new Date(r.checkedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <ConfirmDeleteDialog
                    trigger={
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
                    }
                    onConfirm={() => deleteRanking.mutate(r.id)}
                    isPending={deleteRanking.isPending}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useCreatePerformanceReport,
  useDeletePerformanceReport,
  usePerformanceReports,
} from "@/hooks/use-seo-performance-reports";

import type { RankingDevice } from "@/lib/api/seo-keyword-rankings";

export default function SeoPerformancePage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = usePerformanceReports(id);
  const createReport = useCreatePerformanceReport(id);
  const deleteReport = useDeletePerformanceReport(id);

  const [pageUrl, setPageUrl] = useState("");
  const [device, setDevice] = useState<RankingDevice>("MOBILE");
  const [performanceScore, setPerformanceScore] = useState("");
  const [seoScore, setSeoScore] = useState("");

  const reports = data?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageUrl.trim()) return;

    createReport.mutate(
      {
        pageUrl,
        device,
        performanceScore: performanceScore
          ? Number(performanceScore)
          : undefined,
        seoScore: seoScore ? Number(seoScore) : undefined,
      },
      {
        onSuccess: () => {
          setPageUrl("");
          setPerformanceScore("");
          setSeoScore("");
          toast.success("Report added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Performance Reports" />
      <SeoTabs projectId={id} />

      <form onSubmit={handleCreate} className="flex gap-2 mb-4 flex-wrap">
        <Input
          placeholder="Page URL"
          value={pageUrl}
          onChange={(e) => setPageUrl(e.target.value)}
          required
          className="flex-1 min-w-[200px]"
        />
        <Select
          value={device}
          onValueChange={(v) => setDevice(v as RankingDevice)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MOBILE">MOBILE</SelectItem>
            <SelectItem value="DESKTOP">DESKTOP</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Perf Score"
          type="number"
          value={performanceScore}
          onChange={(e) => setPerformanceScore(e.target.value)}
          className="w-28"
        />
        <Input
          placeholder="SEO Score"
          type="number"
          value={seoScore}
          onChange={(e) => setSeoScore(e.target.value)}
          className="w-28"
        />
        <Button type="submit" disabled={createReport.isPending}>
          Add
        </Button>
      </form>

      {isLoading && <p className="text-muted-foreground">Loading reports...</p>}
      {!isLoading && reports.length === 0 && (
        <EmptyState title="No performance reports yet" />
      )}

      {!isLoading && reports.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page URL</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>SEO Score</TableHead>
              <TableHead>Checked</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="max-w-xs truncate">{r.pageUrl}</TableCell>
                <TableCell>{r.device}</TableCell>
                <TableCell>{r.performanceScore ?? "-"}</TableCell>
                <TableCell>{r.seoScore ?? "-"}</TableCell>
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
                    onConfirm={() => deleteReport.mutate(r.id)}
                    isPending={deleteReport.isPending}
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

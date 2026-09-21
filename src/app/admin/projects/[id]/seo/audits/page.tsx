"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SeoTabs } from "@/components/admin/seo-tabs";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  useCreateSeoAudit,
  useDeleteSeoAudit,
  useSeoAudits,
} from "@/hooks/use-seo-audits";

export default function SeoAuditsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useSeoAudits(id);
  const createAudit = useCreateSeoAudit(id);
  const deleteAudit = useDeleteSeoAudit(id);

  const [title, setTitle] = useState("");
  const [score, setScore] = useState("");
  const [summary, setSummary] = useState("");

  const audits = data?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    createAudit.mutate(
      {
        title: title || undefined,
        score: score ? Number(score) : undefined,
        summary: summary || undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setScore("");
          setSummary("");
          toast.success("Audit recorded");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="SEO Audits" />
      <SeoTabs projectId={id} />

      <Card className="mb-4">
        <CardContent className="pt-6">
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Audit title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Score (0-100)"
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-32"
              />
            </div>
            <Textarea
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
            <Button type="submit" disabled={createAudit.isPending}>
              Record Audit
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && <p className="text-muted-foreground">Loading audits...</p>}
      {!isLoading && audits.length === 0 && (
        <EmptyState title="No audits recorded yet" />
      )}

      <div className="space-y-2">
        {audits.map((audit) => (
          <Card key={audit.id}>
            <CardContent className="pt-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-sm">
                  {audit.title ?? "Untitled Audit"}{" "}
                  {audit.score !== null && `— Score: ${audit.score}/100`}
                </p>
                {audit.summary && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {audit.summary}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(audit.auditDate).toLocaleDateString()}
                </p>
              </div>
              <ConfirmDeleteDialog
                trigger={
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                }
                onConfirm={() => deleteAudit.mutate(audit.id)}
                isPending={deleteAudit.isPending}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

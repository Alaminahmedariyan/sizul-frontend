"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import {
  useClient,
  useClientProjects,
  useClientProposals,
  useUpdateClient,
  useUpdateClientActiveStatus,
} from "@/hooks/use-clients";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: clientRes, isLoading } = useClient(id);
  const { data: projectsRes } = useClientProjects(id);
  const { data: proposalsRes } = useClientProposals(id);

  const updateClient = useUpdateClient(id);
  const updateActiveStatus = useUpdateClientActiveStatus(id);

  const [notes, setNotes] = useState("");

  if (isLoading)
    return <p className="text-muted-foreground">Loading client...</p>;

  const client = clientRes?.data;
  if (!client)
    return <p className="text-muted-foreground">Client not found.</p>;

  const projects = projectsRes?.data ?? [];
  const proposals = proposalsRes?.data ?? [];

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    updateClient.mutate(
      { notes },
      {
        onSuccess: () => toast.success("Notes saved"),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const handleActiveToggle = (checked: boolean) => {
    updateActiveStatus.mutate(checked, {
      onSuccess: () =>
        toast.success(checked ? "Client activated" : "Client deactivated"),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <PageHeader
        title={client.name}
        description={`${client.email} · ${client.phone ?? "No phone"}`}
        action={
          <div className="flex items-center gap-2">
            <Checkbox
              checked={client.isActive}
              onCheckedChange={handleActiveToggle}
              id="active-toggle"
            />
            <label htmlFor="active-toggle" className="text-sm">
              Active
            </label>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Company:</span>{" "}
              {client.company ?? "-"}
            </p>
            <p>
              <span className="text-muted-foreground">Website:</span>{" "}
              {client.website ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Internal Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveNotes} className="space-y-2">
              <Textarea
                defaultValue={client.notes ?? ""}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button type="submit" size="sm" disabled={updateClient.isPending}>
                Save notes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Projects ({projects.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            )}
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="text-sm hover:underline"
                >
                  {project.name}
                </Link>
                <StatusBadge status={project.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proposals ({proposals.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {proposals.length === 0 && (
              <p className="text-sm text-muted-foreground">No proposals yet.</p>
            )}
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <Link
                  href={`/admin/proposals/${proposal.id}`}
                  className="text-sm hover:underline"
                >
                  {proposal.title}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {proposal.total} {proposal.currency}
                  </span>
                  <StatusBadge status={proposal.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

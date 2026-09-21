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
  useCreateServiceArea,
  useDeleteServiceArea,
  usePublishServiceArea,
  useServiceAreas,
} from "@/hooks/use-seo-service-areas";

export default function SeoServiceAreasPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useServiceAreas(id);
  const createArea = useCreateServiceArea(id);
  const publishArea = usePublishServiceArea(id);
  const deleteArea = useDeleteServiceArea(id);

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [slug, setSlug] = useState("");

  const areas = data?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !slug.trim()) return;

    createArea.mutate(
      { city, state: state || undefined, slug },
      {
        onSuccess: () => {
          setCity("");
          setState("");
          setSlug("");
          toast.success("Service area added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Service Areas" />
      <SeoTabs projectId={id} />

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <Input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="max-w-[150px]"
        />
        <Input
          placeholder="State (optional)"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="max-w-[150px]"
        />
        <Input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="max-w-[150px]"
        />
        <Button type="submit" disabled={createArea.isPending}>
          Add
        </Button>
      </form>

      {isLoading && (
        <p className="text-muted-foreground">Loading service areas...</p>
      )}
      {!isLoading && areas.length === 0 && (
        <EmptyState title="No service areas yet" />
      )}

      {!isLoading && areas.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Page URL</TableHead>
              <TableHead>Published</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.map((area) => (
              <TableRow key={area.id}>
                <TableCell className="font-medium">{area.city}</TableCell>
                <TableCell>{area.state ?? "-"}</TableCell>
                <TableCell>{area.pageUrl ?? "-"}</TableCell>
                <TableCell>
                  {area.publishedAt ? (
                    new Date(area.publishedAt).toLocaleDateString()
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={publishArea.isPending}
                      onClick={() =>
                        publishArea.mutate(area.id, {
                          onSuccess: () => toast.success("Published"),
                        })
                      }
                    >
                      Publish
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <ConfirmDeleteDialog
                    trigger={
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
                    }
                    onConfirm={() => deleteArea.mutate(area.id)}
                    isPending={deleteArea.isPending}
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

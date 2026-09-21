"use client";

import { Gift } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorAlert } from "@/components/shared/error-alert";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  useAppreciations,
  useCreateAppreciation,
  useDeleteAppreciation,
} from "@/hooks/use-client-appreciations";
import { useClients } from "@/hooks/use-clients";

import type { AppreciationType } from "@/lib/api/client-appreciations";

const TYPE_OPTIONS: AppreciationType[] = [
  "THANK_YOU_NOTE",
  "GIFT",
  "REFERRAL",
  "BONUS",
  "TESTIMONIAL",
  "OTHER",
];

export default function AppreciationsPage() {
  const { data, isLoading, isError, error } = useAppreciations();
  const { data: clientsRes } = useClients({ limit: 100 });
  const createAppreciation = useCreateAppreciation();
  const deleteAppreciation = useDeleteAppreciation();

  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [type, setType] = useState<AppreciationType>("THANK_YOU_NOTE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const appreciations = data?.data ?? [];
  const clients = clientsRes?.data ?? [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    createAppreciation.mutate(
      {
        clientId,
        type,
        title: title || undefined,
        description: description || undefined,
      },
      {
        onSuccess: () => {
          setClientId("");
          setTitle("");
          setDescription("");
          setOpen(false);
          toast.success("Appreciation recorded");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  if (isError) return <ErrorAlert message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Client Appreciations"
        description="Track thank-you notes, referrals, and gifts from clients"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Record Appreciation</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Appreciation</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <Label>Client</Label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Type</Label>
                  <Select
                    value={type}
                    onValueChange={(v) => setType(v as AppreciationType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Title (optional)</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createAppreciation.isPending || !clientId}
                  >
                    {createAppreciation.isPending ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading && (
        <p className="text-muted-foreground">Loading appreciations...</p>
      )}
      {!isLoading && appreciations.length === 0 && (
        <EmptyState icon={Gift} title="No appreciations recorded yet" />
      )}

      <div className="space-y-2">
        {appreciations.map((a) => (
          <Card key={a.id}>
            <CardContent className="pt-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-sm">
                  {a.title ?? a.type.replace(/_/g, " ")}{" "}
                  <span className="text-xs text-muted-foreground">
                    · {a.type.replace(/_/g, " ")}
                  </span>
                </p>
                {a.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {a.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(a.receivedAt).toLocaleDateString()}
                </p>
              </div>
              <ConfirmDeleteDialog
                trigger={
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                }
                onConfirm={() => deleteAppreciation.mutate(a.id)}
                isPending={deleteAppreciation.isPending}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

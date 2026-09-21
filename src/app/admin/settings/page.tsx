"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  useDeleteSiteSetting,
  useSiteSettings,
  useUpsertSiteSetting,
} from "@/hooks/use-site-settings";

export default function SiteSettingsPage() {
  const { data, isLoading } = useSiteSettings();
  const upsertSetting = useUpsertSiteSetting();
  const deleteSetting = useDeleteSiteSetting();

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");

  const settings = data?.data ?? [];

  const handleUpsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim()) return;

    upsertSetting.mutate(
      { key, value, description: description || undefined },
      {
        onSuccess: () => {
          setKey("");
          setValue("");
          setDescription("");
          toast.success("Setting saved");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader
        title="Site Settings"
        description="Key-value configuration for the public site"
      />

      <form onSubmit={handleUpsert} className="flex gap-2 mb-4">
        <Input
          placeholder="Key (e.g. contact_email)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
          className="max-w-[220px]"
        />
        <Input
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          className="flex-1"
        />
        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit" disabled={upsertSetting.isPending}>
          Save
        </Button>
      </form>

      {isLoading && (
        <p className="text-muted-foreground">Loading settings...</p>
      )}
      {!isLoading && settings.length === 0 && (
        <EmptyState title="No settings configured" />
      )}

      <div className="space-y-2">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between border rounded-md p-3"
          >
            <div>
              <p className="text-sm font-mono font-medium">{setting.key}</p>
              <p className="text-sm text-muted-foreground">{setting.value}</p>
              {setting.description && (
                <p className="text-xs text-muted-foreground">
                  {setting.description}
                </p>
              )}
            </div>
            <ConfirmDeleteDialog
              trigger={
                <Button variant="ghost" size="icon">
                  <Trash2 className="size-4" />
                </Button>
              }
              onConfirm={() => deleteSetting.mutate(setting.key)}
              isPending={deleteSetting.isPending}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

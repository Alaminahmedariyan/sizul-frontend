"use client";

import { FileIcon, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ProjectTabs } from "@/components/admin/project-tabs";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  useDeleteProjectFile,
  useProjectFiles,
  useUploadProjectFile,
} from "@/hooks/use-project-files";

export default function ProjectFilesPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useProjectFiles(id);
  const uploadFile = useUploadProjectFile(id);
  const deleteFile = useDeleteProjectFile(id);

  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const files = data?.data ?? [];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    uploadFile.mutate(
      { file, description: description || undefined },
      {
        onSuccess: () => {
          setDescription("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          toast.success("File uploaded");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Files" />
      <ProjectTabs projectId={id} />

      <form onSubmit={handleUpload} className="flex gap-2 mb-4">
        <Input ref={fileInputRef} type="file" required className="max-w-xs" />
        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit" disabled={uploadFile.isPending}>
          <Upload className="size-4" />
          {uploadFile.isPending ? "Uploading..." : "Upload"}
        </Button>
      </form>

      {isLoading && <p className="text-muted-foreground">Loading files...</p>}

      {!isLoading && files.length === 0 && (
        <EmptyState
          icon={FileIcon}
          title="No files yet"
          description="Upload the first file for this project."
        />
      )}

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between border rounded-md p-3"
          >
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline flex items-center gap-2"
            >
              <FileIcon className="size-4 text-muted-foreground" />
              {file.fileName}
              {file.description && (
                <span className="text-muted-foreground">
                  — {file.description}
                </span>
              )}
            </a>
            <ConfirmDeleteDialog
              trigger={
                <Button variant="ghost" size="sm">
                  Delete
                </Button>
              }
              onConfirm={() => deleteFile.mutate(file.id)}
              isPending={deleteFile.isPending}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

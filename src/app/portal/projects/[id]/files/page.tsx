"use client";

import { Download, FileIcon } from "lucide-react";
import { useParams } from "next/navigation";

import { ClientProjectTabs } from "@/components/portal/project-tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

import { useProjectFiles } from "@/hooks/use-project-files";

export default function PortalProjectFilesPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProjectFiles(id);

  const files = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Files" description="Deliverables shared by the team" />

      <ClientProjectTabs projectId={id} />

      {isLoading && <p className="text-muted-foreground">Loading files...</p>}

      {!isLoading && files.length === 0 && (
        <EmptyState icon={FileIcon} title="No files shared yet" />
      )}

      <div className="space-y-2">
        {files.map((file) => (
          <a
            key={file.id}
            href={file.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <FileIcon className="size-4 text-muted-foreground" />

              <div>
                <p className="text-sm">{file.fileName}</p>

                {file.description && (
                  <p className="text-xs text-muted-foreground">
                    {file.description}
                  </p>
                )}
              </div>
            </div>

            <Download className="size-4 text-muted-foreground" />
          </a>
        ))}
      </div>
    </div>
  );
}

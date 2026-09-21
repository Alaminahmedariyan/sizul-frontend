"use client";

import { ImageIcon, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  useDeleteMedia,
  useMediaList,
  useUploadMedia,
} from "@/hooks/use-media";

export default function MediaLibraryPage() {
  const { data, isLoading } = useMediaList();
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();

  const [altText, setAltText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mediaItems = data?.data ?? [];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    uploadMedia.mutate(
      { file, altText: altText || undefined },
      {
        onSuccess: () => {
          setAltText("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          toast.success("Uploaded");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Uploaded images and files"
      />

      <form onSubmit={handleUpload} className="flex gap-2 mb-4">
        <Input ref={fileInputRef} type="file" required className="max-w-xs" />
        <Input
          placeholder="Alt text (optional)"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit" disabled={uploadMedia.isPending}>
          <Upload className="size-4" />
          {uploadMedia.isPending ? "Uploading..." : "Upload"}
        </Button>
      </form>

      {isLoading && <p className="text-muted-foreground">Loading media...</p>}
      {!isLoading && mediaItems.length === 0 && (
        <EmptyState
          icon={ImageIcon}
          title="No media uploaded yet"
          description="Upload your first file above."
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="relative group border rounded-md overflow-hidden"
          >
            {item.category === "IMAGE" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.altText ?? item.fileName}
                className="w-full h-24 object-cover"
              />
            ) : (
              <div className="w-full h-24 flex items-center justify-center bg-muted">
                <ImageIcon className="size-6 text-muted-foreground" />
              </div>
            )}
            <p className="text-xs p-1 truncate">{item.fileName}</p>
            <ConfirmDeleteDialog
              trigger={
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 size-6 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="size-3" />
                </Button>
              }
              onConfirm={() => deleteMedia.mutate(item.id)}
              isPending={deleteMedia.isPending}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

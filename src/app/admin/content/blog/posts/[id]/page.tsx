"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { PageHeader } from "@/components/shared/page-header";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { StatusBadge } from "@/components/shared/status-badge";

import { useUploadMedia } from "@/hooks/use-media";
import { useBlogCategories, useBlogPostForManage, useBlogTags, useUpdateBlogPost, useUpdateBlogPostStatus } from "@/hooks/use-blog";
import { ContentStatus } from "@/lib/api/testimonials";


const STATUS_OPTIONS: ContentStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function BlogPostEditorPage() {
  const { id } = useParams<{ id: string }>();

  const { data: postRes, isLoading } = useBlogPostForManage(id);
  const { data: categoriesRes } = useBlogCategories();
  const { data: tagsRes } = useBlogTags();

  const updatePost = useUpdateBlogPost(id);
  const updateStatus = useUpdateBlogPostStatus(id);
  const uploadMedia = useUploadMedia();

  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState<string | null>(null);
  const [seoDescription, setSeoDescription] = useState<string | null>(null);
  const [canonicalUrl, setCanonicalUrl] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[] | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const post = postRes?.data;

  useEffect(() => {
    if (post) {
      setContent(post.content ?? "");
    }
  }, [post]);

  if (isLoading) {
    return <p className="text-muted-foreground">Loading post...</p>;
  }

  if (!post) {
    return <p className="text-muted-foreground">Post not found.</p>;
  }

  const categories = categoriesRes?.data ?? [];
  const allTags = tagsRes?.data ?? [];

  const currentTagIds = selectedTagIds ?? post.tags?.map(({ tag }) => tag.id) ?? [];

  const seoValues = {
    seoTitle: seoTitle ?? post.seoTitle ?? "",
    seoDescription: seoDescription ?? post.seoDescription ?? "",
    canonicalUrl: canonicalUrl ?? post.canonicalUrl ?? "",
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(currentTagIds.includes(tagId) ? currentTagIds.filter((tag) => tag !== tagId) : [...currentTagIds, tagId]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setIsUploadingImage(true);

    try {
      const res = await uploadMedia.mutateAsync({ file });

      await updatePost.mutateAsync({
        featuredImage: res.data.url,
      });

      toast.success("Featured image updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSaveContent = () => {
    updatePost.mutate(
      {
        content,
      },
      {
        onSuccess: () => {
          toast.success("Content saved");
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };

  const handleSaveSeo = () => {
    updatePost.mutate(
      {
        seoTitle: seoValues.seoTitle || null,
        seoDescription: seoValues.seoDescription || null,
        canonicalUrl: seoValues.canonicalUrl || null,
        tagIds: currentTagIds,
      },
      {
        onSuccess: () => {
          toast.success("SEO & tags saved");

          setSeoTitle(null);
          setSeoDescription(null);
          setCanonicalUrl(null);
          setSelectedTagIds(null);
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };

  return (
    <div>
      <PageHeader title={post.title} action={<StatusBadge status={post.status} />} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              {post.featuredImage && <img src={post.featuredImage} alt={post.title} className="h-48 w-full rounded-md object-cover" />}

              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} />

              {isUploadingImage && <p className="text-sm text-muted-foreground">Uploading image...</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Excerpt</CardTitle>
            </CardHeader>

            <CardContent>
              <Textarea
                defaultValue={post.excerpt ?? ""}
                onBlur={(e) =>
                  updatePost.mutate(
                    {
                      excerpt: e.target.value,
                    },
                    {
                      onError: (err) => toast.error(err.message),
                    },
                  )
                }
                placeholder="A short summary shown in the blog list..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Content</CardTitle>

              <Button size="sm" disabled={updatePost.isPending} onClick={handleSaveContent}>
                {updatePost.isPending ? "Saving..." : "Save content"}
              </Button>
            </CardHeader>

            <CardContent>
              <RichTextEditor content={post.content} onChange={setContent} placeholder="Write your blog post..." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>SEO & Tags</CardTitle>

              <Button size="sm" disabled={updatePost.isPending} onClick={handleSaveSeo}>
                {updatePost.isPending ? "Saving..." : "Save"}
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="seo-title">SEO Title</Label>

                <Input id="seo-title" value={seoValues.seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="seo-description">SEO Description</Label>

                <Textarea
                  id="seo-description"
                  value={seoValues.seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="canonical-url">Canonical URL (optional)</Label>

                <Input
                  id="canonical-url"
                  value={seoValues.canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1">
                <Label>Tags</Label>

                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const isSelected = currentTagIds.includes(tag.id);

                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={
                          isSelected
                            ? "rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground"
                            : "rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                        }
                      >
                        {tag.name}
                      </button>
                    );
                  })}

                  {allTags.length === 0 && <p className="text-xs text-muted-foreground">No tags yet — create some in the Blog Tags tab.</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Category</Label>

              <Select
                value={post.categoryId ?? "none"}
                onValueChange={(value) =>
                  updatePost.mutate(
                    {
                      categoryId: value === "none" ? null : value,
                    },
                    {
                      onSuccess: () => toast.success("Category updated"),
                      onError: (err) => toast.error(err.message),
                    },
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No category" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>

                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Status</Label>

              <Select
                value={post.status}
                onValueChange={(value) =>
                  updateStatus.mutate(value as ContentStatus, {
                    onSuccess: () => toast.success("Status updated"),
                    onError: (err) => toast.error(err.message),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

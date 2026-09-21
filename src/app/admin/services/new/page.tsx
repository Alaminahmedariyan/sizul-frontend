"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateService } from "@/hooks/use-service";

export default function NewServicePage() {
  const router = useRouter();
  const createService = useCreateService();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState<string>("");
  const [currency, setCurrency] = useState("USD");

  function handleNameChange(value: string) {
    setName(value);
    if (!slug) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    createService.mutate(
      {
        name,
        slug,
        tagline: tagline || undefined,
        description: description || undefined,
        startingPrice: startingPrice || undefined,
        currency,
      },
      {
        onSuccess: () => {
          toast.success("Service created");
          router.push("/admin/services");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  return (
    <div>
      <PageHeader
        title="New Service"
        description="Create a new service offering"
      />

      <Card className="mt-6 max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="SEO Optimization"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="seo-optimization"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Boost your search rankings"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe the service in detail…"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startingPrice">Starting Price</Label>
                <Input
                  id="startingPrice"
                  type="number"
                  min={0}
                  step="0.01"
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={createService.isPending}>
                {createService.isPending ? "Creating…" : "Create Service"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

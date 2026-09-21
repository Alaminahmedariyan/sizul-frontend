"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SeoTabs } from "@/components/admin/seo-tabs";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  useGbp,
  useMarkGbpOptimized,
  useUpdateGbpVerification,
  useUpsertGbp,
} from "@/hooks/use-seo-gbp";

export default function SeoGbpPage() {
  const { id } = useParams<{ id: string }>();

  const { data: gbpRes, isLoading } = useGbp(id);
  const upsertGbp = useUpsertGbp(id);
  const updateVerification = useUpdateGbpVerification(id);
  const markOptimized = useMarkGbpOptimized(id);

  const gbp = gbpRes?.data ?? null;

  const [businessName, setBusinessName] = useState(gbp?.businessName ?? "");
  const [category, setCategory] = useState(gbp?.category ?? "");
  const [address, setAddress] = useState(gbp?.address ?? "");
  const [phone, setPhone] = useState(gbp?.phone ?? "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    upsertGbp.mutate(
      {
        businessName,
        category: category || undefined,
        address: address || undefined,
        phone: phone || undefined,
      },
      {
        onSuccess: () => toast.success("GBP saved"),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader title="Google Business Profile" />
      <SeoTabs projectId={id} />

      {isLoading && <p className="text-muted-foreground">Loading GBP...</p>}

      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 max-w-md">
              <div className="space-y-1">
                <Label>Business Name</Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Marketing Agency"
                />
              </div>
              <div className="space-y-1">
                <Label>Address</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={upsertGbp.isPending}>
                Save
              </Button>
            </form>

            {gbp && (
              <div className="mt-6 space-y-3 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={gbp.isVerified}
                    onCheckedChange={(checked) =>
                      updateVerification.mutate(!!checked, {
                        onSuccess: () =>
                          toast.success("Verification status updated"),
                      })
                    }
                  />
                  <Label>Verified</Label>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Last optimized:{" "}
                    {gbp.lastOptimizedAt
                      ? new Date(gbp.lastOptimizedAt).toLocaleDateString()
                      : "Never"}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={markOptimized.isPending}
                    onClick={() =>
                      markOptimized.mutate(undefined, {
                        onSuccess: () => toast.success("Marked as optimized"),
                      })
                    }
                  >
                    Mark as Optimized
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

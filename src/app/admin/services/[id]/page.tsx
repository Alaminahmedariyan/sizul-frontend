"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PricingPlanEditDialog } from "@/components/admin/pricing-plan-edit-dialog";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  useCreatePricingPlan,
  useDeletePricingPlan,
  usePricingPlans,
} from "@/hooks/use-pricing-plans";
import { useServiceForManage, useUpdateService } from "@/hooks/use-service";
import type { BillingInterval, PricingPlan } from "@/lib/api/pricing-plans";

const BILLING_OPTIONS: BillingInterval[] = [
  "ONE_TIME",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
  "CUSTOM",
];

export default function AdminServiceDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: serviceRes, isLoading } = useServiceForManage(id);
  const { data: plansRes } = usePricingPlans(id);

  const updateService = useUpdateService(id);
  const createPlan = useCreatePricingPlan(id);
  const deletePlan = useDeletePricingPlan(id);

  // Add form state
  const [planName, setPlanName] = useState("");
  const [planSlug, setPlanSlug] = useState("");
  const [planPrice, setPlanPrice] = useState<string>("");
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("MONTHLY");
  const [planDescription, setPlanDescription] = useState("");
  const [planFeatures, setPlanFeatures] = useState("");
  const [isPopular, setIsPopular] = useState(false);

  // Edit dialog state
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  if (isLoading)
    return <p className="text-muted-foreground">Loading service...</p>;

  const service = serviceRes?.data;
  if (!service)
    return <p className="text-muted-foreground">Service not found.</p>;

  const plans = plansRes?.data ?? [];

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName.trim() || !planSlug.trim() || !planPrice) return;

    const featuresArray = planFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    createPlan.mutate(
      {
        name: planName,
        slug: planSlug,
        price: planPrice,
        billingInterval,
        description: planDescription || undefined,
        features: featuresArray.length > 0 ? featuresArray : undefined,
        isPopular,
      },
      {
        onSuccess: () => {
          setPlanName("");
          setPlanSlug("");
          setPlanPrice("");
          setPlanDescription("");
          setPlanFeatures("");
          setIsPopular(false);
          toast.success("Plan added");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <PageHeader
        title={service.name}
        description={service.tagline ?? undefined}
      />

      {/* Visibility */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="active"
              checked={service.isActive}
              onCheckedChange={(checked) =>
                updateService.mutate(
                  { isActive: !!checked },
                  { onError: (err) => toast.error(err.message) },
                )
              }
            />
            <Label htmlFor="active">Active</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={service.isFeatured}
              onCheckedChange={(checked) =>
                updateService.mutate(
                  { isFeatured: !!checked },
                  { onError: (err) => toast.error(err.message) },
                )
              }
            />
            <Label htmlFor="featured">Featured</Label>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add form */}
          <form
            onSubmit={handleAddPlan}
            className="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-dashed p-4 md:grid-cols-12"
          >
            <div className="space-y-1.5 md:col-span-4">
              <Label htmlFor="plan-name">Plan name</Label>
              <Input
                id="plan-name"
                placeholder="Basic"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-4">
              <Label htmlFor="plan-slug">Slug</Label>
              <Input
                id="plan-slug"
                placeholder="seo-basic"
                value={planSlug}
                onChange={(e) => setPlanSlug(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="plan-price">Price</Label>
              <Input
                id="plan-price"
                type="number"
                min={0}
                step="0.01"
                placeholder="299"
                value={planPrice}
                onChange={(e) => setPlanPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="plan-billing">Billing</Label>
              <Select
                value={billingInterval}
                onValueChange={(v) => setBillingInterval(v as BillingInterval)}
              >
                <SelectTrigger id="plan-billing" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BILLING_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-12">
              <Label htmlFor="plan-description">Description</Label>
              <Input
                id="plan-description"
                placeholder="A solid SEO foundation for startups and small businesses."
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1.5 md:col-span-12">
              <Label htmlFor="plan-features">
                Features{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (one per line)
                </span>
              </Label>
              <Textarea
                id="plan-features"
                rows={5}
                placeholder={`10 Keyword Research\nOn-Page SEO (5 Pages)\nMeta Tags Optimization\nGoogle Analytics Setup\nMonthly SEO Report`}
                value={planFeatures}
                onChange={(e) => setPlanFeatures(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 md:col-span-12">
              <Checkbox
                id="plan-popular"
                checked={isPopular}
                onCheckedChange={(checked) => setIsPopular(!!checked)}
              />
              <Label htmlFor="plan-popular">
                Mark as Popular{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (shows a POPULAR badge and highlights the card)
                </span>
              </Label>
            </div>

            <div className="flex items-end md:col-span-12">
              <Button
                type="submit"
                disabled={createPlan.isPending}
                className="w-full md:w-auto"
              >
                {createPlan.isPending ? "Adding…" : "Add Plan"}
              </Button>
            </div>
          </form>

          {/* Plans list */}
          <div className="space-y-2">
            {plans.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No pricing plans yet.
              </p>
            )}
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between gap-3 rounded-md border p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{plan.name}</p>
                    {plan.isPopular && (
                      <span className="rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {plan.price} {plan.currency} /{" "}
                    {plan.billingInterval.replace(/_/g, " ")}
                  </p>
                  {Array.isArray(plan.features) && plan.features.length > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {plan.features.length} features
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingPlan(plan)}
                    title="Edit plan"
                  >
                    <Pencil className="size-4" />
                  </Button>

                  <ConfirmDeleteDialog
                    trigger={
                      <Button variant="ghost" size="icon" title="Delete plan">
                        <Trash2 className="size-4" />
                      </Button>
                    }
                    onConfirm={() => deletePlan.mutate(plan.id)}
                    isPending={deletePlan.isPending}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <PricingPlanEditDialog
        serviceId={id}
        plan={editingPlan}
        open={!!editingPlan}
        onOpenChange={(open) => {
          if (!open) setEditingPlan(null);
        }}
      />
    </div>
  );
}

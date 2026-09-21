"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

import { useUpdatePricingPlan } from "@/hooks/use-pricing-plans";

import type { BillingInterval, PricingPlan } from "@/lib/api/pricing-plans";

const BILLING_OPTIONS: BillingInterval[] = [
  "ONE_TIME",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
  "CUSTOM",
];

type Props = {
  serviceId: string;
  plan: PricingPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PricingPlanEditDialog({
  serviceId,
  plan,
  open,
  onOpenChange,
}: Props) {
  const updatePlan = useUpdatePricingPlan(serviceId);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState<string>("");
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("MONTHLY");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [isPopular, setIsPopular] = useState(false);

  // Load the plan's data into local state when the dialog opens
  useEffect(() => {
    if (!plan || !open) return;
    setName(plan.name);
    setSlug(plan.slug);
    setPrice(plan.price);
    setBillingInterval(plan.billingInterval);
    setDescription(plan.description ?? "");
    setFeatures(Array.isArray(plan.features) ? plan.features.join("\n") : "");
    setIsPopular(plan.isPopular);
  }, [plan, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!plan) return;

    const featuresArray = features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    updatePlan.mutate(
      {
        id: plan.id,
        payload: {
          name,
          slug,
          price,
          billingInterval,
          description: description || null,
          features: featuresArray.length > 0 ? featuresArray : null,
          isPopular,
        },
      },
      {
        onSuccess: () => {
          toast.success("Plan updated");
          onOpenChange(false);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit pricing plan</DialogTitle>
          <DialogDescription>
            Update the plan details. Changes apply immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name + Slug */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Plan name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Price + Billing */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-billing">Billing interval</Label>
              <Select
                value={billingInterval}
                onValueChange={(v) => setBillingInterval(v as BillingInterval)}
              >
                <SelectTrigger id="edit-billing" className="w-full">
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
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of this plan"
            />
          </div>

          {/* Features */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-features">
              Features{" "}
              <span className="text-xs font-normal text-muted-foreground">
                (one per line)
              </span>
            </Label>
            <Textarea
              id="edit-features"
              rows={7}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder={`10 Keyword Research\nOn-Page SEO (5 Pages)\nMonthly SEO Report`}
            />
          </div>

          {/* Popular */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="edit-popular"
              checked={isPopular}
              onCheckedChange={(checked) => setIsPopular(!!checked)}
            />
            <Label htmlFor="edit-popular">
              Mark as Popular{" "}
              <span className="text-xs font-normal text-muted-foreground">
                (shows a POPULAR badge and highlights the card)
              </span>
            </Label>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updatePlan.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updatePlan.isPending}>
              {updatePlan.isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type BillingInterval =
  | "ONE_TIME"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY"
  | "CUSTOM";

export type PricingPlan = {
  id: string;
  serviceId: string;
  slug: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  billingInterval: BillingInterval;
  features: string[] | null;
  isPopular: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export const getPricingPlans = (serviceId?: string) =>
  apiClient<ApiSuccessResponse<PricingPlan[]>>("/api/v1/pricing-plans", {
    query: serviceId ? { serviceId } : undefined,
  });

export const getPricingPlansForManage = () =>
  apiClient<ApiSuccessResponse<PricingPlan[]>>("/api/v1/pricing-plans/manage");

export const getPricingPlanById = (id: string) =>
  apiClient<ApiSuccessResponse<PricingPlan>>(`/api/v1/pricing-plans/${id}`);

export const createPricingPlan = (
  payload: Pick<PricingPlan, "serviceId" | "slug" | "name" | "price"> &
    Partial<Omit<PricingPlan, "id" | "createdAt" | "updatedAt">>,
) =>
  apiClient<ApiSuccessResponse<PricingPlan>>("/api/v1/pricing-plans", {
    method: "POST",
    body: payload,
  });

export const updatePricingPlan = (
  id: string,
  payload: Partial<Omit<PricingPlan, "id" | "createdAt" | "updatedAt">>,
) =>
  apiClient<ApiSuccessResponse<PricingPlan>>(`/api/v1/pricing-plans/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const deletePricingPlan = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/pricing-plans/${id}`, {
    method: "DELETE",
  });

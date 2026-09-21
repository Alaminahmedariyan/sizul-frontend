import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type PaymentProvider = "STRIPE" | "BKASH" | "SSLCOMMERZ" | "MANUAL";
export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCEEDED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export type Payment = {
  id: string;
  proposalId: string | null;
  clientId: string | null;
  provider: PaymentProvider;
  providerPaymentId: string | null;
  amount: string;
  currency: string;
  status: PaymentStatus;
  method: string | null;
  paidAt: string | null;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
};

export type CheckoutResponse = {
  checkoutUrl: string;
  payment: Payment;
};

// ---- Checkout (Client Portal) ----
export const createStripeCheckout = (proposalId: string) =>
  apiClient<ApiSuccessResponse<CheckoutResponse>>(
    "/api/v1/payments/stripe/checkout",
    {
      method: "POST",
      body: { proposalId },
    },
  );

export const createBkashCheckout = (proposalId: string) =>
  apiClient<ApiSuccessResponse<CheckoutResponse>>(
    "/api/v1/payments/bkash/checkout",
    {
      method: "POST",
      body: { proposalId },
    },
  );

export const createSslcommerzCheckout = (proposalId: string) =>
  apiClient<ApiSuccessResponse<CheckoutResponse>>(
    "/api/v1/payments/sslcommerz/checkout",
    {
      method: "POST",
      body: { proposalId },
    },
  );

export const getMyPayments = () =>
  apiClient<ApiSuccessResponse<Payment[]>>("/api/v1/payments/me");

// ---- Admin/Staff ----
export const getPayments = (params?: Record<string, string | number>) =>
  apiClient<ApiSuccessResponse<Payment[]>>("/api/v1/payments", {
    query: params,
  });

export const getPaymentById = (id: string) =>
  apiClient<ApiSuccessResponse<Payment>>(`/api/v1/payments/${id}`);

/** Admin only, Stripe payments only — backend enforces this. */
export const refundPayment = (id: string) =>
  apiClient<ApiSuccessResponse<Payment>>(`/api/v1/payments/${id}/refund`, {
    method: "POST",
  });

import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type ProposalStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED";

export type ProposalItemInput = {
  title: string;
  serviceId?: string;
  pricingPlanId?: string;
  quantity: number;
  unitPrice: number;
  description?: string;
};

export type ProposalItem = ProposalItemInput & { id: string; total: string };

export type Proposal = {
  id: string;
  leadId: string | null;
  clientId: string | null;
  projectId: string | null;
  proposalNumber: string;
  title: string;
  introduction: string | null;
  terms: string | null;
  notes: string | null;
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  currency: string;
  status: ProposalStatus;
  validUntil: string | null;
  sentAt: string | null;
  viewedAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  items: ProposalItem[];
  createdAt: string;
  updatedAt: string;
};

export type CreateProposalInput = {
  clientId?: string;
  leadId?: string;
  title: string;
  introduction?: string;
  terms?: string;
  discount?: number;
  tax?: number;
  currency?: string;
  items: ProposalItemInput[];
};

export const getProposals = (params?: Record<string, string | number>) =>
  apiClient<ApiSuccessResponse<Proposal[]>>("/api/v1/proposals", {
    query: params,
  });

export const getProposalById = (id: string) =>
  apiClient<ApiSuccessResponse<Proposal>>(`/api/v1/proposals/${id}`);

export const createProposal = (payload: CreateProposalInput) =>
  apiClient<ApiSuccessResponse<Proposal>>("/api/v1/proposals", {
    method: "POST",
    body: payload,
  });

/** Only works while status is DRAFT — backend enforces this. */
export const updateProposal = (
  id: string,
  payload: Partial<Pick<Proposal, "title" | "introduction" | "terms">>,
) =>
  apiClient<ApiSuccessResponse<Proposal>>(`/api/v1/proposals/${id}`, {
    method: "PATCH",
    body: payload,
  });

export const sendProposal = (id: string) =>
  apiClient<ApiSuccessResponse<Proposal>>(`/api/v1/proposals/${id}/send`, {
    method: "POST",
  });

export const markProposalViewed = (id: string) =>
  apiClient<ApiSuccessResponse<Proposal>>(
    `/api/v1/proposals/${id}/mark-viewed`,
    { method: "POST" },
  );

export const acceptProposal = (id: string) =>
  apiClient<ApiSuccessResponse<Proposal>>(`/api/v1/proposals/${id}/accept`, {
    method: "POST",
  });

export const rejectProposal = (id: string) =>
  apiClient<ApiSuccessResponse<Proposal>>(`/api/v1/proposals/${id}/reject`, {
    method: "POST",
  });

/** Only works while status is DRAFT (Admin only) — backend enforces this. */
export const deleteProposal = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/proposals/${id}`, {
    method: "DELETE",
  });

import { apiClient } from "@/lib/api-client";

import type { ApiSuccessResponse } from "@/types/api";

export type RankingSearchEngine = "GOOGLE" | "BING";
export type RankingDevice = "DESKTOP" | "MOBILE";

export type KeywordRanking = {
  id: string;
  projectId: string;
  keyword: string;
  targetUrl: string | null;
  searchEngine: RankingSearchEngine;
  device: RankingDevice;
  location: string | null;
  rank: number | null;
  previousRank: number | null;
  checkedAt: string;
  createdAt: string;
};

export type CreateKeywordRankingInput = {
  projectId: string;
  keyword: string;
  searchEngine?: RankingSearchEngine;
  device?: RankingDevice;
  rank?: number;
};

export const getKeywordRankings = (projectId: string) =>
  apiClient<ApiSuccessResponse<KeywordRanking[]>>(
    "/api/v1/seo/keyword-rankings",
    { query: { projectId } },
  );

export const getKeywordRankingById = (id: string) =>
  apiClient<ApiSuccessResponse<KeywordRanking>>(
    `/api/v1/seo/keyword-rankings/${id}`,
  );

export const createKeywordRanking = (payload: CreateKeywordRankingInput) =>
  apiClient<ApiSuccessResponse<KeywordRanking>>(
    "/api/v1/seo/keyword-rankings",
    { method: "POST", body: payload },
  );

export const updateKeywordRanking = (
  id: string,
  payload: Partial<Pick<KeywordRanking, "rank">>,
) =>
  apiClient<ApiSuccessResponse<KeywordRanking>>(
    `/api/v1/seo/keyword-rankings/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );

export const deleteKeywordRanking = (id: string) =>
  apiClient<ApiSuccessResponse<null>>(`/api/v1/seo/keyword-rankings/${id}`, {
    method: "DELETE",
  });

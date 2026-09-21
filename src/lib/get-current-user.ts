import { cache } from "react";
import type { ApiSuccessResponse } from "@/types/api";
import type { SessionUser } from "@/types/auth";
import { serverApiClient } from "./server-api-client";

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  try {
    const res = await serverApiClient<ApiSuccessResponse<SessionUser>>(
      "/api/v1/auth/session",
    );
    return res.data;
  } catch {
    return null;
  }
});
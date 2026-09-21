import { headers } from "next/headers";
import { ofetch } from "ofetch";
import type { ApiErrorResponse } from "@/types/api";
import ApiError from "./api-error";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export async function serverApiClient<T = unknown>(
  url: string,
  options?: Parameters<typeof ofetch<T>>[1],
) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const reqHeaders = await headers();
  const cookieHeader = reqHeaders.get("cookie") || "";

  return ofetch<T>(url, {
    baseURL: API_URL,
    credentials: "include",
    ...options,
    headers: {
      cookie: cookieHeader,
      ...options?.headers,
    },
    async onResponseError({ response }) {
      const body = response._data as ApiErrorResponse | undefined;
      if (body && body.success === false) {
        throw new ApiError(body);
      }
      throw new ApiError({
        success: false,
        statusCode: response.status,
        message: response.statusText || "Something went wrong",
      });
    },
  });
}
import { headers } from "next/headers";
import { ofetch } from "ofetch";
import type { ApiErrorResponse } from "@/types/api";
import ApiError from "./api-error";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

function ensureUrl() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }
}

async function handleError({ response }: { response: any }) {
  const body = response._data as ApiErrorResponse | undefined;
  if (body && body.success === false) {
    throw new ApiError(body);
  }
  throw new ApiError({
    success: false,
    statusCode: response.status,
    message: response.statusText || "Something went wrong",
  });
}

export async function publicApiClient<T = unknown>(
  url: string,
  options?: Parameters<typeof ofetch<T>>[1],
) {
  ensureUrl();

  return ofetch<T>(url, {
    baseURL: API_URL,
    timeout: 10_000,
    retry: 1,
    next: { revalidate: 300 },
    ...options,
    headers: {
      ...options?.headers,
    },
    onResponseError: handleError,
  });
}

export async function serverApiClient<T = unknown>(
  url: string,
  options?: Parameters<typeof ofetch<T>>[1],
) {
  ensureUrl();

  const reqHeaders = await headers();
  const cookieHeader = reqHeaders.get("cookie") || "";

  return ofetch<T>(url, {
    baseURL: API_URL,
    credentials: "include",
    cache: "no-store",
    timeout: 10_000,
    retry: 0,
    ...options,
    headers: {
      cookie: cookieHeader,
      ...options?.headers,
    },
    onResponseError: handleError,
  });
}
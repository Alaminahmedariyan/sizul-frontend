import { cookies } from "next/headers";
import { ofetch } from "ofetch";
import type { ApiErrorResponse } from "@/types/api";
import ApiError from "./api-error";

export async function serverApiClient<T = unknown>(
  url: string,
  options?: Parameters<typeof ofetch<T>>[1],
) {
  const cookieStore = await cookies();

  return ofetch<T>(url, {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    ...options,
    headers: {
      cookie: cookieStore.toString(),
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

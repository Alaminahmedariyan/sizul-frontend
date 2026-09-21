import { ofetch } from "ofetch";
import type { ApiErrorResponse } from "@/types/api";
import ApiError from "./api-error";

export const apiClient = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
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

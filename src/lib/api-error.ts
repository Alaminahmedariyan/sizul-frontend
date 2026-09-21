import type { ApiErrorDetail, ApiErrorResponse } from "@/types/api";

class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode?: string;
  public readonly details?: ApiErrorDetail[];

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = "ApiError";
    this.statusCode = response.statusCode;
    this.errorCode = response.errorCode;
    this.details = response.details;
  }

  /** Handy for @tanstack/react-form: { fieldName: message } */
  get fieldErrors(): Record<string, string> | null {
    if (!this.details?.length) return null;
    return Object.fromEntries(this.details.map((d) => [d.field, d.message]));
  }

  get isValidationError(): boolean {
    return this.errorCode === "VALIDATION_ERROR";
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isForbidden(): boolean {
    return this.statusCode === 403;
  }
}

export default ApiError;

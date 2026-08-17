import type { ApiError } from "@/types/api-error";
import { notifyUnauthorized } from "@/features/auth/auth-events";
import { authStorage } from "@/features/auth/auth-storage";

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  auth?: boolean;
  body?: unknown;
  handleUnauthorized?: boolean;
};

export class ApiClientError extends Error {
  constructor(public readonly details: ApiError) {
    super(details.message);
    this.name = "ApiClientError";
  }
}

function getApiBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return apiUrl.replace(/\/$/, "");
}

function isApiError(value: unknown): value is ApiError {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ApiError>;
  return (
    typeof candidate.status === "number" &&
    typeof candidate.code === "string" &&
    typeof candidate.message === "string"
  );
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || undefined;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    auth = true,
    body,
    handleUnauthorized = auth,
    ...requestOptions
  } = options;
  const headers = new Headers(requestOptions.headers);
  headers.set("Accept", "application/json");

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = auth ? authStorage.getAccessToken() : null;
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${getApiBaseUrl()}${normalizedPath}`, {
    ...requestOptions,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const responseBody = await readResponseBody(response);

  if (response.status === 401 && handleUnauthorized) {
    authStorage.clearAccessToken();
    notifyUnauthorized();
  }

  if (!response.ok) {
    const details: ApiError = isApiError(responseBody)
      ? responseBody
      : {
          status: response.status,
          code: "HTTP_ERROR",
          message: response.statusText || "Request failed",
        };

    throw new ApiClientError(details);
  }

  return responseBody as T;
}

export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T = void>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "@/config/env-config";
import { getCookie, deleteCookie } from "cookies-next";

export interface FetchResponse {
  success: boolean;
  message?: string;
  data?: any;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  error?: string | null;
  statusCode?: number;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  tags?: string[];
  token?: string;
  headers?: Record<string, string>;
  cache?: RequestCache;
  forceFresh?: boolean;
  skipCache?: boolean;
  cacheTtlMs?: number;
}

interface CacheEntry {
  timestamp: number;
  data: FetchResponse;
}

const apiCache = new Map<string, CacheEntry>();
const DEFAULT_CACHE_TTL = 45 * 1000; // 45 seconds TTL

export const clearApiCache = (pattern?: string) => {
  if (!pattern) {
    apiCache.clear();
  } else {
    for (const key of apiCache.keys()) {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    }
  }
};

export const myFetch = async (
  url: string,
  {
    method = "GET",
    body,
    tags,
    token,
    headers = {},
    cache = "no-store",
    forceFresh = false,
    skipCache = false,
    cacheTtlMs = DEFAULT_CACHE_TTL,
  }: FetchOptions = {}
): Promise<FetchResponse> => {
  // Retrieve access token from parameter, cookies, or localStorage
  const accessToken =
    token ||
    (getCookie("accessToken") as string) ||
    (typeof window !== "undefined" ? localStorage.getItem("accessToken") || undefined : undefined);

  const fullUrl = url.startsWith("/") ? `${config.baseURL}${url}` : `${config.baseURL}/${url}`;
  const cacheKey = `${fullUrl}_${accessToken || "anon"}`;

  // If mutation (POST/PATCH/DELETE/PUT), invalidate cache
  if (method !== "GET") {
    clearApiCache();
  } else if (!forceFresh && !skipCache) {
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTtlMs) {
      return cached.data;
    }
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const hasBody = body !== undefined && method !== "GET";

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: reqHeaders,
      ...(hasBody && { body: isFormData ? body : JSON.stringify(body) }),
      ...(tags && { next: { tags } }),
      ...(!(method === "GET") ? { cache: "no-store" } : { cache }),
    });

    const data = await response.json();

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        const fcmToken = getCookie("fcmToken") as string | undefined;

        if (fcmToken && accessToken) {
          try {
            await fetch(`${config.baseURL}/auth/remove-fcm-token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ fcmToken }),
            });
          } catch {
            // Ignore error if token is already expired on backend
          }
        }

        deleteCookie("accessToken");
        deleteCookie("user");
        deleteCookie("fcmToken");

        try {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        } catch {
          // Ignore localStorage exceptions
        }

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      return {
        success: false,
        message: data?.message || "Session expired or unauthorized",
        data: null,
        error: data?.message || "Unauthorized",
        statusCode: 401,
      };
    }

    if (response.ok) {
      const result: FetchResponse = {
        success: data?.success ?? true,
        message: data?.message,
        data: data?.data,
        pagination: data?.pagination,
        error: null,
        statusCode: response.status,
      };

      if (method === "GET") {
        apiCache.set(cacheKey, { timestamp: Date.now(), data: result });
      }

      return result;
    }

    return {
      success: false,
      message: data?.message,
      data: null,
      error: data?.errorMessages || data?.message || "Request failed",
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Network error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

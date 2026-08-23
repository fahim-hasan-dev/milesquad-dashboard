/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { config } from "@/config/env-config";
import { getToken } from "./get-token";

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
}

export const myFetch = async (
  url: string,
  {
    method = "GET",
    body,
    tags,
    token,
    headers = {},
    cache = "no-store",
  }: FetchOptions = {}
): Promise<FetchResponse> => {
  const accessToken = token || (await getToken());

  const isFormData = body instanceof FormData;
  const hasBody = body !== undefined && method !== "GET";

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  try {
    const fullUrl = url.startsWith("/") ? `${config.baseURL}${url}` : `${config.baseURL}/${url}`;
    const response = await fetch(fullUrl, {
      method,
      headers: reqHeaders,
      ...(hasBody && { body: isFormData ? body : JSON.stringify(body) }),
      ...(tags && { next: { tags } }),
      ...(!(method === "GET") ? { cache: "no-store" } : { cache: cache }),
    });

    const data = await response.json();

    if (response.status === 401) {
      try {
        const cookieStore = await cookies();
        cookieStore.delete("accessToken");
        cookieStore.delete("user");
      } catch {
        // Ignored if called in context where cookies cannot be mutated
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
      return {
        success: data?.success ?? true,
        message: data?.message,
        data: data?.data,
        pagination: data?.pagination,
        error: null,
        statusCode: response.status,
      };
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

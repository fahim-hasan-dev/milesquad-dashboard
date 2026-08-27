import { SERVER_URL } from "@/config/env-config";

export const getImageUrl = (url?: string | null): string => {
  if (!url || typeof url !== "string") return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  const cleanServerUrl = (SERVER_URL || "http://localhost:5003").replace(/\/+$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanServerUrl}${cleanPath}`;
};

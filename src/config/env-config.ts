if (typeof window === "undefined") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("dotenv").config();
  } catch {
    // Ignore in non-node environments
  }
}

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.SERVER_URL ||
  "https://api.milesquad.com";

const rawBaseURL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  (serverURL ? `${serverURL.replace(/\/+$/, "")}/api/v1` : "https://api.milesquad.com/api/v1");

const baseURL = rawBaseURL.endsWith("/api/v1")
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/+$/, "")}/api/v1`;

const mapApiKey = process.env.NEXT_PUBLIC_MAP_API_KEY || process.env.MAP_API_KEY || "";

export const config = {
  serverURL,
  baseURL,
  mapApiKey,
};

export const SERVER_URL = config.serverURL;
export const BASE_URL = config.baseURL;
export const MAP_API_KEY = config.mapApiKey;

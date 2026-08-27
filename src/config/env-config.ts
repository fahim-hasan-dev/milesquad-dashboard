import dotenv from "dotenv";

// Load environment variables from .env.local file
dotenv.config();

const rawBaseURL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5003/api/v1";
const baseURL = rawBaseURL.endsWith("/api/v1")
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/+$/, "")}/api/v1`;

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5003";
const mapApiKey = process.env.NEXT_PUBLIC_MAP_API_KEY || process.env.MAP_API_KEY;

export const config = {
  serverURL,
  baseURL,
  mapApiKey,
};

export const SERVER_URL = config.serverURL;
export const BASE_URL = config.baseURL;
export const MAP_API_KEY = config.mapApiKey;

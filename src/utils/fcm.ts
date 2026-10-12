import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { config } from "@/config/env-config";
import { requestFcmToken } from "@/lib/firebase";

const FCM_TOKEN_STORAGE_KEY = "milesquad_fcm_token";

export const getStoredFcmToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const localToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
    if (localToken) return localToken;
  } catch {
    // Ignore localStorage access issues
  }

  const cookieToken = getCookie("fcmToken");
  return typeof cookieToken === "string" ? cookieToken : null;
};

export const saveStoredFcmToken = (token: string) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
    } catch {
      // Ignore localStorage access issues
    }
  }

  setCookie("fcmToken", token, {
    sameSite: "lax",
    path: "/",
  });
};

export const clearStoredFcmToken = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
    } catch {
      // Ignore localStorage access issues
    }
  }

  deleteCookie("fcmToken", { path: "/" });
};

/**
 * Register FCM token with backend:
 * POST /auth/add-fcm-token
 * Body: { fcmToken: string }
 */
export const registerFcmToken = async (
  authToken?: string | null
): Promise<string | null> => {
  if (typeof window === "undefined") return null;

  try {
    const currentAuthToken =
      authToken ||
      (getCookie("accessToken") as string) ||
      localStorage.getItem("accessToken") ||
      "";

    if (!currentAuthToken) {
      console.warn("[FCM] User not authenticated. Skipping FCM registration.");
      return null;
    }

    const fcmToken = await requestFcmToken();
    if (!fcmToken) {
      console.warn("[FCM] Could not generate FCM token.");
      return null;
    }

    saveStoredFcmToken(fcmToken);

    const endpoint = `${config.baseURL}/auth/add-fcm-token`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentAuthToken}`,
      },
      body: JSON.stringify({ fcmToken }),
    });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      console.log("[FCM] Successfully added FCM token to server:", data?.message || "OK");
      return fcmToken;
    } else {
      console.warn("[FCM] Failed to add FCM token to server:", data?.message || response.statusText);
      return fcmToken;
    }
  } catch (error) {
    console.error("[FCM] Network error while adding FCM token:", error);
    return null;
  }
};

/**
 * Remove FCM token from backend:
 * POST /auth/remove-fcm-token
 * Body: { fcmToken: string }
 */
export const removeFcmToken = async (
  authToken?: string | null,
  fcmTokenOverride?: string | null
): Promise<boolean> => {
  const tokenToRemove = fcmTokenOverride || getStoredFcmToken();

  if (!tokenToRemove) {
    console.log("[FCM] No FCM token found to remove.");
    return false;
  }

  const currentAuthToken =
    authToken ||
    (getCookie("accessToken") as string) ||
    (typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "");

  try {
    const endpoint = `${config.baseURL}/auth/remove-fcm-token`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(currentAuthToken ? { Authorization: `Bearer ${currentAuthToken}` } : {}),
      },
      body: JSON.stringify({ fcmToken: tokenToRemove }),
    });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      console.log("[FCM] Successfully removed FCM token from server:", data?.message || "OK");
    } else {
      console.warn(
        "[FCM] Server response when removing FCM token:",
        data?.message || response.statusText
      );
    }
  } catch (error) {
    console.error("[FCM] Error while removing FCM token from server:", error);
  } finally {
    clearStoredFcmToken();
  }

  return true;
};

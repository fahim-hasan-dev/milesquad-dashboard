"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { setCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { removeFcmToken } from "@/utils/fcm";

// Define the context type
export interface AdminUser {
  id?: string;
  role?: string;
  name?: string;
  email?: string;
  image?: string | null;
  [key: string]: any;
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user: AdminUser | string | null;
  setUser: (user: AdminUser | string | null) => void;
  logout: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  initialToken,
  initialUser,
}: {
  children: ReactNode;
  initialToken: string | null;
  initialUser: string | null;
}) => {
  const [token, setTokenState] = useState<string | null>(initialToken);
  const [user, setUserState] = useState<AdminUser | string | null>(() => {
    if (!initialUser) return null;
    try {
      return JSON.parse(initialUser);
    } catch {
      return initialUser;
    }
  });
  const router = useRouter();

  // Function to update token state and cookies without maxAge expiry
  const setToken = (newToken: string | null) => {
    if (newToken) {
      setCookie("accessToken", newToken); // No maxAge set - token expiry handled by backend
    } else {
      deleteCookie("accessToken");
    }
    setTokenState(newToken);
  };

  // Function to update user state and cookies without maxAge expiry
  const setUser = (newUser: AdminUser | string | null) => {
    if (newUser) {
      const userVal = typeof newUser === "string" ? newUser : JSON.stringify(newUser);
      setCookie("user", userVal); // No maxAge set - expiry handled by backend
      setUserState(newUser);
    } else {
      deleteCookie("user");
      setUserState(null);
    }
  };

  // Function to perform clean logout with FCM token removal
  const logout = async () => {
    try {
      await removeFcmToken(token);
    } catch (err) {
      console.error("[Auth] Error removing FCM token on logout:", err);
    } finally {
      deleteCookie("accessToken");
      deleteCookie("user");
      deleteCookie("fcmToken");
      setTokenState(null);
      setUserState(null);
      router.push("/login");
    }
  };

  // Auto logout handler when token expires or session invalidates
  const handleAutoLogout = useCallback(async () => {
    try {
      await removeFcmToken(token);
    } catch (err) {
      console.error("[Auth] Error removing FCM token on auto logout:", err);
    } finally {
      deleteCookie("accessToken");
      deleteCookie("user");
      deleteCookie("fcmToken");
      setTokenState(null);
      setUserState(null);
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [token, router]);

  // Handle global session-expired events
  useEffect(() => {
    const handleSessionExpired = () => {
      console.warn("[Auth] Session expired event received. Performing auto logout.");
      handleAutoLogout();
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [handleAutoLogout]);

  // Auto logout timer based on JWT exp claim
  useEffect(() => {
    if (!token) return;

    try {
      const parts = token.split(".");
      if (parts.length >= 2) {
        const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(payloadBase64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);

        if (payload?.exp) {
          const expirationTime = payload.exp * 1000;
          const timeUntilExpiry = expirationTime - Date.now();

          if (timeUntilExpiry <= 0) {
            console.warn("[Auth] Token already expired. Auto-logging out.");
            handleAutoLogout();
            return;
          }

          const timer = setTimeout(() => {
            console.warn("[Auth] Token expired. Triggering auto-logout and removing FCM token.");
            handleAutoLogout();
          }, timeUntilExpiry);

          return () => clearTimeout(timer);
        }
      }
    } catch (e) {
      console.error("[Auth] Failed to parse JWT token expiration:", e);
    }
  }, [token, handleAutoLogout]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

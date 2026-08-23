"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { setCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

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
  logout: () => void;
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

  // Function to clear user state and cookies
  const logout = () => {
    deleteCookie("accessToken");
    deleteCookie("user");
    setTokenState(null);
    setUserState(null);
    router.push("/login");
  };

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

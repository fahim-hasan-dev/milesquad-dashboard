import { io, Socket } from "socket.io-client";
import { getCookie } from "cookies-next";
import { SERVER_URL } from "@/config/env-config";

let trackingSocket: Socket | null = null;

export const getTrackingSocket = (): Socket => {
  const token = (getCookie("accessToken") as string) || (typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "");
  const serverUrl = (SERVER_URL || "http://localhost:5003").replace(/\/+$/, "");

  if (!trackingSocket || !trackingSocket.connected) {
    trackingSocket = io(`${serverUrl}/tracking`, {
      transports: ["websocket", "polling"],
      auth: {
        token: token,
      },
      extraHeaders: {
        token: token,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    trackingSocket.on("connect", () => {
      console.log("Connected to tracking socket namespace");
    });

    trackingSocket.on("connect_error", (err) => {
      console.warn("Tracking socket connection error:", err.message);
    });
  }

  return trackingSocket;
};

export const disconnectTrackingSocket = () => {
  if (trackingSocket) {
    trackingSocket.disconnect();
    trackingSocket = null;
  }
};

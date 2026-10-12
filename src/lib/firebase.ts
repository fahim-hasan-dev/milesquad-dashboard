import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported, Messaging } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const FIREBASE_VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

// Safe client-side check to see if credentials are configured
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase App client-side
export const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === "undefined") return null;

  if (!isFirebaseConfigured()) {
    console.warn(
      "[Firebase] Missing Firebase environment variables. Please configure NEXT_PUBLIC_FIREBASE_* in .env"
    );
    return null;
  }

  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
};

// Register the service worker for background FCM
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      apiKey: firebaseConfig.apiKey || "",
      projectId: firebaseConfig.projectId || "",
      messagingSenderId: firebaseConfig.messagingSenderId || "",
      appId: firebaseConfig.appId || "",
      authDomain: firebaseConfig.authDomain || "",
      storageBucket: firebaseConfig.storageBucket || "",
    });

    const registration = await navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?${params.toString()}`,
      { scope: "/" }
    );

    return registration;
  } catch (error) {
    console.error("[FCM] Failed to register service worker:", error);
    return null;
  }
};

// Request FCM Token from Firebase Cloud Messaging
export const requestFcmToken = async (): Promise<string | null> => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("[FCM] Firebase messaging is not supported in this browser.");
      return null;
    }

    const app = getFirebaseApp();
    if (!app) return null;

    // Request notification permission if not yet decided
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") {
      console.warn("[FCM] Notification permission was not granted:", permission);
      return null;
    }

    const messaging: Messaging = getMessaging(app);
    const serviceWorkerRegistration = await registerServiceWorker();

    const token = await getToken(messaging, {
      vapidKey: FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: serviceWorkerRegistration || undefined,
    });

    if (token) {
      return token;
    } else {
      console.warn("[FCM] No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("[FCM] Error retrieving FCM token:", error);
    return null;
  }
};

// Listen to foreground notifications when dashboard is active
export const onForegroundMessage = async (
  callback: (payload: any) => void
): Promise<(() => void) | null> => {
  if (typeof window === "undefined") return null;

  try {
    const supported = await isSupported();
    if (!supported) return null;

    const app = getFirebaseApp();
    if (!app) return null;

    const messaging: Messaging = getMessaging(app);
    const unsubscribe = onMessage(messaging, (payload) => {
      callback(payload);
    });

    return unsubscribe;
  } catch (error) {
    console.error("[FCM] Error setting up foreground message listener:", error);
    return null;
  }
};

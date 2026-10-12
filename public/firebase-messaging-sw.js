/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js");

// Initialize Firebase in the service worker from URL query parameters
const urlParams = new URLSearchParams(location.search);
const apiKey = urlParams.get("apiKey");
const projectId = urlParams.get("projectId");
const messagingSenderId = urlParams.get("messagingSenderId");
const appId = urlParams.get("appId");
const authDomain = urlParams.get("authDomain");
const storageBucket = urlParams.get("storageBucket");

if (apiKey && projectId && messagingSenderId && appId) {
  try {
    firebase.initializeApp({
      apiKey,
      projectId,
      messagingSenderId,
      appId,
      authDomain: authDomain || `${projectId}.firebaseapp.com`,
      storageBucket: storageBucket || `${projectId}.appspot.com`,
    });

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const notificationTitle =
        payload.notification?.title || payload.data?.title || "MileSquad Notification";
      const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || "",
        icon: "/logo.png",
        badge: "/logo.png",
        data: payload.data || payload,
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } catch (err) {
    console.error("[firebase-messaging-sw.js] Firebase initialization error:", err);
  }
}

// Fallback listener for raw web push events
self.addEventListener("push", (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const title = data.notification?.title || data.data?.title || "MileSquad Notification";
    const options = {
      body: data.notification?.body || data.data?.body || "",
      icon: "/logo.png",
      badge: "/logo.png",
      data: data.data || data,
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification("MileSquad Notification", {
        body: text,
        icon: "/logo.png",
      })
    );
  }
});

// Click event: Focus or open the appropriate dashboard page
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const screen = event.notification.data?.screen;
  let targetUrl = "/";

  if (screen === "RIDERS") targetUrl = "/riders";
  else if (screen === "PARCEL_DETAILS" || screen === "PARCEL_TRACKING") targetUrl = "/deliveries";
  else if (screen === "WALLET") targetUrl = "/transactions";
  else if (screen === "SUPPORT") targetUrl = "/support";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && "focus" in client) {
          if ("navigate" in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

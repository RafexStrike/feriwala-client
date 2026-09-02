"use client";

import { getPushConfig, registerPushSubscription, unregisterPushSubscription } from "@/lib/api/admin";

export type BrowserPushState =
  | "unsupported"
  | "denied"
  | "default"
  | "disabled"
  | "enabled";

const SW_PATH = "/sw.js";

const isBrowserEnvironment = () =>
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const getBrowserPushState = async (): Promise<BrowserPushState> => {
  if (!isBrowserEnvironment()) {
    return "unsupported";
  }

  const permission = Notification.permission;
  if (permission === "denied") {
    return "denied";
  }

  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();

  if (subscription) {
    return "enabled";
  }

  return permission === "default" ? "default" : "disabled";
};

export const ensureServiceWorkerRegistration = async () => {
  if (!isBrowserEnvironment()) {
    throw new Error("Push notifications are not supported in this browser");
  }

  return navigator.serviceWorker.register(SW_PATH, { scope: "/" });
};

export const getCurrentPushSubscription = async () => {
  if (!isBrowserEnvironment()) {
    return null;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  return registration?.pushManager.getSubscription() ?? null;
};

export const enableBrowserPushNotifications = async () => {
  if (!isBrowserEnvironment()) {
    throw new Error("Push notifications are not supported in this browser");
  }

  const permission = Notification.permission === "default"
    ? await Notification.requestPermission()
    : Notification.permission;

  if (permission !== "granted") {
    throw new Error(permission === "denied" ? "Notification permission was denied" : "Notification permission is required");
  }

  const registration = await ensureServiceWorkerRegistration();
  const existingSubscription = await registration.pushManager.getSubscription();
  const { publicKey } = await getPushConfig();
  const applicationServerKey = urlBase64ToUint8Array(publicKey);

  const subscription = existingSubscription ?? await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  const serialized = subscription.toJSON();
  const endpoint = serialized.endpoint ?? subscription.endpoint;
  const auth = serialized.keys?.auth;
  const p256dh = serialized.keys?.p256dh;

  if (!endpoint || !auth || !p256dh) {
    throw new Error("Unable to serialize the push subscription");
  }

  await registerPushSubscription({
    endpoint,
    expirationTime: typeof serialized.expirationTime === "number" ? serialized.expirationTime : null,
    keys: {
      auth,
      p256dh,
    },
  });

  return subscription;
};

export const disableBrowserPushNotifications = async () => {
  if (!isBrowserEnvironment()) {
    return;
  }

  const subscription = await getCurrentPushSubscription();
  if (!subscription) {
    return;
  }

  await Promise.allSettled([
    unregisterPushSubscription({ endpoint: subscription.endpoint }),
    subscription.unsubscribe(),
  ]);
};

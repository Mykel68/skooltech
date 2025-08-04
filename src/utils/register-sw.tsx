// components/PWAServiceWorker.tsx
"use client";

import { useEffect } from "react";

export default function PWAServiceWorker() {
  useEffect(() => {
    const isProd = process.env.NODE_ENV === "production";
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    if (isProd && isStandalone && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("SW registered in standalone mode:", reg);
        })
        .catch((err) => {
          console.error("SW registration failed:", err);
        });
    }
  }, []);

  return null;
}

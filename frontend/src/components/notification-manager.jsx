"use client";
import { useEffect } from "react";

export default function NotificationManager() {
  useEffect(() => {
    console.log(
      "NotificationManager mounted at",
      new Date().toLocaleTimeString()
    );

    const runCheck = () => {
      const raw = localStorage.getItem("pendingNotifications");
      if (!raw) return;

      const pending = JSON.parse(raw);
      const now = Date.now();
      const stillPending = [];

      for (const notif of pending) {
        const time =
          typeof notif.time === "number"
            ? notif.time
            : new Date(notif.time).getTime();
        const delay = time - now;

        if (delay <= 0 && delay > -60000) {
          console.log("🔁 Triggering missed or due notification:", notif.title);
          new Notification(notif.title, {
            body: `Starts at ${notif.startTime}`,
            icon: "/assets/studenthub_logo_collapsed_dark.svg",
          });
        } else if (delay > 0) {
          stillPending.push(notif);
        } else {
          console.log("Skipping old notification:", notif.title);
        }
      }

      localStorage.setItem(
        "pendingNotifications",
        JSON.stringify(stillPending)
      );
    };

    runCheck(); // run once immediately
    const interval = setInterval(runCheck, 30000);

    return () => clearInterval(interval);
  }, []);

  return null;
}

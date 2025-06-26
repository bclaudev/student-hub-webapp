import { LoginForm } from "@/components/login-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthRedirector from "@/components/onboarding/AuthRedirector";
import posthog from "posthog-js";
import { useUser } from "@/hooks/use-user.jsx";

export default function LoginPage() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });
    }
  }, [user]);
  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      const parsed = JSON.parse(userFromStorage);
      posthog.identify(parsed.id, {
        email: parsed.email,
        name: `${parsed.firstName} ${parsed.lastName}`,
      });
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:8787/api/user", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();

      setUser(data.user);

      posthog.identify(data.user.id, {
        email: data.user.email,
        name: `${data.user.firstName} ${data.user.lastName}`,
      });

      return data.user;
    } catch (err) {
      console.error("Failed to fetch user:", err.message);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm fetchUser={fetchUser} />
        {user && <AuthRedirector />}
      </div>
    </div>
  );
}

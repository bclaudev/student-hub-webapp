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
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full">
        <LoginForm fetchUser={fetchUser} />
        {user && <AuthRedirector />}
      </div>
    </div>
  );
}

import { LoginForm } from "@/components/login-form";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:8787/api/user", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setUser(data.user);
      return data.user;
      console.log("User fetched:", data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err.message);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm fetchUser={fetchUser} />
      </div>
      <ThemeToggle />
    </div>
  );
}

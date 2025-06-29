import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { User, Lock, Plus, Circle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/studenthub_logo_default.svg";
import { toast } from "sonner";

export function LoginForm({ fetchUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);

  const navigate = useNavigate();

  const missing = [];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) missing.push("email");
    if (!password.trim()) missing.push("password");

    if (missing.length) {
      setInvalidFields(missing);
      toast.error("Please fill in all required fields.");
      return;
    } else {
      setInvalidFields([]); // resetăm dacă totul e ok
    }

    try {
      console.log("Sending login request...");

      const response = await fetch("http://localhost:8787/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response received:", response.status);

      if (response.ok) {
        console.log("Login successful! Fetching user data...");

        const userData = await fetchUser?.();
        if (userData) {
          console.log("User data:", userData);
          navigate("/calendar");
        } else {
          console.warn("fetchUser returned nothing");
        }
      } else {
        const errorData = await response.json();
        toast.error("Login failed! Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex min-h-[600px] h-screen">
      <img
        src={logo}
        alt="Student Hub Logo"
        className="absolute top-6 right-6 h-10 w-auto z-50"
      />
      {/* Left Panel */}
      <div className="flex-1 bg-[#a585ff] relative overflow-hidden flex items-center justify-center p-12">
        <div className="relative z-10 text-white text-center max-w-md">
          <h1 className="text-5xl font-bold mb-6">
            Welcome back to Student Hub!
          </h1>
          <p className="text-white/90 text-lg leading-relaxed text-justify">
            Did you know? Students who engage in structured time management
            practices tend to perform better academically and report lower
            levels of stress.{" "}
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-12 py-4 border-2 rounded-2xl focus:ring-[#a585ff] focus:border-[#a585ff] placeholder-gray-400 text-gray-700 ${
                  invalidFields.includes("email")
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-12 py-4 border-2 rounded-2xl focus:ring-[#a585ff] focus:border-[#a585ff] placeholder-gray-400 text-gray-700 ${
                  invalidFields.includes("password")
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked)}
                  className="border-gray-300"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-[#a585ff] transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#a585ff] hover:bg-[#9575ef] text-white font-semibold py-4 rounded-2xl transition-all duration-300 text-lg"
            >
              Sign In
            </Button>
            <div className="text-center pt-4">
              <span className="text-gray-600">New here? </span>
              <a
                href="/register"
                className="text-[#a585ff] hover:text-[#9575ef] font-medium transition-colors"
              >
                Create an Account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

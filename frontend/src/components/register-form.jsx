import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import posthog from "posthog-js";
import { User, Lock, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";
import { registerSchema } from "@/schemas/register-schema";
import { z } from "zod";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        const message = err.message;

        toast.error(`${field}: ${message}`);
      });
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      dateOfBirth: formData.dateOfBirth,
    };

    try {
      const res = await fetch("http://localhost:8787/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully!");
        // Optional: redirect or clear form
      } else {
        toast.error(data?.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Welcome Section */}
      <div className="flex-1 bg-[#a585ff] relative overflow-hidden flex items-center justify-center p-12">
        <div className="relative z-10 text-white text-center max-w-md">
          <h1 className="text-5xl font-bold mb-6">Join us today!</h1>
          <p className="text-white/90 text-lg leading-relaxed">
            Create your account and start your journey with us. It only takes a
            few minutes.
          </p>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name & Last Name */}
            <Label>Personal identification</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="pl-12 py-4 border-2 border-gray-200 rounded-2xl"
                  required
                />
              </div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="pl-12 py-4 border-2 border-gray-200 rounded-2xl"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-12 py-4 border-2 border-gray-200 rounded-2xl"
                required
              />
            </div>

            {/* Date of Birth */}
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                className="pl-12 py-4 border-2 border-gray-200 rounded-2xl"
                required
              />
            </div>
            <Label>Password</Label>
            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-12 py-4 border-2 border-gray-200 rounded-2xl"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="pl-12 py-4 border-2 border-gray-200 rounded-2xl"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#a585ff] hover:bg-[#9575ef] text-white font-semibold py-4 rounded-2xl text-lg mt-4"
            >
              Create Account
            </Button>

            <div className="text-center pt-4">
              <span className="text-gray-600">Already have an account? </span>
              <a
                href="/login"
                className="text-[#a585ff] hover:text-[#9575ef] font-medium transition-colors"
              >
                Sign In
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { z } from "zod";

// Verify user is at least 14 years old
const isAtLeast14 = (date) => {
  const dob = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  return age > 14 || (age === 14 && m >= 0 && today.getDate() >= dob.getDate());
};

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(20, "Max 20 characters")
      .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(20, "Max 20 characters")
      .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),

    email: z.string().email("Invalid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[0-9]/, "At least one number"),

    confirmPassword: z.string(),

    dateOfBirth: z.string().refine((val) => isAtLeast14(val), {
      message: "You must be at least 14 years old",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

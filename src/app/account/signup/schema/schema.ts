import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"), // new field
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});


export type SignupSchema = z.infer<typeof signupSchema>;

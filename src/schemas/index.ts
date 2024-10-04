import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required." }),
  password: z
    .string()
    .min(6, { message: "Minimum 6 characters required for password." }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email is required." }),
});

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Minimum 6 characters required for password." }),
});

"use server";

import bcrypt from "bcryptjs";
import prisma from "@/db";
import { getUserByEmail } from "@/lib/data/user";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export async function login(
  prevState:
    | {
        errors: { email?: string[]; password?: string[] } | null;
        message: string;
      }
    | undefined,
  formData: FormData
) {
  const validatedCredentials = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedCredentials.success) {
    return {
      errors: validatedCredentials.error.flatten().fieldErrors,
      message: "Invalid credentials",
    };
  }

  const { email, password } = validatedCredentials.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { errors: {}, message: "Invalid credentials" };
        default:
          return { errors: {}, message: "Something went wrong" };
      }
    }

    throw error;
  }
}

export async function register(
  prevState:
    | {
        errors: { email?: string[]; password?: string[] } | null;
        message: string;
      }
    | undefined,
  formData: FormData
) {
  const validatedCredentials = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedCredentials.success) {
    return {
      errors: validatedCredentials.error.flatten().fieldErrors,
      message: "Failed to Create Account",
    };
  }

  const { email, password } = validatedCredentials.data;
  const hashedPassword = await bcrypt.hash(password, 6);

  const alreadyExisting = await getUserByEmail(email);

  if (alreadyExisting) {
    return {
      errors: {},
      message: `Email already in use.`,
    };
  }

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return {
      errors: null,
      message: "Account created successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: "Database Error: Failed to Create User.",
    };
  }
}

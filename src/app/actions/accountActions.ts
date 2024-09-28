"use server";

import bcrypt from "bcryptjs";
import prisma from "@/db";
import { getUserByEmail } from "@/lib/data/user";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateRandomColor } from "@/lib/utils";

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
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    try {
      await createDefaultCategories(newUser.id);
      return {
        errors: null,
        message:
          "Account created successfully! Please return to the login page.",
      };
    } catch (categoriesError) {
      console.error("Default Categories Creation Error:", categoriesError);
      return {
        errors: null,
        message: "Account created, but failed to create default categories.",
      };
    }
  } catch (newUserError) {
    console.error(newUserError);
    return {
      errors: {},
      message: "Database Error: Failed to Create User.",
    };
  }
}

const createDefaultCategories = async (userId: string) => {
  const defaultCategories = [
    {
      userId,
      name: "Groceries",
      type: "expense",
      color: generateRandomColor(),
      emoji: "🛒",
    },
    {
      userId,
      name: "Entertainment",
      type: "expense",
      color: generateRandomColor(),
      emoji: "🍿",
    },
    {
      userId,
      name: "Utilities",
      type: "expense",
      color: generateRandomColor(),
      emoji: "💡",
    },
    {
      userId,
      name: "Transport",
      type: "expense",
      color: generateRandomColor(),
      emoji: "🚗",
    },
    {
      userId,
      name: "Health",
      type: "expense",
      color: generateRandomColor(),
      emoji: "💊",
    },
  ];

  await prisma.category.createMany({
    data: defaultCategories,
  });
};

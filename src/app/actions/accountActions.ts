"use server";

import bcrypt from "bcryptjs";
import prisma from "@/db";
import { getUserByEmail } from "@/lib/data/user";
import {
  ForgotPasswordSchema,
  LoginSchema,
  NewPasswordSchema,
} from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateRandomColor } from "@/lib/utils";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "@/lib/data/tokens";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { getVerificationTokenByToken } from "@/lib/data/verification-token";
import { getPasswordResetTokenByToken } from "@/lib/data/password-reset-token";

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
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { errors: {}, message: "User does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return {
      errors: null,
      message: "Confirmation email sent!",
    };
  }

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

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return {
      errors: null,
      message: "Confirmation email sent!",
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: "Database Error: Failed to Create User.",
    };
  }
}

export async function newVerification(token: string) {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { errors: {}, message: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { errors: {}, message: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return {
      errors: {},
      message: "Email does not exist!",
    };
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { id: existingToken.id } });

  try {
    await createDefaultCategories(existingUser.id);
    return {
      errors: null,
      message: "Email verified!",
    };
  } catch (categoriesError) {
    console.error("Default Categories Creation Error:", categoriesError);
    return {
      errors: null,
      message: "Email verified!",
    };
  }
}

export async function reset(
  prevState:
    | {
        errors: { email?: string[]; password?: string[] } | null;
        message: string;
      }
    | undefined,
  formData: FormData
) {
  const validatedCredentials = ForgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedCredentials.success) {
    return {
      errors: validatedCredentials.error.flatten().fieldErrors,
      message: "Invalid email",
    };
  }

  const { email } = validatedCredentials.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { errors: {}, message: "Email not found!" };
  }
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );
  return { errors: null, message: "Reset email sent!" };
}

export async function newPassword(
  token: string | null,
  prevState:
    | {
        errors: { email?: string[]; password?: string[] } | null;
        message: string;
      }
    | undefined,
  formData: FormData
) {
  if (!token) {
    return {
      errors: { password: ["Missing token!"] },
      message: "Missing token!",
    };
  }

  const validatedCredentials = NewPasswordSchema.safeParse({
    password: formData.get("password"),
  });

  if (!validatedCredentials.success) {
    return {
      errors: validatedCredentials.error.flatten().fieldErrors,
      message: "Failed to Create Account",
    };
  }

  const { password } = validatedCredentials.data;

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken)
    return {
      errors: { password: ["Invalid token"] },
      message: "Invalid token",
    };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired)
    return {
      errors: { password: ["Token has expired!"] },
      message: "Token has expired!",
    };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser)
    return {
      errors: { password: ["Email does not exist!"] },
      message: "Email does not exist!",
    };

  const hashedPassword = await bcrypt.hash(password, 6);
  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { errors: null, message: "Password updated!" };
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

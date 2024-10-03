"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import dayjs from "dayjs";
import { auth } from "@/auth";

const FormSchema = z.object({
  id: z.string(),
  category: z.string({
    invalid_type_error: "Please select a category.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than 0." }),
  date: z.date(),
  note: z.string(),
});
const CreateIncome = FormSchema.omit({ id: true });

export async function createIncome(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User ID is required");
  }

  const validatedFields = CreateIncome.safeParse({
    category: formData.get("category"),
    amount: formData.get("amount"),
    note: formData.get("note"),
    date: dayjs(formData.get("date")?.toString()).toDate(),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Income.",
    };
  }
  const { category, amount, date, note } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await prisma.income.create({
      data: {
        category: {
          connect: {
            type_name_userId: { name: category, type: "income", userId },
          },
        },
        amount: amountInCents,
        date,
        note,
        User: { connect: { id: userId } },
      },
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Create Income.",
    };
  }
  revalidatePath("/incomes");
  redirect("/incomes");
}

export async function editIncome(id: string, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User ID is required");
  }

  const validatedFields = CreateIncome.safeParse({
    category: formData.get("category"),
    amount: formData.get("amount"),
    note: formData.get("note"),
    date: dayjs(formData.get("date")?.toString()).toDate(),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Income.",
    };
  }
  const data = {
    ...validatedFields.data,
    amount: validatedFields.data.amount * 100,
  };

  try {
    await prisma.income.update({
      where: { id, userId },
      data: {
        ...data,
        category: {
          connect: {
            type_name_userId: { name: data.category, type: "income", userId },
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Create Income.",
    };
  }

  revalidatePath("/incomes");
  redirect("/incomes");
}

export async function deleteIncome(id: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User ID is required");
  }

  await prisma.income.delete({
    where: {
      id,
      userId,
    },
  });

  revalidatePath("/incomes");
}

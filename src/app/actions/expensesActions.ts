"use server";

import prisma from "@/db";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuid } from "uuid";
import { z } from "zod";

const FormSchema = z.object({
  id: z.string(),
  category: z.string({
    invalid_type_error: "Please select a category.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  date: z.date(),
  note: z.string(),
  location: z.string(),
});
const CreateExpense = FormSchema.omit({ id: true });

export async function createExpense(formData: FormData) {
  const validatedFields = CreateExpense.safeParse({
    category: formData.get("category"),
    amount: formData.get("amount"),
    note: formData.get("note"),
    location: formData.get("location"),
    date: dayjs(formData.get("date")?.toString()).toDate(),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Expense.",
    };
  }
  const { category, amount, date, note, location } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await prisma.expense.create({
      data: {
        id: uuid(),
        category: {
          connect: { type_name: { type: "expense", name: category } },
        },
        amount: amountInCents,
        date,
        location,
        note,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Create Expense.",
    };
  }
  revalidatePath("/expenses");
  revalidatePath("/budgets");
  redirect("/expenses");
}

export async function editExpense(id: string, formData: FormData) {
  const validatedFields = CreateExpense.safeParse({
    category: formData.get("category"),
    amount: formData.get("amount"),
    note: formData.get("note"),
    location: formData.get("location"),
    date: dayjs(formData.get("date")?.toString()).toDate(),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Expense.",
    };
  }
  const data = {
    ...validatedFields.data,
    amount: validatedFields.data.amount * 100,
  };

  try {
    await prisma.expense.update({
      where: { id },
      data: {
        ...data,
        category: {
          connect: { type_name: { type: "expense", name: data.category } },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Create Expense.",
    };
  }

  revalidatePath("/expenses");
  revalidatePath("/budgets");
  redirect("/expenses");
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({
    where: {
      id,
    },
  });

  revalidatePath("/expenses");
  revalidatePath("/budgets");
}

"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuid } from "uuid";
import { z } from "zod";

const FormSchema = z.object({
  id: z.string(),
  color: z.string(),
  category: z.string(),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0" }),
  resetPeriod: z.string(),
});

const CreateBudget = FormSchema.omit({ id: true, color: true });

export async function createBudget(
  prevState: { message: string } | null,
  formData: FormData
) {
  const validatedFields = CreateBudget.safeParse({
    category: formData.get("category"),
    amount: formData.get("amount"),
    resetPeriod: formData.get("resetPeriod"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Budget",
    };
  }

  const { category, amount, resetPeriod } = validatedFields.data;
  const amountInCents = amount * 100;

  const alreadyExisting = await prisma.budget.findFirst({
    where: { category: { name: category }, resetPeriod },
  });

  if (alreadyExisting) {
    return {
      message: `A budget with the same category and reset period already exists.`,
    };
  }

  try {
    await prisma.budget.create({
      data: {
        id: uuid(),
        category: {
          connect: { type_name: { name: category, type: "expense" } },
        },
        initAmount: amountInCents,
        currentAmount: amountInCents,
        resetPeriod,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Create Budget.",
    };
  }

  revalidatePath("/budgets");
  redirect("/budgets");
}

export async function editBudget(
  id: string,
  prevState: { message: string } | null,
  formData: FormData
) {
  const validatedFields = CreateBudget.safeParse({
    category: formData.get("category"),
    amount: formData.get("amount"),
    resetPeriod: formData.get("resetPeriod"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Edit Budget",
    };
  }

  const { category, amount, resetPeriod } = validatedFields.data;
  const amountInCents = amount * 100;

  const alreadyExisting = await prisma.budget.findFirst({
    where: {
      category: { name: category },
      resetPeriod,
    },
  });

  if (alreadyExisting && alreadyExisting.id !== id) {
    return {
      message: `A budget with the same category and reset period already exists.`,
    };
  }

  try {
    await prisma.budget.update({
      where: {
        id,
      },
      data: {
        category: {
          connect: { type_name: { name: category, type: "expense" } },
        },
        initAmount: amountInCents,
        currentAmount: amountInCents,
        resetPeriod,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to Edit Budget.",
    };
  }

  revalidatePath("/budgets");
  redirect("/budgets");
}

export async function deleteBudget(id: string) {
  await prisma.budget.delete({
    where: {
      id,
    },
  });

  revalidatePath("/budgets");
}

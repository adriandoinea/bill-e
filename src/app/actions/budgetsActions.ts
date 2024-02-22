"use server";

import prisma from "@/db";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateRandomBgColor } from "@/lib/utils";

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

export async function createBudget(formData: FormData) {
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
    where: { category, resetPeriod },
  });

  if (alreadyExisting) {
    //TODO: Implement message that the budget already exists
    redirect("/budgets");
  }

  try {
    await prisma.budget.create({
      data: {
        id: uuid(),
        category,
        initAmount: amountInCents,
        currentAmount: amountInCents,
        resetPeriod,
        color: generateRandomBgColor(),
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

export async function editBudget(id: string, formData: FormData) {
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
    where: { category, resetPeriod },
  });

  if (alreadyExisting) {
    //TODO: Implement message that the budget already exists
    redirect("/budgets");
  }

  try {
    await prisma.budget.update({
      where: {
        id,
      },
      data: {
        category,
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

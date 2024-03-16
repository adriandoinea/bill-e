"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v4 as uuid } from "uuid";

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
});
const CreateCategory = FormSchema.omit({ id: true });

export async function createCategory(formData: FormData) {
  const validatedFields = CreateCategory.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create Category.",
    };
  }

  const { name, type } = validatedFields.data;

  try {
    await prisma.category.create({
      data: {
        id: uuid(),
        name,
        type,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      message: "Database Error: Failed to create Category.",
    };
  }
  revalidatePath(`/${type}s/create`);
}

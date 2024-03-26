"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/db";
import { z } from "zod";

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
});
const CreateCategory = FormSchema.omit({ id: true });

export async function createCategory(type: string, formData: FormData) {
  const validatedFields = CreateCategory.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to create Category.",
    };
  }

  try {
    await prisma.category.create({
      data: {
        name: validatedFields.data.name,
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

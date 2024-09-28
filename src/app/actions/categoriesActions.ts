"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { validateCategoriesFields } from "@/lib/categories-utils";
import { generateRandomColor } from "@/lib/utils";
import { ILocalCategory } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateCategories(
  type: string,
  localCategories: ILocalCategory[]
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User ID is required");
  }

  const validatedFields = validateCategoriesFields(localCategories);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to update categories.",
    };
  }
  const addedCategories = localCategories.filter((categ) => categ.isAdded);
  const deletedCategories = localCategories.filter(
    (categ) => categ.isDeletedLocally
  );
  const updatedCategories = localCategories.filter(
    (category) =>
      category.isUpdated && !category.isDeletedLocally && !category.isAdded
  );
  for (const updatedCateg of updatedCategories) {
    try {
      await prisma.category.update({
        where: {
          type_name_userId: { type, name: updatedCateg.oldVal, userId },
        },
        data: {
          type,
          name: updatedCateg.newVal,
          emoji: updatedCateg.emoji,
          color: updatedCateg.color,
        },
      });
    } catch (error) {
      console.error(error);
      return {
        message: `Database Error: Failed to Update ${updatedCateg.oldVal}.`,
      };
    }
  }
  try {
    await prisma.category.createMany({
      data: addedCategories.map((categ) => ({
        type,
        name: categ.newVal,
        emoji: categ.emoji,
        color: categ.color || generateRandomColor(),
        userId,
      })),
    });
  } catch (error) {
    console.error(error);
    return {
      message: `Database Error: Failed to add categories.`,
    };
  }
  try {
    await prisma.category.deleteMany({
      where: {
        userId,
        name: {
          in: deletedCategories.map((deletedCateg) => deletedCateg.oldVal),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return {
      message: `Database Error: Failed to delete categories.`,
    };
  }
  revalidatePath(`/${type}s`);
}

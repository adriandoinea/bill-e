import { auth } from "@/auth";
import prisma from "@/db";
import { validateCategoriesFields } from "@/lib/categories-utils";
import { CategoriesRequestBody } from "@/types";
import { revalidatePath } from "next/cache";

export const PUT = auth(async function PUT(req) {
  if (!req.auth?.user?.id) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }
  const { id: userId } = req.auth.user;

  const body: CategoriesRequestBody = await req.json();
  const { type, categories } = body;

  const validatedFields = validateCategoriesFields(categories);
  if (!validatedFields.success) {
    return Response.json(
      {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid categories.",
      },
      { status: 400 }
    );
  }

  for (const updatedCateg of categories) {
    try {
      await prisma.category.update({
        where: {
          type_name_userId: { type, name: updatedCateg.oldVal!, userId },
        },
        data: {
          type,
          name: updatedCateg.newVal!,
          emoji: updatedCateg.emoji,
          color: updatedCateg.color,
        },
      });
    } catch (error) {
      console.error(error);
      return Response.json(
        {
          message: `Failed to update categories.`,
        },
        { status: 500 }
      );
    }
  }

  revalidatePath(`/${type}s`);
  return Response.json({ message: "Categories updated successfully." });
});

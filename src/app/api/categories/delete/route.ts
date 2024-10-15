import { auth } from "@/auth";
import prisma from "@/db";
import { validateCategoriesFields } from "@/lib/categories-utils";
import { CategoriesRequestBody } from "@/types";
import { revalidatePath } from "next/cache";

export const DELETE = auth(async function DELETE(req) {
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

  try {
    await prisma.category.deleteMany({
      where: {
        userId,
        name: {
          in: categories.map((deletedCateg) => deletedCateg.oldVal),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: `Failed to delete categories.`,
      },
      { status: 500 }
    );
  }

  revalidatePath(`/${type}s`);
  return Response.json({ message: "Categories deleted successfully." });
});

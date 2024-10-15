import { auth } from "@/auth";
import prisma from "@/db";
import { validateCategoriesFields } from "@/lib/categories-utils";
import { generateRandomColor } from "@/lib/utils";
import { CategoriesRequestBody } from "@/types";
import { revalidatePath } from "next/cache";

export const POST = auth(async function POST(req) {
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
    await prisma.category.createMany({
      data: categories.map((categ) => ({
        type,
        name: categ.newVal,
        emoji: categ.emoji,
        color: categ.color || generateRandomColor(),
        userId,
      })),
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: `Failed to add categories.`,
      },
      { status: 500 }
    );
  }

  revalidatePath(`/${type}s`);
  return Response.json({ message: "Categories added successfully." });
});

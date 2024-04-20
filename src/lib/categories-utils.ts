import { ILocalCategory } from "@/types";
import { z } from "zod";

const FormSchema = z.object({
  id: z.number(),
  oldVal: z.string(),
  newVal: z.string().refine((arg) => arg.trim().length > 0 && arg[0] !== " ", {
    message: "Category name must not start with a whitespace.",
  }),
  emoji: z.string().refine((arg) => !!arg, {
    message: "Please select an emoji.",
  }),
  isEditing: z.optional(z.boolean()),
  isAdded: z.optional(z.boolean()),
  isDeletedLocally: z.optional(z.boolean()),
  isUpdated: z.optional(z.boolean()),
});
const CategorySchema = FormSchema.omit({ id: true });
const CategoriesSchema = z.array(CategorySchema);

export const validateCategoriesFields = (categories: ILocalCategory[]) =>
  CategoriesSchema.safeParse(categories);

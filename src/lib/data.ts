import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { validateFilter } from "./utils";

export async function fetchFilteredExpenses(
  query: string,
  filter: { filterBy?: "day" | "month" | "year" | string; date?: string }
) {
  let filterData;
  const currentYear = new Date().getFullYear();
  const { filterBy, date } = validateFilter(filter);

  if (filterBy === "day") {
    const dateArray = date.split("-");
    const day = dateArray[0];
    const month = dateArray[1];
    const year = dateArray[2];

    filterData = {
      gte: new Date(`${year}-${month}-${day}T00:00:00.000`),
      lte: new Date(`${year}-${month}-${day}T23:59:59.999`),
    };
  } else if (filterBy === "year") {
    filterData = {
      gte: new Date(`${date}-01-01`),
      lte: new Date(`${date}-12-31`),
    };
  } else if (filterBy === "month") {
    if (date === "12") {
      filterData = {
        gte: new Date(`${currentYear}-${date}-01`),
        lte: new Date(`${currentYear + 1}-01-01`),
      };
    } else {
      filterData = {
        gte: new Date(`${currentYear}-${date}-01`),
        lte: new Date(
          `${currentYear}-${(parseInt(date) + 1)
            .toString()
            .padStart(2, "0")}-01`
        ),
      };
    }
  } else {
    throw new Error(`Filter by options can only be 'day', 'month' or 'year'`);
  }

  try {
    const expenses = await prisma.expense.findMany({
      where: query
        ? {
            AND: [
              {
                date: filterData,
              },
              {
                OR: [
                  { category: { contains: query } },
                  { note: { contains: query } },
                  { location: { contains: query } },
                  { amount: Number(query) * 100 || 0 },
                ],
              },
            ],
          }
        : { date: filterData },
      orderBy: { date: "desc" },
    });

    revalidatePath("/expenses");
    return expenses;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch expenses.");
  }
}

export async function fetchExpenseById(id: string) {
  try {
    const data = await prisma.expense.findUnique({ where: { id } });
    if (data) {
      const expense = { ...data, amount: data.amount / 100 };
      revalidatePath(`/expense/${id}/edit`);
      return expense;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function fetchTransactionCategories(type: "expense" | "income") {
  return prisma.category.findMany({ where: { type } });
}

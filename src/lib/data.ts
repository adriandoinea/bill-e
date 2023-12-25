import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function fetchFilteredExpenses(
  query: string,
  filter: { filterBy: "day" | "month" | "year" | string; date: string }
) {
  const dateArray = filter.date.split("-");
  const day = dateArray[0];
  const month = dateArray[1];
  const year = dateArray[2];

  let filterData = {
    gte: new Date(`${year}-${month}-${day}T00:00:00.000`),
    lte: new Date(`${year}-${month}-${day}T23:59:59.999`),
  };

  if (filter.filterBy === "month") {
    if (month === "12") {
      filterData = {
        gte: new Date(`${year}-${month}-01`),
        lte: new Date(`${parseInt(year) + 1}-01-01`),
      };
    } else {
      filterData = {
        gte: new Date(`${year}-${month}-01`),
        lte: new Date(
          `${year}-${(parseInt(month) + 1).toString().padStart(2, "0")}-01`
        ),
      };
    }
  } else if (filter.filterBy === "year") {
    filterData = {
      gte: new Date(`${year}-01-01`),
      lte: new Date(`${year}-12-31`),
    };
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

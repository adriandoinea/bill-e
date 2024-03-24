import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { validateFilter } from "../utils";
import { IExpense } from "@/types";

export async function fetchFilteredTransactions(
  query: string,
  filter: { filterBy?: "day" | "month" | "year" | string; date?: string },
  type: "expense" | "income"
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
      gte: new Date(`${date}-01-01T00:00:00.000`),
      lte: new Date(`${date}-12-31T23:59:59.999`),
    };
  } else if (filterBy === "month") {
    if (date === "12") {
      filterData = {
        gte: new Date(`${currentYear}-${date}-01T00:00:00.000`),
        lte: new Date(`${currentYear + 1}-01-01T23:59:59.999`),
      };
    } else {
      filterData = {
        gte: new Date(`${currentYear}-${date}-01T00:00:00.000`),
        lte: new Date(
          `${currentYear}-${(parseInt(date) + 1)
            .toString()
            .padStart(2, "0")}-01T23:59:59.999`
        ),
      };
    }
  } else {
    throw new Error(`Filter by options can only be 'day', 'month' or 'year'`);
  }

  try {
    const transactions = await queryTransactions(type, filterData, query);

    revalidatePath(`/${type}s`);
    return transactions;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch expenses.");
  }
}

export async function fetchTransactionById(
  id: string,
  type: "expense" | "income"
) {
  try {
    const data =
      type === "expense"
        ? await prisma.expense.findUnique({
            where: { id },
            include: { category: { select: { name: true } } },
          })
        : await prisma.income.findUnique({
            where: { id },
            include: { category: { select: { name: true } } },
          });

    if (data) {
      const expense = { ...data, amount: data.amount / 100 };
      revalidatePath(`/${type}/${id}/edit`);
      return expense as IExpense;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function fetchTransactionCategories(type: "expense" | "income") {
  return prisma.category.findMany({ where: { type } });
}

export const queryTransactions = async (
  type: "expense" | "income",
  filterData: { gte: Date; lte: Date },
  query: string,
  categoryName?: string
) => {
  if (type === "expense") {
    return await prisma.expense.findMany({
      where: query
        ? {
            AND: [
              {
                date: filterData,
                category: { name: categoryName },
              },
              {
                OR: [
                  { category: { name: { contains: query } } },
                  { note: { contains: query } },
                  { location: { contains: query } },
                  { amount: Number(query) * 100 || 0 },
                ],
              },
            ],
          }
        : { date: filterData, category: { name: categoryName } },
      include: { category: { select: { name: true } } },
      orderBy: { date: "desc" },
    });
  }

  return await prisma.income.findMany({
    where: query
      ? {
          AND: [
            {
              date: filterData,
            },
            {
              OR: [
                {
                  category: {
                    name: { contains: query },
                  },
                },
                { note: { contains: query } },
                { amount: Number(query) * 100 || 0 },
              ],
            },
          ],
        }
      : { date: filterData },
    include: { category: { select: { name: true } } },
    orderBy: { date: "desc" },
  });
};

export const sumOfExpenses = (expenses?: IExpense[]) => {
  let s = 0;
  if (expenses && expenses.length > 0) {
    for (let expense of expenses) {
      s += expense.amount;
    }

    return s;
  }
  return 0;
};

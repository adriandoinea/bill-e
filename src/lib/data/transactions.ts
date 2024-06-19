import prisma from "@/db";
import { IExpense } from "@/types";
import { revalidatePath } from "next/cache";
import { validateFilter } from "../utils";

export async function fetchFilteredTransactions(
  query: string,
  filter: { filterBy?: string; date?: string },
  type: "expense" | "income"
) {
  const filterData = getFilterData(filter);
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
            include: { category: true },
          })
        : await prisma.income.findUnique({
            where: { id },
            include: { category: true },
          });

    if (data) {
      const expense = { ...data, amount: data.amount / 100 };
      revalidatePath(`/${type}/${id}/edit`);
      return expense;
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
  query?: string,
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
      include: { category: true },
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
    include: { category: true },
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

export const getMonthlyTotal = async (type: "expense" | "income") => {
  const currentMonth = (new Date().getMonth() + 1).toString();
  const filterData = getFilterData({ filterBy: "month", date: currentMonth });
  const transactions = await queryTransactions(type, filterData);

  const sumInCents = transactions.reduce((acc, current) => {
    return (acc += current.amount);
  }, 0);
  return sumInCents;
};

export const getFilterData = (filter: { filterBy?: string; date?: string }) => {
  const currentYear = new Date().getFullYear();
  const { filterBy, date } = validateFilter(filter);

  switch (filterBy) {
    case "day":
      const dateArray = date.split("-");
      const day = dateArray[0];
      const month = dateArray[1];
      const year = dateArray[2];
      return {
        gte: new Date(`${year}-${month}-${day}T00:00:00.000`),
        lte: new Date(`${year}-${month}-${day}T23:59:59.999`),
      };

    case "year":
      return {
        gte: new Date(`${date}-01-01T00:00:00.000`),
        lte: new Date(`${date}-12-31T23:59:59.999`),
      };

    case "month":
      if (date === "12") {
        return {
          gte: new Date(`${currentYear}-${date}-01T00:00:00.000`),
          lte: new Date(`${currentYear + 1}-01-01T00:00:00.000`),
        };
      } else {
        const newCurrentMonth =
          parseInt(date) < 10 ? date.padStart(2, "0") : date;
        const nextMonth =
          parseInt(date) < 9
            ? (parseInt(date) + 1).toString().padStart(2, "0")
            : date;

        const lte = new Date(`${currentYear}-${nextMonth}-01T00:00:00.000`);
        lte.setMilliseconds(-1);
        return {
          gte: new Date(`${currentYear}-${newCurrentMonth}-01T00:00:00.000`),
          lte,
        };
      }

    default:
      throw new Error(`'Filter by' can only be 'day', 'month' or 'year'`);
  }
};

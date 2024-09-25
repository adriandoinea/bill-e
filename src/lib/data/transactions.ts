import prisma from "@/db";
import { FilterParams, IExpense } from "@/types";
import { revalidatePath } from "next/cache";
import {
  calculatePercentageChange,
  getFilterData,
  getLastSixMonths,
  getTopSpentBudget,
} from "../utils";
import { fetchFilteredBudgets } from "./budgets";
import dayjs from "dayjs";
import { auth } from "@/auth";

export const fetchFilteredTransactions = async (
  query: string,
  filter: FilterParams,
  type: "expense" | "income"
) => {
  const filterData = getFilterData(filter);
  if (filterData.gte > filterData.lte) {
    return;
  }

  try {
    const transactions = await queryTransactions(type, filterData, query);
    revalidatePath(`/${type}s`);
    return transactions;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch expenses.");
  }
};

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
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User ID is required");
  }

  return prisma.category.findMany({ where: { type, userId } });
}

export const queryTransactions = async (
  type: "expense" | "income",
  filterData: { gte: Date; lte: Date },
  query?: string,
  categoryName?: string
) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (type === "expense") {
    return await prisma.expense.findMany({
      where: query
        ? {
            AND: [
              {
                userId,
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
        : {
            userId,
            date: filterData,
            category: { name: categoryName },
          },
      include: { category: true },
      orderBy: { date: "desc" },
    });
  }

  return await prisma.income.findMany({
    where: query
      ? {
          AND: [
            {
              userId,
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
      : { userId, date: filterData },
    include: { category: true },
    orderBy: { date: "desc" },
  });
};

export const sumOfExpenses = (expenses: IExpense[]) => {
  return expenses.reduce((acc, current) => (acc += current.amount), 0);
};

export const getMonthTotal = async (
  month: number,
  year: number,
  type: "expense" | "income"
) => {
  const formattedMonth = month.toString().padStart(2, "0");
  const lastDayOfTheMonth = dayjs(`${year}-${formattedMonth}-01`)
    .endOf("month")
    .date();
  const filterData = getFilterData({
    from: `01-${formattedMonth}-${year}`,
    to: `${lastDayOfTheMonth}-${formattedMonth}-${year}`,
  });

  const transactions = await queryTransactions(type, filterData, "");
  const sumInCents = transactions.reduce((acc, current) => {
    return (acc += current.amount);
  }, 0);
  return sumInCents / 100;
};

export const getMonthTotalByCategory = async (
  month: number,
  year: number,
  type: "expense" | "income"
) => {
  const formattedMonth = month.toString().padStart(2, "0");
  const lastDayOfTheMonth = dayjs(`${year}-${formattedMonth}-01`)
    .endOf("month")
    .date();
  const filterData = getFilterData({
    from: `01-${formattedMonth}-${year}`,
    to: `${lastDayOfTheMonth}-${formattedMonth}-${year}`,
  });
  const currentMonthTransactions = await queryTransactions(
    type,
    filterData,
    ""
  );

  const transactionsTotalPerCategs = currentMonthTransactions.reduce(
    (acc: Record<string, { amount: number; color: string }>, current) => {
      if (acc[current.categoryName]?.amount) {
        acc[current.categoryName].amount += current.amount;
      } else
        acc[current.categoryName] = {
          amount: current.amount,
          color: current.category.color,
        };

      return acc;
    },
    {}
  );

  return transactionsTotalPerCategs;
};

export const getLineChartData = async (type: "expense" | "income") => {
  const last6Months = getLastSixMonths();
  const result = [];
  for (const item of last6Months) {
    const { monthNum, month, year } = item;
    const total = await getMonthTotal(monthNum, year, type);
    result.push({ x: month, y: total });
  }

  return result;
};

export const getRecentExpenses = async (take?: number) => {
  return await prisma.expense.findMany({
    orderBy: [{ date: "desc" }],
    take: take || 10,
    include: { category: true },
  });
};

export const getInsights = async () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const lastMonth = currentMonth > 1 ? currentMonth - 1 : 12;
  const yearForLastMonth = currentMonth > 1 ? currentYear : currentYear - 1;

  const lastMonthExpensesTotal = await getMonthTotal(
    lastMonth,
    yearForLastMonth,
    "expense"
  );
  const currentMonthExpensesTotal = await getMonthTotal(
    currentMonth,
    currentYear,
    "expense"
  );
  const expensePercentageChange = calculatePercentageChange(
    lastMonthExpensesTotal,
    currentMonthExpensesTotal
  );

  const lastMonthIncomeTotal = await getMonthTotal(
    lastMonth,
    yearForLastMonth,
    "income"
  );
  const currentMonthIncomeTotal = await getMonthTotal(
    currentMonth,
    currentYear,
    "income"
  );
  const incomePercentageChange = calculatePercentageChange(
    lastMonthIncomeTotal,
    currentMonthIncomeTotal
  );

  const budgets = await fetchFilteredBudgets("monthly");
  const budgetsCompletionPercentages = budgets.map((budget) => ({
    name: budget.categoryName,
    spentPercent: Math.round(
      ((budget.initAmount - budget.currentAmount) / budget.initAmount) * 100
    ),
    initAmount: budget.initAmount / 100,
    currentAmount: budget.currentAmount / 100,
  }));
  const budgetDetails = getTopSpentBudget(budgetsCompletionPercentages);

  return {
    transactionsPercentageChange: {
      expenses: expensePercentageChange,
      income: incomePercentageChange,
    },
    budgetDetails,
  };
};

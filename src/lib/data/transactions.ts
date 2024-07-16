import prisma from "@/db";
import { IExpense } from "@/types";
import { revalidatePath } from "next/cache";
import {
  calculatePercentageChange,
  getFilterData,
  getLastSixMonths,
  getTopSpentBudget,
} from "../utils";
import { fetchFilteredBudgets } from "./budgets";

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

export const sumOfExpenses = (expenses: IExpense[]) => {
  return expenses.reduce((acc, current) => (acc += current.amount), 0);
};

export const getMonthlyTotal = async (
  month: number,
  type: "expense" | "income"
) => {
  const filterData = getFilterData({
    filterBy: "month",
    date: month.toString(),
  });
  const transactions = await queryTransactions(type, filterData);

  const sumInCents = transactions.reduce((acc, current) => {
    return (acc += current.amount);
  }, 0);
  return sumInCents / 100;
};

export const getMonthlyTotalByCategory = async (
  month: number,
  type: "expense" | "income"
) => {
  const filter = getFilterData({ filterBy: "month", date: month.toString() });
  const lastMonthTransactions = await queryTransactions(type, filter);
  const transactionsTotalPerCategs = lastMonthTransactions.reduce(
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
    const { monthNum, month } = item;
    const total = await getMonthlyTotal(monthNum, type);
    result.push({ x: month, y: total });
  }
  return result;
};

export const getRecentExpenses = async () => {
  return await prisma.expense.findMany({
    orderBy: [{ date: "desc" }],
    take: 10,
    include: { category: true },
  });
};

export const getInsights = async () => {
  const currentMonth = new Date().getMonth() + 1;
  const lastMonth = currentMonth - 1;
  const lastMonthExpensesTotal = await getMonthlyTotal(lastMonth, "expense");
  const currentMonthExpensesTotal = await getMonthlyTotal(
    currentMonth,
    "expense"
  );
  const expensePercentageChange = calculatePercentageChange(
    lastMonthExpensesTotal,
    currentMonthExpensesTotal
  );
  const lastMonthIncomeTotal = await getMonthlyTotal(lastMonth, "income");
  const currentMonthIncomeTotal = await getMonthlyTotal(currentMonth, "income");
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

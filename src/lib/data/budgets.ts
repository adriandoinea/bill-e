import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { queryTransactions, sumOfExpenses } from "./transactions";
import prisma from "@/db";
import { revalidatePath } from "next/cache";

dayjs.extend(weekOfYear);
export async function fetchFilteredBudgets(
  resetPeriod?: "daily" | "weekly" | "monthly" | "yearly" | string
) {
  const currentDay = new Date().getDate();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const currentYear = new Date().getFullYear();
  const lastDayOfTheMonth = dayjs().endOf("month").date();

  //resetPeriod = "monthly" || !resetPeriod
  let filterData = {
    gte: new Date(`${currentYear}-${currentMonth}-01T00:00:00.000`),
    lte: new Date(
      `${currentYear}-${currentMonth}-${lastDayOfTheMonth}T23:59:59.999`
    ),
  };

  if (resetPeriod === "daily") {
    filterData = {
      gte: new Date(
        `${currentYear}-${currentMonth}-${currentDay}T00:00:00.000`
      ),
      lte: new Date(
        `${currentYear}-${currentMonth}-${currentDay}T23:59:59.999`
      ),
    };
  } else if (resetPeriod === "weekly") {
    const firstDayOfWeek = dayjs().startOf("week").day(1);
    const lastDayOfWeek = firstDayOfWeek.add(6, "day").endOf("day");

    filterData = {
      gte: firstDayOfWeek.toDate(),
      lte: lastDayOfWeek.toDate(),
    };
  } else if (resetPeriod === "yearly") {
    filterData = {
      gte: new Date(`${currentYear}-${currentMonth}-01T00:00:00.000`),
      lte: new Date(`${currentYear}-12-31T23:59:59.999`),
    };
  }

  const budgets = await prisma.budget.findMany({
    where: { resetPeriod: resetPeriod || "monthly" },
  });

  let expenses: Record<string, any> = {};
  for (let budget of budgets) {
    const tempExpenses = await queryTransactions(
      "expense",
      filterData,
      "",
      budget.category
    );
    if (tempExpenses.length > 0) {
      expenses = { ...expenses, [budget.category]: tempExpenses };
    }
  }

  for (let budget of budgets) {
    const expensesForBudget = expenses[budget.category];
    budget.currentAmount = budget.initAmount - sumOfExpenses(expensesForBudget);
    await prisma.budget.update({ where: { id: budget.id }, data: budget });
  }

  return budgets;
}
export async function fetchBudgetById(id: string) {
  try {
    const data = await prisma.budget.findUnique({ where: { id } });

    if (data) {
      const budget = {
        ...data,
        initAmount: data.initAmount / 100,
        currentAmount: data.currentAmount / 100,
      };
      revalidatePath(`/budgets/${id}/edit`);
      return budget;
    }
  } catch (error) {
    console.error(error);
  }
}

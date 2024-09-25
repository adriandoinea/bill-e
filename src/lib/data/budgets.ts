import prisma from "@/db";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { queryTransactions, sumOfExpenses } from "./transactions";
import { auth } from "@/auth";

export async function fetchFilteredBudgets(
  resetPeriod?: "daily" | "weekly" | "monthly" | "yearly" | string
) {
  const session = await auth();
  const userId = session?.user?.id;

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const currentYear = currentDate.getFullYear();
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
    where: { resetPeriod: resetPeriod || "monthly", userId },
    include: { category: true },
  });

  const expenses: Record<string, any[]> = {};
  for (let budget of budgets) {
    const tempExpenses = await queryTransactions(
      "expense",
      filterData,
      "",
      budget.category.name
    );
    if (tempExpenses.length > 0) {
      expenses[budget.category.name] = tempExpenses;
    }
  }

  for (let budget of budgets) {
    const expensesForBudget = expenses[budget.category.name];
    if (!expensesForBudget && budget.currentAmount > 0) {
      await prisma.budget.update({
        where: { id: budget.id, userId },
        data: { currentAmount: budget.initAmount },
      });
    }
    if (expensesForBudget?.length > 0) {
      const currentAmount =
        budget.initAmount - sumOfExpenses(expensesForBudget);

      const { category, ...rest } = budget;

      await prisma.budget.update({
        where: { id: budget.id, userId },
        data: { ...rest, currentAmount },
      });
    }
  }

  return budgets;
}

export async function fetchBudgetById(id: string) {
  try {
    const data = await prisma.budget.findUnique({
      where: { id },
      include: { category: true },
    });

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

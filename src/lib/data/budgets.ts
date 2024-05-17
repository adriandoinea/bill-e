import prisma from "@/db";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { revalidatePath } from "next/cache";
import { queryTransactions, sumOfExpenses } from "./transactions";

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

  const tempBudgets = [...budgets];

  for (let budget of tempBudgets) {
    const expensesForBudget = expenses[budget.category.name];
    const currentAmount = budget.initAmount - sumOfExpenses(expensesForBudget);

    const { category, ...rest } = budget;

    await prisma.budget.update({
      where: { id: budget.id },
      data: { ...rest, currentAmount },
    });
  }

  return tempBudgets;
}
export async function fetchBudgetById(id: string) {
  try {
    const data = await prisma.budget.findUnique({
      where: { id },
      include: { category: { select: { name: true } } },
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

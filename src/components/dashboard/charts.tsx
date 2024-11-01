import {
  getLineChartData,
  getMonthTotalByCategory,
} from "@/lib/data/transactions";
import { cn, roundWithTwoDecimals } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import LineChart from "../charts/line-chart";
import PieChart from "../charts/pie-chart";

export async function DashboardLineChart({
  className,
}: {
  className?: string;
}) {
  const expensesLineChartData = await getLineChartData("expense");
  const incomeLineChartData = await getLineChartData("income");

  return (
    <LineChart
      className={cn("w-full", className)}
      data={[
        {
          id: "expenses",
          color: "hsl(var(--destructive))",
          data: expensesLineChartData,
        },
        {
          id: "incomes",
          color: "hsl(var(--custom-accent))",
          data: incomeLineChartData,
        },
      ]}
    />
  );
}

export async function DashboardPieChart({
  currentMonth,
  currentYear,
  className,
}: {
  currentMonth: number;
  currentYear: number;
  className?: string;
}) {
  const monthlyDetailsByCategory = await getMonthTotalByCategory(
    currentMonth,
    currentYear,
    "expense"
  );
  const pieChartData = Object.entries(monthlyDetailsByCategory).map(
    ([category, details]) => ({
      id: category,
      value: details.amount / 100,
      color: details.color,
    })
  );

  const hasExpenses = Object.values(monthlyDetailsByCategory).some(
    (detail) => detail.amount > 0
  );
  const totalSpent = Object.values(monthlyDetailsByCategory).reduce(
    (acc, current) => (acc += current.amount / 100),
    0
  );

  if (!hasExpenses) {
    return (
      <div className="h-full flex items-center">
        No expenses added this month.
        <Link
          className="text-customAccent rounded-full hover:bg-hoverColor p-1"
          href={"/expenses/create"}
        >
          <Plus />
        </Link>
      </div>
    );
  }

  return (
    <PieChart
      isDonut
      className={cn("size-full", className)}
      centerTextClassName="text-base lg:text-xl"
      data={pieChartData}
      centerText={`${roundWithTwoDecimals(totalSpent)}`}
    />
  );
}

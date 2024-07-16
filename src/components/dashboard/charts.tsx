import {
  getLineChartData,
  getMonthlyTotalByCategory,
} from "@/lib/data/transactions";
import LineChart from "../charts/line-chart";
import PieChart from "../charts/pie-chart";

export async function DashboardLineChart() {
  const expensesLineChartData = await getLineChartData("expense");
  const incomeLineChartData = await getLineChartData("income");

  return (
    <LineChart
      className="md:col-span-2"
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
}: {
  currentMonth: number;
}) {
  const monthlyDetailsByCategory = await getMonthlyTotalByCategory(
    currentMonth,
    "expense"
  );
  const pieChartData = Object.entries(monthlyDetailsByCategory).map(
    ([category, details]) => ({
      id: category,
      value: details.amount / 100,
      color: details.color,
    })
  );

  const totalSpent = Object.values(monthlyDetailsByCategory).reduce(
    (acc, current) => (acc += current.amount / 100),
    0
  );

  return (
    <PieChart
      className="w-auto md:col-span-1"
      isDonut
      data={pieChartData}
      centerText={`$${totalSpent}`}
    />
  );
}

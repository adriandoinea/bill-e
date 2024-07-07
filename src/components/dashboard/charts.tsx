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
  const monthlyTotalByCategory = await getMonthlyTotalByCategory(
    currentMonth,
    "expense"
  );
  const pieChartData = Object.entries(monthlyTotalByCategory).map(
    ([key, value]) => ({ id: key, value: value / 100 })
  );

  return (
    <PieChart
      className="w-auto md:col-span-1"
      data={pieChartData}
      arcLabel="id"
      padAngle={0.5}
    />
  );
}

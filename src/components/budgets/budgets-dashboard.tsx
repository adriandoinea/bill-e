import BudgetCard from "./budget-card";
import { CreateBudget } from "./buttons";
import DonutChart from "./donut-chart";
import ProgressPanel from "./progress-panel";
import { fetchFilteredBudgets } from "@/lib/data/budgets";

export default async function BudgetsDashboard({
  period,
}: {
  period?: string;
}) {
  const budgets = await fetchFilteredBudgets(period);

  const donutChartData = budgets.map((budget) => budget.initAmount / 100);
  const backgroundColors = budgets.map((budget) => budget.color);
  const labels = budgets.map((budget) => budget.category);

  return (
    <>
      <div className="flex items-center gap-8 w-full">
        <DonutChart
          className="h-52 w-52"
          data={donutChartData}
          backgroundColors={backgroundColors}
          labels={labels}
        />

        <ProgressPanel budgets={budgets} className="w-full" />
      </div>

      <div className="flex flex-wrap gap-5">
        <CreateBudget />
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            id={budget.id}
            category={budget.category}
            initialAmount={budget.initAmount / 100}
            currentAmount={budget.currentAmount / 100}
            color={budget.color}
          />
        ))}
      </div>
    </>
  );
}

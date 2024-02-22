import BudgetCard from "@/components/ui/budgets/budget-card";
import { CreateBudget } from "@/components/ui/budgets/buttons";
import DonutChart from "@/components/ui/budgets/donut-chart";
import Filter from "@/components/ui/budgets/filter";
import ProgressPanel from "@/components/ui/budgets/progress-panel";
import { fetchFilteredBudgets } from "@/lib/data/budgets";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const period = searchParams.period;
  const budgets = await fetchFilteredBudgets(period);

  const donutChartData = budgets.map((budget) => budget.initAmount / 100);
  const backgroundColors = budgets.map((budget) => budget.color);
  const labels = budgets.map((budget) => budget.category);

  return (
    <div className="pl-10 pr-5 h-full flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="text-2xl mb-3">Budgets</div>
        <Filter />
      </div>

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
    </div>
  );
}

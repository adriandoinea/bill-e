import { fetchFilteredBudgets } from "@/lib/data/budgets";
import PieChart from "../charts/pie-chart";
import BudgetCard from "./budget-card";
import { CreateBudget } from "./buttons";
import ProgressPanel from "./progress-panel";

export default async function BudgetsDashboard({
  period,
}: {
  period?: string;
}) {
  const budgets = await fetchFilteredBudgets(period);

  const donutChartData = budgets.map((budget) => ({
    id: budget.category.name,
    value: (budget.initAmount - budget.currentAmount) / 100,
    color: budget.category.color,
    label: budget.category.name,
  }));
  const totalSpent = budgets.reduce((acc, current) => {
    const spent = current.initAmount - current.currentAmount;
    return (acc += spent);
  }, 0);

  return (
    <div className="flex flex-col gap-10">
      {budgets.length > 0 ? (
        <div className="flex items-center gap-8 w-full h-52">
          <PieChart
            isDonut
            data={donutChartData}
            centerText={`$${totalSpent / 100}`}
          />
          <ProgressPanel budgets={budgets} className="w-full" />
        </div>
      ) : (
        <div className="font-medium">No {period} budgets added yet.</div>
      )}

      <div className="flex flex-wrap gap-5">
        <CreateBudget />
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            id={budget.id}
            category={budget.category}
            initialAmount={budget.initAmount / 100}
            currentAmount={budget.currentAmount / 100}
            color={budget.category.color}
          />
        ))}
      </div>
    </div>
  );
}

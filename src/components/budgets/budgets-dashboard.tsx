import { fetchFilteredBudgets } from "@/lib/data/budgets";
import { cn } from "@/lib/utils";
import PieChart from "../charts/pie-chart";
import BudgetCard from "./budget-card";
import { CreateBudget } from "./buttons";
import ProgressPanel from "./progress-panel";
import { CURRENCY } from "@/lib/constants";

export default async function BudgetsDashboard({
  period,
}: {
  period?: string;
}) {
  const budgets = await fetchFilteredBudgets(period);

  const donutChartData = budgets.map((budget) => ({
    id: budget.category.name,
    value: Math.round((budget.initAmount - budget.currentAmount) / 100),
    color: budget.category.color,
    label: budget.category.name,
  }));
  const totalSpent = budgets.reduce((acc, current) => {
    const spent = current.initAmount - current.currentAmount;
    return (acc += spent);
  }, 0);

  const hasBudgetsValues = budgets.some(
    (budget) => budget.initAmount - budget.currentAmount > 0
  );

  return (
    <div className="flex flex-col gap-8">
      {budgets.length > 0 ? (
        <div
          className={cn(
            "w-full flex flex-col md:flex-row items-center gap-4 md:gap-8"
          )}
        >
          {hasBudgetsValues && (
            <PieChart
              isDonut
              data={donutChartData}
              centerText={`${Math.round(totalSpent / 100)} ${CURRENCY}`}
              centerTextClassName="text-base lg:text-2xl"
              className="h-56 w-full md:w-1/3"
            />
          )}
          <ProgressPanel
            budgets={budgets}
            className={cn("w-full md:w-2/3", {
              "md:w-full": !hasBudgetsValues,
            })}
          />
        </div>
      ) : (
        <div className="font-medium">No {period} budgets added yet.</div>
      )}

      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
        <CreateBudget />
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            id={budget.id}
            category={budget.category}
            initialAmount={Math.round(budget.initAmount / 100)}
            currentAmount={Math.round(budget.currentAmount / 100)}
            color={budget.category.color}
          />
        ))}
      </div>
    </div>
  );
}

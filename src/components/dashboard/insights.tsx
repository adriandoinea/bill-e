import { getInsights } from "@/lib/data/transactions";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

export default async function Insights({ className }: { className?: string }) {
  const { transactionsPercentageChange, budgetDetails } = await getInsights();

  const getExpensesPercentChangeMessage = () => {
    const { expenses: percentageChange } = transactionsPercentageChange;
    if (!percentageChange) return null;
    if (percentageChange > 0) {
      return (
        <>
          You spent {percentageChange.toFixed(0)}% more this month compared to
          last month.
          <ArrowUpIcon className="size-12 md:size-5 text-destructive" />
        </>
      );
    } else if (percentageChange < 0) {
      return (
        <>
          <span>
            You spent {Math.abs(percentageChange).toFixed(0)}% less this month
            compared to last month.
          </span>
          <ArrowDownIcon className="size-12 md:size-5 text-green-500" />
        </>
      );
    } else return <>Your spending is the same as last month.</>;
  };

  const getIncomePercentChangeMessage = () => {
    const { income: percentageChange } = transactionsPercentageChange;
    if (!percentageChange) return null;
    if (percentageChange > 0) {
      return (
        <>
          <span>
            Your income increased by {percentageChange.toFixed(0)}% this month
            compared to last month.
          </span>
          <ArrowUpIcon className="size-12 md:size-5 text-green-500" />
        </>
      );
    } else if (percentageChange < 0) {
      return (
        <>
          <span>
            Your income decreased by {Math.abs(percentageChange).toFixed(0)}%
            this month compared to last month.
          </span>
          <ArrowDownIcon className="size-12 md:size-5 text-destructive" />
        </>
      );
    } else return <>Your income is the same as last month.</>;
  };

  const expensesPercentChangeMessage = getExpensesPercentChangeMessage();
  const incomePercentChangeMessage = getIncomePercentChangeMessage();

  const budgetMessage = budgetDetails
    ? `You spent $${
        budgetDetails.initAmount - budgetDetails.currentAmount
      } on ${budgetDetails.name} this month. That's ${
        budgetDetails.spentPercent
      }% of this category's budget.`
    : null;

  return (
    <Card className={cn("h-full w-full overflow-auto", className)}>
      <CardHeader className="px-4 md:px-6">
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6 text-sm md:text-base">
        <div className="grid gap-2">
          <div className="font-medium flex items-center justify-between gap-1">
            {expensesPercentChangeMessage}
          </div>
          <div className="font-medium flex items-center justify-between gap-1">
            {incomePercentChangeMessage}
          </div>
          <div className="font-medium flex items-center justify-between gap-1">
            {budgetMessage}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

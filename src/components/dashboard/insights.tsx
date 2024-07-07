import { getInsights } from "@/lib/data/transactions";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default async function Insights() {
  const { transactionsPercentageChange, budgetDetails } = await getInsights();

  const getExpensesPercentChangeMessage = () => {
    const { expenses: percentageChange } = transactionsPercentageChange;
    if (!percentageChange) return null;
    if (percentageChange > 0) {
      return (
        <>
          You spent {percentageChange.toFixed(0)}% more this month compared to
          last month.
          <ArrowUpIcon className="h-5 w-5 text-destructive" />
        </>
      );
    } else if (percentageChange < 0) {
      return (
        <>
          You spent {Math.abs(percentageChange).toFixed(0)}% less this month
          compared to last month.
          <ArrowDownIcon className="h-5 w-5 text-green-500" />
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
          Your income increased by {percentageChange.toFixed(0)}% this month
          compared to last month.
          <ArrowUpIcon className="h-5 w-5 text-green-500" />
        </>
      );
    } else if (percentageChange < 0) {
      return (
        <>
          Your income decreased by {Math.abs(percentageChange).toFixed(0)}% this
          month compared to last month.
          <ArrowDownIcon className="h-5 w-5 text-destructive" />
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
    <Card className="h-full w-full overflow-hidden">
      <CardHeader>
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <h4 className="text-md font-medium flex items-center justify-between">
            {expensesPercentChangeMessage}
          </h4>
          <h4 className="text-md font-medium flex items-center justify-between">
            {incomePercentChangeMessage}
          </h4>
          <h4 className="text-md font-medium flex items-center justify-between">
            {budgetMessage}
          </h4>
        </div>
      </CardContent>
    </Card>
  );
}

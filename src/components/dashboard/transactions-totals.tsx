import { getMonthTotal } from "@/lib/data/transactions";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CURRENCY } from "@/lib/constants";

interface Props {
  currentMonth: number;
  currentYear: number;
}
export default async function TransactionsTotals({
  currentMonth,
  currentYear,
}: Props) {
  const totalExpenses = await getMonthTotal(
    currentMonth,
    currentYear,
    "expense"
  );
  const totalIncome = await getMonthTotal(currentMonth, currentYear, "income");
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="grid gap-2 md:grid-cols-3 md:gap-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Expenses</CardDescription>
          <CardTitle>
            {totalExpenses} {CURRENCY}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Total Income</CardDescription>
          <CardTitle>
            {totalIncome} {CURRENCY}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Net balance</CardDescription>
          <CardTitle>
            {netBalance} {CURRENCY}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

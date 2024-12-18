import { getMonthTotal } from "@/lib/data/transactions";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CURRENCY } from "@/lib/constants";
import { roundWithTwoDecimals } from "@/lib/utils";

interface Props {
  month: number;
  year: number;
}
export default async function TransactionsTotals({ month, year }: Props) {
  const totalExpenses = await getMonthTotal(month, year, "expense");
  const totalIncome = await getMonthTotal(month, year, "income");
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="grid gap-2 md:grid-cols-3 md:gap-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Expenses</CardDescription>
          <CardTitle>
            {roundWithTwoDecimals(totalExpenses)} {CURRENCY}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Total Income</CardDescription>
          <CardTitle>
            {roundWithTwoDecimals(totalIncome)} {CURRENCY}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Net balance</CardDescription>
          <CardTitle>
            {roundWithTwoDecimals(netBalance)} {CURRENCY}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

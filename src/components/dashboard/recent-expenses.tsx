import { getRecentExpenses } from "@/lib/data/transactions";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn, convertDateToString } from "@/lib/utils";
import { CURRENCY } from "@/lib/constants";

export default async function RecentExpenses({
  month,
  year,
  className,
}: {
  month: number;
  year: number;
  className?: string;
}) {
  const recentExpenses = await getRecentExpenses({ month, year });

  return (
    <Card className={cn("h-full w-full overflow-auto", className)}>
      <CardHeader className="px-4 md:px-6">
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span className="hidden sm:inline">Hover to see the date</span>
          <Link href="/expenses">
            {recentExpenses.length > 0 ? "View all" : "Add"}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 px-4 md:px-6 text-sm md:text-base">
        {recentExpenses.length > 0 ? (
          recentExpenses.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between"
              title={convertDateToString(transaction.date)}
            >
              <div className="font-medium">
                {transaction.category.emoji} {transaction.categoryName}
              </div>
              <div className="font-semibold">
                {transaction.amount / 100} {CURRENCY}
              </div>
            </div>
          ))
        ) : (
          <span>No expenses added this month.</span>
        )}
      </CardContent>
    </Card>
  );
}

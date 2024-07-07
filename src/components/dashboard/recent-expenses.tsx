import { getRecentExpenses } from "@/lib/data/transactions";
import dayjs from "dayjs";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default async function RecentExpenses() {
  const recentExpenses = await getRecentExpenses();
  return (
    <Card className="h-full w-full overflow-hidden hover:overflow-auto">
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>Hover to see the date</span>
          <Link href="/expenses">
            {recentExpenses.length > 0 ? "View all" : "Add"}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {recentExpenses.length > 0 ? (
          recentExpenses.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between"
              title={dayjs(transaction.date).format("DD-MM-YYYY")}
            >
              <div className="font-medium">
                {transaction.category.emoji} {transaction.categoryName}
              </div>
              <div className="font-semibold">${transaction.amount / 100}</div>
            </div>
          ))
        ) : (
          <span>No transactions added yet.</span>
        )}
      </CardContent>
    </Card>
  );
}

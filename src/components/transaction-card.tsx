import { IExpense, IIncome } from "@/types";
import { Card } from "./ui/card";
import dayjs from "dayjs";
import { DeleteExpense, EditExpense } from "./expenses/buttons";
import { DeleteIncome, EditIncome } from "./incomes/buttons";
import { cn } from "@/lib/utils";

interface Props {
  transaction: IExpense | IIncome;
  className?: string;
}

export default function TransactionCard({ transaction, className }: Props) {
  return (
    <Card key={transaction.id} className={cn("p-4", className)}>
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">
          {transaction.category.emoji} {transaction.category.name}
        </div>
        <div className="font-bold">
          ${(transaction.amount / 100).toFixed(2)}
        </div>
      </div>
      <div className="text-sm text-muted-foreground mb-2">
        {dayjs(transaction.date).format("DD MMM YY")}
      </div>
      {transaction.note && (
        <div className="text-sm mb-2">
          <span className="font-medium">Note:</span> {transaction.note}
        </div>
      )}
      {"location" in transaction && transaction.location && (
        <div className="text-sm mb-2">
          <span className="font-medium">Location:</span>{" "}
          {transaction.location as string}
        </div>
      )}
      <div className="flex justify-end gap-2 mt-2">
        {transaction.category.type === "expense" ? (
          <>
            <EditExpense id={transaction.id} />
            <DeleteExpense id={transaction.id} />
          </>
        ) : transaction.category.type === "income" ? (
          <>
            <EditIncome id={transaction.id} />
            <DeleteIncome id={transaction.id} />
          </>
        ) : null}
      </div>
    </Card>
  );
}
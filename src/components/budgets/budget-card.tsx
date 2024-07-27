import { cn } from "@/lib/utils";
import { DeleteBudget, EditBudget } from "./buttons";

interface BudgetCardProps {
  id: string;
  category: { name: string; emoji: string };
  initialAmount: number;
  currentAmount: number;
  color: string;
}

export default function BudgetCard({
  id,
  category,
  initialAmount,
  currentAmount,
  color,
}: BudgetCardProps) {
  return (
    <div className="w-56 h-40 bg-accent dark:bg-background px-5 py-2 border-2 rounded-md flex flex-col justify-center items-center">
      <div className="w-full flex items-center justify-end gap-1">
        <EditBudget id={id} />
        <DeleteBudget id={id} />
      </div>

      <div
        style={{ backgroundColor: color }}
        className="flex items-center justify-center rounded-full h-7 w-7"
      >
        <div className="text-lg">{category.emoji}</div>
      </div>
      <div className="text-center">
        <div>{category.name}</div>
        <div>${initialAmount}</div>
      </div>
      <div className="w-full flex justify-between">
        <div className="flex flex-col items-center">
          <div>Spent</div>
          <div> ${initialAmount - currentAmount}</div>
        </div>
        <div className="text-4xl font-extralight">|</div>
        <div className="flex flex-col items-center">
          <div>Left</div>
          <div className={cn({ "text-destructive": currentAmount < 0 })}>
            ${currentAmount}
          </div>
        </div>
      </div>
    </div>
  );
}

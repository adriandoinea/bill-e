import { cn, roundWithTwoDecimals } from "@/lib/utils";
import { DeleteBudget, EditBudget } from "./buttons";
import { CURRENCY } from "@/lib/constants";

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
  const roundedInitAmount = roundWithTwoDecimals(initialAmount);
  const roundedCurrentAmount = roundWithTwoDecimals(currentAmount);
  return (
    <div className="w-auto h-36 sm:w-56 sm:h-40 bg-accent dark:bg-background px-5 py-2 border-2 rounded-md flex flex-col flex-wrap justify-center items-center">
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
        <div>
          {roundedInitAmount} {CURRENCY}
        </div>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col items-center">
          <div>Spent</div>
          <div>{roundedInitAmount - roundedCurrentAmount}</div>
        </div>
        <div className="text-4xl font-thin">|</div>
        <div className="flex flex-col items-center">
          <div>Left</div>
          <div className={cn({ "text-destructive": roundedCurrentAmount < 0 })}>
            {roundedCurrentAmount}
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { IBudget } from "@/types";
import { Progress } from "../ui/progress";

export default async function ProgressPanel({
  budgets,
  className,
}: {
  budgets: IBudget[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-h-52 flex flex-col gap-1 border-secondary border-2 px-4 py-5 rounded-md overflow-auto",
        className
      )}
    >
      {budgets.map((budget) => {
        const value = Math.round(
          ((budget.initAmount - budget.currentAmount) / budget.initAmount) * 100
        );
        return (
          <div key={budget.id} className="flex items-center justify-between">
            <div className="w-48 truncate">{budget.category.name}</div>
            <div className="relative w-full flex items-center">
              <Progress value={value} color={budget.category.color} />
              <div
                className={cn("absolute left-1/2 text-primary", {
                  "text-destructive": value > 100,
                })}
              >
                {value}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

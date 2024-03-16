import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { IBudget } from "@/types";

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
            <div className="w-48 truncate">{budget.category}</div>
            <div className="relative w-full flex items-center">
              <Progress value={value} color={budget.color} />
              <div className="absolute left-1/2 text-primary">{value}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import BudgetsDashboard from "@/components/budgets/budgets-dashboard";
import Filter from "@/components/budgets/filter";
import { BudgetsDashboardSkeleton } from "@/components/skeletons";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const period = searchParams.period;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="text-2xl mb-3">Budgets</div>
        <Filter />
      </div>

      <Suspense key={period} fallback={<BudgetsDashboardSkeleton />}>
        <BudgetsDashboard period={period} />
      </Suspense>
    </div>
  );
}

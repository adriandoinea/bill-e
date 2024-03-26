import { BudgetsDashboardSkeleton } from "@/components/skeletons";
import BudgetsDashboard from "@/components/budgets/budgets-dashboard";
import Filter from "@/components/budgets/filter";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const period = searchParams.period;

  return (
    <div className="pl-10 pr-5 h-full flex flex-col gap-6">
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

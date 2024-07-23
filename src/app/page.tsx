import {
  DashboardLineChart,
  DashboardPieChart,
} from "@/components/dashboard/charts";
import Insights from "@/components/dashboard/insights";
import RecentExpenses from "@/components/dashboard/recent-expenses";
import TransactionsTotals from "@/components/dashboard/transactions-totals";
import {
  DashboardBottomSectionSkeleton,
  DashboardPieChartSkeleton,
  LineChartSkeleton,
  TransactionsTotalsSkeleton,
} from "@/components/skeletons";
import { Suspense } from "react";

export default async function Page() {
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="pl-10 pr-5 h-full flex flex-col gap-6">
      <div className="text-2xl mb-3">Dashboard</div>
      <div className="flex flex-col gap-6">
        <Suspense key={currentMonth} fallback={<TransactionsTotalsSkeleton />}>
          <TransactionsTotals currentMonth={currentMonth} />
        </Suspense>

        <div className="grid md:grid-cols-3">
          <Suspense fallback={<LineChartSkeleton />}>
            <DashboardLineChart className="col-span-2" />
          </Suspense>

          <Suspense key={currentMonth} fallback={<DashboardPieChartSkeleton />}>
            <DashboardPieChart currentMonth={currentMonth} />
          </Suspense>
        </div>

        <div className="max-h-60 flex gap-6">
          <Suspense fallback={<DashboardBottomSectionSkeleton />}>
            <RecentExpenses />
          </Suspense>

          <Suspense fallback={<DashboardBottomSectionSkeleton />}>
            <Insights />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

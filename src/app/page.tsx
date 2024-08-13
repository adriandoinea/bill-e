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
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="text-2xl mb-3">Dashboard</div>
      <div className="flex flex-col gap-6">
        <Suspense
          key={`${currentMonth}-${currentYear}`}
          fallback={<TransactionsTotalsSkeleton />}
        >
          <TransactionsTotals
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
        </Suspense>

        <div className="grid md:grid-cols-3">
          <Suspense fallback={<LineChartSkeleton />}>
            <DashboardLineChart className="col-span-2" />
          </Suspense>

          <Suspense
            key={`${currentMonth}-${currentYear}`}
            fallback={<DashboardPieChartSkeleton />}
          >
            <DashboardPieChart
              currentMonth={currentMonth}
              currentYear={currentYear}
            />
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

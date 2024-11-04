import {
  DashboardLineChart,
  DashboardPieChart,
} from "@/components/dashboard/charts";
import Insights from "@/components/dashboard/insights";
import RecentExpenses from "@/components/dashboard/recent-expenses";
import TransactionsTotals from "@/components/dashboard/transactions-totals";
import MonthYearPicker from "@/components/month-year-picker";
import {
  DashboardBottomSectionSkeleton,
  DashboardPieChartSkeleton,
  LineChartSkeleton,
  TransactionsTotalsSkeleton,
} from "@/components/skeletons";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const date = (await searchParams).date as string;
  const month = date ? parseInt(date.split("-")[0]) : currentMonth;
  const year = date ? parseInt(date.split("-")[1]) : currentYear;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="text-2xl mb-3">Dashboard</div>
        <MonthYearPicker />
      </div>
      <div className="flex flex-col gap-4">
        <Suspense
          key={`${month}-${year}`}
          fallback={<TransactionsTotalsSkeleton />}
        >
          <TransactionsTotals month={month} year={year} />
        </Suspense>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-0">
          <div className="order-1 md:-order-none col-span-2">
            <Suspense fallback={<LineChartSkeleton />}>
              <DashboardLineChart />
            </Suspense>
          </div>

          <Suspense
            key={`${month}-${year}`}
            fallback={<DashboardPieChartSkeleton />}
          >
            <DashboardPieChart
              className="w-56 h-56 md:w-full md:h-full"
              month={month}
              year={year}
            />
          </Suspense>
        </div>

        <div className="max-h-80 md:max-h-60 flex flex-col md:flex-row gap-4 mb-2">
          <Suspense fallback={<DashboardBottomSectionSkeleton />}>
            <RecentExpenses month={month} year={year} />
          </Suspense>

          <Suspense fallback={<DashboardBottomSectionSkeleton />}>
            <Insights month={month} year={year} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

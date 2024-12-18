import IncomesTable from "@/components/incomes/table";
import { TransactionsTableSkeleton } from "@/components/skeletons";
import TransactionsOperations from "@/components/transactions-operations";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Incomes",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const query = searchParams.query || "";
  const filter = { from: searchParams.dateFrom, to: searchParams.dateTo };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="text-2xl mb-3">Incomes</div>
      <TransactionsOperations type="income" />
      <Suspense
        key={`${query}_${filter.from}_${filter.to}`}
        fallback={<TransactionsTableSkeleton type="income" />}
      >
        <IncomesTable query={query} filter={filter} />
      </Suspense>
    </div>
  );
}

import ExpensesTable from "@/components/expenses/table";
import { TransactionsTableSkeleton } from "@/components/skeletons";
import TransactionsOperations from "@/components/transactions-operations";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const query = searchParams.query || "";
  const filter = { from: searchParams.dateFrom, to: searchParams.dateTo };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="text-2xl mb-3">Expenses</div>
      <TransactionsOperations type="expense" />
      <Suspense
        key={`${query}_${filter.from}_${filter.to}`}
        fallback={<TransactionsTableSkeleton type="expense" />}
      >
        <ExpensesTable query={query} filter={filter} />
      </Suspense>
    </div>
  );
}

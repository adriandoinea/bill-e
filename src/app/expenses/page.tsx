import ExpensesOperations from "@/components/ui/expenses/operations";
import ExpensesTable from "@/components/ui/expenses/table";
import { Suspense } from "react";
import { TransactionsTableSkeleton } from "@/components/skeletons";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const query = searchParams.query || "";
  const filterBy = searchParams.filterBy;
  const date = searchParams.date;

  return (
    <div className="pl-10 pr-5 h-full flex flex-col gap-6">
      <div className="text-2xl mb-3">Expenses</div>
      <ExpensesOperations />
      <Suspense
        key={`${query}_${filterBy}_${date}`}
        fallback={<TransactionsTableSkeleton />}
      >
        <ExpensesTable query={query} filterBy={filterBy} date={date} />
      </Suspense>
    </div>
  );
}

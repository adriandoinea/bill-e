import TransactionsOperations from "@/components/transactions-operations";
import { Suspense } from "react";
import { TransactionsTableSkeleton } from "@/components/skeletons";
import IncomesTable from "@/components/ui/incomes/table";

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
      <div className="text-2xl mb-3">Incomes</div>
      <TransactionsOperations type="income" />
      <Suspense
        key={`${query}_${filterBy}_${date}`}
        fallback={<TransactionsTableSkeleton type="income" />}
      >
        <IncomesTable query={query} filterBy={filterBy} date={date} />
      </Suspense>
    </div>
  );
}

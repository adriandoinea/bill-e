"use client";

import CreateTransaction from "@/components/create-transaction";
import Filter from "@/components/filter";
import Searchbar from "@/components/searchbar";

export default function TransactionsOperations({
  type,
}: {
  type: "expense" | "income";
}) {
  return (
    <div className="flex gap-2 w-full">
      <Searchbar placeholder={`Search an ${type}...`} />
      <CreateTransaction type={type} />
      <Filter />
    </div>
  );
}

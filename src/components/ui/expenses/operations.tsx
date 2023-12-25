"use client";

import CreateTransaction from "@/components/create-transaction";
import Filter from "@/components/filter";
import Searchbar from "@/components/searchbar";

export default function ExpensesOperations() {
  return (
    <div className="flex gap-2 w-full">
      <Searchbar placeholder="Search an expense..." />
      <CreateTransaction type="expense" />
      <Filter />
    </div>
  );
}

import { editIncome } from "@/app/actions/incomesActions";
import { IIncome, ITransactionCategory } from "@/types";
import dayjs from "dayjs";
import { CircleDollarSign, StickyNote } from "lucide-react";
import Link from "next/link";
import CategorySelector from "../categories/category-selector";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function EditForm({
  categories,
  income,
}: {
  categories: ITransactionCategory[];
  income: IIncome;
}) {
  const editIncomeWithId = editIncome.bind(null, income.id);
  return (
    <form action={editIncomeWithId}>
      <div className="rounded-md bg-accent p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Choose category
          </label>
          <CategorySelector
            defaultValue={income.category.name}
            categories={categories}
            type="income"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative">
            <Input
              required
              className="pl-10"
              type="number"
              name="amount"
              id="amount"
              step="0.01"
              placeholder="Enter USD amount"
              defaultValue={income.amount}
            />
            <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium" htmlFor="note">
            Leave a note
          </label>
          <div className="relative">
            <Input
              className="pl-10"
              type="text"
              name="note"
              id="note"
              placeholder="Enter a note"
              defaultValue={income.note || ""}
            />
            <StickyNote className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium" htmlFor="date">
            Choose a date
          </label>
          <div className="mt-2 rounded-md">
            <Input
              required
              className="block w-full rounded-md py-2 pl-2 pr-2 text-sm outline-2 placeholder:text-gray-500"
              type="date"
              name="date"
              id="date"
              defaultValue={dayjs(income.date).format("YYYY-MM-DD")}
            />
          </div>
        </div>
      </div>
      <div className="w-full mt-5 flex gap-4 justify-end items-center">
        <Link
          className="flex h-10 items-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          href="/incomes"
        >
          Cancel
        </Link>
        <Button
          className="bg-customAccent hover:bg-customAccent-foreground transition duration-300"
          type="submit"
        >
          Update income
        </Button>
      </div>
    </form>
  );
}

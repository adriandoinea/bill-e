import { editExpense } from "@/app/actions/expensesActions";
import { IExpense, ITransactionCategory } from "@/types";
import dayjs from "dayjs";
import { CircleDollarSign, MapPin, StickyNote } from "lucide-react";
import Link from "next/link";
import CategorySelector from "../categories/category-selector";
import { Button } from "../ui/button";

export default function EditForm({
  categories,
  expense,
}: {
  categories: ITransactionCategory[];
  expense: IExpense;
}) {
  const editExpenseWithId = editExpense.bind(null, expense.id);
  return (
    <form action={editExpenseWithId}>
      <div className="rounded-md bg-accent p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Choose category
          </label>
          <CategorySelector
            defaultValue={expense.category.name}
            categories={categories}
            type="expense"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                required
                className="block w-full rounded-md py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                type="number"
                name="amount"
                id="amount"
                step="0.01"
                placeholder="Enter USD amount"
                defaultValue={expense.amount}
              />
              <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium" htmlFor="note">
            Leave a note
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="block w-full rounded-md py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                type="text"
                name="note"
                id="note"
                placeholder="Enter a note"
                defaultValue={expense.note || ""}
              />
              <StickyNote className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium" htmlFor="location">
            Provide a location
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                className="block w-full rounded-md py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                type="text"
                name="location"
                id="location"
                placeholder="Enter a location"
                defaultValue={expense.location || ""}
              />
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium" htmlFor="date">
            Choose a date
          </label>
          <div className="mt-2 rounded-md">
            <input
              required
              className="block w-full rounded-md py-2 pl-2 pr-2 text-sm outline-2 placeholder:text-gray-500"
              type="date"
              name="date"
              id="date"
              defaultValue={dayjs(expense.date).format("YYYY-MM-DD")}
            />
          </div>
        </div>
      </div>
      <div className="w-full mt-5 flex gap-4 justify-end items-center">
        <Link
          className="flex h-10 items-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          href="/expenses"
        >
          Cancel
        </Link>
        <Button
          className="bg-customAccent hover:bg-customAccent-foreground transition duration-300"
          type="submit"
        >
          Update expense
        </Button>
      </div>
    </form>
  );
}
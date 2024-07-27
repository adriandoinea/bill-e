import { createIncome } from "@/app/actions/incomesActions";
import { ITransactionCategory } from "@/types";
import dayjs from "dayjs";
import { CircleDollarSign, StickyNote } from "lucide-react";
import Link from "next/link";
import CategorySelector from "../categories/category-selector";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Form({
  categories,
}: {
  categories: ITransactionCategory[];
}) {
  return (
    <form action={createIncome}>
      <div className="rounded-md bg-accent p-4 md:p-6">
        <div className="mb-4 flex flex-col gap-2">
          <label htmlFor="category">Choose category</label>
          <CategorySelector categories={categories} type="income" />
        </div>

        <div className="mb-4 flex flex-col gap-2">
          <label htmlFor="amount">Choose an amount</label>
          <div className="relative">
            <Input
              required
              className="pl-10"
              type="number"
              name="amount"
              id="amount"
              step="0.01"
              placeholder="Enter USD amount"
            />
            <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-2">
          <label htmlFor="note">Leave a note</label>
          <div className="relative">
            <Input
              className="pl-10"
              type="text"
              name="note"
              id="note"
              placeholder="Enter a note"
            />
            <StickyNote className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-2">
          <label htmlFor="date">Choose a date</label>
          <Input
            required
            className="w-full block"
            type="date"
            name="date"
            id="date"
            defaultValue={dayjs().format("YYYY-MM-DD")}
          />
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
          Create income
        </Button>
      </div>
    </form>
  );
}

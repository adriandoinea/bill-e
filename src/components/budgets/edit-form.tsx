import { IBudget, ITransactionCategory } from "@/types";
import { CircleDollarSign, List, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { editBudget } from "@/app/actions/budgetsActions";

export default function EditForm({
  categories,
  budget,
}: {
  categories: ITransactionCategory[];
  budget: IBudget;
}) {
  const editBudgetWithId = editBudget.bind(null, budget.id, budget.resetPeriod);
  return (
    <form action={editBudgetWithId}>
      <div className="rounded-md bg-accent p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Choose category
          </label>
          <div className="relative">
            <select
              required
              className="block w-full cursor-pointer rounded-md py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="category"
              name="category"
              defaultValue={budget.category.name}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <List className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
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
                defaultValue={budget.initAmount}
              />
              <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="resetPeriod"
            className="mb-2 block text-sm font-medium"
          >
            Choose reset period
          </label>
          <div className="relative">
            <select
              required
              className="block w-full cursor-pointer rounded-md py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="resetPeriod"
              name="resetPeriod"
              defaultValue={budget.resetPeriod}
            >
              <option value="" disabled>
                Select a period
              </option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <RotateCcw className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="w-full mt-5 flex gap-4 justify-end items-center">
        <Link
          className="flex h-10 items-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          href="/budgets"
        >
          Cancel
        </Link>
        <Button
          className="bg-customAccent hover:bg-customAccent-foreground transition duration-300"
          type="submit"
        >
          Edit budget
        </Button>
      </div>
    </form>
  );
}

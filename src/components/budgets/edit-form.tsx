"use client";

import { editBudget } from "@/app/actions/budgetsActions";
import { IBudget, ITransactionCategory } from "@/types";
import { CircleDollarSign, RotateCcw } from "lucide-react";
import Link from "next/link";
import CategorySelector from "../categories/category-selector";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CURRENCY } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditForm({
  categories,
  budget,
}: {
  categories: ITransactionCategory[];
  budget: IBudget;
}) {
  const router = useRouter();

  const editBudgetAndConfirm = (formData: FormData) => {
    editBudget(budget.id, formData)
      .then((data) => {
        if (data?.message) {
          toast.warning(data.message);
        } else {
          toast(`Budget edited successfully!`);
          router.replace("/budgets");
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error(`Failed to edit budget.`);
        return e;
      });
  };

  return (
    <form action={editBudgetAndConfirm}>
      <div className="rounded-md bg-accent p-4 md:p-6">
        <div className="mb-4">
          <Label htmlFor="category" className="mb-2">
            Choose category
          </Label>
          <div className="relative">
            <CategorySelector
              type="expense"
              categories={categories}
              defaultValue={budget.category.name}
            />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="amount" className="mb-2">
            Choose an amount
          </Label>
          <div className="relative">
            <Input
              required
              className="pl-10"
              type="number"
              name="amount"
              id="amount"
              step="0.01"
              placeholder={`Enter ${CURRENCY} amount`}
              defaultValue={budget.initAmount}
            />
            <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="resetPeriod" className="mb-2">
            Choose reset period
          </Label>
          <Select required name="resetPeriod" defaultValue={budget.resetPeriod}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <RotateCcw className="pointer-events-none h-[18px] w-[18px] text-gray-500" />
                <SelectValue placeholder="Select a category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
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

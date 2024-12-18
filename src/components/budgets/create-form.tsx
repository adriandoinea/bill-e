"use client";

import { createBudget } from "@/app/actions/budgetsActions";
import { ITransactionCategory } from "@/types";
import { CircleDollarSign, RotateCcw } from "lucide-react";
import CategorySelector from "../categories/category-selector";
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
import FormButton from "../form-button";
import { Button } from "../ui/button";

export default function Form({
  categories,
}: {
  categories: ITransactionCategory[];
}) {
  const router = useRouter();

  const createBudgetAndConfirm = (formData: FormData) => {
    const budgetName = formData.get("category");
    createBudget(formData)
      .then((data) => {
        if (data?.message) {
          toast.warning(data.message);
        } else {
          toast(`"${budgetName}" budget created successfully!`);
          router.replace("/budgets");
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error(`Failed to create "${budgetName}" budget.`);
        return e;
      });
  };

  return (
    <form action={createBudgetAndConfirm}>
      <div className="rounded-md bg-accent p-4 md:p-6">
        <div className="mb-4">
          <Label htmlFor="category" className="mb-2 block text-sm font-medium">
            Choose category
          </Label>
          <div className="relative">
            <CategorySelector categories={categories} type="expense" />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="amount" className="mb-2 block text-sm font-medium">
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
            />
            <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="mb-4">
          <Label
            htmlFor="resetPeriod"
            className="mb-2 block text-sm font-medium"
          >
            Choose reset period
          </Label>

          <Select required name="resetPeriod" defaultValue="monthly">
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
        <Button variant="secondary" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <FormButton
          className="bg-customAccent hover:bg-customAccent-foreground transition duration-300"
          type="submit"
        >
          Create budget
        </FormButton>
      </div>
    </form>
  );
}

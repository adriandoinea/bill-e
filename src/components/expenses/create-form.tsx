"use client";

import { createExpense } from "@/app/actions/expensesActions";
import { ITransactionCategory } from "@/types";
import dayjs from "dayjs";
import { CircleDollarSign, MapPin, StickyNote } from "lucide-react";
import Link from "next/link";
import CategorySelector from "../categories/category-selector";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CURRENCY } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormButton from "../form-button";

export default function Form({
  categories,
}: {
  categories: ITransactionCategory[];
}) {
  const router = useRouter();

  const createExpenseAndConfirm = (formData: FormData) => {
    const expenseName = formData.get("category");
    createExpense(formData)
      .then(() => {
        toast(`"${expenseName}" expense created successfully!`);
        router.replace("/expenses");
      })
      .catch((e) => {
        console.error(e);
        toast.error(`Failed to create "${expenseName}" expense.`);
      });
  };

  return (
    <form action={createExpenseAndConfirm}>
      <div className="rounded-md bg-accent p-4 md:p-6">
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="category">Choose category</Label>
          <CategorySelector categories={categories} type="expense" />
        </div>

        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="amount">Choose an amount</Label>
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

        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="note">Leave a note</Label>
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
          <Label htmlFor="location">Provide a location</Label>
          <div className="relative">
            <Input
              className="pl-10"
              type="text"
              name="location"
              id="location"
              placeholder="Enter a location"
            />
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="date">Choose a date</Label>
          <Input
            required
            className="block w-full"
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
          href="/expenses"
        >
          Cancel
        </Link>
        <FormButton
          className="bg-customAccent hover:bg-customAccent-foreground transition duration-300"
          type="submit"
        >
          Create expense
        </FormButton>
      </div>
    </form>
  );
}

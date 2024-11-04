"use client";

import { createIncome } from "@/app/actions/incomesActions";
import { ITransactionCategory } from "@/types";
import dayjs from "dayjs";
import { CircleDollarSign, StickyNote } from "lucide-react";
import CategorySelector from "../categories/category-selector";
import { Input } from "../ui/input";
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

  const createIncomeAndConfirm = (formData: FormData) => {
    const incomeName = formData.get("category");
    createIncome(formData)
      .then(() => {
        toast(`"${incomeName}" income created successfully!`);
        router.replace("/incomes");
      })
      .catch((e) => {
        console.error(e);
        toast.error(`Failed to create "${incomeName}" income.`);
      });
  };

  return (
    <form action={createIncomeAndConfirm}>
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
              placeholder={`Enter ${CURRENCY} amount`}
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
        <Button variant="secondary" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <FormButton
          className="bg-customAccent hover:bg-customAccent-foreground transition duration-300"
          type="submit"
        >
          Create income
        </FormButton>
      </div>
    </form>
  );
}

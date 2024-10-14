"use client";

import { convertDateToString } from "@/lib/utils";
import { IExpense, IIncome } from "@/types";
import { Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Alert } from "./alert";

interface Props {
  id: string;
  type: "expense" | "income";
}

export function CreateTransaction({ type }: { type: Props["type"] }) {
  return (
    <Link
      href={`/${type}s/create`}
      className="flex h-10 items-center bg-customAccent text-secondary py-2 px-4 rounded-lg hover:bg-customAccent-foreground transition duration-300"
    >
      <span className="hidden md:block">Create {type}</span>{" "}
      <Plus className="h-5 md:ml-4" />
    </Link>
  );
}

export function EditTransaction({ id, type }: Props) {
  return (
    <Link className="text-customAccent" href={`${type}s/${id}/edit`}>
      <Pencil className="size-5 sm:size-6" />
    </Link>
  );
}

export function DeleteTransaction({ id, type }: Props) {
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const deleteTransaction = async () => {
    try {
      const res = await fetch(`/api/${type}s/delete`, {
        method: "DELETE",
        body: JSON.stringify({
          id,
        }),
      });
      const data: IExpense | IIncome = await res.json();
      const { category, date } = data;
      router.refresh();
      toast(
        `"${category.name}" from ${convertDateToString(date)} has been removed.`
      );
    } catch (e) {
      console.log("error", e);
      toast.error(`Failed to delete ${type}.`);
    }
  };

  const handleOpenAlert = () => setIsAlertOpen(true);
  const handleCloseAlert = () => setIsAlertOpen(false);
  const handleConfirm = () => {
    deleteTransaction();
    handleCloseAlert();
  };

  return (
    <>
      <button className="text-destructive" onClick={handleOpenAlert}>
        <span className="sr-only">Delete</span>
        <Trash className="size-5 sm:size-6" />
      </button>

      <Alert
        isOpen={isAlertOpen}
        description={`This will permanently delete this ${type}.`}
        onCancel={handleCloseAlert}
        onConfirm={handleConfirm}
      />
    </>
  );
}

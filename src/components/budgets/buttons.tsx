"use client";

import { IBudget } from "@/types";
import { Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Alert } from "../alert";

export function CreateBudget() {
  return (
    <Link
      href="budgets/create"
      className="w-auto h-36 sm:w-56 sm:h-40 bg-accent dark:bg-background border-2 rounded-md flex flex-wrap justify-center items-center gap-1 text-customAccent hover:text-customAccent-foreground hover:border-customAccent-foreground"
    >
      <Plus size={16} />
      <>Add budget</>
    </Link>
  );
}

export function EditBudget({ id }: { id: string }) {
  return (
    <Link className="text-customAccent" href={`budgets/${id}/edit`}>
      <Pencil size={16} />
    </Link>
  );
}

export function DeleteBudget({ id }: { id: string }) {
  const router = useRouter();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const deleteTransaction = async () => {
    try {
      const res = await fetch(`/api/budgets/delete`, {
        method: "DELETE",
        body: JSON.stringify({
          id,
        }),
      });
      const data: Pick<IBudget, "category" | "resetPeriod"> = await res.json();
      const { category, resetPeriod } = data;
      router.refresh();
      toast(`"${category.name}" ${resetPeriod} budget has been removed.`);
    } catch (e) {
      console.error("error", e);
      toast.error(`Failed to delete budget.`);
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
      <button className="text-customAccent" onClick={handleOpenAlert}>
        <span className="sr-only">Delete</span>
        <Trash size={16} />
      </button>

      <Alert
        isOpen={isAlertOpen}
        description={`This will permanently delete this budget.`}
        onCancel={handleCloseAlert}
        onConfirm={handleConfirm}
      />
    </>
  );
}

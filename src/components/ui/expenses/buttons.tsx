import { deleteExpense } from "@/app/actions/expensesActions";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";

export function EditExpense({ id }: { id: string }) {
  return (
    <Link className="text-customAccent" href={`expenses/${id}/edit`}>
      <Pencil />
    </Link>
  );
}

export function DeleteExpense({ id }: { id: string }) {
  const deleteExpenseWithId = deleteExpense.bind(null, id);
  return (
    <form className="flex" action={deleteExpenseWithId}>
      <button className="text-red-400">
        <span className="sr-only">Delete</span>
        <Trash />
      </button>
    </form>
  );
}

import { deleteIncome } from "@/app/actions/incomesActions";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";

export function EditIncome({ id }: { id: string }) {
  return (
    <Link className="text-customAccent" href={`incomes/${id}/edit`}>
      <Pencil />
    </Link>
  );
}

export function DeleteIncome({ id }: { id: string }) {
  const deleteIncomeWithId = deleteIncome.bind(null, id);
  return (
    <form className="flex" action={deleteIncomeWithId}>
      <button className="text-red-400">
        <span className="sr-only">Delete</span>
        <Trash />
      </button>
    </form>
  );
}

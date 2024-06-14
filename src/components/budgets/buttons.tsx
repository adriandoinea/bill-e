import { deleteBudget } from "@/app/actions/budgetsActions";
import { Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";

export function EditBudget({ id }: { id: string }) {
  return (
    <Link className="text-customAccent" href={`budgets/${id}/edit`}>
      <Pencil size={16} />
    </Link>
  );
}

export function DeleteBudget({ id }: { id: string }) {
  const deleteBudgetWithId = deleteBudget.bind(null, id);
  return (
    <form className="flex" action={deleteBudgetWithId}>
      <button className="text-customAccent">
        <span className="sr-only">Delete</span>
        <Trash size={16} />
      </button>
    </form>
  );
}

export function CreateBudget() {
  return (
    <Link
      href="budgets/create"
      className="w-56 h-40 bg-accent dark:bg-background border-2 rounded-md flex justify-center items-center gap-1 text-customAccent hover:text-customAccent-foreground hover:border-customAccent-foreground"
    >
      <Plus size={16} />
      <>Add budget</>
    </Link>
  );
}

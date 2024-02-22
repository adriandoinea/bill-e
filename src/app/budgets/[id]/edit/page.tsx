import Breadcrumbs from "@/components/breadcrumbs";
import EditForm from "@/components/ui/budgets/edit-form";
import {
  fetchBudgetById,
  fetchTransactionCategories,
} from "@/lib/data/transactions";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const categories = await fetchTransactionCategories("expense");
  const budget = await fetchBudgetById(params.id);

  if (!budget) notFound();

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Budgets", href: "/budgets" },
          { label: "Edit Budget", href: "/budgets/edit", active: true },
        ]}
      />

      <EditForm budget={budget} categories={categories} />
    </>
  );
}

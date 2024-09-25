import Breadcrumbs from "@/components/breadcrumbs";
import EditForm from "@/components/budgets/edit-form";
import { fetchTransactionCategories } from "@/lib/data/transactions";
import { fetchBudgetById } from "@/lib/data/budgets";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const categories = await fetchTransactionCategories("expense");
  const budget = await fetchBudgetById(params.id);

  if (!budget || budget.userId !== session?.user?.id) notFound();

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

import Breadcrumbs from "@/components/breadcrumbs";
import EditForm from "@/components/ui/expenses/edit-form";
import { fetchTransactionById, fetchTransactionCategories } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const categories = await fetchTransactionCategories("expense");
  const expense = await fetchTransactionById(params.id, "income");

  if (!expense) notFound();

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Expenses", href: "/expenses" },
          { label: "Edit Expense", href: "/expenses/edit", active: true },
        ]}
      />
      <EditForm categories={categories} expense={expense} />
    </>
  );
}

import { auth } from "@/auth";
import Breadcrumbs from "@/components/breadcrumbs";
import EditForm from "@/components/expenses/edit-form";
import {
  fetchTransactionById,
  fetchTransactionCategories,
} from "@/lib/data/transactions";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const categories = await fetchTransactionCategories("expense");
  const expense = await fetchTransactionById(params.id, "expense");

  if (!expense || expense.userId !== session?.user?.id) notFound();

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

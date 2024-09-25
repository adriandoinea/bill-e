import { auth } from "@/auth";
import Breadcrumbs from "@/components/breadcrumbs";
import EditForm from "@/components/incomes/edit-form";
import {
  fetchTransactionById,
  fetchTransactionCategories,
} from "@/lib/data/transactions";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const categories = await fetchTransactionCategories("income");
  const income = await fetchTransactionById(params.id, "income");

  if (!income || income.userId !== session?.user?.id) notFound();

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Incomes", href: "/incomes" },
          { label: "Edit Income", href: "/incomes/edit", active: true },
        ]}
      />
      <EditForm categories={categories} income={income} />
    </>
  );
}

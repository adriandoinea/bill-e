import Breadcrumbs from "@/components/breadcrumbs";
import Form from "@/components/budgets/create-form";
import { fetchTransactionCategories } from "@/lib/data/transactions";

export default async function Page() {
  const categories = await fetchTransactionCategories("expense");
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Budgets", href: "/budgets" },
          { label: "Create Budget", href: "/budgets/create", active: true },
        ]}
      />
      <Form categories={categories} />
    </>
  );
}

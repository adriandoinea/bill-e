import Breadcrumbs from "@/components/breadcrumbs";
import Form from "@/components/expenses/create-form";
import { fetchTransactionCategories } from "@/lib/data/transactions";

export default async function Page() {
  const categories = await fetchTransactionCategories("expense");
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Expenses", href: "/expenses" },
          { label: "Create Expense", href: "/expenses/create", active: true },
        ]}
      />
      <Form categories={categories} />
    </>
  );
}

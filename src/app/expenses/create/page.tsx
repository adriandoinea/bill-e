import Breadcrumbs from "@/components/ui/expenses/breadcrumbs";
import Form from "@/components/ui/expenses/create-form";
import { fetchTransactionCategories } from "@/lib/data";

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

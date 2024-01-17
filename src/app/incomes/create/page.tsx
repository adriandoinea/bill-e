import Breadcrumbs from "@/components/breadcrumbs";
import Form from "@/components/ui/incomes/create-form";
import { fetchTransactionCategories } from "@/lib/data";

export default async function Page() {
  const categories = await fetchTransactionCategories("income");
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Incomes", href: "/incomes" },
          { label: "Create Income", href: "/incomes/create", active: true },
        ]}
      />
      <Form categories={categories} />
    </>
  );
}

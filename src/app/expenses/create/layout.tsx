import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Expense",
};

export default function CreateExpenseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="size-full sm:px-20">{children}</div>;
}

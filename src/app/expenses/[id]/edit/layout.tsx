import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Expense",
};

export default function EditExpenseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="size-full sm:px-20">{children}</div>;
}

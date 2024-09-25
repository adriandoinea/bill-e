import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit budget",
};

export default function EditBudgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="size-full sm:px-20">{children}</div>;
}

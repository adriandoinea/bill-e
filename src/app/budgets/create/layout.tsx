import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Budget",
};

export default function CreateBudgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="size-full sm:px-20">{children}</div>;
}

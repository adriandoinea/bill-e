import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Income",
};

export default function EditIncomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="size-full sm:px-20">{children}</div>;
}

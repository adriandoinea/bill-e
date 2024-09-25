import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Income",
};

export default function CreateIncomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="size-full sm:px-20">{children}</div>;
}

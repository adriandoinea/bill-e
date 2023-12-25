import Link from "next/link";
import { Sidebar as UiSidebar } from "../../components/sidebar";
import { DarkModeToggle } from "@/components/dark-mode-toggler";
import { FileBarChart } from "lucide-react";

export default function Page() {
  return (
    <UiSidebar>
      <FileBarChart size="50px" />
      <div className="flex flex-col gap-4">
        <Link href="/">Dashboard</Link>
        <Link href="/expenses">Expenses</Link>
        <Link href="/incomes">Incomes</Link>
        <Link href="/budgets">Budgets</Link>
      </div>
      <DarkModeToggle />
    </UiSidebar>
  );
}

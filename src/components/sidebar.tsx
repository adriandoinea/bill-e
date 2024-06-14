"use client";

import { cn } from "@/lib/utils";
import { FileBarChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DarkModeToggle } from "./dark-mode-toggler";

export function Sidebar({ className }: { className?: string }) {
  const path = usePathname();

  return (
    <div
      className={cn(
        "w-52 bg-accent dark:bg-background w-250 flex flex-col justify-between items-center px-5 py-10 border-r border-solid border-border",
        className
      )}
    >
      <Link href="/">
        <FileBarChart size="50px" />
      </Link>
      <div className="flex flex-col gap-1">
        <Link
          className={cn(
            "rounded-sm",
            "py-2",
            "px-10",
            "hover:bg-slate-200",
            "dark:hover:bg-muted",
            {
              "bg-customAccent hover:bg-customAccent-foreground dark:hover:bg-customAccent-foreground text-secondary":
                path === "/dashboard" || path === "/",
            }
          )}
          href="/"
        >
          Dashboard
        </Link>
        <Link
          className={cn(
            "rounded-sm",
            "py-2",
            "px-10",
            "hover:bg-slate-200",
            "dark:hover:bg-muted",
            {
              "bg-customAccent hover:bg-customAccent-foreground dark:hover:bg-customAccent-foreground text-secondary":
                path === "/expenses",
            }
          )}
          href="/expenses"
        >
          Expenses
        </Link>
        <Link
          className={cn(
            "rounded-sm",
            "py-2",
            "px-10",
            "hover:bg-slate-200",
            "dark:hover:bg-muted",
            {
              "bg-customAccent hover:bg-customAccent-foreground dark:hover:bg-customAccent-foreground text-secondary":
                path === "/incomes",
            }
          )}
          href="/incomes"
        >
          Incomes
        </Link>
        <Link
          className={cn(
            "rounded-sm",
            "py-2",
            "px-10",
            "hover:bg-slate-200",
            "dark:hover:bg-muted",
            {
              "bg-customAccent hover:bg-customAccent-foreground dark:hover:bg-customAccent-foreground text-secondary":
                path === "/budgets",
            }
          )}
          href="/budgets"
        >
          Budgets
        </Link>
      </div>
      <DarkModeToggle />
    </div>
  );
}

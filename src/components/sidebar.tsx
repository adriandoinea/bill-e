"use client";

import { cn } from "@/lib/utils";
import { FileBarChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DarkModeToggle } from "./dark-mode-toggler";

export function Sidebar({ className }: { className?: string }) {
  const defaultStyle = "rounded-md py-2 px-10 hover:bg-hoverColor";
  const selectedStyle =
    "bg-customAccent hover:bg-hoverColor-foreground text-secondary";
  const path = usePathname();

  return (
    <div
      className={cn(
        `w-52 bg-accent dark:bg-background flex flex-col justify-between items-center px-5 py-10 border-r border-solid border-border`,
        className
      )}
    >
      <Link href="/">
        <FileBarChart size="50px" />
      </Link>
      <div className="flex flex-col gap-1">
        <Link
          className={cn(defaultStyle, {
            [selectedStyle]: path === "/dashboard" || path === "/",
          })}
          href="/"
        >
          Dashboard
        </Link>
        <Link
          className={cn(defaultStyle, {
            [selectedStyle]: path === "/expenses",
          })}
          href="/expenses"
        >
          Expenses
        </Link>
        <Link
          className={cn(defaultStyle, {
            [selectedStyle]: path === "/incomes",
          })}
          href="/incomes"
        >
          Incomes
        </Link>
        <Link
          className={cn(defaultStyle, {
            [selectedStyle]: path === "/budgets",
          })}
          href="/budgets"
        >
          Budgets
        </Link>
      </div>
      <DarkModeToggle />
    </div>
  );
}

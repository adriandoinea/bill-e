"use client";

import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  PiggyBank,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DarkModeToggle } from "./dark-mode-toggler";
import { Button } from "./ui/button";

export function Sidebar({ className }: { className?: string }) {
  const defaultLinkStyle =
    "rounded-md py-2 px-3 md:px-8 hover:bg-hoverColor flex items-center gap-1";
  const selectedLinkStyle =
    "bg-customAccent hover:bg-hoverColor-foreground text-secondary";
  const collapsedStyle = "p-3 md:p-3";
  const path = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggleCollapsing = () => setIsCollapsed(!isCollapsed);

  return (
    <div
      className={cn(
        `w-full flex flex-row items-center bg-accent dark:bg-background p-2 sm:py-10 border-border border-solid border-b sm:border-r sm:border-b-0 sm:w-52 sm:h-full sm:flex-col justify-between md:px-5`,
        className,
        { "sm:w-auto": isCollapsed }
      )}
    >
      <Link href="/">
        <FileBarChart className="size-8 sm:size-12" />
      </Link>
      <div className="flex flex-row gap-1 sm:flex-col">
        <Link
          className={cn(defaultLinkStyle, {
            [selectedLinkStyle]: path === "/dashboard" || path === "/",
            [collapsedStyle]: isCollapsed,
          })}
          href="/"
        >
          <LayoutDashboard />
          {!isCollapsed && (
            <span
              className={cn("hidden sm:inline", { "sm:inline": !isCollapsed })}
            >
              Dashboard
            </span>
          )}
        </Link>
        <Link
          className={cn(defaultLinkStyle, {
            [selectedLinkStyle]: path === "/expenses",
            [collapsedStyle]: isCollapsed,
          })}
          href="/expenses"
        >
          <BadgeDollarSign />
          {!isCollapsed && (
            <span
              className={cn("hidden sm:inline", { "sm:inline": !isCollapsed })}
            >
              Expenses
            </span>
          )}
        </Link>
        <Link
          className={cn(defaultLinkStyle, {
            [selectedLinkStyle]: path === "/incomes",
            [collapsedStyle]: isCollapsed,
          })}
          href="/incomes"
        >
          <CreditCard />
          {!isCollapsed && (
            <span
              className={cn("hidden sm:inline", { "sm:inline": !isCollapsed })}
            >
              Incomes
            </span>
          )}
        </Link>
        <Link
          className={cn(defaultLinkStyle, {
            [selectedLinkStyle]: path === "/budgets",
            [collapsedStyle]: isCollapsed,
          })}
          href="/budgets"
        >
          <PiggyBank />
          {!isCollapsed && (
            <span
              className={cn("hidden sm:inline", { "sm:inline": !isCollapsed })}
            >
              Budgets
            </span>
          )}
        </Link>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex justify-center items-center rounded-full hover:bg-hoverColor">
          <Button
            size="icon"
            className="hidden sm:flex bg-transparent hover:bg-transparent text-primary"
            onClick={handleToggleCollapsing}
          >
            {isCollapsed ? <ArrowRight /> : <ArrowLeft />}
          </Button>
        </div>
        <DarkModeToggle />
      </div>
    </div>
  );
}

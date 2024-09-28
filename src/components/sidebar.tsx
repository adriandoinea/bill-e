"use client";

import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CreditCard,
  LayoutDashboard,
  PiggyBank,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DarkModeToggle } from "./dark-mode-toggler";
import { Button } from "./ui/button";
import Image from "next/image";

const getLocalStorageState = () => {
  const savedState = localStorage.getItem("bille-sidebar-isCollapsed");
  if (!savedState) return false;
  return JSON.parse(savedState);
};

const DEFAULT_LINK_STYLE =
  "rounded-md p-3 md:px-8 hover:bg-hoverColor flex items-center gap-1";
const SELECTED_LINK_STYLE =
  "bg-customAccent hover:bg-hoverColor-foreground text-secondary";
const COLLAPSED_LINK_STYLE = "md:p-3";

export function Sidebar({ className }: { className?: string }) {
  const { status } = useSession();
  const path = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggleCollapsing = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem("bille-sidebar-isCollapsed", JSON.stringify(newVal));
  };

  useEffect(() => {
    const savedState = getLocalStorageState();
    setIsCollapsed(savedState);
  }, []);

  if (status === "unauthenticated") return null;

  return (
    <nav
      className={cn(
        `w-full flex flex-row items-center bg-accent dark:bg-background p-2 sm:py-10 border-border border-solid border-b sm:border-r sm:border-b-0 sm:h-full sm:flex-col justify-between`,
        { "sm:w-24": isCollapsed, "sm:w-52": !isCollapsed },
        className
      )}
    >
      <Link href="/">
        <Image
          src="/logo-small.png"
          alt="Small Logo"
          width={50}
          height={50}
          className={cn("size-10 sm:size-[50px] inline sm:hidden", {
            "sm:inline": isCollapsed,
          })}
        />

        <Image
          src="/logo-lightmode.png"
          priority
          alt="Logo"
          width={120}
          height={120}
          className={cn("hidden size-auto", {
            "sm:block dark:hidden": !isCollapsed,
          })}
        />
        <Image
          src="/logo-darkmode.png"
          priority
          alt="Logo"
          width={120}
          height={120}
          className={cn("hidden size-auto", {
            "sm:dark:block": !isCollapsed,
          })}
        />
      </Link>

      <div className="flex flex-row gap-1 sm:flex-col">
        <Link
          className={cn(DEFAULT_LINK_STYLE, {
            [SELECTED_LINK_STYLE]: path === "/dashboard" || path === "/",
            [COLLAPSED_LINK_STYLE]: isCollapsed,
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
          className={cn(DEFAULT_LINK_STYLE, {
            [SELECTED_LINK_STYLE]: path === "/expenses",
            [COLLAPSED_LINK_STYLE]: isCollapsed,
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
          className={cn(DEFAULT_LINK_STYLE, {
            [SELECTED_LINK_STYLE]: path === "/incomes",
            [COLLAPSED_LINK_STYLE]: isCollapsed,
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
          className={cn(DEFAULT_LINK_STYLE, {
            [SELECTED_LINK_STYLE]: path === "/budgets",
            [COLLAPSED_LINK_STYLE]: isCollapsed,
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
        <Link
          className={cn(DEFAULT_LINK_STYLE, {
            [SELECTED_LINK_STYLE]: path === "/settings",
            [COLLAPSED_LINK_STYLE]: isCollapsed,
          })}
          href="/settings"
        >
          <SettingsIcon />
          {!isCollapsed && (
            <span
              className={cn("hidden sm:inline", { "sm:inline": !isCollapsed })}
            >
              Settings
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
    </nav>
  );
}

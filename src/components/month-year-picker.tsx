"use client";

import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import { buttonVariants } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const MonthYearPicker = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleMonthChange = useCallback(
    (date: Date) => {
      const dateString = `${date.getMonth() + 1}-${date.getFullYear()}`;
      const queryString = createQueryString("date", dateString);

      router.replace(`${pathName}?${queryString}`);
    },
    [createQueryString, pathName, router]
  );

  const getSelectedDate = useCallback(() => {
    const selectedStr = searchParams.get("date");
    if (!selectedStr) return new Date();

    const month = selectedStr.split("-")[0];
    const year = selectedStr.split("-")[1];

    return new Date(parseInt(year), parseInt(month) - 1);
  }, [searchParams]);

  const selectedDate = getSelectedDate();

  return (
    <DayPicker
      mode="single"
      month={selectedDate}
      onMonthChange={handleMonthChange}
      toDate={new Date()}
      classNames={{
        caption: "flex items-center space-x-2",
        caption_label: "text-lg font-medium",
        table: "hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0"
        ),
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
    />
  );
};

export default MonthYearPicker;

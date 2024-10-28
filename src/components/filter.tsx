"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, convertDateToString, convertStringToDate } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import dayjs from "dayjs";

export default function Filter({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const strFrom = useMemo(() => {
    const firstDayOfTheMonth = dayjs().startOf("month").toDate();
    const paramFrom = params.get("dateFrom");
    if (paramFrom) {
      return paramFrom;
    }
    return convertDateToString(firstDayOfTheMonth);
  }, [params]);

  const strTo = useMemo(() => {
    const lastDayOfTheMonth = dayjs().endOf("month").toDate();
    const paramTo = params.get("dateTo");
    if (paramTo !== null) {
      return paramTo;
    }
    return convertDateToString(lastDayOfTheMonth);
  }, [params]);

  const handleDateChange = (range?: DateRange) => {
    const formattedFrom = convertDateToString(range?.from);
    const formattedTo = convertDateToString(range?.to || range?.from);

    params.set("dateFrom", formattedFrom);
    params.set("dateTo", formattedTo);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const selected = {
    from: convertStringToDate(strFrom),
    to: convertStringToDate(strTo),
  };

  useEffect(() => {
    const dateFrom = convertStringToDate(strFrom);
    const dateTo = convertStringToDate(strTo);
    params.set("dateFrom", strFrom);
    if (dateTo < dateFrom) {
      params.set("dateTo", strFrom);
    } else {
      params.set("dateTo", strTo);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [params, pathname, router, strFrom, strTo]);

  useEffect(() => {
    const checkScreenSize = () => {
      const isSmall = window.innerWidth < 640;
      setIsSmallScreen(isSmall);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !strFrom && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-0 md:mr-2 h-4 w-4" />
            <span className="hidden md:inline">
              {strFrom ? (
                strTo ? (
                  <>
                    {strFrom} - {strTo}
                  </>
                ) : (
                  strFrom
                )
              ) : (
                <span>Pick a date</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selected.from}
            selected={selected}
            onSelect={handleDateChange}
            numberOfMonths={isSmallScreen ? 1 : 2}
          />
          <div className="p-3 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <strong>From:</strong> {strFrom}
              </div>
              <div className="text-sm">
                <strong>To:</strong> {strTo}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

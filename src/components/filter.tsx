"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, convertDateToString, convertStringToDate } from "@/lib/utils";
import { Calendar as CalendarIcon, X } from "lucide-react";
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

  const getDefaultDateRange = () => {
    const firstDayOfTheMonth = dayjs().startOf("month").toDate();
    const lastDayOfTheMonth = dayjs().endOf("month").toDate();
    return {
      from: convertDateToString(firstDayOfTheMonth),
      to: convertDateToString(lastDayOfTheMonth),
    };
  };

  const strFrom = useMemo(() => {
    const paramFrom = params.get("dateFrom");
    if (paramFrom) {
      return paramFrom;
    }
    return getDefaultDateRange().from;
  }, [params]);

  const strTo = useMemo(() => {
    const paramTo = params.get("dateTo");
    if (paramTo !== null) {
      return paramTo;
    }
    return getDefaultDateRange().to;
  }, [params]);

  const handleDateChange = (range?: DateRange) => {
    const formattedFrom = convertDateToString(range?.from);
    const formattedTo = convertDateToString(range?.to || range?.from);

    params.set("dateFrom", formattedFrom);
    params.set("dateTo", formattedTo);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    const defaultRange = getDefaultDateRange();
    params.set("dateFrom", defaultRange.from);
    params.set("dateTo", defaultRange.to);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const selected = {
    from: convertStringToDate(strFrom),
    to: convertStringToDate(strTo),
  };

  const isDefaultRange =
    strFrom === getDefaultDateRange().from &&
    strTo === getDefaultDateRange().to;

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
          <div className="p-3 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="text-sm w-full sm:w-auto flex justify-between sm:justify-start gap-2">
              <span>
                <strong>From:</strong> {strFrom}
              </span>
              <span className="sm:ml-2">
                <strong>To:</strong> {strTo}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isDefaultRange}
              className="w-full sm:w-auto"
            >
              <X className="size-4 mr-2" />
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

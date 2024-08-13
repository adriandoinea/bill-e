import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, convertDateToString, convertStringToDate } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "./ui/button";

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

  const strFrom = params.get("dateFrom") || convertDateToString();
  const strTo = params.get("dateTo");

  const dateFrom = convertStringToDate(strFrom);
  const dateTo = convertStringToDate(strTo);

  const selected = {
    from: dateFrom,
    to: dateTo,
  };

  const handleDateChange = (range?: DateRange) => {
    const formattedFrom = convertDateToString(range?.from);
    const formattedTo = convertDateToString(range?.to || range?.from);

    params.set("dateFrom", formattedFrom);
    params.set("dateTo", formattedTo);
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (dateTo < dateFrom) {
      params.set("dateTo", strFrom);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [dateFrom, dateTo, params, pathname, router, strFrom]);

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
            defaultMonth={dateFrom}
            selected={selected}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

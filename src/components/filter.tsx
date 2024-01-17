import { Filter as FilterIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "./ui/popover";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

export default function Filter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const filterBy = searchParams.get("filterBy");

  const getDatePickerDefaultValue = () => {
    if (!params.get("date")) return dayjs();

    const filterBy = params.get("filterBy");

    if (filterBy === "day") {
      return dayjs(params.get("date"), "DD-MM-YYYY");
    }
    if (filterBy === "month" || !filterBy) {
      return dayjs(params.get("date"), "MM");
    }
    if (filterBy === "year") {
      return dayjs(params.get("date"), "YYYY");
    }

    return dayjs();
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: filterBy } = e.target;
    if (filterBy === "day" || filterBy === "month" || filterBy === "year") {
      const data = {
        day: dayjs().format("DD-MM-YYYY"),
        month: dayjs().format("MM"),
        year: dayjs().format("YYYY"),
      };

      params.set("filterBy", filterBy);
      params.set("date", data[filterBy]);

      router.replace(`${pathname}?${params.toString()}`);
    }

    return;
  };

  const handleDatePick = (value: Dayjs | null) => {
    if (!value) return null;
    const formattedDate = value.format("DD-MM-YYYY");
    params.set("date", formattedDate);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleMonthViewChange = (value: Dayjs | null) => {
    if (!value) return null;
    const formattedDate = value.format("MM");
    params.set("date", formattedDate);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleYearViewChange = (value: Dayjs | null) => {
    if (!value) return null;
    const formattedDate = value.format("YYYY");
    params.set("date", formattedDate);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const renderDatePicker = () => {
    if (filterBy === "day") {
      return (
        <DatePicker
          className="bg-white rounded-sm"
          format="DD MMM YYYY"
          views={["day"]}
          value={getDatePickerDefaultValue()}
          onChange={handleDatePick}
          slotProps={{
            textField: {
              size: "small",
            },
          }}
        />
      );
    }
    if (filterBy === "year") {
      return (
        <DatePicker
          className="bg-white rounded-sm"
          format="YYYY"
          views={["year"]}
          value={getDatePickerDefaultValue()}
          onChange={handleYearViewChange}
          slotProps={{
            textField: {
              size: "small",
            },
          }}
        />
      );
    }
    return (
      <DatePicker
        className="bg-white rounded-sm"
        format="MMMM"
        views={["month"]}
        value={getDatePickerDefaultValue()}
        onChange={handleMonthViewChange}
        slotProps={{
          textField: {
            size: "small",
          },
        }}
      />
    );
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="text-customAccent hover:text-customAccent-foreground"
          size="icon"
          variant="ghost"
        >
          <FilterIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <label htmlFor="filterBy">Filter By:</label>
            <select
              className="border rounded-md"
              value={params.get("filterBy") || "month"}
              name="filterBy"
              id="filterBy"
              onChange={handleSelectChange}
            >
              <option value="year">Year</option>
              <option value="month">Month</option>
              <option value="day">Day</option>
            </select>
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {renderDatePicker()}
          </LocalizationProvider>
        </div>
      </PopoverContent>
    </Popover>
  );
}

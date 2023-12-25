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

  const datePickerDefaultValue = params.get("date")
    ? dayjs(params.get("date"), "DD-MM-YYYY")
    : dayjs();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    params.set("filterBy", e.target.value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDatePick = (value: Dayjs | null) => {
    if (!value) return null;
    const formattedData = value.format("DD-MM-YYYY");
    params.set("date", formattedData);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const renderDatePicker = () => {
    if (filterBy === "day") {
      return (
        <DatePicker
          className="bg-white rounded-sm"
          format="DD MMM YYYY"
          views={["day"]}
          defaultValue={datePickerDefaultValue}
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
          defaultValue={datePickerDefaultValue}
          onChange={handleDatePick}
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
        defaultValue={datePickerDefaultValue}
        onChange={handleDatePick}
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

import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeString = (id: string) => {
  const sanitized = id.replace(/\s+/g, "_").toLowerCase();

  return sanitized;
};

export const validateFilter = (filter: {
  filterBy?: string;
  date?: string;
}) => {
  const { filterBy, date } = filter;
  const currentDate = dayjs();
  const currentDay = currentDate.format("DD-MM-YYYY");
  const currentMonth = currentDate.format("MM");
  const currentYear = currentDate.format("YYYY");

  switch (filterBy) {
    case "day":
      if (date) {
        return { filterBy, date };
      }
      return { filterBy, date: currentDay };

    case "month":
      if (date && parseInt(date) >= 1 && parseInt(date) <= 12) {
        return { filterBy, date };
      }
      return { filterBy, date: currentMonth };

    case "year":
      if (date) {
        return { filterBy, date: parseInt(date).toString() };
      }
      return { filterBy, date: currentYear };

    default:
      return { filterBy: "month", date: date || currentMonth };
  }
};

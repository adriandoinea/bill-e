import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { COLORS } from "./constants";

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

export const getFilterData = (filter: { filterBy?: string; date?: string }) => {
  const currentYear = new Date().getFullYear();
  const { filterBy, date } = validateFilter(filter);

  switch (filterBy) {
    case "day":
      const dateArray = date.split("-");
      const day = dateArray[0];
      const month = dateArray[1];
      const year = dateArray[2];
      return {
        gte: new Date(`${year}-${month}-${day}T00:00:00.000`),
        lte: new Date(`${year}-${month}-${day}T23:59:59.999`),
      };

    case "year":
      return {
        gte: new Date(`${date}-01-01T00:00:00.000`),
        lte: new Date(`${date}-12-31T23:59:59.999`),
      };

    case "month":
      if (date === "12") {
        return {
          gte: new Date(`${currentYear}-${date}-01T00:00:00.000`),
          lte: new Date(`${currentYear + 1}-01-01T00:00:00.000`),
        };
      } else {
        const newCurrentMonth =
          parseInt(date) < 10 ? date.padStart(2, "0") : date;
        const nextMonth =
          parseInt(date) < 9
            ? (parseInt(date) + 1).toString().padStart(2, "0")
            : date;

        const lte = new Date(`${currentYear}-${nextMonth}-01T00:00:00.000`);
        lte.setMilliseconds(-1);
        return {
          gte: new Date(`${currentYear}-${newCurrentMonth}-01T00:00:00.000`),
          lte,
        };
      }

    default:
      throw new Error(`'Filter by' can only be 'day', 'month' or 'year'`);
  }
};

export const generateRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
};

export const getLastSixMonths = () => {
  const today = new Date();
  const result = [];

  for (let i = 0; i < 6; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "2-digit",
      month: "long",
    });
    const monthNum = date.getMonth() + 1;
    const year = date.getFullYear();
    result.push({ month: formattedDate, monthNum: monthNum, year });
  }

  return result.reverse();
};

export const calculatePercentageChange = (val1: number, val2: number) => {
  if (val1 === 0) {
    return null;
  }
  return ((val2 - val1) / val1) * 100;
};

export const getTopSpentBudget = (
  arr: {
    name: string;
    spentPercent: number;
    initAmount: number;
    currentAmount: number;
  }[]
) => {
  if (!(arr.length > 0)) return null;

  let maxItem = arr[0];
  for (const item of arr) {
    if (item.spentPercent > maxItem.spentPercent) {
      maxItem = item;
    }
  }

  return maxItem;
};

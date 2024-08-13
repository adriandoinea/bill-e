import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { COLORS } from "./constants";
import { FilterParams } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeString = (id: string) => {
  const sanitized = id.replace(/\s+/g, "_").toLowerCase();

  return sanitized;
};

export const getFilterData = (filter: FilterParams) => {
  const filterData = {
    gte: convertStringToDate(filter.from),
    lte: convertStringToDate(filter.to),
  };
  filterData.gte.setHours(0, 0, 0, 0);
  filterData.lte.setHours(23, 59, 59, 999);

  return filterData;
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

export const convertDateToString = (date?: Date) => {
  return dayjs(date).format("DD-MM-YYYY");
};

export const convertStringToDate = (dateStr?: string | null) => {
  // This fn needs a format of DD-MM-YYYY
  if (!dateStr) return new Date();
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

import prisma from "@/db";
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

export const queryTransactions = async (
  type: "expense" | "income",
  filterData: { gte: Date; lte: Date },
  query: string
) => {
  if (type === "expense") {
    return await prisma.expense.findMany({
      where: query
        ? {
            AND: [
              {
                date: filterData,
              },
              {
                OR: [
                  { category: { contains: query } },
                  { note: { contains: query } },
                  { location: { contains: query } },
                  { amount: Number(query) * 100 || 0 },
                ],
              },
            ],
          }
        : { date: filterData },
      orderBy: { date: "desc" },
    });
  }

  return await prisma.income.findMany({
    where: query
      ? {
          AND: [
            {
              date: filterData,
            },
            {
              OR: [
                { category: { contains: query } },
                { note: { contains: query } },
                { amount: Number(query) * 100 || 0 },
              ],
            },
          ],
        }
      : { date: filterData },
    orderBy: { date: "desc" },
  });
};

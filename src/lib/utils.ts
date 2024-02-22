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

export const generateRandomBgColor = () => {
  const colors = [
    "rgba(255, 165, 0, 0.7)",
    "rgba(0, 120, 255, 0.7)",
    "rgba(0, 128, 0, 0.7)",
    "rgba(128, 0, 128, 0.7)",
    "rgba(255, 0, 0, 0.7)",
    "rgba(220, 250, 100, 0.7)",
    "rgba(75, 0, 130, 0.7)",
    "rgba(255, 200, 180, 0.7)",
    "rgba(0, 128, 128, 0.7)",
    "rgba(0, 200, 255, 0.7)",
    "rgba(165, 42, 42, 0.7)",
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

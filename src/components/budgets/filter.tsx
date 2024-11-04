"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

export default function Filter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", event.target.value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const value = searchParams.get("period") || "monthly";

  return (
    <select
      className="rounded-sm px-2 h-10 bg-secondary cursor-pointer"
      name="period"
      id="period"
      onChange={handleChange}
      value={value}
    >
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
      <option value="yearly">Yearly</option>
    </select>
  );
}

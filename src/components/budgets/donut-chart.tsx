"use client";

import { cn } from "@/lib/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Chart } from "chart.js";
import { useTheme } from "next-themes";
import { Doughnut } from "react-chartjs-2";

interface DonutChartProps {
  data: number[];
  labels: string[];
  backgroundColors: string[];
  className?: string;
}

export default function DonutChart({
  data,
  labels,
  backgroundColors,
  className,
}: DonutChartProps) {
  const { resolvedTheme } = useTheme();
  ChartJS.register(ArcElement, Tooltip);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Budget amount",
        data,
        backgroundColor: backgroundColors,
        borderColor: "transparent",
      },
    ],
  };

  const textCenter = {
    id: "textCenter",
    beforeDatasetsDraw(chart: Chart<"doughnut", number[], unknown>) {
      const { ctx, data } = chart;
      const chartData = chart.getDatasetMeta(0).data[0];

      const total = data.datasets[0].data.reduce((acc, current) => {
        return (acc += current);
      }, 0);

      ctx.save();
      ctx.fillStyle = resolvedTheme === "light" ? "black" : "white";
      ctx.font = "normal 1.5rem sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`$${total}`, chartData?.x, chartData?.y);
    },
  };

  return (
    <div className={cn("flex items-center", className)}>
      <Doughnut key={resolvedTheme} data={chartData} plugins={[textCenter]} />
    </div>
  );
}

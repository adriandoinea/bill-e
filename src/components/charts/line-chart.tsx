"use client";

import { cn } from "@/lib/utils";
import { ResponsiveLine } from "@nivo/line";
import {} from "@nivo/pie";

interface Props {
  data: {
    id: string;
    data: { x: string | number; y: number }[];
    color?: string;
  }[];
  className?: string;
}

export default function LineChart({ data, className }: Props) {
  return (
    <div className={cn("h-64 text-black", className)}>
      <ResponsiveLine
        data={data}
        colors={{ datum: "color" }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
        }}
        yFormat={(value) => `$${value}`}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "last 6 months",
          legendOffset: 36,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "amount",
          legendOffset: -45,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            itemTextColor: "hsl(var(--primary))",
          },
        ]}
        theme={{
          crosshair: {
            line: {
              stroke: "hsl(var(--primary))",
              strokeWidth: 1,
            },
          },
          grid: {
            line: {
              stroke: "hsl(var(--hover-color))",
              strokeWidth: 1,
            },
          },
          axis: {
            ticks: {
              text: {
                fill: "hsl(var(--primary))",
                opacity: 0.75,
              },
            },
            legend: {
              text: {
                fill: "hsl(var(--primary))",
                opacity: 0.75,
              },
            },
          },
        }}
      />
    </div>
  );
}

"use client";

import { CURRENCY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { DefaultRawDatum, PieCustomLayerProps, ResponsivePie } from "@nivo/pie";

interface Props {
  data: {
    id: string;
    label?: string;
    color?: string;
    value: number;
  }[];
  arcLabel?: "id" | "value";
  centerText?: string;
  className?: string;
  centerTextClassName?: string;
  isDonut?: boolean;
  padAngle?: number;
}
export default function PieChart({
  data,
  centerText,
  className,
  centerTextClassName,
  isDonut,
  arcLabel,
  padAngle,
}: Props) {
  const donutConfig = isDonut
    ? {
        innerRadius: 0.5,
        cornerRadius: 3,
      }
    : {
        innerRadius: 0,
        cornerRadius: 0,
      };
  const hasCustomColors = data.some((item) => item.color);

  const CenteredMetric = ({
    centerX,
    centerY,
  }: PieCustomLayerProps<DefaultRawDatum>) => {
    return (
      <text
        className={cn("font-semibold", centerTextClassName)}
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        fill="hsl(var(--primary))"
      >
        {centerText}
      </text>
    );
  };

  return (
    <div className={cn("size-64 place-self-center text-black", className)}>
      <ResponsivePie
        {...donutConfig}
        data={data}
        sortByValue
        valueFormat={(value) => `${value} ${CURRENCY}`}
        enableArcLinkLabels={false}
        enableArcLabels={!!arcLabel || false}
        arcLabelsTextColor="hsl(var(--secondary))"
        arcLabel={arcLabel}
        colors={
          hasCustomColors
            ? { datum: "data.color" }
            : ["hsl(var(--custom-accent))"]
        }
        activeOuterRadiusOffset={8}
        padAngle={padAngle || 0.7}
        borderWidth={1}
        borderColor={
          hasCustomColors
            ? {
                from: "color",
                modifiers: [["darker", 0.2]],
              }
            : "hsl(var(--custom-accent-foreground))"
        }
        margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
        layers={[
          "arcs",
          "arcLabels",
          "arcLinkLabels",
          "legends",
          CenteredMetric,
        ]}
      />
    </div>
  );
}
